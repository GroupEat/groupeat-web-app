import angular from 'angular';
import 'angular-route';

angular.module('groupeat.routing', [
  'ngRoute'
])
  .config($locationProvider => {
    'ngInject';

    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
  })
  .config($routeProvider => {
    'ngInject';

    $routeProvider
      .when('/', {
        templateUrl: '/showcase/showcase.html'
      })
      .when('/docs', {
        templateUrl: '/admin/login.html'
      })
      .when('/auth/activate', {
        templateUrl: '/showcase/showcase.html',
        controller: 'ActivateCustomerController'
      })
      .when('/auth/password/reset', {
        templateUrl: '/auth/password-reset.html'
      })
      .when('/groupOrders/:groupOrderId/confirm', {
        templateUrl: '/group-orders/confirm.html'
      })
      .when('/logIn', {
        templateUrl: '/auth/log-in.html'
      })
      .when('/dashboard', {
        templateUrl: '/restaurants/dashboard.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
