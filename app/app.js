var angular = require('angular');

require('./config');
require('./routing');
require('./admin/module');
require('./auth/module');
require('./group-orders/module');
require('./showcase/module');
require('./support/module');

angular.module('groupeat', [
    'groupeat.config',
    'groupeat.routing',
    'groupeat.admin',
    'groupeat.auth',
    'groupeat.groupOrders',
    'groupeat.showcase',
    'groupeat.support'
]);
