export const testNormalGetRequest = () => {
	const Elicit = require('curvature/net/Elicit').Elicit;
	const elicit = new Elicit('http://127.0.0.1:8038/');
	return elicit.then(() => elicit.text());
};
