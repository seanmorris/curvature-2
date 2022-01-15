import { Router } from '../base/Router';

export class Service
{
	static register(script = '/time-service.js', scope = '/')
	{
		if(!('serviceWorker' in navigator))
		{
			return Promise.reject('Service Workers not supported.')
		}

		// navigator.serviceWorker.startMessages();

		navigator.serviceWorker.addEventListener(
			'message', event => this.handleResponse(event)
		);

		navigator.serviceWorker.register(script, {scope})

		navigator.serviceWorker.ready.then(
			registration => this.worker = registration.active
		);

		return navigator.serviceWorker.ready;
	}

	static request({command, args, echo, notify})
	{
		const correlationId = Number(1/Math.random()).toString(36);

		const getResponse = new Promise(accept => {
			this.incomplete.set(correlationId, accept);
		});

		this.worker.postMessage({
			broadcast: false
			, correlationId
			, command
			, notify
			, args
			, echo
		});

		return getResponse;
	}

	static broadcast({command, args, echo, notify})
	{
		const correlationId = Number(1/Math.random()).toString(36);

		const getResponse = new Promise(accept => {
			this.incomplete.set(correlationId, accept);
		});

		this.worker.postMessage({
			broadcast: true
			, correlationId
			, command
			, notify
			, args
			, echo
		});

		return getResponse;
	}

	static handleResponse(event)
	{
		const packet = event.data;

		if(!packet.correlationId)
		{
			return;
		}

		if(!this.incomplete.has(packet.correlationId))
		{
			if(packet.broadcast)
			{
				this.handleBroadcast(event);
			}

			return;
		}

		const getResponse = this.incomplete.get(packet.correlationId);

		this.incomplete.delete(packet.correlationId);

		getResponse(packet.result);
	}

	static handleRequest(event)
	{
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
		else
		{
			getResponse.then(response => event.source.postMessage({
				...packet, result: response
			}));
		}
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
		for(const handler of this.pageHandlers)
		{
			if(typeof handler.handleFetch === 'function')
			{
				handler.handleFetch(event);
			}
		}

		if(event.defaultPrevented)
		{
			return;
		}

		const url  = new URL(event.request.url);
		const path = url.pathname + url.search;

		for(const handler of this.serviceHandlers)
		{
			const routes = handler.routes;

			if(!routes)
			{
				continue;
			}

			Router.match(url.pathname, {routes}).then(result => {
				if(result === undefined)
				{
					return;
				}

				event.respondWith(new Response(result));
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

	static notify(title, options = {})
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
			{notify: true, args: [title, options]}
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
Object.defineProperty(Service, 'pageHandlers',    {value: new Set()});

Object.defineProperty(Service, 'incomplete',    {value: new Map});
Object.defineProperty(Service, 'notifications', {value: new Map});
Object.defineProperty(Service, 'notifyClients', {value: new Map});