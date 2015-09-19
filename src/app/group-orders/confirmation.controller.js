import moment from 'moment';

export default class ConfirmationController {
  constructor(api, $stateParams, popup) {
    'ngInject';

    this.preparationTimeInMinutes = 35; // TODO: sync with API value
    this.stepInMinutes = 5;

    this.api = api;
    this.popup = popup;

    this.token = $stateParams.token;
    this.groupOrderId = $stateParams.groupOrderId;

    this.availableTimes = {};
    this.preparedAt = undefined;

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
    const offsetWithStep = new Date(latestPreparedTimestamp).getMinutes() % this.stepInMinutes;

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

      availableTimes[timestamp] = moment(new Date(timestamp)).format('LT');
    }

    return availableTimes;
  }

  getPreparedAtString(availableTimes, preparedAt) {
    const preparedAtDate = new Date(parseInt(Object.keys(this.availableTimes).filter(
      key => availableTimes[key] === preparedAt
    )[0], 10));

    return moment(preparedAtDate).format('YYYY-MM-DD HH:mm:ss');
  }
}
