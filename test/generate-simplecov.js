const fs = require('fs');

const coverage = JSON.parse(fs.readFileSync('./test/coverage/json/cv-coverage.json', 'utf-8'));

const covered_ratio    = coverage.totalCovered / coverage.totalSize;
const covered_strength = Number(Number(covered_ratio).toFixed(2));
const covered_percent  = Number(Number(covered_ratio * 100).toFixed(1));

const simpleCov = {
	timestamp: Math.round(Date.now() / 1000)
	, files: []
	, metrics: {
		covered_percent
		, covered_strength
		, covered_lines: 0
		, total_lines: 0
	}
};

Object.entries(coverage.lines).forEach(([filename,linesHit]) => {

	const fileInfo         = coverage.stats[filename];
	const covered_ratio    = fileInfo.covered / fileInfo.size;
	const covered_strength = Number(Number(covered_ratio).toFixed(2));
	const covered_percent  = Number(Number(covered_ratio * 100).toFixed(1));
	const covered_lines    = linesHit.length;
	const lines_of_code    = fileInfo.lines;

	simpleCov.metrics.covered_lines += covered_lines;
	simpleCov.metrics.total_lines   += lines_of_code;

	const fileEntry = {
		filename
		, covered_percent
		, coverage: []
		, covered_strength
		, lines_of_code
	};

	simpleCov.files.push(fileEntry);

	for(let i = 1; i <= lines_of_code; i++)
	{
		if(i === linesHit[0])
		{
			fileEntry.coverage.push(1);
			linesHit.shift();
		}
		else
		{
			fileEntry.coverage.push(null);
		}
	}
});


process.stdout.write(JSON.stringify(simpleCov, null, '\t'));
