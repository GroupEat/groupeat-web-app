import angular from 'angular';
import 'angular-input-match';
import ActivateCustomerController from './activate-customer.controller.js';
import AuthService from './auth.service.js';
import LogInController from './log-in.controller.js';
import LogOutController from './log-out.controller.js';
import PasswordResetController from './password-reset.controller.js';

angular.module('groupeat.auth', ['validation.match'])
  .controller(ActivateCustomerController.name, ActivateCustomerController)
  .controller(LogInController.name, LogInController)
  .controller(LogOutController.name, LogOutController)
  .controller(PasswordResetController.name, PasswordResetController)
  .service('auth', AuthService)
  .config($stateProvider => {
    'ngInject';

    $stateProvider
      .state('activate', {
        url: '/auth/activate',
        templateUrl: 'auth/activate.html',
        controller: `${ActivateCustomerController.name} as vm`
      })
      .state('logIn', {
        url: '/logIn',
        templateUrl: 'auth/log-in.html',
        controller: `${LogInController.name} as vm`
      })
      .state('logOut', {
        url: '/logOut',
        templateUrl: 'auth/log-out.html',
        controller: `${LogOutController.name} as vm`
      })
      .state('passwordReset', {
        url: '/auth/password/reset',
        templateUrl: 'auth/password-reset.html',
        controller: `${PasswordResetController.name} as vm`
      });
  })
  .run(($rootScope, auth) => {
    'ngInject';

    $rootScope.$on('$stateChangeStart', (event, toState) => {
      auth.handle(event, toState);
    });
  });
