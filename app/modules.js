import angular from 'angular';
import './config';
import './routing';
import './admin/module';
import './auth/module';
import './group-orders/module';
import './restaurants/module';
import './showcase/module';
import './support/module';

angular.module('groupeat.modules', [
  'groupeat.config',
  'groupeat.routing',
  'groupeat.admin',
  'groupeat.auth',
  'groupeat.groupOrders',
  'groupeat.restaurants',
  'groupeat.showcase',
  'groupeat.support'
]);
