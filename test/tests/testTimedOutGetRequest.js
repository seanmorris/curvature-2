export const testTimedOutGetRequest = () => {
	const Elicit = require('curvature/net/Elicit').Elicit;
	const elicit = new Elicit('http://127.0.0.1:8038/timeout', {timeout: 500});
	return elicit.then(() => elicit.text());
};
