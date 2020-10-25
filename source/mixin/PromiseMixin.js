import { Mixin }    from '../base/Mixin';
import { Bindable } from '../base/Bindable';

const PromiseSymbol = Symbol('Promise');
const Accept        = Symbol('Accept');
const Reject        = Symbol('Reject');

export const PromiseMixin = {
	Promise:  PromiseSymbol
	, Accept: Accept
	, Reject: Reject

	, [Mixin.Constructor]()
	{
		this[PromiseSymbol] = new Promise((accept, reject)=>{
			this[Accept] = accept;
			this[Reject] = reject;
		});
	}

	, then(callback)
	{
		return this[PromiseSymbol].then(callback);
	}

	, catch(callback)
	{
		return this[PromiseSymbol].catch(callback);
	}

	, finally(callback)
	{
		return this[PromiseSymbol].finally(callback);
	}
}
