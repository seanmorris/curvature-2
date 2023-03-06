"use strict";

const testNames = [
'testEventBubbleCancel',
'testEventBubble',
'testEventCaptureCancel',
'testEventCapture',
'testEventDispatchCancel',
'testEventDispatch',
'testFlicker',
'testFocusClick',
'testFocusOrder',

'testTemplate',

'testFormBasic',
'testFormGroupInput',
'testFormGroupOutput',
'testFormInputFlicker',
'testFormOutputFlicker',
'testFunctionRouting',
'testHtmlEscape',
'testHtmlField',
'testHtmlNoEscape',
'testIndexRouting',

// 'testInsertAndSelect',

'testListCascade',
'testListCascadeUp',
'testList',
'testListPrefill',
'testListSplicedOdds',
'testListSplicedUpOdds',
'testNotFoundRouting',
'testObjectDeleteOdds',
'testObjectRefill',
'testObjectSetProperties',
'testPromiseFailRouting',
'testPromiseRouting',
'testStaticRouting',
'testTextarea',
'testTextField',
'testUnexpectedErrorRouting',
'testVariadicRouting0',
'testVariadicRouting1',
'testVariadicRouting2',
'testVariadicRouting3',
'testViewEscaped',
'testViewNoEscape',
'testWildcardRoutingA',
'testWildcardRoutingB',
'testWildcardRoutingC',

];

const os = require('os');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { SourceMapConsumer } = require("source-map");

const source = fs.readFileSync('./test/html/curvature.js', 'utf-8');
const sourcemap = JSON.parse(fs.readFileSync('./test/html/curvature.js.map', 'utf-8'));

const origins  = new Map;
const bDocs    = new Map;
const docMasks = new Map;

for(const s in sourcemap.sources)
{
	origins.set(sourcemap.sources[s], sourcemap.sourcesContent[s]);
}

const ansi = {
	green:  '\x1b[32m',
	yellow: '\x1b[33m',
	red:    '\x1b[31m',
	end:    '\x1b[0m'
}

class BinDoc
{
	constructor(value, offset = 0)
	{
		this.start = offset;
		this.end   = offset + value.length;
		this.count = null;
		this.value = value;
		this.first = null;
		this.last  = null;

		Object.defineProperty(this, 'next', {writable: true});
	}

	contains(index)
	{
		if(index >= this.start && index < this.end)
		{
			return true;
		}
	}

	query(index)
	{
		if(!this.contains(index))
		{
			return;
		}

		if(this.first)
		{
			if(index < this.first.end)
			{
				return this.first.query(index);
			}
			else
			{
				return this.last.query(index);
			}
		}
		else
		{
			return this;
		}
	}

	split(at)
	{
		if(!this.contains(at) || at === this.start)
		{
			return false;
		}

		if(!this.first)
		{
			this.first = new BinDoc(this.value.substring(0, at + -this.start), this.start);
			this.last  = new BinDoc(this.value.substring(at + -this.start), at);

			this.value = null;

			this.first.count = this.last.count = this.count;

			this.first.next = this.last;
			this.last.next = this.next;
			this.next = this.first;

			return true;
		}
		else
		{
			if(at < this.first.end)
			{
				return this.first.split(at);
			}
			else
			{
				return this.last.split(at);
			}
		}
	}

	segment(startAt, endAt)
	{
		if(!this.first && startAt === this.start && this.endAt === this.end)
		{
			return [this];
		}

		if(!this.first)
		{
			if(startAt >= this.start && startAt < this.end && endAt < this.end && endAt > this.start)
			{
				let current;

				if(startAt > this.start)
				{
					this.split(startAt);
				}

				current = this.query(startAt);

				let end = null;
				const segments = [];

				while(current)
				{
					if(!current.first && (current.contains(endAt) || current.end === endAt))
					{
						current.split(endAt);
						end = current.first || current;

						break;
					}

					if(current.start === endAt)
					{
						break;
					}

					if(!current.first)
					{
						segments.push(current);
					}

					current = current.next;
				}

				if(end.start !== endAt)
				{
					segments.push(end);
				}

				return segments;
			}

			return [];
		}
		else
		{
			if(startAt < this.first.end)
			{
				return this.first.segment(startAt, endAt);
			}
			else
			{
				return this.last.segment(startAt, endAt);
			}
		}

		return [];
	}

	toString()
	{
		return this.first ? this.first.toString() + this.last.toString() : this.value;
	}

	each(callback)
	{
		if(this.first)
		{
			this.first.each(callback);
			this.last.each(callback);
		}
		else
		{
			callback(this);
		}
	}
}

class DocMask
{
	constructor(content)
	{
		this.content = content;
		this.masks   = new Map;
	}

	getMask(maskName, index)
	{
		if(!this.masks.has(maskName))
		{
			return null;
		}

		const mask = this.masks.get(maskName);

		return mask[index];
	}

