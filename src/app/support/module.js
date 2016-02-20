import angular from 'angular';
import 'angular-capitalize-filter';
import ApiService from './api.service';
import ElementModifierService from './element-modifier.service';
import FaviconService from './favicon.service';
import NotifierService from './notifier.service';
import PopupService from './popup.service';
import SocketService from './socket.service';
import timeAgoDirective from './time-ago.directive';
import titleFilter from './title.filter';

angular.module('groupeat.support', ['angular-capitalize-filter'])
  .service('api', ApiService)
  .service('elementModifier', ElementModifierService)
  .service('favicon', FaviconService)
  .service('notifier', NotifierService)
  .service('popup', PopupService)
  .service('socket', SocketService)
  .directive('timeAgo', timeAgoDirective)
  .filter('title', titleFilter);
