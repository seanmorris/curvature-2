import { Ease } from '../Ease';

export class CubicOut extends Ease
{
	calculate = t => (--t)*t*t+1;
}
