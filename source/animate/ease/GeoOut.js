import { Ease } from '../Ease';

export class GeoOut extends Ease
{
	constructor(interval, options = {})
	{
		super(interval, options);

		this.power = this.power || 'power' in options
			? options.power
			: 1;
	}

	calculate = t => {
		return 1 - Math.abs(t-1 ** this.power);
	}
}
