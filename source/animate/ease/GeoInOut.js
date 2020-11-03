import { Ease } from '../Ease';

import { GeoIn }  from './GeoIn';
import { GeoOut } from './GeoOut';

console.log(GeoIn);

export class GeoInOut extends Ease
{
	static power = 1;

	calculate(t)
	{
		return t<.5 ? EaseIn(power)(t*2)/2 : EaseOut(power)(t*2 - 1)/2+0.5;
	}
}
