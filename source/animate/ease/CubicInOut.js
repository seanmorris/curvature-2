import { Ease } from '../Ease';

export class CubicInOut extends Ease
{
	calculate = t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;
}
