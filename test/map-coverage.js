// const coverage = require(`${process.cwd()}/test/coverage/v8/testTemplate-coverage.json`);
// const coverage = require(`${process.cwd()}/test/coverage/v8/testList-coverage.json`);

// const coverage = require(`${process.cwd()}/test/coverage/v8/testWildcardRoutingC-coverage.json`);
// const coverage = require(`${process.cwd()}/test/coverage/v8/testViewNoEscape-coverage.json`);
// const coverage = require(`${process.cwd()}/test/coverage/v8/testEventBubble-coverage.json`);
// const coverage = require(`${process.cwd()}/test/coverage/v8/testEventDispatchCancel-coverage.json`);
// const coverage = require(`${process.cwd()}/test/coverage/v8/testFormGroupInput-coverage.json`);

// const testName = 'testPromiseFailRouting';
// const testName = 'testUnexpectedErrorRouting';
// const testName = 'testList';

const testName = 'testList';

const coverage = require(`${process.cwd()}/test/coverage/v8/${testName}-coverage.json`);

const fs = require('fs');
const path = require('path');
const source = fs.readFileSync('./test/html/curvature.js', 'utf-8');
const sourcemap = JSON.parse(fs.readFileSync('./test/html/curvature.js.map', 'utf-8'));
const { SourceMapConsumer } = require("source-map");
const { start } = require('repl');
const { off } = require('process');

const scripts = new Map;
const origins = new Map;
const bDocs   = new Map;

for(const s in sourcemap.sources)
{
	origins.set(sourcemap.sources[s], sourcemap.sourcesContent[s]);
}

for(const script of coverage.result)
{
	scripts.set(script.url, script);
}

