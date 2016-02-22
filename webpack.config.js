const argv = require('yargs').argv;
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const getConfig = require('./webpack.common.config');

const env = require('./env')[argv.env || 'development'];

if (argv.optimize) {
  env.definitions['process.env.NODE_ENV'] = '"production"';
}

const config = getConfig(env);

config.entry = env.entry;

config.output = {
  path: './dist',
  filename: `${argv.optimize ? '[hash].' : ''}[name].js`,
};

config.module.loaders = config.module.loaders.concat([
  {
    test: /\.html$/,
    loader: 'html',
  },
  {
    test: /\.scss/,
    loader: 'style!css!sass',
  },
  {
    test: /\.css/,
    loader: 'style!css',
  },
  {
    test: /\.(eot|svg|ttf|wav|woff|woff2)/,
    loader: 'file',
  },
]);

config.module.preLoaders = config.module.preLoaders.concat([
  {
    test: /\.html$/,
    loader: 'htmlhint',
  },
]);

config.plugins = config.plugins.concat([
  new HtmlWebpackPlugin({
    favicon: './src/app/favicon.ico',
    template: './src/app/index.html',
  }),
]);

if (argv.optimize) {
  config.plugins = config.plugins.concat([
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
  ]);
} else {
  config.devtool = '#source-map';
}

config.devServer = {
  port: env.port,
  inline: true,
  historyApiFallback: true,
};

config.htmlhint = {
  failOnError: argv.optimize,
  failOnWarning: argv.optimize,
};

module.exports = config;
