import angular from 'angular';
import 'angular-capitalize-filter';
import ApiService from './api.service.js';
import ElementModifierService from './element-modifier.service.js';
import FaviconService from './favicon.service.js';
import NotifierService from './notifier.service.js';
import PopupService from './popup.service.js';
import SocketService from './socket.service.js';
import timeAgoDirective from './time-ago.directive.js';
import titleFilter from './title.filter.js';

angular.module('groupeat.support', ['angular-capitalize-filter'])
  .service('api', ApiService)
  .service('elementModifier', ElementModifierService)
  .service('favicon', FaviconService)
  .service('notifier', NotifierService)
  .service('popup', PopupService)
  .service('socket', SocketService)
  .directive('timeAgo', timeAgoDirective)
  .filter('title', titleFilter);
