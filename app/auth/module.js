import angular from 'angular';
import 'angular-input-match';
import ActivateCustomerController from './activate-customer.controller.js';
import Authentication from './authentication.service.js';
import PasswordResetController from './password-reset.controller.js';

angular.module('groupeat.auth', ['validation.match'])
  .controller('ActivateCustomerController', ActivateCustomerController)
  .service('authentication', Authentication)
  .controller('PasswordResetController', PasswordResetController);
