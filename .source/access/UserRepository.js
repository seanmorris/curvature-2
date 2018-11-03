import { Config     } from 'Config';
import { Bindable   } from 'curvature/base/Bindable';
import { Repository } from '../base/Repository';

export class UserRepository extends Repository {
	static get uri() { return Config.backend + '/user/'; }
	static getCurrentUser(refresh) {
		this.args = this.args || Bindable.makeBindable({});
		if(window.prerenderer)
		{
			return;
		}
		return this.request(
			this.uri + 'current'
			, false
			, false
			, false
		).then((response) => {
			this.args.current = response.body;
			return response;
		});
	}
	static login() {
		return this.request(Config.backend + '/user/login')
	}
	static logout() {
		this.args = this.args || Bindable.makeBindable({});
		this.args.current = null;
		return this.request(
			this.uri + 'logout'
			, false
			, {}
			, false
		).then((user) => {
			return user;
		});
	}
	static onChange(callback) {
		this.args = this.args || Bindable.makeBindable({});
		this.args.bindTo('current', callback);
	}
}

// setInterval(() => {
// 	UserRepository.getCurrentUser();
// 	console.log('!!!');
// }, 5000);