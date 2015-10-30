import angular from 'angular';
import 'angular-capitalize-filter';
import ApiService from './api.service.js';
import ElementModifierService from './element-modifier.service.js';
import PopupService from './popup.service.js';
import SocketService from './socket.service.js';

angular.module('groupeat.support', ['angular-capitalize-filter'])
  .service('api', ApiService)
  .service('elementModifier', ElementModifierService)
  .service('popup', PopupService)
  .service('socket', SocketService)
  .filter('title', $filter => {
    'ngInject';

    return input => $filter('capitalize')($filter('translate')(input), 'first');
  });
