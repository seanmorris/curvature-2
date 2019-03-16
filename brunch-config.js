// See http://brunch.io for documentation.
exports.files = {
  javascripts: {joinTo: 'curvature.js'},
};

exports.plugins = {
  babel: {
    presets: ['latest']
    // presets: [ "minify" , {} ]
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

// const { exec } = require('child_process');

// exports.hooks  = {};

// exports.hooks.preCompile = () => {
//   console.log("About to compile...");

//   exec(
//     `cd ../frontend \\
//       && npm link curvature`
//     , (err, stdout, stderr)=>{
//       console.log(stdout);
//       console.log(stderr);

//       return Promise.resolve();
//     }
//   );
// };