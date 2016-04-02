import _ from 'lodash';

export default class MadeUpGroupOrdersController {
  constructor(api, popup, restaurantsService) {
    'ngInject';

    this.api = api;
    this.popup = popup;

    restaurantsService.list().then(restaurants => {
      this.restaurants = restaurants;
    });

    this.initialDiscountRate = 20;
    const now = new Date();
    now.setHours(now.getHours() + 1, 0, 0, 0);
    this.endingAt = now;
  }

  makeUpGroupOrder() {
    this.api
      .post(`restaurants/${this.restaurant.id}/madeUpGroupOrders`, _.pick(this, [
        'endingAt',
        'initialDiscountRate',
      ]))
      .then(() => this.popup.defaultContentOnly('groupOrderMadeUpSuccessfully'))
      .catch(response => { this.popup.fromResponse(response); });
  }
}