	setMask(maskName, index, count)
	{
		if(!this.masks.has(maskName))
		{
			this.masks.set(maskName, new Uint32Array(this.content.length))
		}

		const mask = this.masks.get(maskName);

		mask[index] = count;
	}
}

let totalSize = 0;
let totalCovered = 0;

const ignores = ['node_modules/'];

sources: for(const s in sourcemap.sources)
{
	const sourceFilename = sourcemap.sources[s];

	for(const ignore of ignores)
	{
		if(ignore === sourceFilename.substr(0, ignore.length))
		{
			continue sources;
		}
	}

	docMasks.set(sourceFilename, new DocMask(sourcemap.sourcesContent[s]));

	bDocs.set(sourceFilename, new BinDoc(sourcemap.sourcesContent[s]));
}


const scriptName = `file://${process.cwd()}/test/html/curvature.js`;
const aggregateCoverage = [];
const testMasks = new Map;

for(const testName of testNames)
{
	const coverage = require(`${process.cwd()}/test/coverage/v8/${testName}-coverage.json`);

	const scripts  = new Map;

	for(const script of coverage.result)
	{
		scripts.set(script.url, script);
	}

	const generatedDoc = new BinDoc(source);

	for(const func of scripts.get(scriptName).functions)
	{
		for(const range of func.ranges)
		{
			generatedDoc
			.segment(range.startOffset, range.endOffset)
			.forEach(s => s.count = s.count === 0 ? s.count : range.count);
		}
	}

	aggregateCoverage.push(SourceMapConsumer.with(sourcemap, null, consumer => {
		const generatedLines    = source.split("\n");
		const generatedLengths  = generatedLines.map(l => l.length + 1);
		const generatedLineBreaks = [];

		let generatedNewLine = 0;

		for(const length of generatedLengths)
		{
			generatedLineBreaks.push(generatedNewLine);

			generatedNewLine += length;
		}

		let summary = '<body><link rel="stylesheet" href=".coverage.css">';

		const links = [];

		// const originMasks = new Set;
		console.error('Aggregating test coverage : ' + ansi.yellow +  testName + ' ' + ansi.end);

		origins: for(const [originName, originContent] of origins)
		{
			for(const ignore of ignores)
			{
				if(ignore === originName.substr(0, ignore.length))
				{
					continue origins;
				}
			}

			const originMask = docMasks.get(originName);

			// originMasks.add(originMask);

			let current = null;
			let column  = 0;
			let line    = 1;

			const filename = testName + '_' + originName.replace(/\//g, '_');

			let started = false;

			originContent.split('').forEach((byte,index) => {

				const position = consumer.generatedPositionFor({source:originName, line, column})

				let segment = null;

				if(position.line !== null)
				{
					const offset = generatedLineBreaks[position.line - 1] + position.column;
					const check  = generatedDoc.query(offset);

					if(!segment || check.count < segment.count)
					// if(!segment || check)
					{
						segment = check;
					}

					originMask.setMask(testName, index, segment.count);

					if(segment.count !== current)
					{
						current = segment.count;
					}
				}

				if(byte === '\n')
				{
					column = 0;
					line++;
					return;
				}

				column++;
			});
		}

		// testMasks.set(testName, originMasks);
	}));
}

Promise.all(aggregateCoverage).then(() => {

	let summary = '<body><link rel="stylesheet" href=".coverage.css">';

	const links = [];

	let totalCovered = 0;
	let totalSize = 0;

	const totals = {};

	const segments = {};
	const linesCovered = {};

	const table = {};

	const blanks = {};

	docMasks.forEach((docMask, originName) => {

		const filename = originName.replace(/\//g, '_');

		console.error('file:: ' + ansi.yellow + originName + ansi.end);

		let report = '<body style = "background-color:#222;font-family:terminal, monospace;">';
		report += '<link rel="stylesheet" href=".coverage.css">';

		let started = false;
		let current = null;
		let lineNumber = 1;
		let column = 0;

		let covered = 0;
		let size    = 0;

		let highlighted = ``;

		const lineNumbers = new Set;

		let segmentBuffer = '';

		totals[originName] = totals[originName] || {};

		let lineStarted = false;

		blanks[originName] = blanks[originName] || [];

		for(let index = 0; index < docMask.content.length; index++)
		{
			const byte = docMask.content[index];
			const nonStarters =  ['\n', '\t', ' ', '[', ']', '{', '}', '(', ')', ';'];

			if(!nonStarters.includes(byte))
			{
				lineStarted = true;
			}

			const isWhitespace = [' ', '\t', '\n'].includes(byte);
			const isLastLoop = index === docMask.content.length + -1;

			let total = 0;

			if(current || !isWhitespace || isLastLoop)
			{
				for(const [testName, mask] of docMask.masks)
				{
					totals[originName][testName] = totals[originName][testName] || {total:0,covered:0}

					totals[originName][testName].covered += mask[index] ? 1 : 0;
					totals[originName][testName].total   += 1;

					total += mask[index];
				}
			}

			if(!isWhitespace)
			{
				if(total)
				{
					linesCovered[originName] = linesCovered[originName] || new Set;
					linesCovered[originName].add(lineNumber);

					totalCovered++;
					covered++;
				}

				totalSize++;
				size++;
			}

			if(total !== current || (segmentBuffer && index === docMask.content.length + -1))
			{
				segments[originName] = segments[originName] || [];
				segments[originName].push(index,lineNumber,column,total);

				const segmentLines = segmentBuffer.split('\n');
				const wrappedLines = segmentLines.map((l,li) => {

					const match = l.match(/^([\s]*)(.*?)([\s]*?)\n?$/);

					if(!match)
					{
						return l;
					}

					const [_, pre, line, post] = match;

					const ln = lineNumber - (segmentLines.length - li) + 1;

					l = `<span class = "line">`
						+ (!lineNumbers.has(ln) ? `<span class = "line-number">${ln}</span>` : '')
						+ `${pre}<span class = "code" tabindex = "0" data-count = "${current}" data-length = "${line.length}">${line}</span>${post}`
					+ `</span>`;

					lineNumbers.add(ln);

					return l;

				}).join("\n");

				highlighted += wrappedLines;
				segmentBuffer  = '';

				if(started)
				{
					highlighted += `</span><span class = "segment" data-count = "${total}">`;
				}
				else
				{
					highlighted += `<span class = "segment" data-count = "${total}">`;
					started = true;
				}

				current = total;
			}

			if(byte === '\n')
			{
				if(!lineStarted)
				{
					blanks[originName].push(lineNumber);
				}

				column = 0;
				lineNumber++;
				segmentBuffer += `\n`;
				lineStarted = false;
			}
			else if(byte === '\t')
			{
				segmentBuffer += '    ';
			}
			else if(byte === '<')
			{
				segmentBuffer += '&lt;';
			}
			else if(byte === '>')
			{
				segmentBuffer += '&gt;';
			}
			else if(byte === '&')
			{
				segmentBuffer += '&amp;';
			}
			else if(byte === '"')
			{
				segmentBuffer += '&quot;';
			}
			else
			{
				segmentBuffer += byte;
			}

			column++;
		}

		const percentage = Number(100 * covered / size).toFixed(2);

		report += `<h1 style = "color:green">${originName}</h1>`;
		report += `<h2 style = "color:yellow">Coverage: ${percentage}% (${covered}/${size})</h2>`;
		report += `<span href = "summary.html" style = "color:lightGray">${testNames.join(', ')}</span>\n\n`;
		report += `<a href = "summary.html" style = "color:lightGray">back</a>\n`;
		report += `<label for = "show-totals">Show Totals</label><input id = "show-totals" type = "checkbox">\n\n`;
		report += `<div class = "highlighted">`;
		report += highlighted + `</span></div></body>`;

		table[originName] = table[originName] || {size, covered, lines: -1+lineNumber, tests: {}};

		const reportFile = `${filename}.coverage.html`;

		fs.writeFileSync('./test/coverage/html/' + reportFile, report);

		links.push(
			`<span data-covered = "${percentage}" style = "--percentage:${percentage*100};">`
			+ `<meter max="100" optimum = "100" high = "75" low = "50" value="${Number(percentage).toFixed(0)}"></meter>`
			+ `<span class = "percentage">${percentage}%</span>`
			+ `<a href = "${reportFile}" style = "color:lightGray">${filename}</a>\n</span>`
		);
	});

	Object.entries(totals).forEach(([originName, testTotals]) => Object.entries(testTotals).forEach(([testName,t]) => {
		table[originName].tests[testName] = t.covered;
	}));

	const lineCoverage = {};

	Object.entries(linesCovered).forEach(([originName,lines]) => lineCoverage[originName] = [...lines]);

	const percentage = Number(100 * totalCovered / totalSize).toFixed(2);

	const uuid = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(
		/[018]/g
		, c => (
			c ^ parseInt(Math.random() * 255) & 15 >> c / 4
		).toString(16)
	);

	fs.writeFileSync('./test/coverage/data/cv-coverage.json', JSON.stringify({
		id: uuid
		, timestamp: Date.now()
		// , hostname:  os.hostname()
		// , user:      process.env.USER
		, totalCovered
		, totalSize
		, tests: testNames
		, files: Object.keys(totals)
		, stats: table
		, lines: lineCoverage
		, segments
		, blanks
	}));

	// console.table(table);

	summary += '<h1 style = "color:green">curvature.js</h1>';
	summary += `<h2 style = "color:yellow">Coverage: ${percentage}% (${totalCovered}/${totalSize})</h2>`;
	summary += `<span href = "summary.html" style = "color:lightGray">${testNames.join(', ')}</span>\n\n`;
	summary += `<div class = "links">${links.join("")}</div></body>`;

	fs.writeFileSync(`./test/coverage/html/summary.html`, summary);

});
