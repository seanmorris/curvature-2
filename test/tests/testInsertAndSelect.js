export const testInsertAndSelect = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	try
	{
		const Database = require('curvature/model/Database').Database;

		Database._version_1 = database => this.createObjectStore('records', {keyPath: 'id'});

		const View = require('curvature/base/View').View;
		const view = View.from('<ul cv-each = "records:record"><li>[[record.id]]</li></ul>\n');

		view.render(document.body);

		const records = Array.from(Array(10)).map((_,id) => ({id}));

		Database.open('records', 1).then(database => {
			console.log(database);
		});

		// records.forEach(record => )
		// database.insert('records', record);

		view.args.records = records;

	}
	catch(error)
	{
		console.error(error);
	}
	finally
	{
		return require('Delay')(1000).then(() => JSON.stringify(form.value, null, 4) + "\n");
	}

};
