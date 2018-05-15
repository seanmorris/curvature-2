var objects = {};

export class Repository
{
	static get uri()  { return '//api.laptop.thewhtrbt.com/location'; }
	static get xhrs() { return this.xhrList = this.xhrList || [];   }

	static loadPage(args = {}, refresh = false) {
		return this.request(this.uri, args).then((response) => {
			return response;
			// return response.map((skeleton) => new Model(skeleton));
		});
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
	static request(uri, args = null, post = null, cache = true) {
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

		cache = false;

		if(post) {
			cache = false;
			type = 'POST';
			formData = new FormData();
			for(let i in post) {
				formData.append(i, post[i]);
			}
			postString = Object.keys(post).map((arg) => {
				return encodeURIComponent(arg)
				+ '='
				+ encodeURIComponent(post[arg])
			}).join('&');
		}

		fullUri = uri + '?' + queryString;

		let xhr = new XMLHttpRequest();

		if(!post && cache && this.cache && this.cache[fullUri]) {
			return Promise.resolve(this.cache[fullUri]);
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

						if(response = JSON.parse(xhr.responseText)) {
							if(response.code == 0) {
								// Repository.lastResponse = response;

								if(!post && cache) {
									this.cache[fullUri] = response;
								}

								// console.log(response.body);

								resolve(response);
							}
							else {
								if(!post && cache) {
									this.cache[fullUri] = response;
								}

								reject(response);
							}
						}
						else {
							// Repository.lastResponse = xhr.responseText;

							if(!post && cache) {
								this.cache[fullUri] = xhr.responseText;
							}

							resolve(xhr.responseText);
						}
					}
					else {
						reject('HTTP' + xhr.status);
					}
					this.xhrs[xhrId] = null;
				}
			};

			xhr.open(type, fullUri);

			if(post)
			{
				xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			}
			xhr.send(postString);
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