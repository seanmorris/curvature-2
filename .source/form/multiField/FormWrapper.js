import { Config     } from 'Config';

import { Repository } from '../../base/Repository';
import { Form       } from '../../form/Form';
import { Toast      } from '../../toast/Toast';
import { ToastAlert } from '../../toast/ToastAlert';
import { View       } from '../../base/View';
import { Router     } from '../../base/Router';

export class FormWrapper extends View
{
	constructor(args, path, method = 'GET', customFields = {})
	{
		super(args);

		this.path         = path;
		this.args.method  = method;
		this.args.action  = this.args.action || null;
		this.args.form    = null;
		this.args.title   = null;
		this.args.class   = '';
		this.template     = `
			<div class = "form constrict [[class]]">
				<div cv-if = "title"><label>[[title]]</label></div>
				[[form]]
			</div>
		`;

		this._onLoad     = [];
		this._onSubmit   = [];
		this._onRequest  = [];
		this._onResponse = [];

		if(path instanceof Form)
		{
			this.loadForm(form, customFields);
		}
		else
		{
			Repository.request(path).then(resp=>{
				if(!resp
					|| !resp.meta
					|| !resp.meta.form
					|| !(resp.meta.form instanceof Object)
				){
					console.log('Cannot render form with ', resp);
					// Router.go('/');
					return;
				}

				this.loadForm(new Form(resp.meta.form, customFields));

				this.onLoad(this.args.form, resp.body);
			});
		}

	}

	loadForm(form)
	{
		this.args.form = form;

		this.args.form.onSubmit((form, event)=>{
			if(this.onSubmit(form, event) === false)
			{
				return;
			}

			event.preventDefault();
			event.stopPropagation();

			let formElement = form.tags.formTag.element;
			let uri         = formElement.getAttribute('action') || this.args.action || this.path;
			let method      = formElement.getAttribute('method') || this.args.method;
			let query       = form.args.flatValue;

			method = method.toUpperCase();

			// console.log(method, uri);

			if(method == 'GET')
			{
				let _query = {};

				if(this.args.content && this.args.content.args)
				{
					this.args.content.args.page = 0;
				}

				_query.page = 0;

				for(let i in query)
				{
					if(i === 'api')
					{
						continue;
					}
					_query[i] = query[i];
				}

				let promises = this.onRequest(_query);

				promises.then(()=>{
					this.onResponse({});

					Router.go(uri + '?' + Router.queryToString(_query));

					this.update(_query);
				}).catch((error) => {
					this.onRequestError(error);
				});
			}
			else if(method == 'POST')
			{
				let formData = form.formData();

				for (var pair of formData.entries())
				{
					// console.log(pair[0]+ ', ' + pair[1]);
				}

				let promises = this.onRequest(formData);

				if(promises)
				{
					promises.then(()=>{
						Repository.request(
							uri
							, {api: 'json'}
							, formData
						).then((response) => {
							this.onResponse(response);
						}).catch((error) => {
							this.onRequestError(error);
						});
					});
				}
			}
		});
	}

	onRequest(requestData)
	{
		let promises = [];

		for(let i in this._onRequest)
		{
			let onReq = this._onRequest[i](requestData, this);

			if(onReq)
			{
				promises.push(onReq);
			}
		}

		if(promises.length == 0)
		{
			return Promise.resolve();
		}

		return Promise.all(promises);
	}

	onRequestError(error)
	{

	}

	onResponse(response)
	{
		for(let i in this._onResponse)
		{
			this._onResponse[i](response, this);
		}

		if(response.messages)
		{
			for(let i in response.messages)
			{
				Toast.instance().alert(
					response.body && response.body.id
						? 'Success!'
						: 'Error!'
					, response.messages[i]
					, 3500
				);
			}
		}
	}

	onLoad(form, model)
	{
		for(let i in this._onLoad)
		{
			this._onLoad[i](this, form, model);
		}
	}

	onSubmit(form, event)
	{
		for(let i in this._onSubmit)
		{
			this._onSubmit[i](this);
		}
	}

	customFields()
	{
		return {};
	}

	submit()
	{
		// console.log(this);
	}
}
