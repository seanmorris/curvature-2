import { Config     } from 'Config';
import { Bindable   } from '../base/Bindable';
import { Repository } from '../base/Repository';

export class UserRepository extends Repository {
	static get uri() { return Config.backend + '/user/'; }
	static getCurrentUser(refresh = false) {
		this.args = this.args || Bindable.makeBindable({});
		if(window.prerenderer)
		{
			return;
		}
		if(!refresh && this.args.response)
		{
			console.log(this.args.response);
			return Promise.resolve(this.args.response);
		}
		return this.request(
			this.uri + 'current'
			, false
			, false
			, false
		).then((response) => {
			if(response.body.roles)
			{
				for(let i in response.body.roles)
				{
					if(response.body.roles[i].class == 'SeanMorris\\Access\\Role\\Administrator')
					{
						response.body.isAdmin = true;
					}
				}
			}
			if(this.args.response && this.args.response.id)
			{
				this.args.response = response;
				this.args.current  = response.body;
			}
			return response;
		});
	}
	static login() {
		return this.request(this.uri + '/login');
	}
	static logout() {
		this.args = this.args || Bindable.makeBindable({});
		this.args.current = null;
		return this.request(
			this.uri + 'current'
			, false
			, {}
			, false
		).then((user) => {
			this.request(
				this.uri + 'logout'
				, false
				, {}
				, false
			).then(() => {
				return user;
			});
			return user;
		});
	}
	static onChange(callback) {
		this.args = this.args || Bindable.makeBindable({});
		return this.args.bindTo('current', callback);
	}
}

Repository.onResponse((response)=>{
	UserRepository.args = UserRepository.args || Bindable.makeBindable({});
	if(response
		&& response.meta
		&& response.meta.currentUser
		&& (!UserRepository.args.current
			|| response.meta.currentUser.id !== UserRepository.args.current.id
		)
	){
		UserRepository.args.current = response.meta.currentUser;
	}
}, {wait:0});

// setInterval(() => {
// 	UserRepository.getCurrentUser();
// 	console.log('!!!');
// }, 5000);