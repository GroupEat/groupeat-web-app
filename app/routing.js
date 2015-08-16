import angular from 'angular';
import 'angular-ui-router';

angular.module('groupeat.routing', [
  'ui.router'
])
  .config($locationProvider => {
    'ngInject';

    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
  })
  .config(($stateProvider, $urlRouterProvider) => {
    'ngInject';

    $stateProvider
      .state('showcase', {
        url: '/',
        templateUrl: 'showcase/showcase.html'
      })
      .state('docs', {
        url: '/docs',
        templateUrl: 'admin/login.html'
      })
      .state('activate', {
        url: '/auth/activate',
        templateUrl: 'showcase/showcase.html',
        controller: 'ActivateCustomerController'
      })
      .state('passwordReset', {
        url: '/auth/password/reset',
        templateUrl: 'auth/password-reset.html'
      })
      .state('confirm', {
        url: '/groupOrders/:groupOrderId/confirm',
        templateUrl: 'group-orders/confirm.html'
      })
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'restaurants/dashboard.html'
      });

    $urlRouterProvider.otherwise('/');
  });
