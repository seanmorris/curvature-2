export const testStoreAndIndexListing = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	try
	{
		const Database = require('curvature/model/Database').Database;

		Database.prototype._version_1 = (connection,database) => {
			const records = database.createObjectStore('records', {keyPath: 'id', indexName: 'id'});
			records.createIndex('id',    'id',    {keyPath: 'id', });
			records.createIndex('value', 'value', {keyPath: 'value', unique: false});

			const models = database.createObjectStore('models', {keyPath: 'id', indexName: 'id'});
			models.createIndex('id',    'id',    {keyPath: 'id', });
			models.createIndex('val', 'val', {keyPath: 'val', unique: false});

			const items = database.createObjectStore('items', {keyPath: 'id', indexName: 'id'});
			items.createIndex('id',    'id',    {keyPath: 'id', });
			items.createIndex('name', 'name', {keyPath: 'name', unique: false});
		};

		// const View = require('curvature/base/View').View;
		// const view = View.from('<ul cv-each = "records:record"><li>[[record.id]]::[[record.value]]</li></ul>');
		// view.args.records = [];
		// view.render(document.body);

		const records = Array.from(Array(10)).map((_,id) => ({id, value: id}));

		const selected = [];

		Database.open('records', 1).then(database => {

			const stores = database.getObjectStores();

			const indexList = {};

			stores.forEach(store => database.getStoreIndexes(store).forEach(index => {
				indexList[ store ] = indexList[ store ] || [];

				indexList[ store ].push(index);
			}));

			document.body.innerHTML = JSON.stringify(indexList);

			// const updateSelected = r => {
			// 	r.value++;
			// 	return database.update('records', r);
			// };

			// database.clear('records')
			// .then(() => records.map(record => database.insert('records', record)))
			// .then(() => database.select({store: 'records', index: 'id', ranges: [[,3], [5,7]]}).each(record => selected.push(record)))
			// .then(() => Promise.all(selected.map(updateSelected)))
			// .then(updates => database.select({store: 'records', index: 'id', range: [8]}).each(record => database.delete('records', record)))
			// .then(() => database.select({store: 'records', index: 'id', ranges: [[0,2], [5], [7,,]]}).each(record => view.args.records.push(record)));
		});
	}
	catch(error)
	{
		console.error(error);
	}
	finally
	{
		return require('Delay')(1000).then(() => document.body.innerHTML);
		return require('Delay')(1000**3).then(() => document.body.innerHTML);
	}
};
