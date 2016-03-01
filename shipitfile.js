module.exports = shipit => {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/tmp/app',
      deployTo: '~/app',
      repositoryUrl: 'git@github.com:GroupEat/groupeat-web-app.git',
      ignores: ['.git', 'node_modules'],
      keepReleases: 3,
      shallowClone: true,
    },
    staging: {
      branch: 'staging',
      servers: 'vagrant@staging.groupeat.fr',
    },
    production: {
      branch: 'production',
      servers: 'vagrant@groupeat.fr',
    },
  });

  shipit.on('published', () => shipit
    .start('install')
  );

  shipit.blTask('install', () => shipit
      .remote(`cd ${shipit.releasePath} && npm instal && npm run build -- --env ${shipit.config.branch} --optimize`)
      .then(() => {
        shipit.log('Install Done!');
      })
  );
};
