require('angular-input-match');

require('angular').module('groupeat.auth', ['validation.match'])
    .controller('ActivateCustomerController', require('./activate-customer.controller'))
    .factory('authentication', require('./authentication.factory'))
    .controller('PasswordResetController', require('./password-reset.controller'))
;