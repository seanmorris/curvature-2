// function Node(){};
// function IntersectionObserver(){};
// window = {};

// importScripts('/app.js');

// const Database = require('Database').Database;

// Database.addEventListener('write', event => postMessage(event.detail));
// Database.addEventListener('read',  event => postMessage(event.detail));

// Database.open('event-log', 1).then(database =>  {
// 	const eventSource = new EventSource('/events');

// 	eventSource.addEventListener('ServerEvent', event => {
// 		return database.insert('event-log', JSON.parse(event.data));
// 	});

// 	eventSource.addEventListener('error', error => {
// 		console.error(error);
// 	});
// });
