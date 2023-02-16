const MiniCssExtractPlugin = require('mini-css-extract-plugin');

exports.jsRules = function () {
  return {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: ['babel-loader'],
  };
}

exports.tsRules = function () {
  return {
    test: /\.(ts|tsx)$/,
    exclude: /node_modules/,
    use: ['ts-loader'],
  };
}

exports.cssRules = function () {
  const getCssLoaders = (modules) => ([
    MiniCssExtractPlugin.loader,
    { loader: 'css-loader', options: { modules } },
    'postcss-loader',
  ]);

  return {
    test: /\.s?css$/,
    oneOf: [
      { test: /\.module\.s?css$/, use: getCssLoaders(true) },
      { use: getCssLoaders(false) }
    ]
  };
}

exports.imgRules = function () {
  return {
    test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
    type: 'asset/resource',
    generator: {
      filename: 'images/[name].[contenthash][ext]'
    }
  };
}

exports.fontRules = function () {
  return {
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    type: 'asset/resource',
    generator: {
      filename: 'fonts/[name].[contenthash][ext]'
    },
  };
}
