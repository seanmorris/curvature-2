exports.files = { javascripts: {joinTo: 'curvature.js'}};

exports.plugins = {
  raw: {
    wrapper: content => `module.exports = ${JSON.stringify(content)}`,
    pattern: /\.html$/,
  }
};

exports.paths = {
  public: 'dist', watched: ['source', 'build']
};

exports.modules = {
	nameCleaner: path => path.replace(/^(source|build)?\//, 'curvature/')
}

exports.overrides = {
	development: { paths: { public: 'test/html' } },
}
