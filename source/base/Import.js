export class Import
{
	constructor(uri)
	{
		console.log(this.__proto__.constructor);

		if(this.__proto__.constructor.instances[uri])
		{
			return this.__proto__.constructor.instances[uri];
		}

		this.uri = uri;

		const tag = document.createElement('script');

		tag.setAttribute('src', this.uri);

		this.ready = new Promise((accept, reject) => {

			tag.addEventListener('load',  event  => accept(tag));
			tag.addEventListener('error', error => {

				console.error(error);

				reject(error);

			});

		});

		this.tag = tag;
		this.attached = false;

		this.__proto__.constructor.instances[uri] = this;
	}

	attach(parent = null)
	{
		if(this.attached)
		{
			return;
		}

		parent = parent || document.head;

		parent.append(this.tag);

		this.attached = true;
	}
}

Import.instances = {};
