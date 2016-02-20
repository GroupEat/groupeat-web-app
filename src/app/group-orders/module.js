import angular from 'angular';
import * as userTypes from '../auth/user-types';
import ConfirmationController from './confirmation.controller';

angular.module('groupeat.groupOrders', [])
  .controller(ConfirmationController.name, ConfirmationController)
  .config($stateProvider => {
    'ngInject';

    $stateProvider
      .state('confirm', {
        url: '/groupOrders/:groupOrderId/confirm',
        template: require('./confirm.html'),
        controller: `${ConfirmationController.name} as vm`,
        data: {
          authorizedUser: userTypes.restaurant,
        },
      });
  });
