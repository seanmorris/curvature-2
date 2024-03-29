import { Router } from '../base/Router';

export class Service
{
	static register(script, scope = '/')
	{
		if(!('serviceWorker' in navigator))
		{
			return Promise.reject('Service Workers not supported.')
		}

		// navigator.serviceWorker.startMessages();

		const serviceWorker = navigator.serviceWorker;

		serviceWorker.register(script, {scope})

		serviceWorker.ready.then(registration => {
			const worker = registration.active;

			if(!worker)
			{
				return;
			}

			this.setupWorker(worker);
		});

		return serviceWorker.ready;
	}

	static request({command, args, echo, notify, to = null, broadcast = false})
	{
		const correlationId = Number(1/Math.random()).toString(36);

		const getResponse = new Promise(accept => {
			this.incomplete.set(correlationId, accept);
		});

		for(const [scriptURL, worker] of this.workers)
		{
			if(worker.state === 'redundant')
			{
				if(navigator.serviceWorker.controller
					&& navigator.serviceWorker.controller.scriptURL === scriptURL
					&& navigator.serviceWorker.controller.state === 'activated'
				){
					worker = navigator.serviceWorker.controller;

					this.setupWorker(worker);
				}
				else
				{
					return Promise.reject('Worker has been updated, connection lost. Please refresh the page.');
				}
			}

			worker.postMessage({
				correlationId
				, broadcast
				, command
				, notify
				, args
				, echo
				, to
			});
		}

		return getResponse;
	}

	static broadcast({command, args, echo, notify})
	{
		this.request({command, args, echo, notify, broadcast: true});
	}

	static handleResponse(event)
	{
		event.target.ready.then(registration => this.setupWorker(registration.active));

		const packet = event.data;

		if(!packet.to && !packet.correlationId)
		{
			return;
		}

		if(!this.incomplete.has(packet.correlationId))
		{
			if(packet.broadcast)
			{
				this.handleBroadcast(event);
			}
			else if(packet.to)
			{
				this.handleMessage(event);
			}

			return;
		}

		const getResponse = this.incomplete.get(packet.correlationId);

		this.incomplete.delete(packet.correlationId);

		getResponse(packet.result);
	}

	static handleRequest(event)
	{
		if(event.origin !== globalThis.origin)
		{
			return;
		}

		const packet = event.data;

		let getResponse = Promise.resolve('Unexpected request.');

		if(packet.echo)
		{
			getResponse = Promise.resolve(packet.echo);
		}
		else if(packet.notify)
		{
			const args = packet.args || [];

			getResponse = globalThis.registration.getNotifications()
			.then(notifyList => {

				notifyList.forEach(
					notification => this.notifications.set(notification.tag, notification)
				);

				return globalThis.registration.showNotification(...args);

			})
			.then(() => {

				return globalThis.registration.getNotifications();

			})
			.then(notifyList => {

				let tag = event.data.args
					&& event.data.args[1]
					&& event.data.args[1].tag;

				const notifyClient = new Promise(accept => {

					let notifiers;

					if(this.notifyClients.has(tag))
					{
						notifiers = this.notifyClients.get(tag);
					}
					else
					{
						notifiers = new Map;

						this.notifyClients.set(tag, notifiers);
					}

					notifiers.set(event.source, accept);
				});

				return notifyClient;
			});
		}
		else if(packet.command)
		{
			const command = packet.command;
			const args    = packet.args || [];

			for(const handler of this.serviceHandlers)
			{
				if(typeof handler[command] === 'function')
				{
					getResponse = handler[command](...args);
					break;
				}
			}
		}

		if(typeof getResponse !== Promise)
		{
			getResponse = Promise.resolve(getResponse);
		}

		if(packet.broadcast)
		{
			const options = {type: 'window', includeUncontrolled: true};
			const source  = event.source.id;

			globalThis.clients.matchAll(options).then(clientList => {
				clientList.forEach(client => {
					getResponse.then(response => client.postMessage({
						...packet, result: response, source
					}))
				});
			});
		}
		else if(packet.to)
		{
			const source = event.source.id;

			globalThis.clients.get(packet.to).then(client => {
				getResponse.then(response => {
					client.postMessage({
						...packet, result: response, source
					});
				});
			});
		}
		else
		{
			getResponse.then(response => event.source.postMessage({
				...packet, result: response
			}));
		}
	}

	static setupWorker(worker)
	{
		this.workers.set(worker.scriptURL, worker);

		navigator.serviceWorker.addEventListener('message', event => this.handleResponse(event));
	}

	static handleInstall(event)
	{
		globalThis.skipWaiting();

		for(const handler of this.pageHandlers)
		{
			if(typeof handler.handleInstall === 'function')
			{
				handler.handleInstall(event);
			}
		}
	}

	static handleActivate(event)
	{
		for(const handler of this.pageHandlers)
		{
			if(typeof handler.handleActivate === 'function')
			{
				handler.handleActivate(event);
			}
		}
	}

