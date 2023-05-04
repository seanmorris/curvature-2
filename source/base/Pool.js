export class Pool
{
	backlog = [];
	running = new Set;
	max = 1;

	init = item => new Promise(item);

	constructor({max, init})
	{
		this.init = init || this.init
		this.max  = max  || this.max;
	}

	add(item)
	{
		const onCompleted = () => {
			this.running.delete(item);

			if(!this.backlog.length)
			{
				return;
			}

			const next = this.backlog.shift();

			const wrapped = this.init(next);

			wrapped.finally(onCompleted);

			this.running.add(next);
		};

		if(this.running.size < this.max)
		{
			const wrapped = this.init(item);

			wrapped.finally(onCompleted);

			this.running.add(item);
		}
		else
		{
			this.backlog.push(item);
		}
	}
}
