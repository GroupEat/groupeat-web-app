import angular from 'angular';
import * as userTypes from '../auth/user-types.js';
import GroupOrderController from './group-order.controller.js';
import GroupOrdersController from './group-orders.controller.js';
import DashboardController from './dashboard.controller.js';
import PushExternalOrderController from './push-external-order.controller.js';
import RestaurantsService from './restaurants.service.js';
import foodrushDirective from './foodrush.directive.js';

angular.module('groupeat.restaurants', [])
  .controller(GroupOrderController.name, GroupOrderController)
  .controller(GroupOrdersController.name, GroupOrdersController)
  .controller(DashboardController.name, DashboardController)
  .controller(PushExternalOrderController.name, PushExternalOrderController)
  .service('restaurantsService', RestaurantsService)
  .directive('foodrush', foodrushDirective)
  .config($stateProvider => {
    'ngInject';

    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'restaurants/dashboard.html',
        controller: `${DashboardController.name} as dashboard`,
        redirectTo: 'dashboard.groupOrders',
        data: {
          authorizedUser: userTypes.restaurant
        }
      })
      .state('dashboard.groupOrder', {
        url: '/groupOrder/:groupOrderId',
        templateUrl: 'restaurants/group-order.html',
        controller: `${GroupOrderController.name} as vm`
      })
      .state('dashboard.groupOrders', {
        url: '/groupOrders',
        templateUrl: 'restaurants/group-orders.html',
        controller: `${GroupOrdersController.name} as vm`
      })
      .state('dashboard.pushExternalOrder', {
        url: '/pushExternalOrder',
        templateUrl: 'restaurants/push-external-order.html',
        controller: `${PushExternalOrderController.name} as vm`
      });
  });
