import { Bindable } from '../base/Bindable';
import { Mixin    } from '../base/Mixin';

import { EventTargetMixin } from '../mixin/EventTargetMixin';

const BeforeWrite  = Symbol('BeforeWrite');
const AfterWrite   = Symbol('AfterWrite');
const BeforeInsert = Symbol('BeforeInsert');
const AfterInsert  = Symbol('AfterInsert');
const BeforeUpdate = Symbol('BeforeUpdate');
const AfterUpdate  = Symbol('AfterUpdate');
const BeforeRead   = Symbol('BeforeRead');
const AfterRead    = Symbol('AfterRead');

const PrimaryKey = Symbol('PrimaryKey');
const Connection = Symbol('Connection');
const Instances  = Symbol('Instances');
const HighWater  = Symbol('HighWater');
const Metadata   = Symbol('Metadata');
const Timers     = Symbol('Timers');
const Target     = Symbol('Target');
const Store      = Symbol('Store');
const Fetch      = Symbol('Each');
const Name       = Symbol('Name');
const Bank       = Symbol('Bank');

export class Database extends Mixin.with(EventTargetMixin)
{
	constructor(connection)
	{
		super();

		Object.defineProperty(this, Connection, {value: connection});
		Object.defineProperty(this, Name,       {value: connection.name});
		Object.defineProperty(this, Timers,     {value: {}});
		Object.defineProperty(this, Metadata,   {value: {}});
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
					, store:   undefined
					, type:    'read'
					, subType: 'select'
				}}));

				reject(error);
			};

			request.onsuccess = event => {
				const instance = new this(event.target.result);

				this[Instances][dbName] = instance;

				accept(instance);
			};

			request.onupgradeneeded = event => {
				const connection = event.target.result;

				connection.addEventListener('error', error => console.error(error));

				const instance = new this(connection);

				for(let v = event.oldVersion + 1; v <= version; v += 1)
				{
					instance['_version_' + v](connection);
				}

				this[Instances][dbName] = instance
			};
		});
	}

	select({store, index, range = null, direction = 'next', limit = 0, offset = 0, type = false, origin = undefined})
	{
		const t = this[Connection].transaction(store, "readonly");
		const s = t.objectStore(store);
		const i = index ? s.index(index) : s;

		return {
			each:   this[Fetch](type, i, direction, range, limit, offset, origin)
			, one:  this[Fetch](type, i, direction, range, 1, offset, origin)
			, then: c=>(this[Fetch](type, i, direction, range, limit, offset, origin))(e=>e).then(c)
		};
	}

	insert(storeName, record, origin = undefined)
	{
		return new Promise((accept, reject) => {
			this[Bank][storeName] = this[Bank][storeName] || {};

			const trans = this[Connection].transaction([storeName], 'readwrite');
			const store = trans.objectStore(storeName);
			const bank  = this[Bank][storeName];

			record = Bindable.make(record);

			const detail = {
				database:  this[Name]
				, record:  record
				, store:   storeName
				, type:    'write'
				, subType: 'insert'
				, origin:  origin
			};

			const beforeWriteResult = record[Database.BeforeWrite]
				? record[Database.BeforeWrite](detail)
				: null;

			const beforeInsertResult = record[Database.BeforeInsert]
				? record[Database.BeforeInsert](detail)
				: null;

			const request = store.add(Object.assign({}, record));

			if(beforeWriteResult === false || beforeInsertResult === false)
			{
				return;
			}

			request.onerror = error => {
				this.dispatchEvent(new CustomEvent('writeError', {detail}));

				reject(error);
			};

			request.onsuccess = event => {
				const pk = event.target.result;
				bank[pk] = record;

				const cancelable = true;

				detail.key = Database.getPrimaryKey(record);

				const eventResult = this.dispatchEvent(new CustomEvent('write', {
					cancelable, detail
				}));

				if(eventResult)
				{
					record[PrimaryKey] = Symbol.for(pk);

					if(!this[Metadata][storeName])
					{
						this[Metadata][storeName] = this.getStoreMeta(storeName, 'store', {});
					}

					if(this[Metadata][storeName])
					{
						const metadata    = this[Metadata][storeName];
						const currentMark = this.checkHighWaterMark(storeName, record);
						const recordMark  = record[metadata.highWater];

						if(currentMark < recordMark)
						{
							this.setHighWaterMark(storeName, record, origin, 'insert');
						}
					}

					trans.commit();

					record[Database.AfterInsert] && record[Database.AfterInsert](detail);
					record[Database.AfterWrite]  && record[Database.AfterWrite](detail);
				}
				else
				{
					trans.abort();
				}

				accept(record);
			};
		});
	}

	update(storeName, record, origin = undefined)
	{
		if(!record[PrimaryKey])
		{
			throw Error('Value provided is not a DB record!');
		}

		return new Promise((accept, reject) => {
			const trans     = this[Connection].transaction([storeName], 'readwrite');
			const store     = trans.objectStore(storeName);

			const detail = {
				database:  this[Name]
				, key:     Database.getPrimaryKey(record)
				, record:  record
				, store:   storeName
				, type:    'write'
				, subType: 'update'
				, origin:  origin
			};

			record[Database.AfterInsert] && record[Database.AfterInsert](detail);
			record[Database.AfterWrite]  && record[Database.AfterWrite](detail);

			const beforeWriteResult = record[Database.BeforeWrite]
				? record[Database.BeforeWrite](detail)
				: null;

			const beforeUpdateResult = record[Database.BeforeUpdate]
				? record[Database.BeforeUpdate](detail)
				: null;

			if(beforeWriteResult === false || beforeUpdateResult === false)
			{
				return;
			}

			console.log(record);

			const request = store.put(Object.assign({}, record));

			request.onerror = error => {
				this.dispatchEvent(new CustomEvent('writeError', {detail}));

				reject(error);
			};

			request.onsuccess = event => {

				const cancelable = true;

				const eventResult = this.dispatchEvent(new CustomEvent('write', {
					cancelable, detail
				}));

				if(eventResult)
				{
					if(!this[Metadata][storeName])
					{
						this[Metadata][storeName] = this.getStoreMeta(storeName, 'store', {});
					}

					if(this[Metadata][storeName])
					{
						const metadata    = this[Metadata][storeName];
						const currentMark = this.checkHighWaterMark(storeName, record);
						const recordMark  = record[metadata.highWater];

						if(currentMark < recordMark)
						{
							this.setHighWaterMark(storeName, record, origin, 'update');
						}
					}

					trans.commit();
				}
				else
				{
					trans.abort();
				}

				accept(event);
			};
		});
	}

	delete(storeName, record, origin = undefined)
	{
		if(!record[PrimaryKey])
		{
			throw Error('Value provided is not a DB record!');
		}

		return new Promise((accept, reject) => {
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
					, origin:   origin
				}});

				this.dispatchEvent(deleteEvent);

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
					, origin:   origin
				}});

				this.dispatchEvent(writeEvent);

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

	[Fetch](type, index, direction, range, limit, offset, origin)
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

				this[Bank][storeName] = this[Bank][storeName] || {};

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
					bank[pk] = Bindable.makeBindable(value);
				}

				this.dispatchEvent(new CustomEvent('read', {detail: {
					database:  this[Name]
					, record:  value
					, store:   storeName
					, type:    'read'
					, subType: 'select'
					, origin:   origin
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

	setStoreMeta(storeName, key, value)
	{
		localStorage.setItem(`::::cvdb::${storeName}::${key}`, JSON.stringify(value));
	}

	getStoreMeta(storeName, key, notFound)
	{
		const source = localStorage.getItem(`::::cvdb::${storeName}::${key}`);

		return source ? JSON.parse(source) : notFound;
	}

	createObjectStore(storeName, options)
	{
		const eventLog = this[Connection].createObjectStore(storeName, options);

		this.setStoreMeta(storeName, 'store', options);

		return eventLog;
	}

	deleteObjectStore(storeName)
	{
		return this[Connection].deleteObjectStore(storeName);
	}

	checkHighWaterMark(storeName, record, origin = undefined)
	{
		// if(!this[Metadata][storeName])
		// {
		// 	this[Metadata][storeName] = this.getStoreMeta(storeName, 'store', {});
		// }

		// if(!this[Metadata][storeName])
		// {
		// 	return;
		// }

		const currentMark = this.getStoreMeta(storeName, 'highWater', 0);

		return currentMark;

		// const metadata    = this[Metadata][storeName];
		// const currentMark = this.getStoreMeta(storeName, 'highWater', 0);
		// const recordMark  = record[metadata.highWater];

		// if(currentMark < recordMark)
		// {
		// 	this.setHighWaterMark(storeName, record, origin);
		// }
	}

	setHighWaterMark(storeName, record, origin = undefined, subType = undefined)
	{
		const metadata    = this[Metadata][storeName];
		const recordMark  = record[metadata.highWater];
		const currentMark = this.getStoreMeta(storeName, 'highWater', 0);

		this.setStoreMeta(storeName, 'highWater', recordMark);

		this.dispatchEvent(new CustomEvent('highWaterMoved', {detail: {
			database:   this[Name]
			, record:   record
			, store:    storeName
			, type:     'highWaterMoved'
			, subType:  subType
			, origin:   origin
			, oldValue: currentMark
			, value:    recordMark
		}}));
	}
}

Object.defineProperty(Database, Instances, {value: []});
Object.defineProperty(Database, Target,    {value: new EventTarget});

Object.defineProperty(Database, 'BeforeWrite', {value: BeforeWrite});
Object.defineProperty(Database, 'AfterWrite',  {value: AfterWrite});

Object.defineProperty(Database, 'BeforeInsert', {value: BeforeInsert});
Object.defineProperty(Database, 'AfterInsert',  {value: AfterInsert});

Object.defineProperty(Database, 'BeforeUpdate', {value: BeforeUpdate});
Object.defineProperty(Database, 'AfterUpdate',  {value: AfterUpdate});

Object.defineProperty(Database, 'BeforeRead', {value: BeforeRead});
Object.defineProperty(Database, 'AfterRead',  {value: AfterRead});

for(const method in Database[Target])
{
	Object.defineProperty(Database, method, {
		value: (...args) => Database[Target][method](...args)
	});
}
