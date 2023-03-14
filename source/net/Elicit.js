import { Mixin } from 'curvature/base/Mixin';
import { EventTargetMixin } from 'curvature/mixin/EventTargetMixin';
import { PromiseMixin } from 'curvature/mixin/PromiseMixin';

const IterateDownload = Symbol('IterateDownload');
const Retry = Symbol('Retry');

const HandleFirstByte = Symbol('HandleFirstByte');
const HandleProgress  = Symbol('HandleProgress');
const HandleComplete  = Symbol('HandleComplete');
const HandleHeaders   = Symbol('HandleHeaders');
const HandleClose     = Symbol('HandleClose');
const HandleError     = Symbol('HandleError');
const HandleOpen      = Symbol('HandleOpen');
const HandleFail      = Symbol('HandleFail');

const LastChunkSize   = Symbol('LastChunkSize');
const LastChunkTime   = Symbol('LastChunkTime');

const Options     = Symbol('Options');
const Fetch       = Symbol('Fetch');
const Type        = Symbol('Type');
const Url         = Symbol('Url');

const RetriesLeft = Symbol('RetriesLeft');
const TimeoutLeft = Symbol('TimeoutLeft');
const Timeout     = Symbol('Timeout');
const Timer       = Symbol('Timer');
const Canceller   = Symbol('Canecller');
const Cancelled   = Symbol('Caneclled');
const Paused      = Symbol('Paused');
const Received    = Symbol('Received');
const Length      = Symbol('Length');
const Opened      = Symbol('Opened');
const Closed      = Symbol('Closed');
const Start       = Symbol('Start');
const First       = Symbol('First');
const End         = Symbol('End');

export class Elicit extends Mixin.with(EventTargetMixin, PromiseMixin)
{
	constructor(url, options = {})
	{
		super();

		this[RetriesLeft] = options.retries    || 5;
		this[Timeout]     = options.timeout    || 4500;
		this[TimeoutLeft] = options.maxTimeout || this[Timeout] * this[RetriesLeft];

		this[LastChunkTime] = 0;
		this[LastChunkSize] = 0;

		this[Cancelled] = false;
		this[Received]  = 0;
		this[Paused]    = false;
		this[Closed]    = 0;

		this[Options] = Object.assign({}, options);
		this[Url]     = url;

		if(!options.defer)
		{
			this.open();
		}
	}

	open()
	{
		if(this[Opened] && !this[Closed])
		{
			return;
		}

		if(!this[Start])
		{
			this[Start] = Date.now();
		}

		this[Canceller] = new AbortController;
		this[Options].signal = this[Canceller].signal;

		this[Opened] = Date.now();
		this[Closed] = 0;
		this[First]  = 0;

		this[Fetch] = fetch(this[Url], this[Options])
		.then(response => this[HandleOpen](response))
		.catch(error => this[HandleError](error));

		const onTimeout = () => {

			if(!this[First])
			{
				this[Canceller].abort();

				this[HandleClose]();

				this[TimeoutLeft] = Math.max(0, this[TimeoutLeft] - this[Timeout]);

				if(this[TimeoutLeft])
				{
					return;
				}

				this[HandleFail](new Error('Timed out.'));
			}
		};

		this[Timer] = setTimeout(onTimeout, this[Timeout]);
	}

	headers()
	{
		return this[Fetch].then(({response, stream}) => response.headers)
	}

	json()
	{
		return this[Fetch].then(({response, stream}) => {

			const wrapped = new Response(stream, {headers: {'Content-Type': 'application/json'}});

			return wrapped.json();
		});
	}

	text()
	{
		return this[Fetch].then(({response, stream}) => {

			const wrapped = new Response(stream, {headers: {'Content-Type': this.type}});

			return wrapped.text();
		});
	}

	css()
	{
		return this.text().then(css => {
			const sheet = new CSSStyleSheet();
			sheet.replace(css);
			return sheet;
		});
	}

	blob()
	{
		return this[Fetch].then(({response, stream}) => {

			const wrapped = new Response(stream, {headers: {'Content-Type': response.headers.get('Content-Type')}});

			return wrapped.blob()
		});
	}

