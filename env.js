module.exports = {
  test: {
    port: 3474,
    entry: './src/app/app.test.js',
    definitions: {
      'process.env.API_BASE_URL': '"http://mock/api"',
      'process.env.BROADCAST_URL': '"http://mock:3000"',
    },
  },
  development: {
    port: 8080,
    entry: './src/app/app.js',
    definitions: {
      'process.env.API_BASE_URL': '"http://groupeat.dev/api"',
      'process.env.BROADCAST_URL': '"http://groupeat.dev:3000"',
    },
  },
  staging: {
    port: 8080,
    entry: './src/app/app.js',
    definitions: {
      'process.env.API_BASE_URL': '"https://staging.groupeat.fr/api"',
      'process.env.BROADCAST_URL': '"https://staging.groupeat.fr:3000"',
    },
  },
  production: {
    port: 8080,
    entry: './src/app/app.js',
    definitions: {
      'process.env.API_BASE_URL': '"https://groupeat.fr/api"',
      'process.env.BROADCAST_URL': '"https://groupeat.fr:3000"',
    },
  },
};
