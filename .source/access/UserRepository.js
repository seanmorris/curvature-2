import { Config     } from 'Config';
import { Bindable   } from '../base/Bindable';
import { Repository } from '../base/Repository';

export class UserRepository extends Repository {
	static get uri() { return Config.backend + '/user/'; }
	static getCurrentUser(refresh = null) {
		this.args = this.args || Bindable.makeBindable({});
		if(window.prerenderer)
		{
			return;
		}
		if(!refresh && this.running)
		{
			console.log(this.running);
			return this.running;
		}
		if(!refresh && this.args.response)
		{
			return Promise.resolve(this.args.response);
		}
		if(refresh === false)
		{
			return Promise.resolve(this.args.response);
		}
		this.running = this.request(
			this.uri + 'current'
			, false
			, false
			, false
		).then((response) => {
			this.running = false;
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
			if(response && response.body.id)
			{
				this.args.response = response;
				this.args.current  = response.body;
			}
			return response;
		});

		return this.running;
	}
	static login() {
		return this.request(this.uri + '/login');
	}
	static logout() {
		this.args = this.args || Bindable.makeBindable({});
		let user  = this.args.current;

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