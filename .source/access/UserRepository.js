import { Config     } from 'Config';
import { Repository } from 'base/Repository';

export class UserRepository extends Repository {
	static get uri() { return Config.backend + '/user/'; }
	static getCurrentUser(refresh) {
		return this.request(
			this.uri + 'current?api=json'
			, false, false, false
		).then((user) => {
			console.log(user);

			return user;
		})
	}
}