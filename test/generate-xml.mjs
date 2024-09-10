import fs from 'node:fs';
import xml from 'xml';

const coverage = JSON.parse(fs.readFileSync('./test/coverage/data/cv-coverage.json', 'utf-8'));

const ratio    = coverage.totalCovered / coverage.totalSize;
const strength = Number(Number(ratio).toFixed(2));
const percent  = Number(Number(ratio * 100).toFixed(1));

const _package  = [ {_attr:{ name: 'curvature-2' }} ];
const time     = Math.round(Date.now() / 1000);

const project = [ {_attr: {timestamp:time}}, { package:_package } ];

const outputDoc = { coverage:[ {_attr:{generated:time}}, { project } ] };

let projectCoveredLines = 0;
let projectTotalLines = 0;

let fileCount = 0;

Object.entries(coverage.lines).forEach(([name, linesHit]) => {
	const fileInfo     = coverage.stats[name];
	const ratio        = fileInfo.covered / fileInfo.size;
	const percent      = Number(Number(ratio * 100).toFixed(1));
	const coveredLines = linesHit.length;
	const totalLines   = fileInfo.lines;

	projectCoveredLines += coveredLines;
	projectTotalLines   += totalLines;
	fileCount++;

	const file = [ {  _attr: { name } } ];

	linesHit = linesHit.slice(0)
	const blanks = coverage.blanks[name].slice(0)

	for(let i = 1; i <= totalLines; i++)
	{
		if(i === blanks[0])
		{
			if(i === linesHit[0])
			{
				linesHit.shift();
			}

			blanks.shift();
			continue;
		}

		if(i === linesHit[0])
		{
			file.push({ line: [ {_attr: { num:i, type: 'stmt', count: 1 }} ]});
			linesHit.shift();
		}
		else
		{
			file.push({ line: [ {_attr: { num:i, type: 'stmt', count: 0 }} ]});
		}

	}

	file.push({ metrics: [ {_attr: { loc: totalLines, ncloc: totalLines - coveredLines }} ]});

	_package.push({file});
});

_package.push({ metrics: [ {_attr: { files: fileCount, loc: projectTotalLines, ncloc: projectTotalLines - projectCoveredLines }} ]});

console.log('<?xml version="1.0" encoding="UTF-8"?>\n' + xml(outputDoc, {indent:'  '}));
