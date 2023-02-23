// const coverage = require('/tmp/flicker-coverage.json');
// const coverage = require('/tmp/view-coverage.json');
// const coverage = require('/tmp/escape-coverage.json');
// const coverage = require('/tmp/no-escape-coverage.json');
const coverage = require(`${process.cwd()}/test/coverage/v8/testWildcardRoutingC-coverage.json`);
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
	}

	split(at)
	{
		if(!this.first)
		{
			this.first = new BinDoc(this.value.substring(0, at + -this.start), this.start);
			this.last  = new BinDoc(this.value.substring(at + -this.start), at);

			this.value = null;

			this.first.count = this.last.count = this.count;
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
			return this;
		}

		if(!this.first)
		{
			if(startAt >= this.start && startAt < this.end && endAt <= this.end && endAt > this.start)
			{
				this.split(startAt);
				this.split(endAt);

				return this.last.first;
			}
			else
			{
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


for(const s in sourcemap.sources)
{
	bDocs.set(sourcemap.sources[s], new BinDoc(sourcemap.sourcesContent[s]));
}

SourceMapConsumer.with(sourcemap, null, consumer => {

	// consumer.eachMapping(mapping => console.log(mapping));

	for(const func of scripts.get(scriptName).functions)
	{
		if(!func.isBlockCoverage)
		{
			// continue;
		}

		for(const range of func.ranges)
		{
			if(!range.count)
			{
				// continue;
			}

			const positions = new Map;

			for(let offset = range.startOffset; offset <= range.endOffset; offset++)
			{
				const preChunk    = source.substring(0, offset);
				const preLines    = preChunk.split("\n");
				const line        = preLines.length;
				const column      = preLines[ preLines.length + -1 ].length;
				const position    = consumer.originalPositionFor({line, column});

				position.originalLine   = line;
				position.originalColumn = column;

				if(position.line === null)
				{
					continue;
				}

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

			if(startPos.source === endPos.source)
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

				startPos.byte = startByte;
				endPos.byte   = endByte;

				if(origin && !range.count)
				{
					try{
						const segment = bDoc.segment(startByte, endByte);
						segment.count = range.count;
					}
					catch (error) {
						console.log({error, range, origin});
					}

				}
			}
			else
			{
				continue;
			}
		}
	}

	let summary = '<body style = "white-space:pre;background-color:#222;font-family:terminal, monospace;line-height: 1.2rem;">';

	for(const [filename,bDoc] of bDocs)
	{
		if(bDoc.value)
		{
			bDoc.count = 0;
		}

		const reportFile = `${filename.replace(/\//g, '_')}.coverage.html`;

		let size = covered = 0;

		let report = '<body style = "white-space:pre;background-color:#222;font-family:terminal, monospace;">';

		let highlighted = '';

		bDoc.each(segment => {
			const content = segment.value;

			size += segment.value.trim().length;;

			if(segment.count === 0)
			{
				const lines = content.split("\n");
				highlighted += lines.map(l => '<span style = "color:red">' + l + '</span>').join("\n");
				return;
			}
			covered += segment.value.trim().length;
			highlighted  += '<span style = "color:white">' + content + '</span>';
		});

		summary += `<span style = "color:yellow">${Number(100 * covered / size).toFixed(2)}%</span> `;
		summary += '<a href = "'+reportFile+'" style = "color:lightGray">' + filename + '</a>' + "\n";

		report += '<h1 style = "color:green">' + filename + '</h1>';

		report += `<h2 style = "color:yellow">Coverage: ${Number(100 * covered / size).toFixed(2)}% (${covered}/${size})</h2>`;
		report += `<a href = "summary.html" style = "color:lightGray">back</a>\n\n`;

		report += highlighted + '</body>';
		fs.writeFileSync('./test/coverage/html/' + reportFile, report)

		// bDoc.each(segment => {
		// 	const content = segment.value;

		// 	size += segment.value.trim().length;;

		// 	if(segment.count === 0)
		// 	{
		// 		const lines = content.split("\n");
		// 		report += lines.map(l => ansi.red + l + ansi.end).join("\n");
		// 		return;
		// 	}
		// 	covered += segment.value.trim().length;
		// 	report += content;
		// });

		console.log('file: ' + ansi.green + filename + ansi.end);
		console.log(`${ansi.yellow}Coverage: ${Number(100 * covered / size).toFixed(2)}% (${covered}/${size})${ansi.end}`);
		// process.stdout.write(report + (report[report.length + -1] === "\n" ? "" : "\n"));
	}

	summary += '</body>';
	fs.writeFileSync(`./test/coverage/html/summary.html`, summary)
});
