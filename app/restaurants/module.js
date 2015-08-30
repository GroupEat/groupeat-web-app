import angular from 'angular';
import CurrentOrdersController from './current-orders.controller.js';
import DashboardController from './dashboard.controller.js';
import PushExternalOrderController from './push-external-order.controller.js';
import Restaurants from './restaurants.service.js';
import * as userTypes from '../auth/user-types.js';

angular.module('groupeat.restaurants', [])
  .controller('CurrentOrdersController', CurrentOrdersController)
  .controller('DashboardController', DashboardController)
  .controller('PushExternalOrderController', PushExternalOrderController)
  .service('restaurants', Restaurants)
  .config($stateProvider => {
    'ngInject';

    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'restaurants/dashboard.html',
        controller: 'DashboardController as vm',
        redirectTo: 'dashboard.currentOrders',
        data: {
          authorizedUser: userTypes.restaurant
        },
        resolve: {
          restaurant: (auth, restaurants) => {
            return restaurants.get(auth.getUserId());
          }
        }
      })
      .state('dashboard.currentOrders', {
        url: '/orders',
        templateUrl: 'restaurants/current-orders.html',
        controller: 'CurrentOrdersController as vm'
      })
      .state('dashboard.pushExternalOrder', {
        url: '/pushExternalOrder',
        templateUrl: 'restaurants/push-external-order.html',
        controller: 'PushExternalOrderController as vm',
        resolve: {
          productFormats: (auth, restaurants) => {
            return restaurants.getProductFormats(auth.getUserId());
          }
        }
      });
  });
