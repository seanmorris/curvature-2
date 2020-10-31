import { Bindable } from '../base/Bindable';

const PrimaryKey = Symbol('PrimaryKey');
const Connection = Symbol('Connection');
const Instances  = Symbol('Instances');
const Target = Symbol('Target');
const Store  = Symbol('Store');
const Fetch  = Symbol('Each');
const Name   = Symbol('Name');
const Bank   = Symbol('Bank');

export class Database
{
	constructor(connection)
	{
		Object.defineProperty(this, Connection, {value: connection});
		Object.defineProperty(this, Bank,       {value: {}});
	}

	static open(dbName, version = 0)
	{
		if(this[Instances][dbName])
		{
			return Promise.resolve(this[Instances][dbName]);
		}

		return new Promise((accept, reject) => {
			const request = indexedDB.open(dbName, version);

			request.onerror = error => {
				Database.dispatchEvent(new CustomEvent('readError', {detail: {
					database:  this[Name]
					, error:   error
					, store:   storeName
					, type:    'read'
					, subType: 'select'
				}}));

				reject(error);
			};

			request.onsuccess = event => {
				const instance = new this(event.target.result);
				instance[Name] = dbName;

				this[Instances][dbName] = instance

				accept(instance);
			};

			request.onupgradeneeded = event => {
				const connection = event.target.result;

				connection.addEventListener('error', error => {
					console.error(error)
				});

				for(let v = event.oldVersion + 1; v <= version; v++)
				{
					this['_version_' + v](connection);
				}

				const instance = new this(connection);
				instance[Name] = dbName;

				this[Instances][dbName] = instance

				accept(instance);
			};
		});
	}

	// static _version_1(database)
	// {
	// 	const eventLog = database.createObjectStore(
	// 		'models-store', {keyPath: 'id'}
	// 	);

	// 	eventLog.createIndex('id',      'id',      {unique: false});
	// 	eventLog.createIndex('class',   'class',   {unique: false});
	// }

	select({store, index, range = null, direction = 'next', limit = 0, offset = 0, type = false})
	{
		const t = this[Connection].transaction(store, "readonly");
		const s = t.objectStore(store);
		const i = index ? s.index(index) : s;

		return {
			each:   this[Fetch](type, i, direction, range, limit, offset)
			, one:  this[Fetch](type, i, direction, range, 1, offset)
			, then: c=>(this[Fetch](type, i, direction, range, limit, offset))(e=>e).then(c)
		};
	}

	insert(storeName, record)
	{
		return new Promise((accept, reject) => {
			this[Bank][storeName] = this[Bank][storeName] || new WeakMap;

			const trans = this[Connection].transaction([storeName], 'readwrite');
			const store = trans.objectStore(storeName);
			const bank  = this[Bank][storeName];

			record = Bindable.make(record);

			const request = store.add(Object.assign({}, record));

			request.onerror = error => {

				Database.dispatchEvent(new CustomEvent('writeError', {detail: {
					database:  this[Name]
					, record:  record
					, store:   storeName
					, type:    'write'
					, subType: 'insert'
				}}));

				reject(error);
			};

			request.onsuccess = event => {
				const pk           = event.target.result;
				bank[pk]           = record;
				record[PrimaryKey] = Symbol.for(pk);
				record[Store]      = storeName;

				Database.dispatchEvent(new CustomEvent('write', {detail: {
					database: this[Name]
					, key:    Database.getPrimaryKey(record)
					, store:  storeName
					, type:    'write'
					, subType: 'insert'
				}}));

				trans.commit();
				accept(record);
			};
		});
	}

	update(storeName, record)
	{
		if(!record[PrimaryKey])
		{
			throw Error('Value provided is not a DB record!');
		}

		return new Promise((accept, reject) => {
			// const storeName = record[Store];
			const trans     = this[Connection].transaction([storeName], 'readwrite');
			const store     = trans.objectStore(storeName);
			const request   = store.put(Object.assign({}, record));
			request.onerror = error => {
				Database.dispatchEvent(new CustomEvent('writeError', {detail: {
					database:  this[Name]
					, key:    Database.getPrimaryKey(record)
					, store:   storeName
					, type:    'write'
					, subType: 'update'
				}}));

				reject(error);
			};

			request.onsuccess = event => {
				Database.dispatchEvent(new CustomEvent('write', {detail: {
					database: this[Name]
					, key:    Database.getPrimaryKey(record)
					, store:  storeName
					, type:    'write'
					, subType: 'update'
				}}));

				trans.commit();
				accept(event);
			};
		});
	}

