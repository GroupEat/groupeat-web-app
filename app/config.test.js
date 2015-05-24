import angular from 'angular';
import 'angular-mocks';

angular.module('groupeat.config.test', [
    'ngMockE2E'
])
    .run($httpBackend => {
        'ngInject';

        ['GET', 'POST', 'PUT', 'DELETE'].map(method => {
            $httpBackend.when(method, url => !url.includes('/api/')).passThrough();
        });
    });
