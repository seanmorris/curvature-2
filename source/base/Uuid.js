const win = typeof globalThis === 'object' ? globalThis : (typeof window === 'object' ? window : (typeof self === 'object' ? self : this));
const crypto = win.crypto;

export class Uuid
{
	uuid    = null;
	version = 4;

	constructor(uuid = null, version = 4)
	{
		if(uuid)
		{
			if((typeof uuid !== 'string' && !(uuid instanceof Uuid))
				|| !uuid.match(/[0-9A-Fa-f]{8}(-[0-9A-Fa-f]{4}){3}-[0-9A-Fa-f]{12}/)
			){
				throw new Error(`Invalid input for Uuid: "${uuid}"`);
			}

			this.version = version;
			this.uuid    = uuid;
		}
		else if(crypto && typeof crypto.randomUUID === 'function')
		{
			this.uuid = crypto.randomUUID();
		}
		else
		{
			const init = [1e7]+-1e3+-4e3+-8e3+-1e11;
			const rand = (crypto && typeof crypto.randomUUID === 'function')
				? () => crypto.getRandomValues(new Uint8Array(1))[0]
				: () => Math.trunc(Math.random() * 256);

			this.uuid = init.replace(/[018]/g, c => (c ^ rand() & 15 >> c / 4).toString(16));
		}

		Object.freeze(this);
	}

	[Symbol.toPrimitive]() { return this.toString(); }

	toString() { return this.uuid; }

	toJson() { return {version:this.version, uuid: this.uuid}; }
}
