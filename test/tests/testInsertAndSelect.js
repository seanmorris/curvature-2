export const testInsertAndSelect = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	try
	{
		const Database = require('curvature/model/Database').Database;

		Database.prototype._version_1 = (connection,database) => {
			const store = database.createObjectStore('records', {keyPath: 'id', indexName: 'id'});
			const index = store.createIndex('id', 'id', {keyPath: 'id', });
		};

		const View = require('curvature/base/View').View;
		const view = View.from('<ul cv-each = "records:record"><li>[[record.id]]::[[record.value]]</li></ul>');

		view.args.records = [];

		view.render(document.body);

		const records = Array.from(Array(10)).map((_,id) => ({id, value: id}));

		const selected = [];

		Database.open('records', 1).then(database => {

			const updateSelected = r => {
				r.value++;
				return database.update('records', r);
			};

			database.clear('records')
			.then(() => records.map(record => database.insert('records', record)))
			.then(() => database.select({store: 'records', index: 'id', ranges: [[,3], [5,7]]}).each(record => selected.push(record)))
			.then(() => Promise.all(selected.map(updateSelected)))
			.then(updates => database.select({store: 'records', index: 'id', range: [8]}).each(record => database.delete('records', record)))
			.then(() => database.select({store: 'records', index: 'id', ranges: [[0,2], [5], [7,,]]}).each(record => view.args.records.push(record)));
		});
	}
	catch(error)
	{
		console.error(error);
	}
	finally
	{
		return require('Delay')(1000).then(() => document.body.innerHTML);
	}
};
