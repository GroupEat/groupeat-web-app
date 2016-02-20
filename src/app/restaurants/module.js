import angular from 'angular';
import * as userTypes from '../auth/user-types';
import GroupOrderController from './group-order.controller';
import GroupOrdersController from './group-orders.controller';
import DashboardController from './dashboard.controller';
import PushExternalOrderController from './push-external-order.controller';
import RestaurantsService from './restaurants.service';

angular.module('groupeat.restaurants', [])
  .controller(GroupOrderController.name, GroupOrderController)
  .controller(GroupOrdersController.name, GroupOrdersController)
  .controller(DashboardController.name, DashboardController)
  .controller(PushExternalOrderController.name, PushExternalOrderController)
  .service('restaurantsService', RestaurantsService)
  .config($stateProvider => {
    'ngInject';

    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        template: require('./dashboard.html'),
        controller: `${DashboardController.name} as dashboard`,
        redirectTo: 'dashboard.groupOrders',
        data: {
          authorizedUser: userTypes.restaurant,
        },
      })
      .state('dashboard.groupOrders', {
        url: '/groupOrders',
        template: require('./group-orders.html'),
        controller: `${GroupOrdersController.name} as vm`,
      })
      .state('dashboard.groupOrder', {
        url: '/groupOrders/:groupOrderId',
        template: require('./group-order.html'),
        controller: `${GroupOrderController.name} as vm`,
      })
      .state('dashboard.pushExternalOrder', {
        url: '/pushExternalOrder',
        template: require('./push-external-order.html'),
        controller: `${PushExternalOrderController.name} as vm`,
      });
  });
