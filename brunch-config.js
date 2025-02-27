exports.files = { javascripts: {joinTo: 'curvature.js'}};

exports.plugins = {
	raw: {
		wrapper: content => `module.exports = ${JSON.stringify(content)}`,
		pattern: /\.html$/,
	},
	presets: [
		['@babel/preset-env', {
			useBuiltIns: false,
			targets: {browsers: ['>0.25%', 'not ie 11', 'not op_mini all', 'not dead']},
			exclude: [
				'@babel/plugin-transform-arrow-functions',
				'@babel/plugin-transform-block-scoping',
				'@babel/plugin-transform-for-of',
				'@babel/plugin-transform-spread',
				'@babel/plugin-transform-new-target',
				'@babel/plugin-transform-parameters',
			]
		}]
	]
};

exports.paths = {
	public: 'dist',
	watched: ['source', 'build'],
};

exports.modules = {
	nameCleaner: path => path.replace(/^(source|build)?\//, 'curvature/')
}

exports.overrides = {
	development: { paths: { public: 'test/html' } },
}
