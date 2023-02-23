exports.files = {
  javascripts: {joinTo: 'curvature.js'},
};

exports.plugins = {
  babel: {
    presets: [[ "minify" , { builtIns: false } ]]
  },
  raw: {
    pattern: /\.(html|jss)$/,
    wrapper: content => `module.exports = ${JSON.stringify(content)}`
  }
};

exports.paths = {
  public: 'dist', watched: ['source', 'build']
};

exports.modules = {
	nameCleaner: path => path.replace(/^(source|build)?\//, 'curvature/')
}

exports.overrides = {
	production: {sourceMaps: true}
}
