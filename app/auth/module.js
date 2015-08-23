import angular from 'angular';
import 'angular-input-match';
import ActivateCustomerController from './activate-customer.controller.js';
import Auth from './auth.service.js';
import LogInController from './log-in.controller.js';
import LogOutController from './log-out.controller.js';
import PasswordResetController from './password-reset.controller.js';

angular.module('groupeat.auth', ['validation.match'])
  .controller('ActivateCustomerController', ActivateCustomerController)
  .controller('LogInController', LogInController)
  .controller('LogOutController', LogOutController)
  .controller('PasswordResetController', PasswordResetController)
  .service('auth', Auth)
  .config($stateProvider => {
    'ngInject';

    $stateProvider
      .state('activate', {
        url: '/auth/activate',
        templateUrl: 'auth/activate.html'
      })
      .state('logIn', {
        url: '/logIn',
        templateUrl: 'auth/log-in.html'
      })
      .state('logOut', {
        url: '/logOut',
        templateUrl: 'auth/log-out.html'
      })
      .state('passwordReset', {
        url: '/auth/password/reset',
        templateUrl: 'auth/password-reset.html'
      });
  })
  .run(($rootScope, auth) => {
    'ngInject';

    $rootScope.$on('$stateChangeStart', (event, toState) => {
      auth.handle(event, toState);
    });
  });
