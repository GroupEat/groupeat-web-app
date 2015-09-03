import _ from 'lodash';
import Money from '../support/money.js';

export default class OrdersController {
  constructor(auth, restaurantsService) {
    'ngInject';

    restaurantsService.getGroupOrders(auth.getUserId()).then(groupOrders => {
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
