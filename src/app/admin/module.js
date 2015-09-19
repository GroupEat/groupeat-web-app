import angular from 'angular';
import * as userTypes from '../auth/user-types.js';
import DocsController from './docs.controller.js';

angular.module('groupeat.admin', [])
  .controller(DocsController.name, DocsController)
  .config($stateProvider => {
    'ngInject';

    $stateProvider
      .state('docs', {
        url: '/docs',
        templateUrl: 'admin/docs.html',
        controller: `${DocsController.name} as vm`,
        data: {
          authorizedUser: userTypes.admin
        }
      });
  });
