import { Ease } from '../Ease';

export class QuintOut extends Ease
{
	calculate = t => 1+(--t)*t*t*t*t;
}
