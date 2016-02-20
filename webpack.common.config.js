const argv = require('yargs').argv;
const webpack = require('webpack');

const getConfig = env => ({
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'ng-annotate!babel?presets[]=es2015',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin(env.definitions),
  ],
  eslint: {
    failOnWarning: argv.optimize,
    failOnError: argv.optimize,
  },
});

module.exports = getConfig;
