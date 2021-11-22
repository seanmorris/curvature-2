import { Mixin } from '../base/Mixin';
import { EventTargetMixin  } from '../mixin/EventTargetMixin';

import { Axis } from './Axis';
import { Button } from './Button';

const keys = {
	'Space': 0

	, 'Enter':       0
	, 'NumpadEnter': 0

	, 'ControlLeft':  1
	, 'ControlRight': 1

	, 'ShiftLeft':  2
	, 'ShiftRight': 2

	, 'KeyZ':   3
	, 'KeyQ':   4
	, 'KeyE':   5

	, 'Digit1': 6
	, 'Digit3': 7

	, 'KeyW': 12
	, 'KeyA': 14
	, 'KeyS': 13
	, 'KeyD': 15

	, 'KeyH': 112
	, 'KeyJ': 113
	, 'KeyK': 114
	, 'KeyL': 115

	, 'KeyP':  9
	, 'Pause': 9

	, 'Tab': 11

	, 'ArrowUp':    12
	, 'ArrowDown':  13
	, 'ArrowLeft':  14
	, 'ArrowRight': 15

	, 'Numpad4': 112
	, 'Numpad2': 113
	, 'Numpad8': 114
	, 'Numpad6': 115

	, 'Backquote':      1010
	, 'NumpadAdd':      1011
	, 'NumpadSubtract': 1012
	, 'NumpadMultiply': 1013
	, 'NumpadDivide':   1014

	, 'Escape':         1020
};

[...Array(12)].map((x,fn) => keys[ `F${fn}` ] = 2000 + fn);

const axisMap = {
	12:   -1
	, 13: +1
	, 14: -0
	, 15: +0

	, 112: -2
	, 113: +3
	, 114: -3
	, 115: +2
};

export class Gamepad extends Mixin.with(EventTargetMixin)
{
	static padsConnected = new Map;
	static padsRead = new Map;

	static getPad({index = undefined, deadZone = 0, keys = {}, keyboard = null} = {})
	{
		if(this.padsConnected.has(index))
		{
			return this.padsConnected.get(index);
		}

		const waitForPad = new Promise(accept => {

			const registerPad = event => {

				event.stopImmediatePropagation();

				const pad = new this({gamepad: event.gamepad, deadZone, keys, keyboard});

				this.padsConnected.set(event.gamepad.index, waitForPad);

				accept(pad);
			};

			addEventListener('gamepadconnected', registerPad, {once:true});
		});

		return waitForPad;
	}

	constructor({keys = {}, deadZone = 0, gamepad = null, keyboard = null} = {})
	{
		super();

		this.deadZone = deadZone;
		this.gamepad  = gamepad;
		this.index    = gamepad.index;
		this.id       = gamepad.id;

		Object.defineProperties(this, {
			buttons:    { value: {} }
			, pressure: { value: {} }
			, axes:     { value: {} }
			, keys:     { value: {} }
		});
	}

	update()
	{
		for(const i in this.buttons)
		{
			const button = this.buttons[i];

			button.update();
		}
	}

	rumbleEffect(options)
	{
		return this.gamepad.vibrationActuator.playEffect("dual-rumble", options);
	}

	rumble(...options)
	{
		if(this.gamepad.vibrationActuator.pulse)
		{
			return this.gamepad.vibrationActuator.pulse(...options);
		}
		else
		{
			this.rumbleEffect({
				duration: 1000,
				strongMagnitude: 1.0,
				weakMagnitude: 1.0
			});
		}
	}

