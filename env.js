module.exports = {
  test: {
    entry: './src/app/app.test.js',
    definitions: {
      'process.env.API_BASE_URL': '"http://mock/api"',
      'process.env.BROADCAST_URL': '"http://mock:3000"',
    },
  },
  development: {
    entry: './src/app/app.js',
    definitions: {
      'process.env.API_BASE_URL': '"http://groupeat.dev/api"',
      'process.env.BROADCAST_URL': '"http://groupeat.dev:3000"',
    },
  },
  staging: {
    entry: './src/app/app.js',
    definitions: {
      'process.env.API_BASE_URL': '"http://staging.groupeat.fr/api"',
      'process.env.BROADCAST_URL': '"http://staging.groupeat.fr:3000"',
    },
  },
  production: {
    entry: './src/app/app.js',
    definitions: {
      'process.env.API_BASE_URL': '"http://groupeat.fr/api"',
      'process.env.BROADCAST_URL': '"http://groupeat.fr:3000"',
    },
  },
};