	static handleError(event)
	{
		console.error(event);

		for(const handler of this.pageHandlers)
		{
			if(typeof handler.handleError === 'function')
			{
				handler.handleError(event);
			}
		}
	}

	static handlePush(event)
	{
		// console.log('push', event);
	}

	static handleSync(event)
	{
		// console.log('sync', event);
	}

	static handlePeriodicSync(event)
	{
		// console.log('periodic sync', event);
	}

	static handleFetch(event)
	{
		const url  = new URL(event.request.url);
		const path = url.pathname + url.search;

		for(const routes of this.routeHandlers)
		{
			return Router.match(path, {routes}, {event}).then(result => {

				if(result === undefined)
				{
					return;
				}

				if(typeof result !== 'object' || !(result instanceof Response))
				{
					result = new Response(result);
				}

				return result;
			});
		}
	}

	static handleBroadcast(event)
	{
		for(const handler of this.pageHandlers)
		{
			if(typeof handler.handleBroadcast === 'function')
			{
				handler.handleBroadcast(event);
			}
		}
	}

	static handleMessage(event)
	{
		for(const handler of this.pageHandlers)
		{
			if(typeof handler.handleMessage === 'function')
			{
				handler.handleMessage(event);
			}
		}
	}

	static notify(title, options = {}, broadcast = false)
	{
		options.tag = options.tag || ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(
			/[018]/g
			, c => (
				c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4
			).toString(16)
		);

		return new Promise((accept, reject) => {
			Notification.requestPermission((result) => {
				accept(result);
			});
		})
		.then(result => this.request(
			{notify: true, args: [title, options], broadcast}
		));
	}

	static handleNotifyClicked(event)
	{
		if(this.notifyClients.has(event.notification.tag))
		{
			const notifiers = this.notifyClients.get(event.notification.tag);

			let focusables = [];

			notifiers.forEach((notifier, client) => {
				notifier({
					action:  event.action
					, data:  event.notification.data
					, click: Date.now()
					, time:  event.notification.timestamp
					, tag:   event.notification.tag
				});

				focusables.push(client);
			});

			while(focusables.length)
			{
				const client = focusables.pop();

				if(client.focus())
				{
					break;
				}
			}

			this.notifyClients.delete(event.notification.tag);
		}

		for(const handler of this.pageHandlers)
		{
			if(typeof handler.handleNotifyClicked === 'function')
			{
				handler.handleNotifyClicked(event);
			}
		}

		event.notification.close();
	}

	static handleNotifyClosed(event)
	{
		if(this.notifyClients.has(event.notification.tag))
		{
			const notifiers = this.notifyClients.get(event.notification.tag);

			notifiers.forEach(notifier => notifier({
				action:  undefined
				, data:  event.notification.data
				, close: Date.now()
				, time:  event.notification.timestamp
				, tag:   event.notification.tag
			}));
		}

		if(this.notifyClients.delete(event.notification.tag))
		{
			for(const handler of this.pageHandlers)
			{
				if(typeof handler.handleNotifyDismissed === 'function')
				{
					handler.handleNotifyDismissed(event);
				}
			}
		}

		for(const handler of this.pageHandlers)
		{
			if(typeof handler.handleNotifyClosed === 'function')
			{
				handler.handleNotifyClosed(event);
			}
		}
	}
}

Object.defineProperty(Service, 'serviceHandlers', {value: new Set()});
Object.defineProperty(Service, 'routeHandlers',   {value: new Set()});
Object.defineProperty(Service, 'pageHandlers',    {value: new Set()});


Object.defineProperty(Service, 'notifications', {value: new Map});
Object.defineProperty(Service, 'notifyClients', {value: new Map});
Object.defineProperty(Service, 'incomplete',    {value: new Map});
Object.defineProperty(Service, 'workers',       {value: new Map});

if(!globalThis.document)
{
	globalThis.addEventListener('install',  event => Service.handleInstall(event));
	globalThis.addEventListener('activate', event => Service.handleActivate(event));
	globalThis.addEventListener('error',    event => Service.handleActivate(event));

	globalThis.addEventListener('message', event => Service.handleRequest(event));
	globalThis.addEventListener('fetch',   event => {
		event.waitUntil(new Promise(accept => {
			Service.handleFetch(event).then(result => {
				if(result)
				{
					event.respondWith(result);
				}

				accept();
			});
		}));
	});
	globalThis.addEventListener('push',    event => Service.handlePush(event));

	globalThis.addEventListener('notificationclose', event => Service.handleNotifyClosed(event));
	globalThis.addEventListener('notificationclick', event => Service.handleNotifyClicked(event));

	globalThis.addEventListener('sync',         event => Service.handleSync(event));
	globalThis.addEventListener('periodicsync', event => Service.handlePeriodicSync(event));
}

