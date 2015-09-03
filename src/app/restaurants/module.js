import angular from 'angular';
import OrdersController from './orders.controller.js';
import DashboardController from './dashboard.controller.js';
import PushExternalOrderController from './push-external-order.controller.js';
import RestaurantsService from './restaurants.service.js';
import * as userTypes from '../auth/user-types.js';

angular.module('groupeat.restaurants', [])
  .controller(OrdersController.name, OrdersController)
  .controller(DashboardController.name, DashboardController)
  .controller(PushExternalOrderController.name, PushExternalOrderController)
  .service('restaurantsService', RestaurantsService)
  .config($stateProvider => {
    'ngInject';

    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'restaurants/dashboard.html',
        controller: `${DashboardController.name} as dashboard`,
        redirectTo: 'dashboard.orders',
        data: {
          authorizedUser: userTypes.restaurant
        }
      })
      .state('dashboard.orders', {
        url: '/orders',
        templateUrl: 'restaurants/orders.html',
        controller: `${OrdersController.name} as vm`
      })
      .state('dashboard.pushExternalOrder', {
        url: '/pushExternalOrder',
        templateUrl: 'restaurants/push-external-order.html',
        controller: `${PushExternalOrderController.name} as vm`
      });
  });
