import { Ease } from '../Ease';

export class QuadIn extends Ease
{
	current()
	{
		const t = this.fraction();

		return t * t;
		return t * (2 - t);
	}
}
