import _ from 'lodash';

export default class ConfirmationController {
    /*@ngInject*/
    constructor(api, authentication, $routeParams, popup) {
        this.preparationTimeInMinutes = 45; // TODO: sync with API value
        this.stepInMinutes = 5;

        this.api = api;
        this.authentication = authentication;
        this.popup = popup;

        this.token = $routeParams.token;
        this.groupOrderId = $routeParams.groupOrderId;

        this.availableTimes = {};
        this.preparedAt = undefined;

        this.authentication.setToken(this.token);

        this.api.get(`groupOrders/${this.groupOrderId}`)
            .success(response => {
                this.availableTimes = this.getAvailableTimes(Date.parse(response.data.closedAt));
            });
    }

    confirmGroupOrder() {
        this.api.post(`groupOrders/${this.groupOrderId}/confirm`, {
            preparedAt: this.getPreparedAtString(this.availableTimes, this.preparedAt)
        })
            .success(() => this.popup.defaultContentOnly('confirmGroupOrderSuccess'))
            .error(response => this.popup.error(response.errorKey));
    }

    getAvailableTimes(closedAt) {
        const currentTimestamp = Date.now();
        const latestPreparedTimestamp = closedAt + 60000 * this.preparationTimeInMinutes;

        let timestampOnStep;
        let availableTimestamps = [];
        const offsetWithStep = (new Date(latestPreparedTimestamp)).getMinutes() % this.stepInMinutes;

        if (offsetWithStep !== 0) {
            availableTimestamps.push(latestPreparedTimestamp);
            timestampOnStep = latestPreparedTimestamp - offsetWithStep * 60000;
        } else {
            timestampOnStep = latestPreparedTimestamp;
        }

        while (timestampOnStep > currentTimestamp) {
            availableTimestamps.push(timestampOnStep);
            timestampOnStep -= this.stepInMinutes * 60000;
        }

        availableTimestamps.reverse();

        let availableTimes = {};

        for (let i = 0; i < availableTimestamps.length; i++) {
            const timestamp = availableTimestamps[i];
            const date = new Date(timestamp);

            availableTimes[timestamp] = ('0' + date.getHours()).slice(-2) + 'h' + ('0' + date.getMinutes()).slice(-2);
        }

        return availableTimes;
    }

    getPreparedAtString(availableTimes, preparedAt) {
        const preparedAtDate = new Date(parseInt(Object.keys(this.availableTimes).filter(
                key => availableTimes[key] === preparedAt
        )[0]));

        return [
                preparedAtDate.getFullYear(),
                _.padLeft(preparedAtDate.getMonth() + 1),
                _.padLeft(preparedAtDate.getDate())
            ].join('-') + ' ' + [
                _.padLeft(preparedAtDate.getHours()),
                _.padLeft(preparedAtDate.getMinutes()),
                _.padLeft(preparedAtDate.getSeconds())
            ].join(':');
    }
}
