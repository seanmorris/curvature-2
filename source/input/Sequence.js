import { Mixin } from '../base/Mixin';
import { EventTargetMixin } from '../mixin/EventTargetMixin';

export class Sequence extends Mixin.with(EventTargetMixin)
{
	lastTap  = false;
	recent   = [];
	callback = () => {};
	timing   = 500;
	keys     = '';

	constructor({callback, keys, timing})
	{
		super();

		[this.callback, this.timing, this.keys] = [callback, timing, keys];
	}

	check(k)
	{
		const recent = this.recent;
		const now = Date.now();

		if(now + -this.lastTap > this.timing)
		{
			recent.splice(0);
		}

		recent.push({code: k, time: Date.now()});

		const current = recent.map(r => r.code).join(',');

		const konami = this.keys.join(',');

		this.lastTap = now;

		const matched = [];

		for(const i in recent)
		{
			const r = recent[i];

			const matchable = recent.slice(i);

			const chunk = matchable
				.map(r => r.code)
				.join(',');

			if(chunk === konami.substr(0, chunk.length))
			{
				matched.push(...matchable);

				this.dispatchEvent(new CustomEvent(
					'advance', {detail:{
						matched
						, recent
						, keys: this.keys
						, length: matchable.length
					}}
				));

				break;
			}
		}

		if(!matched.length)
		{
			this.dispatchEvent(new CustomEvent(
				'cancel', {detail: {
					matched
					, recent
					, keys: this.keys
					, length: matched.length
				}}
			));

			return;
		}

		if(konami === current.substr(-konami.length))
		{
			this.dispatchEvent(new CustomEvent(
				'complete', {detail: {
					matched
					, recent
					, keys: this.keys
					, length: matched.length
				}}
			));
		}
	}
}
