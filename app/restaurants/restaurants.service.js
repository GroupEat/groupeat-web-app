import _ from 'lodash';

const ENDPOINT = 'restaurants';

export default class Restaurants {
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

            const price = (parseFloat(format.price) / 100).toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            });
            format.text = `${_._.capitalize(product.name)} - ${format.name} (${price})`;

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
}
