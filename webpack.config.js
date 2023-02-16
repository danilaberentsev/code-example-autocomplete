const { merge } = require('webpack-merge');
const dev = require('./webpack/webpack.dev');
const common = require('./webpack/webpack.common');
const production = require('./webpack/webpack.production');

module.exports = function (env, argv) {
  if (argv.mode === 'production') {
    return merge([common, production]);
  }

  // development as default
  return merge([common, dev]);
};
