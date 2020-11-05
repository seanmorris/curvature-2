import { Mixin } from '../base/Mixin';

const _Promise = Symbol('Promise');
const Accept   = Symbol('Accept');
const Reject   = Symbol('Reject');

export const PromiseMixin = {
	[Mixin.Constructor]()
	{
		this[_Promise] = new Promise((accept, reject)=>{
			this[Accept] = accept;
			this[Reject] = reject;
		});
	}

	, then(...args)
	{
		return this[_Promise].then(...args);
	}

	, catch(...args)
	{
		return this[_Promise].catch(...args);
	}

	, finally(...args)
	{
		return this[_Promise].finally(...args);
	}
}
