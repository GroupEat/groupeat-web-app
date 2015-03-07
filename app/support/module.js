require('angular-capitalize-filter');

require('angular').module('groupeat.support', ['angular-capitalize-filter'])
    .factory('api', require('./api.factory'))
    .factory('elementModifier', require('./element-modifier.factory'))
    .factory('popup', require('./popup.factory'))
;