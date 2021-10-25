export class Store
{
	storeName = 'test-store';

	static setHighWaterMark(record, origin = undefined, subType = undefined){}
	static setLowWaterMark(record, origin = undefined, subType = undefined){}

	static checkHighWaterMark(record, origin = undefined){}
	static checkLowWaterMark(record, origin = undefined){}

	static create(storeName, options){}
	static delete(storeName){}

	select({index, range = null, ranges = [], direction = 'next', limit = 0, offset = 0, type = false, origin = undefined, map = undefined}){}
	insert(record, origin = {}){}
	update(record, origin = {}){}
	delete(record, origin = undefined){}

	getMeta(key, notFound = null){}
	setMeta(key, value){}

	listIndexes(){}
	clear(){}
}
