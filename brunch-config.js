exports.files = {
  javascripts: {joinTo: 'curvature.js'},
};

exports.plugins = {
  babel: {
    presets: [ "minify" , {} ]
  },
  raw: {
    pattern: /\.(html|jss)$/,
    wrapper: content => `module.exports = ${JSON.stringify(content)}`
  }
};

exports.paths = {
  public: 'docs', watched: ['source','source-docs']
};

exports.modules = {
	nameCleaner: path => path.replace(/^source(?:-docs)?\//, '')
}
