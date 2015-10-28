import _ from 'lodash';
import Money from '../support/money.js';
import io from 'socket.io-client';

export default class OrdersController {
  constructor($state, auth, restaurantsService) {
    'ngInject';

    const socket = io.connect(`${window.location.origin}:3000`);
    socket.on('connect', () => {
      socket.emit('authentication', {token: auth.getToken()});
      socket.on('authenticated', () => {
        socket.on('GroupOrderHasBeenCreated', event => {
          $state.go($state.current, {}, {reload: true});
        });
      });
    });

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
