import { Ease } from '../Ease';

export class QuartOut extends Ease
{
	calculate = t => 1-(--t)*t*t*t;
}
