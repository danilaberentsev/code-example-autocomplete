const path = require('path');
const Dotenv = require('dotenv-webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { jsRules, tsRules, fontRules, imgRules, cssRules } = require('./rules');

module.exports = {
  entry: './index.tsx',
  module: {
    rules: [
      jsRules(),
      tsRules(),
      cssRules(),
      imgRules(),
      fontRules()
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({ template: 'index.html', favicon: './src/assets/logo/favicon.ico' }),
    new WebpackManifestPlugin({ publicPath: '' }),
    new MiniCssExtractPlugin({ filename: '[name]-[contenthash].css' }),
    new ESLintPlugin({ failOnError: false }),
    new Dotenv()
  ],
};
