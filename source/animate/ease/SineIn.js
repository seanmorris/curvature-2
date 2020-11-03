import { Ease } from '../Ease';

export class SineIn extends Ease
{
	calculate = t => 1 + Math.sin(Math.PI / 2 * t - Math.PI / 2);
}