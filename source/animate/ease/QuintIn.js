import { Ease } from '../Ease';

export class QuintIn extends Ease
{
	calculate = t => t*t*t*t*t;
}
