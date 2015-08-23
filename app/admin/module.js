import angular from 'angular';
import DocsController from './docs.controller.js';
import * as userTypes from '../auth/user-types.js';

angular.module('groupeat.admin', [])
  .controller('DocsController', DocsController)
  .config($stateProvider => {
    'ngInject';

    $stateProvider
      .state('docs', {
        url: '/docs',
        templateUrl: 'admin/docs.html',
        data: {
          authorizedUser: userTypes.admin
        }
      });
  });
