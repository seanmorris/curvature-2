import { Bindable } from '../base/Bindable';

export class Keyboard
{
	static get()
	{
		return this.instance = this.instance || Bindable.make(new this);
	}

	constructor()
	{
		this.maxDecay     = 120;
		this.comboTime    = 500;
		this.listening    = false;
		this.focusElement = document.body;

		this[ Bindable.NoGetters ] = true;

		Object.defineProperty(this, 'combo',  {value: Bindable.make([])});

		Object.defineProperty(this, 'whichs', {value: Bindable.make({})});
		Object.defineProperty(this, 'codes',  {value: Bindable.make({})});
		Object.defineProperty(this, 'keys',   {value: Bindable.make({})});

		Object.defineProperty(this, 'pressedWhich', {value: Bindable.make({})});
		Object.defineProperty(this, 'pressedCode',  {value: Bindable.make({})});
		Object.defineProperty(this, 'pressedKey',   {value: Bindable.make({})});

		Object.defineProperty(this, 'releasedWhich', {value: Bindable.make({})});
		Object.defineProperty(this, 'releasedCode',  {value: Bindable.make({})});
		Object.defineProperty(this, 'releasedKey',   {value: Bindable.make({})});

		Object.defineProperty(this, 'keyRefs', {value: Bindable.make({})});

		document.addEventListener('keyup', (event) => {

			if(!this.listening)
			{
				return;
			}

			if(!(this.keys[ event.key ] > 0)
				&& this.focusElement
				&& document.activeElement !== this.focusElement
				&& (
					!this.focusElement.contains(document.activeElement)
					|| document.activeElement.matches('input,textarea')
				)
			){
				return;
			}

			event.preventDefault();

			this.releasedWhich[ event.which ] = Date.now();
			this.releasedCode[ event.code ]   = Date.now();
			this.releasedKey[ event.key ]     = Date.now();

			this.whichs[ event.which ] = -1;
			this.codes[ event.code ]   = -1;
			this.keys[ event.key ]     = -1;
		});

		document.addEventListener('keydown', (event) => {

			if(!this.listening)
			{
				return;
			}

			if(this.focusElement
				&& document.activeElement !== this.focusElement
				&& (
					!this.focusElement.contains(document.activeElement)
					|| document.activeElement.matches('input,textarea')
				)
			){
				return;
			}

			event.preventDefault();

			if(event.repeat)
			{
				return;
			}

			this.combo.push(event.code);

			clearTimeout(this.comboTimer);

			this.comboTimer = setTimeout(()=> this.combo.splice(0), this.comboTime);

			this.pressedWhich[ event.which ] = Date.now();
			this.pressedCode[ event.code ]   = Date.now();
			this.pressedKey[ event.key ]     = Date.now();

			if(this.keys[ event.key ] > 0)
			{
				return;
			}

			this.whichs[ event.which ] = 1;
			this.codes[ event.code ]   = 1;
			this.keys[ event.key ]     = 1;
		});

		const windowBlur = (event)=>{

			for(let i in this.keys)
			{
				if(this.keys[i] < 0)
				{
					continue;
				}

				this.releasedKey[ i ] = Date.now();
				this.keys[i] = -1;
			}

			for(let i in this.codes)
			{
				if(this.codes[i] < 0)
				{
					continue;
				}

				this.releasedCode[ i ] = Date.now();
				this.codes[i] = -1;
			}

			for(let i in this.whichs)
			{
				if(this.whichs[i] < 0)
				{
					continue;
				}

				this.releasedWhich[ i ] = Date.now();
				this.whichs[i] =  -1;
			}
		};

		window.addEventListener('blur', windowBlur);

		window.addEventListener('visibilitychange', () =>{

			if(document.visibilityState === 'visible')
			{
				return;
			}

		 	windowBlur();

		});
	}

	getKeyRef(keyCode)
	{
		const keyRef
			= this.keyRefs[keyCode]
			= this.keyRefs[keyCode] || Bindable.make({});

		return keyRef;
	}

	getKeyTime(key)
	{
		const released = this.releasedKey[ key ];
		const pressed  = this.pressedKey[ key ];

		if(!pressed)
		{
			return 0;
		}

		if(!released || released < pressed)
		{
			return Date.now() - pressed;
		}

		return (Date.now() - released) * -1;
	}

	getCodeTime(code)
	{
		const released = this.releasedCode[ code ];
		const pressed  = this.pressedCode[ code ];

		if(!pressed)
		{
			return 0;
		}

		if(!released || released < pressed)
		{
			return Date.now() - pressed;
		}

		return (Date.now() - released) * -1;
	}

	getWhichTime(code)
	{
		const released = this.releasedWhich[ code ];
		const pressed  = this.pressedWhich[ code ];

		if(!pressed)
		{
			return 0;
		}

		if(!released || released < pressed)
		{
			return Date.now() - pressed;
		}

		return (Date.now() - released) * -1;
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

	reset()
	{
		for(var i in this.keys)
		{
			delete this.keys[i];
		}

		for(var i in this.codes)
		{
			delete this.codes[i];
		}

		for(var i in this.whichs)
		{
			delete this.whichs[i];
		}
	}

	update()
	{
		for(var i in this.keys)
		{
			if(this.keys[i] > 0)
			{
				this.keys[i]++;
			}
			else if(this.keys[i] > -this.maxDecay)
			{
				this.keys[i]--;
			}
			else
			{
				delete this.keys[i];
			}
		}

		for(var i in this.codes)
		{
			const released = this.releasedCode[ i ];
			const pressed  = this.pressedCode[ i ];
			const keyRef   = this.getKeyRef(i);

			if(this.codes[i] > 0)
			{
				keyRef.frames = this.codes[i]++;
				keyRef.time   = pressed ? Date.now() - pressed : 0;
				keyRef.down   = true;

				if(!released || released < pressed)
				{
					return
				}

				return (Date.now() - released) * -1;
			}
			else if(this.codes[i] > -this.maxDecay)
			{
				keyRef.frames = this.codes[i]--;
				keyRef.time   = released - Date.now();
				keyRef.down   = false;
			}
			else
			{
				keyRef.frames = 0;
				keyRef.time   = 0;
				keyRef.down   = false;

				delete this.codes[i];
			}
		}

		for(var i in this.whichs)
		{
			if(this.whichs[i] > 0)
			{
				this.whichs[i]++;
			}
			else if(this.whichs[i] > -this.maxDecay)
			{
				this.whichs[i]--;
			}
			else
			{
				delete this.whichs[i];
			}
		}
	}
}
