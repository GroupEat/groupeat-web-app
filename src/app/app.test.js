import angular from 'angular';
import './config.test';
import './modules';

angular.module('groupeat', [
  'groupeat.config.test',
  'groupeat.modules',
]);
