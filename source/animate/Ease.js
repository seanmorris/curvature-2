import { Mixin } from '../base/Mixin';

import { PromiseMixin } from '../mixin/PromiseMixin';

export class Ease extends Mixin.with(PromiseMixin)
{
	constructor(interval, options = {})
	{
		super();

		this.interval = interval;
		this.terminal = false;
		this.initial  = false;
		this.timeout  = false;
		this.final    = false;
		this.canceled = false;
		this.done     = false;

		this.calculate = this.calculate || 'calculate' in options
			? options.calculate
			: false;

		this.bounded = 'bounded' in options
			? options.bounded
			: true;

		this.repeat = 'repeat' in options
			? options.repeat
			: 1;

		this.reverse = 'reverse' in options
			? options.reverse
			: false;
	}

	start()
	{
		this.done = false;

		requestAnimationFrame(()=>{
			this.initial  = Date.now();
			this.terminal = this.initial + this.interval;

			if(this.repeat >= 0)
			{
				this.terminal = this.initial + this.interval * this.repeat;
				this.timeout = setTimeout(
					() => {

						if(this.done)
						{
							return this.reverse ? 0 : 1;
						}

						this.done = true;

						this[PromiseMixin.Accept](this.reverse ? 0 : 1);
					}
					, this.interval * this.repeat
				);
			}
		});
	}

	cancel()
	{
		if(this.done)
		{
			return this.final;
		}

		clearTimeout(this.timeout);

		this.final    = this.current();
		this.canceled = this.done = true;

		this[PromiseMixin.Reject](this.final);

		return this.final;
	}

	fraction()
	{
		if(this.done)
		{
			return this.reverse ? 0 : 1;
		}

		if(this.initial === false)
		{
			return this.reverse ? 1 : 0;
		}

		const elapsed = Date.now() - this.initial;

		if(elapsed / this.interval >= this.repeat)
		{
			return this.reverse ? 0 : 1;
		}

		let fraction = (elapsed  % this.interval) / this.interval;

		return this.reverse
			? 1 - fraction
			: fraction;
	}

	current()
	{
		const t = this.fraction();

		if(this.calculate)
		{
			return this.calculate(t);
		}

		return t;
	}
}
