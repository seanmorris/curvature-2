import { Ease } from '../Ease';

export class QuadOut extends Ease
{
	current()
	{
		const t = this.fraction();

		return t * (2 - t);
	}
}
