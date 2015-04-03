import angular from 'angular';
import 'angular-capitalize-filter';
import Api from './api.service.js';
import ElementModifier from './element-modifier.service.js';
import Popup from './popup.service.js';

angular.module('groupeat.support', ['angular-capitalize-filter'])
    .service('api', Api)
    .service('elementModifier', ElementModifier)
    .service('popup', Popup);
