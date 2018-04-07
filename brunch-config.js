exports.files = {
  javascripts: {
    joinTo: {
      'curvature.js': /^app/
    }
  },
  stylesheets: {joinTo: 'curvature.css'}
};

// exports.paths = {
//   watched: ['.source', 'test', 'vendor']
// };

// exports.modules = {
//   nameCleaner: (path) => path.replace(/^\.source\//, '')
// }

exports.plugins = {
  babel: {
    presets: ['latest']
  }
};
