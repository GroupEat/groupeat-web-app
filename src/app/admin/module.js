import angular from 'angular';
import * as userTypes from '../auth/user-types';
import DocsController from './docs.controller';

angular.module('groupeat.admin', [])
  .controller(DocsController.name, DocsController)
  .config($stateProvider => {
    'ngInject';

    $stateProvider
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
