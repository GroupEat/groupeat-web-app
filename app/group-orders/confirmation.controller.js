/*@ngInject*/
module.exports = function(api, $routeParams, popup) {
    var preparationTimeInMinutes = 45; // TODO: sync with API value
    var stepInMinutes = 5;

    var vm = this;

    vm.confirmGroupOrder = confirmGroupOrder;

    activate();

    function activate() {
        api('GET', 'groupOrders/' + $routeParams['groupOrderId'])
            .success(function(response) {
                vm.availableTimes = getAvailableTimes(Date.parse(response['data']['completedAt']));
            });
    }

    function confirmGroupOrder() {
        api('POST', 'groupOrders/' + $routeParams['groupOrderId'] + '/confirm', {
            preparedAt: getPreparedAtString(vm.availableTimes, vm.preparedAt)
        })
            .success(function() {
                popup.defaultContentOnly('confirmGroupOrderSuccess');
            })
            .error(function(response) {
                popup.error(response['error_key']);
            });
    }

    function getAvailableTimes(completedAt) { // TODO: use moment.js instead
        var currentTimestamp = Date.now();
        var latestPreparedTimestamp = completedAt + (60000 * preparationTimeInMinutes);

        var timestampOnStep;
        var availableTimestamps = [];
        var offsetWithStep = (new Date(latestPreparedTimestamp)).getMinutes() % stepInMinutes;

        if (offsetWithStep != 0) {
            availableTimestamps.push(latestPreparedTimestamp);
            timestampOnStep = latestPreparedTimestamp - offsetWithStep * 60000;
        } else {
            timestampOnStep = latestPreparedTimestamp;
        }

        while (timestampOnStep > currentTimestamp) {
            availableTimestamps.push(timestampOnStep);
            timestampOnStep -= stepInMinutes * 60000;
        }

        availableTimestamps.reverse();

        var availableTimes = {};

        for (var i = 0; i < availableTimestamps.length; i++) {
            var timestamp = availableTimestamps[i];
            var date = new Date(timestamp);

            availableTimes[timestamp] = ('0' + date.getHours()).slice(-2) + 'h' + ('0' + date.getMinutes()).slice(-2);
        }

        return availableTimes;
    }

    function getPreparedAtString(availableTimes, preparedAt) {
        Number.prototype.padLeft = function(base, chr) {
            var len = (String(base || 10).length - String(this).length) + 1;
            return len > 0 ? new Array(len).join(chr || '0') + this : this;
        }

        var preparedAtDate = new Date(parseInt(Object.keys(vm.availableTimes).filter(function(key) {
            return availableTimes[key] === preparedAt;
        })[0]));

        return [
                preparedAtDate.getFullYear(),
                (preparedAtDate.getMonth() + 1).padLeft(),
                preparedAtDate.getDate().padLeft()
            ].join('-') + ' ' + [
                preparedAtDate.getHours().padLeft(),
                preparedAtDate.getMinutes().padLeft(),
                preparedAtDate.getSeconds().padLeft()
            ].join(':');
    }
}