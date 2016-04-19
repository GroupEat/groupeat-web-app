import angular from 'angular';
import * as userTypes from '../auth/user-types';
import DocsController from './docs.controller';
import MadeUpGroupOrdersController from './made-up-group-orders.controller';

angular.module('groupeat.admin', [])
  .controller(DocsController.name, DocsController)
  .controller(MadeUpGroupOrdersController.name, MadeUpGroupOrdersController)
  .config($stateProvider => {
    'ngInject';

    $stateProvider
      .state('madeUpGroupOrders', {
        url: '/madeUpGroupOrders',
        template: require('./made-up-group-orders.html'),
        controller: `${MadeUpGroupOrdersController.name} as vm`,
        data: {
          authorizedUser: userTypes.admin,
        },
      })
      .state('docs', {
        url: '/docs',
        template: require('./docs.html'),
        controller: `${DocsController.name} as vm`,
        data: {
          authorizedUser: userTypes.admin,
        },
      })
      .state('analytics', {
        url: '/analytics',
        template: '',
        controller: () => {
          window.location = `${window.location.origin}:8000`;
        },
      });
  });
