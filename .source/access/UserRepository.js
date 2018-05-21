import { Config     } from 'Config';
import { Repository } from '../base/Repository';

export class UserRepository extends Repository {
	static get uri() { return Config.backend + '/user/'; }
	static getCurrentUser(refresh) {
		return this.request(
			this.uri + 'current'
			, false, false, false
		).then((user) => {
			return user;
		});
	}
	static logout() {
		return this.request(
			this.uri + 'logout'
			, false, {}, false
		).then((user) => {
			return user;
		});
	}
}