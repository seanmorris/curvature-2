// See http://brunch.io for documentation.
exports.files = {
  javascripts: {joinTo: 'curvature.js'},
};

exports.plugins = {
  babel: {
    // presets: ['latest']
    presets: [ "minify" , {} ]
  },
  raw: {
    pattern: /\.(html|jss)$/,
    wrapper: content => `module.exports = ${JSON.stringify(content)}`
  }
};

exports.watcher = {
    awaitWriteFinish: true,
    usePolling: true
};

exports.paths = {
  public: '.dist', watched: ['app']
};
