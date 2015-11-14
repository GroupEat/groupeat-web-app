import _ from 'lodash';
import Address from './address.js';
import Money from '../support/money.js';

export default class GroupOrderController {
  constructor($scope, $stateParams, restaurantsService, socket) {
    'ngInject';

    this.groupOrderId = $stateParams.groupOrderId;
    this.restaurantsService = restaurantsService;

    socket.on($scope, [
      'GroupOrderHasBeenClosed',
      'GroupOrderHasBeenConfirmed',
      'GroupOrderHasBeenJoined'
    ], event => {
      const groupOrderId = event.order ? event.order.groupOrderId : event.groupOrder.id;

      if (groupOrderId === this.groupOrderId) {
        this.loadGroupOrder();

        return true;
      }
    });

    this.loadGroupOrder();
  }

  loadGroupOrder() {
    this.restaurantsService.getGroupOrder(this.groupOrderId).then(groupOrder => {
      this.groupOrder = groupOrder;
      this.productFormats = {};
      this.orders = groupOrder.orders.map(order => {
        order.deliveryAddress = new Address(
          order.deliveryAddress.street,
          order.deliveryAddress.city,
          order.deliveryAddress.details
        );
        order.discountedPrice = new Money(order.discountedPrice);

        order.productFormats.forEach(product => {
          if (!_.has(this.productFormats, product.name)) {
            this.productFormats[product.name] = {};
          }

          product.formats.forEach(format => {
            if (!_.has(this.productFormats, [product.name, format.name])) {
              this.productFormats[product.name][format.name] = 0;
            }

            this.productFormats[product.name][format.name] = this.productFormats[product.name][format.name]
              + format.quantity;
          });
        });

        return order;
      });
    });
  }
}
