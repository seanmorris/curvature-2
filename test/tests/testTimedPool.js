export const testTimedPool = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const Pool = require('curvature/base/Pool').Pool;
	const pool = new Pool({max: 5});

	const time = Date.now();

	for(let i = 0; i < 20; i++)
	{
		const timer = accept => {
			document.write(`Started ${i} @ ${Math.trunc((Date.now() - time) / 1000)}\n`);
			setTimeout(accept, 1000);
		};

		pool.add(timer);
	}

	return require('Delay')(10*1000).then(() => String(document.body.innerHTML).trim());
};