	objectUrl()
	{
		return this.blob().then(blob => URL.createObjectURL(blob));
	}

	dataUri()
	{
		return this.blob().then(blob => new Promise((accept,reject) => {
			const reader  = new FileReader();
			reader.onload  = event => accept(reader.result);
			reader.onerror = event => reject(reader.error);
			reader.onabort = event => reject(new Error("Read aborted"));

			reader.readAsDataURL(blob);
		}));
	}

	buffer()
	{
		return this.blob().then(blob => blob.arrayBuffer());
	}

	bytes()
	{
		return this.buffer().then(buffer => new Uint8Array(buffer));
	}

	cancel()
	{
		if(!this.emitCancelEvent())
		{
			return;
		}

		this[Canceller].abort();

		this[Cancelled] = true;

		this.emitCancelledEvent();
	}

	pause()
	{
		if(this[End] || this[Paused] || this[Closed])
		{
			return;
		}

		if(!this.emitPauseEvent())
		{
			return;
		}

		this[Paused] = true;

		this.emitPausedEvent()
	}

	unpause()
	{
		if(this[End] || !this[Paused])
		{
			return;
		}

		if(!this.emitUnpauseEvent())
		{
			return;
		}

		this[Paused] = false;

		this.emitUnpausedEvent()
	}

	get done()
	{
		return !!this[End];
	}

	get type()
	{
		return this[Type];
	}

	get totalTime()
	{
		if(!this[End])
		{
			return Date.now() - this[Start];
		}

		return this[End] - this[Start];
	}

	get waitTime()
	{
		if(!this[First])
		{
			return Date.now() - this[Opened];
		}

		return this[First] - this[Opened];
	}

	get loadTime()
	{
		if(!this[Opened])
		{
			return 0;
		}

		if(!this[Closed])
		{
			return Date.now() - this[First];
		}

		return this[Closed] - this[First];
	}

	get speed()
	{
		if(!this[Opened])
		{
			return 0;
		}

		let time;

		if(this[End])
		{
			time = this[End] - this[LastChunkTime];
		}
		else
		{
			time = Date.now() - this[LastChunkTime];
		}

		if(!time)
		{
			time = 0.01;
		}

		return this[LastChunkSize] / time;
	}

	get received()
	{
		return this[Received];
	}

	get length()
	{
		return this[Length];
	}

	get isPaused()
	{
		return this[Paused];
	}

	[IterateDownload](reader, controller, length)
	{
		this[HandleProgress](length, 0, null);

		let lastTime = Date.now();
		let lastSize = 1;

		const handleChunk = ({done, value}) => {

			if(done)
			{
				controller.close();

				return this[HandleComplete]();
			}

			controller.enqueue(value);

			this[Received] += value.length;

			if(!this[First])
			{
				this[HandleFirstByte](value);
			}

			this[HandleProgress](length, this[Received]);

			this[LastChunkTime] = lastTime;
			this[LastChunkSize] = lastSize;

			lastTime = Date.now();
			lastSize = value.length;

			return iterate();
		};

		const iterate = () => {

			if(this[Cancelled])
			{
				return reader.cancel();
			}

			if(this[Paused])
			{
				return new Promise(accept => {
					setTimeout(() => accept(iterate()), 100);
				});
			}

			return reader.read()
			.then((chunk) => handleChunk(chunk))
			.catch(error => this[HandleError](error));
		}

		return iterate();
	}

	[Retry]()
	{
		if(!this.emitRetryEvent())
		{
			return;
		}

		if(this[RetriesLeft] <= 0)
		{
			return;
		}

		this[Canceller].abort();

		this[HandleClose]();

		this[Received] = 0;

		this[RetriesLeft]--;

		return this.open();
	}

	[HandleOpen](response)
	{
		const reader = response.body.getReader();
		const length = this[Length] || Number(response.headers.get('Content-Length'));
		const type   = this[type]   || response.headers.get('Content-Type');

		this[Length] = length;
		this[Type]   = type;

		this[HandleHeaders](response.headers);

		const _this  = this;

		const stream = new ReadableStream({
			start(controller)
			{
				_this[IterateDownload](reader, controller, length);
			}
		});

		return {response, stream};
	}

