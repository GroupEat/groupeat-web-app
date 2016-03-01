import angular from 'angular';

angular.module('groupeat.showcase', [])
  .config($stateProvider => {
    'ngInject';

    $stateProvider
      .state('home', {
        url: '/',
        template: require('./showcase.html'),
      })
      .state('terms', {
        url: '/terms',
        template: require('./terms.html'),
      });
  });
