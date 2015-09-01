import _ from 'lodash';
import Money from '../support/money.js';

const ENDPOINT = 'restaurants';

export default class RestaurantsService {
  constructor(api) {
    'ngInject';

    this.api = api;
  }

  get(id) {
    return this.api.get(`${ENDPOINT}/${id}`)
      .then(response => response.data.data);
  }

  getProductFormats(id) {
    return this.api.get(`${ENDPOINT}/${id}/products?include=formats`)
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

  pushExternalOrder(id, customer, productFormats, deliveryAddress, comment) {
    return this.api.post(
      `${ENDPOINT}/${id}/externalOrders`,
      {customer, productFormats, deliveryAddress, comment}
    );
  }

  getGroupOrders(id) {
    return this.api.get(`${ENDPOINT}/${id}/groupOrders?include=orders.productFormats`)
      .then(response => {
        return response.data.data.map(groupOrder => {
          groupOrder.orders = groupOrder.orders.data.map(order => {
            order.productFormats = order.productFormats.data.map(productFormat => {
              productFormat.formats = productFormat.formats.data;

              return productFormat;
            });

            return order;
          });

          return groupOrder;
        });
      });
  }
}