	delete(storeName, record)
	{
		if(!record[PrimaryKey])
		{
			throw Error('Value provided is not a DB record!');
		}

		return new Promise((accept, reject) => {
			// const storeName = record[Store];
			const trans     = this[Connection].transaction([storeName], 'readwrite');
			const store     = trans.objectStore(storeName);
			const request   = store.delete(Number(record[PrimaryKey].description));

			request.onerror = error => {
				const deleteEvent = new CustomEvent('writeError', {detail: {
					database:   this[Name]
					, original: event
					, key:      Database.getPrimaryKey(record)
					, store:    storeName
					, type:     'write'
					, subType:  'delete'
				}});

				Database.dispatchEvent(deleteEvent);

				reject(error);
			};

			request.onsuccess = event => {
				const writeEvent = new CustomEvent('write', {detail: {
					database:   this[Name]
					, original: event
					, key:      Database.getPrimaryKey(record)
					, store:    storeName
					, type:     'write'
					, subType:  'delete'
				}});

				Database.dispatchEvent(writeEvent);

				trans.commit();

				accept(writeEvent);
			};
		});
	}

	listStores()
	{
		return [...this[Connection].objectStoreNames];
	}

	listIndexes(storeName)
	{
		const trans     = this[Connection].transaction([storeName]);
		const store     = trans.objectStore(storeName);

		return [...store.indexNames];
	}

	[Fetch](type, index, direction, range, limit, offset)
	{
		return callback => new Promise((accept, reject) => {
			let i = 0;

			const request = index.openCursor(range, direction);

			request.addEventListener('success', event => {

				const cursor = event.target.result;

				if(!cursor)
				{
					return accept({record: null, result: null, index: i});
				}

				if(offset > i++)
				{
					return cursor.continue();
				}

				const source    = cursor.source;
				const storeName = source.objectStore
					? source.objectStore.name
					: index.name;

				this[Bank][storeName] = this[Bank][storeName] || new WeakMap;

				const bank  = this[Bank][storeName];
				const pk    = cursor.primaryKey;
				const value = type
					? type.from(cursor.value)
					: cursor.value;

				if(bank[pk])
				{
					Object.assign(bank[pk], value);
				}
				else
				{
					value[PrimaryKey] = Symbol.for(pk);
					value[Store]      = storeName;
					bank[pk]          = Bindable.makeBindable(value);
				}

				Database.dispatchEvent(new CustomEvent('read', {detail: {
					database:  this[Name]
					, record:  value
					, store:   storeName
					, type:    'read'
					, subType: 'select'
				}}));

				const result = callback
					? callback(bank[pk], i)
					: bank[pk];

				if(limit && i - offset >= limit)
				{
					offset += limit;

					return accept({record: bank[pk], result, index: i});
				}

				cursor.continue();
			});
		});
	}

	static getPrimaryKey(record)
	{
		return record[PrimaryKey]
			? record[PrimaryKey].description
			: null;
	}

	static destroyDatabase()
	{
		return new Promise((accept, reject) => {
			const request = indexedDB.delete(dbName);

			request.onerror = error => {
				Database.dispatchEvent(new CustomEvent('destroyError', {detail: {
					database:  dbName
					, error:   error
					, type:    'destroy'
				}}));

				reject(error);
			};

			request.onsuccess = event => {
				delete this[Instances][dbName];

				accept(dbName);
			};
		});
	}
}

Object.defineProperty(Database, Instances, {value: []});
Object.defineProperty(Database, Target,    {value: new EventTarget});

for(const method in Database[Target])
{
	Object.defineProperty(Database, method, {
		value: (...args) => Database[Target][method](...args)
	});
}
