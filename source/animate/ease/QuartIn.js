import { Ease } from '../Ease';

export class QuartIn extends Ease
{
	calculate = t => t*t*t*t;
}
