import { Ease } from '../Ease';

export class SineOut extends Ease
{
	calculate = t => Math.sin(Math.PI / 2 * t);
}
