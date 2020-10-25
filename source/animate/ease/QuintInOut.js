import { Ease } from '../Ease';

export class QuintInOut extends Ease
{
	calculate = t => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t;
}
