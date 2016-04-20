import angular from 'angular';
import 'angular-validation-match';
import AuthService from './auth.service';
import LogInController from './log-in.controller';
import LogOutController from './log-out.controller';
import PasswordResetController from './password-reset.controller';

angular.module('groupeat.auth', ['validation.match'])
  .controller(LogInController.name, LogInController)
  .controller(LogOutController.name, LogOutController)
  .controller(PasswordResetController.name, PasswordResetController)
  .service('auth', AuthService)
  .config($stateProvider => {
    'ngInject';

    $stateProvider
      .state('logIn', {
        url: '/logIn',
        template: require('./log-in.html'),
        controller: `${LogInController.name} as vm`,
      })
      .state('logOut', {
        url: '/logOut',
        template: require('./log-out.html'),
        controller: `${LogOutController.name} as vm`,
      })
      .state('passwordReset', {
        url: '/auth/password/reset?token',
        template: require('./password-reset.html'),
        controller: `${PasswordResetController.name} as vm`,
      });
  })
  .run(($rootScope, auth) => {
    'ngInject';

    $rootScope.$on('$stateChangeStart', (event, toState) => {
      auth.handle(event, toState);
    });
  });
