import angular from 'angular';

angular.module('groupeat.showcase', [])
  .config($stateProvider => {
    'ngInject';

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'showcase/showcase.html'
      });
  });
