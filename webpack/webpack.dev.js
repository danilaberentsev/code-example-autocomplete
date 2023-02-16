const path = require('path');

module.exports = {
  mode: 'development',
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    path: path.resolve(__dirname, '../build'),
    clean: true,
    publicPath: '/',
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './build',
    hot: true,
    historyApiFallback: true,
    client: {
      progress: true,
    }
  },
};
