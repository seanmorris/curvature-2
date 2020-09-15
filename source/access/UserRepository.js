import { Config     } from '../base/Config';
import { Bindable   } from '../base/Bindable';
import { Repository } from '../base/Repository';

export class UserRepository extends Repository {

	static get uri() { return Config.get('backend') + '/user/'; }

	static getCurrentUser(refresh = null)
	{
		if(window.prerenderer || navigator.userAgent.match(/prerender/i))
		{
			window.prerenderer = window.prerenderer || true;

			return;
		}

		if(this.args.response && refresh === false)
		{
			return Promise.resolve(this.args.response);
		}

		return this.request(
			this.uri + 'current'
			, false
			, false
		).then(response => {
			if(response.body && response.body.roles)
			{
				for(let i in response.body.roles)
				{
					if(response.body.roles[i].class == 'SeanMorris\\Access\\Role\\Administrator')
					{
						response.body.isAdmin = true;
					}
				}
			}
			if(response.body && response.body.id)
			{
				this.args.response = response;
				this.args.current  = response.body;
			}
			return response;
		}).catch(error => {

			console.error(error);

		});
	}

	static login()
	{
		return this.request(this.uri + '/login');
	}

	static logout()
	{
		const user  = this.args.current;

		delete this.args.current;

		return this.request(
			this.uri + 'logout'
			, false
			, {}
			, false
		).then(() => {
			this.args.current = null;
			return user;
		});
	}

	static onChange(callback)
	{
		return this.args.bindTo('current', callback);
	}
}

Object.defineProperty(UserRepository, 'args', {
	configurable: false
	, writable:   false
	, value:      Bindable.makeBindable({})
});

Repository.onResponse(response => {
	if(response
		&& response.meta
		&& 'currentUser' in response.meta
		&& (!UserRepository.args.current || response.meta.currentUser.id !== UserRepository.args.current.id
		)
	){
		UserRepository.args.current = response.meta.currentUser;
	}
});