const scriptName = 'file:///home/sean/projects/curvature-2/test/html/curvature.js';

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
		this.value = value;
		this.start = offset;
		this.end   = offset + value.length;
		this.first = null;
		this.last  = null;
		this.count = null;

		Object.defineProperty(this, 'next', {writable: true});
	}

	query(index)
	{
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
		else if(index >= this.start && index < this.end)
		{
			return this;
		}
	}

	split(at)
	{
		if(!this.first)
		{
			this.first = new BinDoc(this.value.substring(0, at + -this.start), this.start);
			this.last  = new BinDoc(this.value.substring(at + -this.start), at);

			this.value = null;

			this.first.count = this.last.count = this.count;

			this.last.next = this.next;
			this.next = this.first;
			this.first.next = this.last;
		}
		else
		{
			if(at < this.first.end)
			{
				this.first.split(at);
			}
			else
			{
				this.last.split(at);
			}
		}
	}

	segment(startAt, endAt)
	{
		if(startAt === this.start && this.endAt === this.end)
		{
			return [this];
		}

		if(!this.first)
		{
			if(startAt >= this.start && startAt < this.end && endAt <= this.end && endAt > this.start)
			{
				this.split(startAt);
				this.split(endAt);

				return [this.last.first];
			}
			else
			{
				this.split(startAt);

				let end = null;
				let current = this.last;
				const segments = [current];

				while(current)
				{
					if(end = current.query(endAt))
					{
						break;
					}

					current = current.next;
					segments.push(current);
				}

				end.split(endAt);

				segments.push(end.first);

				return segments;

				throw Error(
					'New segment boundaries overlap with existing segments: '
					+ JSON.stringify({startAt, endAt, start: this.start, end: this.end})
					+ "\n"
					+ this.toString()
				);
			}
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

let totalSize = totalCovered = 0, links = [];

for(const s in sourcemap.sources)
{
	bDocs.set(sourcemap.sources[s], new BinDoc(sourcemap.sourcesContent[s]));
}

SourceMapConsumer.with(sourcemap, null, consumer => {

	for(const func of scripts.get(scriptName).functions)
	{
		for(const range of func.ranges)
		{
			if(range.count)
			{
				continue;
			}

			const positions = new Map;

			for(let offset = range.startOffset; offset <= range.endOffset; offset++)
			{
				const preChunk    = source.substring(0, offset);
				const preLines    = preChunk.split("\n");
				const line        = preLines.length;
				const column      = preLines[ preLines.length + -1 ].length;
				const position    = consumer.originalPositionFor(
					{line, column}
				);

				if(position.line === null)
				{
					continue;
				}

				position.originalLine   = line;
				position.originalColumn = column;

				position.byte = offset;

				// console.log(position);

				if(!positions.has(position.line))
				{
					positions.set(position.line, new Map);
				}

				positions.get(position.line).set(position.column, position);
			}

			if(!positions.size)
			{
				continue;
			}

			const lineStart = Math.min(...[...positions.keys()]);
			const colStart  = Math.min(...(positions.get(lineStart).keys()));
			const lineEnd   = Math.max(...[...positions.keys()]);
			const colEnd    = Math.max(...(positions.get(lineEnd).keys()));

			const sourceChunk = source.substring(range.startOffset, range.endOffset);

			const startPos = positions.get(lineStart).get(colStart);
			const endPos   = positions.get(lineEnd).get(colEnd);

			let origin = '';

			range.length = range.endOffset - range.startOffset;

			if(startPos.source && endPos.source)
			{
				const bDoc        = bDocs.get(startPos.source);
				const originChunk = origins.get(startPos.source);
				const originLines = originChunk.split("\n")//.map(l => l + "\n");
				const originPrev  = originLines.slice(0, startPos.line - 1);
				const originSlice = originLines.slice(startPos.line - 1, endPos.line);

				originSlice[originSlice.length + -1] = originSlice[originSlice.length + -1].substr(0, endPos.column);
				originSlice[0] = originSlice[0].substr(startPos.column);

				origin = originSlice.join("\n");

				const startByte   = originPrev.join("\n").length + startPos.column + ((startPos.line > 1 && startPos.column) ? 1 : 0);
				const endByte     = startByte + origin.length;

				try{
					const segments = bDoc.segment(startByte, endByte);
					segments.forEach(s => s.count = func.isBlockCoverage ? (s.count || range.count) : range.count);
					// const segment = ;
					// segment.count = range.count;
				}
				catch (error) {
					console.log({error, range, origin});
				}

				console.log('================================================================');
				console.log(startPos.source, range);
				console.log('----------------------------------------------------------------');
				console.log(sourceChunk);
				console.log('----------------------------------------------------------------');
				console.log(origin);
				console.log('================================================================');
			}
			else
			{
				continue;
			}
		}
	}

	let summary = '<body style = "white-space:pre;background-color:#222;font-family:terminal, monospace;">';

	for(const [filename,bDoc] of bDocs)
	{
		if(bDoc.value)
		{
			bDoc.count = 0;
		}

		let size = covered = 0;

		bDoc.each(segment => {
			size += segment.value.trim().length;
			if(segment.count !== 0)
			{
				covered += segment.value.trim().length;
			}
		});

		bDoc.covered = covered;
		bDoc.size    = size;

		totalCovered += covered;
		totalSize    += size;

		{
			const reportFile = `${filename.replace(/\//g, '_')}.coverage.html`;

			let report = '<body style = "white-space:pre;background-color:#222;font-family:terminal, monospace;">';

			let highlighted = '';

			let n = 0;

			bDoc.each(segment => {
				const content = segment.value
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/\"/g, "&quot;");

				const lines = content.split("\n");

				if(segment.count === 0)
				{
					highlighted += `<span title = "${segment.count}" style = "color:red">${content}</span>`;
					return;
				}

				highlighted += `<span title = "${segment.count}" style = "color:white">${content}</span>`;
			});

			highlighted = highlighted.split("\n").map(l => `<span style = "color:lightGray">${++n}</span>	${l}`).join("\n");

			links.push(
				`<span style = "color:yellow">${Number(100 * covered / size).toFixed(2)}%</span> `
				+ '<a href = "'+reportFile+'" style = "color:lightGray">' + filename + '</a>' + "\n"
			);

			report += '<h1 style = "color:green">' + filename + '</h1>';

			report += `<h2 style = "color:yellow">Coverage: ${Number(100 * covered / size).toFixed(2)}% (${covered}/${size})</h2>`;
			report += `<a href = "summary.html" style = "color:lightGray">back</a>\n\n`;

			report += highlighted + '</body>';
			fs.writeFileSync('./test/coverage/html/' + reportFile, report)
		}

		{
			let report = '';

			console.log('file: ' + ansi.green + filename + ansi.end);
			console.log(`${ansi.yellow}Coverage: ${Number(100 * covered / size).toFixed(2)}% (${covered}/${size})${ansi.end}`);

			bDoc.each(segment => {

				const content = segment.value;

				if(segment.count === 0)
				{
					const lines = content.split("\n");
					report += lines.map(l => ansi.red + l + ansi.end).join("\n");
					return;
				}

				report += content;
			});

			process.stdout.write(report + (report[report.length + -1] === "\n" ? "" : "\n"));
		}
	}

	summary += '<h1 style = "color:green">curvature.js</h1>';
	summary += `<h2 style = "color:yellow">Coverage: ${Number(100 * totalCovered / totalSize).toFixed(2)}%</h2>`;
	summary += `<span href = "summary.html" style = "color:lightGray">${testName}</span>\n\n`;
	summary += links.join("\n") + '</body>';

	fs.writeFileSync(`./test/coverage/html/summary.html`, summary)
});
