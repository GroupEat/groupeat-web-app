import angular from 'angular';
import './config';
import './admin/module';
import './auth/module';
import './group-orders/module';
import './restaurants/module';
import './showcase/module';
import './support/module';

import '../scss/style.scss';
import 'angular-material/angular-material.min.css';
import 'angular-loading-bar/build/loading-bar.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

angular.module('groupeat.modules', [
  'groupeat.config',
  'groupeat.admin',
  'groupeat.auth',
  'groupeat.groupOrders',
  'groupeat.restaurants',
  'groupeat.showcase',
  'groupeat.support',
]);
