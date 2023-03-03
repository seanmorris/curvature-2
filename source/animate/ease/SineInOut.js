import { Ease } from '../Ease';

export class SineInOut extends Ease
{
	calculate = t => (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2;
}
