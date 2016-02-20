import _ from 'lodash';
import Money from '../support/money.js';
import PhoneNumber from '../support/phone-number.js';

const ENDPOINT = 'restaurants';

export default class RestaurantsService {
  constructor(api) {
    'ngInject';

    this.api = api;
  }

  get(restaurantId) {
    return this.api.get(`${ENDPOINT}/${restaurantId}`)
      .then(response => response.data.data);
  }

  getProductFormats(restaurantId) {
    return this.api.get(`${ENDPOINT}/${restaurantId}/products?include=formats`)
      .then(response => {
        return _.flatten(response.data.data.map(product => {
          return product.formats.data.map(format => {
            format.product = _.pick(product, ['id', 'name', 'description']);
            format.text = `${_.capitalize(product.name)} - ${format.name} (${new Money(format.price)})`;

            return format;
          });
        }));
      });
  }

  pushExternalOrder(restaurantId, customer, productFormats, deliveryAddress, comment) {
    return this.api.post(
      `${ENDPOINT}/${restaurantId}/externalOrders`,
      {customer, productFormats, deliveryAddress, comment}
    );
  }

  getGroupOrders(restaurantId) {
    return this.api.get(`${ENDPOINT}/${restaurantId}/groupOrders?include=orders.productFormats`)
      .then(response => response.data.data.map(this.flattenGroupOrder));
  }

  getGroupOrder(groupOrderId) {
    return this.api.get(
      `groupOrders/${groupOrderId}?include=orders.productFormats,orders.customer,orders.deliveryAddress,orders.restaurantPromotions`
    ).then(response => this.flattenGroupOrder(response.data.data));
  }

  flattenGroupOrder(groupOrder) {
    groupOrder.orders = groupOrder.orders.data.map(order => {
      if (order.customer) {
        order.customer = order.customer.data;
        order.customer.phoneNumber = new PhoneNumber(order.customer.phoneNumber);
      }

      if (order.deliveryAddress) {
        order.deliveryAddress = order.deliveryAddress.data;
      }

      order.productFormats = order.productFormats.data.map(productFormat => {
        productFormat.formats = productFormat.formats.data;

        return productFormat;
      });

      order.promotions = [];

      if (order.restaurantPromotions) {
        order.promotions = order.restaurantPromotions.data.map(restaurantPromotion => {
          return restaurantPromotion.name;
        });
      }

      return order;
    });

    groupOrder.unconfirmed = !groupOrder.confirmed && groupOrder.closedAt;

    return groupOrder;
  }
}
