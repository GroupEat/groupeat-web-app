import _ from 'lodash';
import Money from '../support/money.js';

export default class OrdersController {
  constructor(auth, restaurantsService, socket) {
    'ngInject';

    this.auth = auth;
    this.restaurantsService = restaurantsService;

    socket.on([
      'GroupOrderHasBeenClosed',
      'GroupOrderHasBeenCreated',
      'GroupOrderHasBeenConfirmed',
      'GroupOrderHasBeenJoined'
    ], 'reloadGroupOrders', () => {
      this.loadGroupOrders();
    });

    this.loadGroupOrders();
  }

  loadGroupOrders() {
    this.restaurantsService.getGroupOrders(this.auth.getUserId()).then(groupOrders => {
      this.groupOrders = _.sortBy(groupOrders.map(groupOrder => {
        groupOrder.productFormatsCount = _.sum(groupOrder.orders, order =>
            _.sum(order.productFormats, productFormat =>
                _.sum(productFormat.formats, 'quantity')
            )
        );

        groupOrder.totalDiscountedPrice = new Money(groupOrder.totalRawPrice).applyDiscount(groupOrder.discountRate);

        return groupOrder;
      }), 'createdAt').reverse();
    });
  }
}
