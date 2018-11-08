import { Bindable } from './Bindable';
import { Cache    } from './Cache';
import { Model    } from './Model';
import { Form     } from '../form/Form';

var objects = {};

export class Repository
{
	constructor(uri)
	{
		this.uri = uri;
	}

	get(id)
	{
		let resourceUri = this.uri + '/' + id;

		let cached = Cache.load(
			resourceUri
			, false
			, 'model-uri-repo'
		);

		if(cached)
		{
			return Promise.resolve(cached);
		}

		return Repository.request(resourceUri).then((response) => {
			return this.extractModel(response.body);
		});
	}

	page(page = 0, args)
	{
		return Repository.request(this.uri, args).then((response) => {
			let records = [];

			for(let record of response.body)
			{
				records.push(this.extractModel(record));
			}

			return records;
		});
	}

	edit(publicId = null)
	{
		let resourceUri = this.uri + '/create';
		
		if(publicId)
		{
			resourceUri = this.uri + '/' + publicId + '/edit';
		}

		// console.log(resourceUri);

		return Repository.request(resourceUri).then((response) => {
			console.log(response);
			let form  = new Form(response.meta.form);
			// let model = this.extractModel(response.body);

			return form;
		});
	}

	extractModel(rawData)
	{
		let model = Bindable.makeBindable(new Model(this));

		model.consume(rawData);

		let resourceUri = this.uri + '/' + model.id;

		Cache.store(
			resourceUri
			, model
			, 60*60
			, 'model-uri-repo'
		);

		if(model.class)
		{
			let cacheKey = `${model.class}::${model.publidId}`;

			let cached = Cache.load(cacheKey, false, 'model-type-repo');

			if(cached)
			{
				cached.consume(rawData);
				return cached;
			}

			Cache.store(
				cacheKey
				, model
				, 0
				, 'model-type-repo'
			);
		}

		return model;
	}

	static get xhrs(){
		return this.xhrList = this.xhrList || [];
	}

	static loadPage(args = {}, refresh = false) {
		return this.request(this.uri, args).then((response) => {
			return response;
			// return response.map((skeleton) => new Model(skeleton));
		});
	}
	static domCache(uri, content)
	{
		// console.log(uri, content);
	}
	static load(id, refresh = false) {
		this.objects           = this.objects           || {};
		this.objects[this.uri] = this.objects[this.uri] || {};

		if(this.objects[this.uri][id]) {
			return Promise.resolve(this.objects[this.uri][id]);
		}

		return this.request(this.uri + '/' + id).then((response) => {
			// let model = new Model(response);
			// return this.objects[this.uri][id] = model;
		});
	}
	static form(id = null) {
		let uri = this.uri + '/' + 'create';
		if(id) {
			uri = this.uri + '/' + id + '/edit';
		}
		return this.request(uri).then((skeleton) => {
			return skeleton;
		});
	}
	static clearCache() {
		if(this.objects && this.objects[this.uri]) {
			this.objects[this.uri] = {};
		}
	}
	static request(uri, args = null, post = null, cache = true, options = {}) {
		let type = 'GET';
		let queryString = '';
		let formData = null;
		let queryArgs   = {};

		if(args) {
			queryArgs   = args;
		}

		queryArgs.api   = queryArgs.api || 'json';

		queryString = Object.keys(queryArgs).map((arg) => {
			return encodeURIComponent(arg)
			+ '='
			+ encodeURIComponent(queryArgs[arg])
		}).join('&');

		let fullUri    = uri;
		let postString = '';

		if(post) {
			cache = false;
			type = 'POST';
			if(post instanceof FormData)
			{
				formData = post;
			}
			else
			{
				formData = new FormData();
				for(let i in post) {
					formData.append(i, post[i]);
				}
			}
			postString = Object.keys(post).map((arg) => {
				return encodeURIComponent(arg)
				+ '='
				+ encodeURIComponent(post[arg])
			}).join('&');
		}

		fullUri = uri + '?' + queryString;

		let xhr = new XMLHttpRequest();

		if('responseType' in options)
		{
			xhr.responseType = options.responseType;
		}

		if(!post && cache && this.cache && this.cache[fullUri]) {
			return Promise.resolve(this.cache[fullUri]);
		}

		let tagCacheSelector = 'script[data-uri="'
			+ fullUri
			+ '"]';

		let tagCache = document.querySelector(tagCacheSelector);

		if(!post && cache && tagCache) {
			let tagCacheContent = JSON.parse(tagCache.innerText);
			
			return Promise.resolve(tagCacheContent);
		}

		xhr.withCredentials = true;
		xhr.timeout         = 15000;

		let xhrId = this.xhrs.length;

		if(!post) {
			this.xhrs.push(xhr);
		}

		return new Promise(((xhrId) => (resolve, reject) => {
			xhr.onreadystatechange = () => {
				let DONE = 4;
				let OK = 200;

				let response;

				if (xhr.readyState === DONE) {

					if(!this.cache) {
						this.cache = {};
					}

					if (xhr.status === OK) {

						if(xhr.getResponseHeader("Content-Type") == 'application/json'
							|| xhr.getResponseHeader("Content-Type") == 'application/json; charset=utf-8'
							|| xhr.getResponseHeader("Content-Type") == 'text/json'
							|| xhr.getResponseHeader("Content-Type") == 'text/json; charset=utf-8'
						) {
							response = JSON.parse(xhr.responseText)
							if(response.code == 0) {
								// Repository.lastResponse = response;

								if(!post && cache) {
									// this.cache[fullUri] = response;
								}

								let tagCache = document.querySelector(
									'script[data-uri="'
									+ fullUri
									+ '"]'
								);

								let prerendering  = window.prerenderer;
								
								if(prerendering)
								{
									if(!tagCache)
									{
										tagCache  = document.createElement('script');
										tagCache.type = 'text/json';
										tagCache.setAttribute('data-uri', fullUri);
										document.head.appendChild(tagCache);
									}

									// console.log(JSON.stringify(response));
									
									tagCache.innerText = JSON.stringify(response);
								}

								resolve(response);
							}
							else {
								if(!post && cache) {
									// this.cache[fullUri] = response;
								}

								reject(response);
							}
						}
						else {
							// Repository.lastResponse = xhr.responseText;

							if(!post && cache) {
								// this.cache[fullUri] = xhr.responseText;
							}

							resolve(xhr);
						}
					}
					else {
						reject('HTTP' + xhr.status);
					}
					this.xhrs[xhrId] = null;
				}
			};

			xhr.open(type, fullUri, true);

			// if(post)
			// {
			// 	xhr.setRequestHeader("Content-type", "multipart/form-data");
			// }
			xhr.send(formData);
		})(xhrId));
	}
	static cancel() {
		for(var i in this.xhrs) {
			if(!this.xhrs[i]) {
				continue;
			}
			this.xhrs[i].abort();
		}
		this.xhrList = [];
	}
}

// Repository.lastResponse = null;