import { Bindable } from '../base/Bindable';
import { Mixin    } from '../base/Mixin';

import { EventTargetMixin } from '../mixin/EventTargetMixin';

const BeforeWrite  = Symbol('BeforeWrite');
const AfterWrite   = Symbol('AfterWrite');
const BeforeDelete = Symbol('BeforeDelete');
const AfterDelete  = Symbol('AfterDelete');
const BeforeInsert = Symbol('BeforeInsert');
const AfterInsert  = Symbol('AfterInsert');
const BeforeUpdate = Symbol('BeforeUpdate');
const AfterUpdate  = Symbol('AfterUpdate');
const BeforeRead   = Symbol('BeforeRead');
const AfterRead    = Symbol('AfterRead');

const PrimaryKey   = Symbol('PrimaryKey');
const Connection   = Symbol('Connection');
const Instances    = Symbol('Instances');
const HighWater    = Symbol('HighWater');
const Metadata     = Symbol('Metadata');
const Timers       = Symbol('Timers');
const Target       = Symbol('Target');
const Store        = Symbol('Store');
const Fetch        = Symbol('Each');
const Name         = Symbol('Name');
const Bank         = Symbol('Bank');

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
			return this[Instances][dbName];
		}

		return this[Instances][dbName] = new Promise((accept, reject) => {
			const request = indexedDB.open(dbName, version);

			request.onerror = error => {
				Database.dispatchEvent(new CustomEvent('error', {detail: {
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

				accept(instance);
			};

			request.onupgradeneeded = event => {
				const connection = event.target.result;

				connection.addEventListener('error', error => console.error(error));

				const instance = new this(connection);

				for(let v = event.oldVersion + 1; v <= version; v += 1)
				{
					instance['_version_' + v](connection, instance, event);
				}
			};
		});
	}

	select({store, index, range = undefined, ranges = [], direction = 'next', limit = 0, offset = 0, type = false, origin = undefined, map = undefined})
	{
		const transaction = this[Connection].transaction(store, "readonly");
		const storeObject = transaction.objectStore(store);
		const indexObject = index ? storeObject.index(index) : storeObject;

		if(range !== undefined && (!ranges || !ranges.length))
		{
			ranges = [range];
		}

		const params = [type, indexObject, direction, ranges, limit, offset, origin, map];

		let existing = null;

		return {
			finally: c => ( existing || (existing = this[Fetch](...params)(e=>e)) ).finally(c)
			, catch: c => ( existing || (existing = this[Fetch](...params)(e=>e)) ).catch(c)
			,  then: c => ( existing || (existing = this[Fetch](...params)(e=>e)) ).then(c)
			,  each: c => ( existing || (existing = this[Fetch](...params)(c)) )
			,   one: c => ( existing || (existing = this[Fetch](...Object.assign(params, [,,,,1]) )(c)) )
		};
	}

	insert(storeName, records, origin = {})
	{
		const inserts = this.inserts({[storeName]: records}, origin);
		return inserts[0];
	}

	inserts(storesToRecords, origin = {})
	{
		const storeNames = Object.keys(storesToRecords);

		const transaction = this[Connection].transaction(storeNames, 'readwrite');

		const inserts = [];

		for(let [storeName, records] of Object.entries(storesToRecords))
		{
			const store = transaction.objectStore(storeName);
			const bank  = this[Bank][storeName] = this[Bank][storeName] || {};

			let list = true;

			if(!Array.isArray(records))
			{
				records = [records];
				list = false;
			}

			const results = records.map(record => new Promise((accept, reject) => {

				record = Bindable.make(record);

				const detail = {
					database:  this
					, record:  record
					, store:   storeName
					, type:    'write'
					, subType: 'insert'
					, origin:  origin
				};

				detail.key = Database.getPrimaryKey(record);

				const cancelable  = true;
				const writeEvent  = new CustomEvent('write', {cancelable, detail});
				const eventResult = this.dispatchEvent(writeEvent);

				if(!eventResult)
				{
					transaction.abort && transaction.abort();
					return;
				}

				const beforeWriteResult = record[Database.BeforeWrite]
					? record[Database.BeforeWrite](detail)
					: null;

				const beforeInsertResult = record[Database.BeforeInsert]
					? record[Database.BeforeInsert](detail)
					: null;

				const request = store.add(Object.assign({}, Bindable.shuck(record)));

				if(beforeWriteResult === false || beforeInsertResult === false)
				{
					transaction.abort && transaction.abort();
					return;
				}

				request.onerror = error => {
					this.dispatchEvent(new CustomEvent('writeError', {detail}));
					transaction.abort && transaction.abort();
					reject(error);
				};

				request.onsuccess = event => {
					const pk = event.target.result;

					transaction.addEventListener('complete', event => {
						if(store.autoIncrement)
						{
							record.id = pk;
						}

						record[Database.AfterInsert] && record[Database.AfterInsert](detail);
						record[Database.AfterWrite]  && record[Database.AfterWrite](detail);

						bank[pk] = record;
						record[PrimaryKey] = Symbol.for(pk);

						accept(record);

						if(!this[Metadata][storeName])
						{
							this[Metadata][storeName] = this.getStoreMeta(storeName, 'store', {});
						}

						if(this[Metadata][storeName])
						{
							const currentHighMark = this.checkHighWaterMark(storeName, record);
							const currentLowMark  = this.checkLowWaterMark(storeName, record);
							const metadata        = this[Metadata][storeName];
							const recordMark      = record[metadata.highWater];

							if(origin.setHighWater && currentHighMark < recordMark)
							{
								this.setHighWaterMark(storeName, record, origin, 'insert');
							}

							if(origin.setLowWater && currentLowMark > recordMark)
							{
								this.setLowWaterMark(storeName, record, origin, 'insert');
							}
						}
					});
				};
			}));

			let finalResult;

			if(list)
			{
				finalResult = Promise.all(results);
			}
			else
			{
				finalResult = results[0];
			}

			inserts.push(finalResult);
		}

		// Promise.all(inserts).then(() => transaction.commit && transaction.commit());

		return inserts;
	}

	update(storeName, record, origin = {})
	{
		const updates = this.updates({[storeName]: [record]}, origin);
		return updates[0];
	}

	updates(storesToRecords, origin = {})
	{
		const storeNames = Object.keys(storesToRecords);

		const transaction = this[Connection].transaction(storeNames, 'readwrite');

		const updates = [];

		for(const [storeName, records] of Object.entries(storesToRecords))
		{
			const store = transaction.objectStore(storeName);

			for(const record of records)
			{
				if(!record[PrimaryKey])
				{
					throw Error('Value provided is not a DB record!');
				}

				updates.push(new Promise((accept, reject) => {

					const detail = {
						database:  this
						, key:     Database.getPrimaryKey(record)
						, record:  record
						, store:   storeName
						, type:    'write'
						, subType: 'update'
						, origin:  origin
					};

					const cancelable  = true;
					const writeEvent  = new CustomEvent('write', {cancelable, detail});
					const eventResult = this.dispatchEvent(writeEvent);

					if(!eventResult)
					{
						transaction.abort && transaction.abort();
						return;
					}

					const beforeWriteResult = record[Database.BeforeWrite]
						? record[Database.BeforeWrite](detail)
						: null;

					const beforeUpdateResult = record[Database.BeforeUpdate]
						? record[Database.BeforeUpdate](detail)
						: null;

					if(beforeWriteResult === false || beforeUpdateResult === false)
					{
						transaction.abort && transaction.abort();
						return;
					}

					const requestA = store.delete(record.id);

					requestA.onerror = error => {
						this.dispatchEvent(new CustomEvent('writeError', {detail}));
						reject(error);
					};

					requestA.onsuccess = event => {
						const requestB = store.put(Object.assign({}, Bindable.shuck(record)));
						requestB.onerror = error => {
							this.dispatchEvent(new CustomEvent('writeError', {detail}));
							reject(error);
						};

						requestB.onsuccess = event => {

							accept(writeEvent);

							transaction.oncomplete = event => {
								record[Database.AfterInsert] && record[Database.AfterInsert](detail);
								record[Database.AfterWrite]  && record[Database.AfterWrite](detail);

								if(!this[Metadata][storeName])
								{
									this[Metadata][storeName] = this.getStoreMeta(storeName, 'store', {});
								}

								if(this[Metadata][storeName])
								{
									const currentHighMark = this.checkHighWaterMark(storeName, record);
									const currentLowMark  = this.checkLowWaterMark(storeName, record);
									const metadata        = this[Metadata][storeName];
									const recordMark      = record[metadata.highWater];

									if(origin.setHighWater && currentHighMark < recordMark)
									{
										this.setHighWaterMark(storeName, record, origin, 'insert');
									}

									if(origin.setLowWater && currentLowMark > recordMark)
									{

										this.setLowWaterMark(storeName, record, origin, 'insert');
									}
								}
							}
						};
					};
				}));
			}
		}

		Promise.all(updates).then(() => transaction.commit && transaction.commit());

		return updates;
	}

	delete(storeName, record, origin = {})
	{
		const deletes = this.deletes({[storeName]: [record]}, origin);
		return deletes[0];
	}

	deletes(storesToRecords, origin = {})
	{
		const storeNames = Object.keys(storesToRecords);

		const transaction = this[Connection].transaction(storeNames, 'readwrite');

		const deletes = [];

		for(const [storeName, records] of Object.entries(storesToRecords))
		{
			const store = transaction.objectStore(storeName);

			for(const record of records)
			{
				if(!record[PrimaryKey])
				{
					throw Error('Value provided is not a DB record!');
				}

				deletes.push(new Promise((accept, reject) => {
					const detail = {
						database:  this
						, record:  record
						, key:     Database.getPrimaryKey(record)
						, store:   storeName
						, type:    'write'
						, subType: 'delete'
						, origin:  origin
					};

					const cancelable  = true;
					const writeEvent  = new CustomEvent('write', {cancelable, detail});
					const eventResult = this.dispatchEvent(writeEvent);

					if(!eventResult)
					{
						transaction.abort && transaction.abort();
						return;
					}

					const beforeDeleteResult = record[Database.BeforeDelete]
						? record[Database.BeforeDelete](detail)
						: null;

					if(beforeDeleteResult === false)
					{
						transaction.abort && transaction.abort();
						return;
					}

					const request = store.delete(record.id);

					request.onerror = error => {
						detail.original = error;
						const deleteEvent = new CustomEvent('writeError', {detail});
						this.dispatchEvent(deleteEvent);
						reject(error);
					};

					request.onsuccess = event => {
						accept(writeEvent);
						transaction.oncomplete = event => {
							record[PrimaryKey] = undefined;
							record[Database.AfterDelete] && record[Database.AfterDelete](detail);
							detail.original = event;
						};
					};

				}));
			}
		}

		Promise.all(deletes).then(() => transaction.commit && transaction.commit());

		return deletes;
	}

	clear(storeName)
	{
		return new Promise((accept, reject) => {
			const trans   = this[Connection].transaction([storeName], 'readwrite');
			const store   = trans.objectStore(storeName);
			const request = store.clear();
			const detail  = {
				database:   this[Name]
				, store:    storeName
				, type:     'write'
				, subType:  'clear'
				, origin:   origin
			};

			request.onerror = error => {

				detail.original = error;

				const deleteEvent = new CustomEvent('writeError', {detail});

				this.dispatchEvent(deleteEvent);

				reject(error);
			};

			request.onsuccess = event => {

				detail.original = event;

				const writeEvent = new CustomEvent('write', {detail});

				this.dispatchEvent(writeEvent);

				trans.commit && trans.commit();

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
		const trans = this[Connection].transaction([storeName]);
		const store = trans.objectStore(storeName);

		return [...store.indexNames];
	}

	[Fetch](type, index, direction, ranges, limit, offset, origin, map)
	{
		const processRange = (range, callback) => new Promise((accept, reject) => {

			if(range instanceof IDBKeyRange)
			{
				// NOOP
			}
			else if(!Array.isArray(range))
			{
				if(typeof range !== 'undefined' && range !== null)
				{
					range = IDBKeyRange.only(range);
				}
			}
			else if(range.length === 0)
			{
				range = undefined;
			}
			else if(range.length === 1)
			{
				range = IDBKeyRange.only(range[0]);
			}
			else
			{
				if(range[0] === undefined && range[1] === undefined)
				{
					range = undefined;
				}
				else if(range[0] === undefined)
				{
					range = IDBKeyRange.upperBound(range[1], range[2] ?? true);
				}
				else if(range[1] === undefined)
				{
					range = IDBKeyRange.lowerBound(range[0], range[2] ?? false);
				}
				else
				{
					range = IDBKeyRange.bound(range[0], range[1], range[2] ?? false, range[3] ?? true);
				}
			}

			const request = index.openCursor(range, direction);

			let i = 0;

			const resultHandler = event => {
				const cursor = event.target.result;

				if(!cursor)
				{
					return accept({record: null, result: null, index: i});
				}

				const source    = cursor.source;
				const storeName = source.objectStore
					? source.objectStore.name
					: index.name;

				this[Bank][storeName] = this[Bank][storeName] || {};

				const bank   = this[Bank][storeName];
				const pk     =  cursor.primaryKey;
				const value  = type
					? type.from(cursor.value)
					: cursor.value;

				const bindableValue = Bindable.makeBindable(value);

				const detail = {
					database:  this[Name]
					, key:     Database.getPrimaryKey(bindableValue)
					, record:  value
					, store:   index.name
					, type:    'read'
					, subType: 'select'
					, origin:  origin
				};

				const beforeReadResult = value[Database.BeforeRead]
					? value[Database.BeforeRead](detail)
					: null;

				if(offset > i++ || beforeReadResult === false)
				{
					return cursor.continue();
				}

				if(bank[pk])
				{
					Object.assign(bank[pk], value);
				}
				else
				{
					value[PrimaryKey] = Symbol.for(pk);
					bank[pk] = value;
				}

				detail.record = value;

				bank[pk][Database.AfterRead] && bank[pk][Database.AfterRead](detail);

				const cancelable = true;

				const eventResult = this.dispatchEvent(new CustomEvent('read', {detail, cancelable}));

				if(eventResult)
				{
					const record = type ? type.from(bank[pk]) : bank[pk];

					record[PrimaryKey] = Symbol.for(pk);

					const mapped = map ? map( record ) : record;

					const result = callback
						? callback(mapped, i)
						: mapped;

					if(limit && i - offset >= limit)
					{
						offset += limit;

						return accept({mapped, result, index: i});
					}
				}

				cursor.continue();
			};

			request.addEventListener('success', resultHandler);
		});

		const results = [];

		ranges = (ranges && ranges.length) ? ranges.slice() : [ [] ];

		const processResult = (result, callback) => {

			results.push(result);

			if(ranges.length)
			{
				return processRange(ranges.shift(), callback).then(result => processResult(result, callback));
			}

			if(results.length === 1)
			{
				return results[0];
			}

			return results;
		};

		return callback => processRange(ranges.shift(), callback).then(result => processResult(result, callback));
	}

	static getPrimaryKey(record)
	{
		return record[PrimaryKey]
			? record[PrimaryKey]
			: null;
	}

	static destroyDatabase()
	{
		return new Promise((accept, reject) => {
			const request = indexedDB.delete(dbName);

			request.onerror = error => {
				Database.dispatchEvent(new CustomEvent('error', {detail: {
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

	getObjectStores(storeName)
	{
		return [...this[Connection].objectStoreNames];
	}

	getStoreIndexes(storeName)
	{
		const transaction = this[Connection].transaction([storeName], 'readonly');
		const storeObject = transaction.objectStore(storeName);
		const indexes = [...storeObject.indexNames];

		transaction.abort();

		return indexes;
	}

	setStoreMeta(storeName, key, value)
	{
		localStorage.setItem(`::::cvdb::${storeName}::${key}`, JSON.stringify(value));
	}

	getStoreMeta(storeName, key, notFound = null)
	{
		const source = localStorage.getItem(`::::cvdb::${storeName}::${key}`);

		const value = source !== null ? JSON.parse(source) : notFound;

		if(value === null)
		{
			return notFound;
		}

		return value;
	}

	createObjectStore(storeName, options)
	{
		const store = this[Connection].createObjectStore(storeName, options);

		this.setStoreMeta(storeName, 'store', options);

		return store;
	}

	deleteObjectStore(storeName)
	{
		return this[Connection].deleteObjectStore(storeName);
	}

	checkHighWaterMark(storeName, record, origin = undefined)
	{
		const currentMark = this.getStoreMeta(storeName, 'highWater', 0);

		return currentMark;
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

	checkLowWaterMark(storeName, record, origin = undefined)
	{
		const currentMark = this.getStoreMeta(storeName, 'lowWater', Infinity);

		return currentMark;
	}

	setLowWaterMark(storeName, record, origin = undefined, subType = undefined)
	{
		const metadata    = this[Metadata][storeName];
		const recordMark  = record[metadata.highWater];
		const currentMark = this.getStoreMeta(storeName, 'lowWater', null);

		this.setStoreMeta(storeName, 'lowWater', recordMark);

		this.dispatchEvent(new CustomEvent('lowWaterMoved', {detail: {
			database:   this[Name]
			, record:   record
			, store:    storeName
			, type:     'lowWaterMoved'
			, subType:  subType
			, origin:   origin
			, oldValue: currentMark
			, value:    recordMark
		}}));
	}
}

Object.defineProperty(Database, Instances, {value: []});

Object.defineProperty(Database, 'BeforeDelete', {value: BeforeDelete});
Object.defineProperty(Database, 'AfterDelete',  {value: AfterDelete});

Object.defineProperty(Database, 'BeforeWrite', {value: BeforeWrite});
Object.defineProperty(Database, 'AfterWrite',  {value: AfterWrite});

Object.defineProperty(Database, 'BeforeInsert', {value: BeforeInsert});
Object.defineProperty(Database, 'AfterInsert',  {value: AfterInsert});

Object.defineProperty(Database, 'BeforeUpdate', {value: BeforeUpdate});
Object.defineProperty(Database, 'AfterUpdate',  {value: AfterUpdate});

Object.defineProperty(Database, 'BeforeRead', {value: BeforeRead});
Object.defineProperty(Database, 'AfterRead',  {value: AfterRead});

Object.defineProperty(Database, 'PKSymbol',   {value: PrimaryKey});
Object.defineProperty(Database, 'PrimaryKey', {value: PrimaryKey});

try
{
	Object.defineProperty(Database, Target, {value: new EventTarget});
}
catch(error)
{
	Object.defineProperty(Database, Target, {value: document.createDocumentFragment()});
}

for(const method of ['addEventListener', 'removeEventListener', 'dispatchEvent'])
{
	Object.defineProperty(Database, method, {
		value: (...args) => Database[Target][method](...args)
	});
}
