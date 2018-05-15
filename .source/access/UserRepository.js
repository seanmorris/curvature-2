import { Config     } from 'Config';
import { Repository } from 'curvature/base/Repository';

export class UserRepository extends Repository {
	static get uri() { return Config.backend + '/user/'; }
	static getCurrentUser(refresh) {
		return this.request(
			this.uri + 'current'
			, false, false, false
		).then((user) => {
			return user;
		})
	}
}