	[HandleClose]()
	{
		this[Closed] = Date.now();

		this.emitCloseEvent();
	}

	[HandleHeaders](headers)
	{
		this.emitHeadersEvent(headers);
	}

	[HandleProgress](length, received, value)
	{
		this.emitProgressEvent(length, received, value);
	}

	[HandleComplete]()
	{
		this[End] = Date.now();

		this[HandleClose]();

		this.emitCompleteEvent();
		this[PromiseMixin.Accept]();
	}

	[HandleError](error)
	{
		console.warn(`[${error.constructor.name}] ${error.code}: ${error.message}`, error);

		if(this.emitErrorEvent(error))
		{
			return this[Retry]();
		}

		return this[HandleFail](error);
	}

	[HandleFail](error)
	{
		this[End] = Date.now();

		this[HandleClose]();

		this.emitFailEvent(error);

		return this[PromiseMixin.Reject](error);
	}

	[HandleFirstByte](received)
	{
		clearInterval(this[Timer]);

		this[First] = Date.now();

		this.emitFirstByteEvent(received);
	}

	emitProgressEvent(length, received, value)
	{
		const done = length ? (received / length) : 0;

		const totalTime = this.totalTime;
		const loadTime  = this.loadTime;
		const waitTime  = this.waitTime;
		const speed     = this.speed;

		return this.dispatchEvent(new CustomEvent(
			'progress', {detail: {
				length, received, done, speed, loadTime, waitTime, totalTime, value
			}}
		));
	}

	emitOpenEvent()
	{
		return this.dispatchEvent(new CustomEvent('open'));
	}

	emitCloseEvent()
	{
		return this.dispatchEvent(new CustomEvent('close'));
	}

	emitFirstByteEvent(received)
	{
		return this.dispatchEvent(new CustomEvent('firstByte', {detail: {received}}));
	}

	emitHeadersEvent(headers)
	{
		return this.dispatchEvent(new CustomEvent('headers', {detail: {headers}}));
	}

	emitCompleteEvent()
	{
		return this.dispatchEvent(new CustomEvent('complete'));
	}

	emitErrorEvent()
	{
		return this.dispatchEvent(new CustomEvent('error', {cancelable: this[RetriesLeft] > 0}));
	}

	emitRetryEvent()
	{
		return this.dispatchEvent(new CustomEvent('retry', {cancelable: true}));
	}

	emitFailEvent()
	{
		return this.dispatchEvent(new CustomEvent('fail'));
	}

	emitPauseEvent()
	{
		return this.dispatchEvent(new CustomEvent('pause', {cancelable: true}));
	}

	emitPausedEvent()
	{
		this.dispatchEvent(new CustomEvent('paused'));
	}

	emitUnpauseEvent()
	{
		return this.dispatchEvent(new CustomEvent('unpause', {cancelable: true}));
	}

	emitUnpausedEvent()
	{
		this.dispatchEvent(new CustomEvent('unpaused'));
	}

	emitCancelEvent()
	{
		return this.dispatchEvent(new CustomEvent('cancel', {cancelable: true}));
	}

	emitCancelledEvent()
	{
		return this.dispatchEvent(new CustomEvent('cancelled'));
	}
}

// elicit.addEventListener('open', event => console.log(event));
// elicit.addEventListener('close', event => console.log(event));

// elicit.addEventListener('firstByte', event => console.log(event));
// elicit.addEventListener('headers', event => console.log(event));

// elicit.addEventListener('complete', event => console.log(event));
// elicit.addEventListener('error', event => console.log(event));
// elicit.addEventListener('fail', event => console.log(event));

// elicit.addEventListener('pause', event => console.log(event));
// elicit.addEventListener('paused', event => console.log(event));
// elicit.addEventListener('unpause', event => console.log(event));
// elicit.addEventListener('unpaused', event => console.log(event));

// elicit.addEventListener('cancelled', event => console.log(event));
// elicit.addEventListener('cancel', event => console.log(event));
