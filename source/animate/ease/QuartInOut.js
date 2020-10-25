import { Ease } from '../Ease';

export class QuartInOut extends Ease
{
	calculate = t => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t;
}
