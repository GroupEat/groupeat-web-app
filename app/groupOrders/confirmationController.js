angular.module("groupeat.groupOrders")
    .controller("ConfirmationController", ConfirmationController);

function ConfirmationController($http, $routeParams, $mdDialog, $filter) {
    var preparationTimeInMinutes = 45; // TODO: sync with API value
    var stepInMinutes = 5;

    var vm = this;

    vm.confirmGroupOrder = confirmGroupOrder;

    activate();

    function activate() {
        var request = {
            method: "GET",
            url: "/api/groupOrders/" + $routeParams["groupOrderId"],
            headers: {
                "Accept": "application/vnd.groupeat.v1+json",
                "Authorization": "bearer " + $routeParams["token"]
            }
        };

        $http(request)
            .success(function(response) {
                vm.availableTimes = getAvailableTimes(Date.parse(response['data']['completedAt']));
            });
    }

    function confirmGroupOrder() {
        var request = {
            method: "POST",
            url: "/api/groupOrders/" + $routeParams["groupOrderId"] + "/confirm",
            headers: {
                "Accept": "application/vnd.groupeat.v1+json",
                "Authorization": "bearer " + $routeParams["token"]
            },
            data: {
                "preparedAt": getPreparedAtString(vm.availableTimes, vm.preparedAt)
            }
        };

        $http(request)
            .success(function() {
                $mdDialog.show(
                    $mdDialog.alert()
                        .content($filter("translate")("confirmGroupOrderSuccess"))
                        .ok("x")
                );
            })
            .error(function(response) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .title($filter("translate")("errorDialogTitle"))
                        .content($filter("translate")(response["error_key"])) // TODO: I18N
                        .ok("x")
                );
            });
    };

    function getAvailableTimes(completedAt) { // TODO: use moment.js instead
        var currentTimestamp = Date.now();
        var latestPreparedTimestamp = completedAt + (60000 * preparationTimeInMinutes);
        var remainingMinutes = Math.floor((latestPreparedTimestamp - currentTimestamp) / (60000));

        var timestampOnStep;
        var availableTimestamps = [];
        var offsetWithStep = (new Date(latestPreparedTimestamp)).getMinutes() % stepInMinutes;

        if (offsetWithStep != 0)
        {
            availableTimestamps.push(latestPreparedTimestamp);
            timestampOnStep = latestPreparedTimestamp - offsetWithStep * 60000;
        }
        else
        {
            timestampOnStep = latestPreparedTimestamp;
        }

        while (timestampOnStep > currentTimestamp)
        {
            availableTimestamps.push(timestampOnStep);
            timestampOnStep -= stepInMinutes * 60000;
        }

        availableTimestamps.reverse();

        var availableTimes = {};

        for (var i = 0; i < availableTimestamps.length; i++) {
            var timestamp = availableTimestamps[i];
            var date = new Date(timestamp);

            availableTimes[timestamp] = ("0" + date.getHours()).slice(-2) + "h" + ("0" + date.getMinutes()).slice(-2);
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
            ].join("-") + " " + [
                preparedAtDate.getHours().padLeft(),
                preparedAtDate.getMinutes().padLeft(),
                preparedAtDate.getSeconds().padLeft()
            ].join(":");
    }
}