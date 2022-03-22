export const EventPipe = (events) => {

	const headers = new Headers;

	headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
	headers.set('Access-Control-Allow-Origin',  '*');

	headers.set('Cache-Control', 'no-cache');
	headers.set('Content-Type',  'text/event-stream');
	headers.set('Connection',    'keep-alive');

	const { readable, writable } = new TransformStream();

	const writer  = writable.getWriter();
	const encoder = new TextEncoder();

	const eventSenders = [];

	for(const getEvent of events)
	{
		if(!(getEvent instanceof Promise))
		{
			getEvent = Promise.resolve(getEvent);
		}

		getEvent.then(event => {
			if(!event || typeof event !== 'object')
			{
				event = {data:event};
			}

			writer.write(encoder.encode(
				`event: ${ event.type ?? 'ServerEvent' }\n`
				+ `data: ${ JSON.stringify(event.data) }\n`
				+ `id: ${ event.id ?? Date.now() }\n\n`
			));
		});

		eventSenders.push(getEvent);
	}

	Promise.all(eventSenders).then(() => writer.close());

	return new Response(readable, {
		status:       '200'
		, statusText: 'OK'
		, headers
	});

};
