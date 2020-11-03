import { Ease } from '../Ease';

export class ElasticOut extends Ease
{
	constructor(interval, options = {})
	{
		super(interval, options);

		this.friction = this.friction || 'friction' in options
			? options.friction
			: 0.3;
	}

	calculate = t => {
		return Math.pow(2,-10*t)
			* Math.sin((t-this.friction/4) * (2*Math.PI)/this.friction)
			+ 1;
	}
}
