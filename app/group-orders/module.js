import angular from 'angular';
import ConfirmationController from './confirmation.controller.js';

angular.module('groupeat.groupOrders', [])
  .controller('ConfirmationController', ConfirmationController)
  .config($stateProvider => {
    'ngInject';

    $stateProvider
      .state('confirm', {
        url: '/groupOrders/:groupOrderId/confirm',
        templateUrl: 'group-orders/confirm.html'
      });
  });