	readInput()
	{
		if(!this.gamepad)
		{
			return;
		}

		const index = String(this.gamepad.index);
		const stat  = this.constructor;

		if(!stat.padsRead.has(index))
		{
			stat.padsRead = new Map(Object.entries(navigator.getGamepads()));
		}

		const gamepad = this.gamepad = stat.padsRead.get(index);

		stat.padsRead.delete(index);

		const pressed  = {};
		const released = {};

		if(gamepad)
		{
			for(const i in gamepad.buttons)
			{
				const button = gamepad.buttons[i];

				if(button.pressed)
				{
					this.press(i, button.value);

					pressed[i] = true;
				}
			}
		}

		if(this.keyboard)
		{
			for(const i in [...Array(10)])
			{
				if(pressed[i])
				{
					continue;
				}

				if(this.keyboard.getKeyCode(i) > 0)
				{
					this.press(i, 1);

					pressed[i] = true;
				}
			}

			for(const keycode in keys)
			{
				if(pressed[keycode])
				{
					continue;
				}

				const buttonId = keys[keycode];

				if(this.keyboard.getKeyCode(keycode) > 0)
				{
					this.press(buttonId, 1);

					pressed[buttonId] = true;
				}
			}
		}

		if(gamepad)
		{
			for(const i in gamepad.buttons)
			{
				if(pressed[i])
				{
					continue;
				}

				const button = gamepad.buttons[i];

				if(!button.pressed)
				{
					this.release(i);

					released[i] = true;
				}
			}
		}

		if(this.keyboard)
		{
			for(const i in [...Array(10)])
			{
				if(released[i])
				{
					continue;
				}

				if(pressed[i])
				{
					continue;
				}

				if(this.keyboard.getKeyCode(i) < 0)
				{
					this.release(i);

					released[i] = true;
				}
			}

			for(const keycode in keys)
			{
				const buttonId = keys[keycode];

				if(released[buttonId])
				{
					continue;
				}

				if(pressed[buttonId])
				{
					continue;
				}

				if(this.keyboard.getKeyCode(keycode) < 0)
				{
					this.release(buttonId);

					released[keycode] = true;
				}
			}
		}

		const tilted = {};

		if(gamepad)
		{
			for(const i in gamepad.axes)
			{
				const axis = gamepad.axes[i];

				tilted[i] = true;

				this.tilt(i, axis);
			}
		}

		for(let inputId in axisMap)
		{
			if(!this.buttons[inputId])
			{
				this.buttons[inputId] = new Button;
			}

			const axis   = axisMap[ inputId ];
			const value  = Math.sign(1/axis);
			const axisId = Math.abs(axis);

			if(this.buttons[inputId].active)
			{
				tilted[axisId] = true;

				this.tilt(axisId, value);
			}
			else if(!tilted[axisId])
			{
				this.tilt(axisId, 0);
			}
		}
	}

	tilt(axisId, magnitude)
	{
		if(!this.axes[axisId])
		{
			this.axes[axisId] = new Axis({deadZone:this.deadZone});
		}

		this.axes[axisId].tilt(magnitude);
	}

	press(buttonId, pressure = 1)
	{
		if(!this.buttons[buttonId])
		{
			this.buttons[buttonId] = new Button;
		}

		this.buttons[buttonId].press(pressure);
	}

	release(buttonId)
	{
		if(!this.buttons[buttonId])
		{
			this.buttons[buttonId] = new Button;
		}

		this.buttons[buttonId].release();
	}

	serialize()
	{
		const buttons = {};

		for(const i in this.buttons)
		{
			buttons[i] = this.buttons[i].pressure;
		}

		const axes = {};

		for(const i in this.axes)
		{
			axes[i] = this.axes[i].magnitude;
		}

		return {axes, buttons};
	}

	replay(input)
	{
		if(input.buttons)
		{
			for(const i in input.buttons)
			{
				if(input.buttons[i] > 0)
				{
					this.press(i, input.buttons[i]);
				}
				else
				{
					this.release(i);
				}
			}
		}

		if(input.axes)
		{
			for(const i in input.axes)
			{
				if(input.axes[i].magnitude !== input.axes[i])
				{
					this.tilt(i, input.axes[i]);
				}
			}
		}
	}

	zero()
	{
		for(const i in this.axes)
		{
			this.axes[i].zero();
		}

		for(const i in this.buttons)
		{
			this.buttons[i].zero();
		}
	}
}
