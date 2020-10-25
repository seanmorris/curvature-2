import { Ease } from '../Ease';

export class QuadInOut extends Ease
{
	calculate = t => t<.5? 2*t*t : -1+(4-2*t)*t;
}
