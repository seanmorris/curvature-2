import { Bindable } from '../base/Bindable';

export class Keyboard
{
	constructor()
	{
		if(this.listening)
		{
			// return;
		}

		this.maxDecay = 60;

		console.log('listening');

		this.listening = true;

		this.keys  = Bindable.makeBindable({});
		this.codes = Bindable.makeBindable({});

		document.addEventListener('keyup', (event) => {
			this.keys[ event.key ]   = -1;
			this.codes[ event.code ] = -1;
		});

		document.addEventListener('keydown', (event) => {
			if(this.keys[ event.key ] > 0)
			{
				return;
			}
			this.keys[ event.key ]   = 1;
			this.codes[ event.code ] = 1;
		});
	}

	getKey(key)
	{
		if(!this.keys[key])
		{
			return 0;
		}

		return this.keys[key];
	}

	getKeyCode(code)
	{
		if(!this.codes[code])
		{
			return 0;
		}

		return this.codes[code];
	}

	update()
	{
		for(var i in this.keys)
		{
			if(this.keys[i] > 0)
			{
				this.keys[i]++;
			}
			else
			{
				this.keys[i]--;

				if(this.keys[i] < -this.maxDecay)
				{
					delete this.keys[i];
				}
			}
		}
		for(var i in this.codes)
		{
			if(this.codes[i] > 0)
			{
				this.codes[i]++;
			}
			else
			{
				this.codes[i]--;

				if(this.codes[i] < -this.maxDecay)
				{
					delete this.keys[i];
				}
			}
		}
	}
}
