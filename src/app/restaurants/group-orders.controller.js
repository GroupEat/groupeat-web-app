import _ from 'lodash';
import Money from '../support/money';

export default class GroupOrdersController {
  constructor($scope, $state, auth, restaurantsService, socket) {
    'ngInject';

    this.$state = $state;
    this.auth = auth;
    this.restaurantsService = restaurantsService;

    socket.on($scope, [
      'GroupOrderHasBeenClosed',
      'GroupOrderHasBeenCreated',
      'GroupOrderHasBeenConfirmed',
      'GroupOrderHasBeenJoined',
    ], () => {
      this.loadGroupOrders();

      return true;
    });

    this.loadGroupOrders();
  }

  loadGroupOrders() {
    this.restaurantsService.getGroupOrders(this.auth.getUserId()).then(groupOrders => {
      this.groupOrders = _.sortBy(groupOrders.map(groupOrder => {
        groupOrder.productFormatsCount = _.sumBy(groupOrder.orders, order =>
            _.sumBy(order.productFormats, productFormat =>
                _.sumBy(productFormat.formats, 'quantity')
            )
        );

        groupOrder.totalDiscountedPrice = new Money(groupOrder.totalRawPrice)
          .applyDiscount(groupOrder.discountRate);

        return groupOrder;
      }), 'createdAt').reverse();
    });
  }

  goToOrder(groupOrder) {
    if (groupOrder.closedAt) {
      this.$state.go('dashboard.groupOrder', { groupOrderId: groupOrder.id });
    }
  }
}
