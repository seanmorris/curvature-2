import { Config         } from '../base/Config';

import { View           } from '../base/View';
import { Router         } from '../base/Router';
import { Repository     } from '../base/Repository';

import { UserRepository } from './UserRepository';

import { Toast      } from '../toast/Toast';
import { ToastAlert } from '../toast/ToastAlert';

export class LoginView extends View{
	constructor() {
		super();
		this.template = `
			<a cv-link = "user">User</a>
			<br />
			
			<a cv-link = "user/login">Login</a>
			<br />

			<a cv-link = "user/register">Register</a>
			<br />

			<a cv-link = "user/logout">Logout</a>
			<br />

			<input
				type  = "button"
				value = "Login via FaceBook"
			 	cv-on = "click:facebookLogin(event)"
			 />
			 <input
				type  = "button"
				value = "Log Out"
			 	cv-on = "click:logout(event)"
			 />
		`;
	}
	facebookLogin(event) {
		console.log('fb!')
		event.preventDefault();
		let fbWindow = window.open(
			Config.get('backend')
				+ '/facebookLogin'
		);

		if(this.userCheck)
		{
			this.clearInterval(this.userCheck);
		}

		this.userCheck = this.onInterval(333, () => {
			UserRepository.getCurrentUser(true).then((response) => {
				let user = response.body;
				if(!user.id || !user)
				{
					return;
				}

				this.clearInterval(this.userCheck);

				Router.clearCache();
				Repository.clearCache();

				Toast.instance().pop(new ToastAlert({
					title: 'Logged in as ' + user.username
					, body: 'ID: '  + user.publicId
					, time: 2400
				}));

				// history.go(-1);

				// Router.instance().updateView(this, this.routes, true);
			});
		});
	}
	logout(event) {
		let logoutWindow = window.open(
			Config.get('backend')
				+ '/user/logout?page=app%3Fclose%3D1'
		);
	}
}

