const _ = require('lodash');
const glob = require('glob');
const getConfig = require('./webpack.common.config');

const env = require('./env').test;
const config = getConfig(env);

config.entry = _.fromPairs(glob.sync('./tests/*.js').map(filename => [
  filename.match(/tests\/(.+)\.js/)[1],
  filename,
]));

config.output = {
  path: './dist-test',
  filename: '[name].js',
};

module.exports = config;
