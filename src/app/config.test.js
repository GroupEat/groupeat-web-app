import angular from 'angular';
import 'angular-mocks';

angular.module('groupeat.config.test', [
  'ngMockE2E'
])
  .run($httpBackend => {
    'ngInject';

    const httpMethods = ['GET', 'POST', 'PUT', 'DELETE'];

    httpMethods.map(method => {
      $httpBackend.when(method, url => !url.includes('/api/')).passThrough();
    });
  });
