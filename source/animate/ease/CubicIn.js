import { Ease } from '../Ease';

export class CubicIn extends Ease
{
	calculate = t => t*t*t;
}
