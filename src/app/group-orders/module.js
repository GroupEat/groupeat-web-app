import angular from 'angular';
import * as userTypes from '../auth/user-types.js';
import ConfirmationController from './confirmation.controller.js';

angular.module('groupeat.groupOrders', [])
  .controller(ConfirmationController.name, ConfirmationController)
  .config($stateProvider => {
    'ngInject';

    $stateProvider
      .state('confirm', {
        url: '/groupOrders/:groupOrderId/confirm',
        templateUrl: 'group-orders/confirm.html',
        controller: `${ConfirmationController.name} as vm`,
        data: {
          authorizedUser: userTypes.restaurant
        }
      });
  });
