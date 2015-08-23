import angular from 'angular';
import DashboardController from './dashboard.controller.js';
import Restaurants from './restaurants.service.js';
import * as userTypes from '../auth/user-types.js';

angular.module('groupeat.restaurants', [])
  .controller('DashboardController', DashboardController)
  .service('restaurants', Restaurants)
  .config($stateProvider => {
    'ngInject';

    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'restaurants/dashboard.html',
        controller: 'DashboardController as vm',
        data: {
          authorizedUser: userTypes.restaurant
        },
        resolve: {
          restaurant: (auth, restaurants) => {
            'ngInject';

            return restaurants.get(auth.getUserId());
          }
        }
      });
  });
