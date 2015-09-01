/* global google */
import _ from 'lodash';

export default class PushExternalOrderController {
  constructor($q, $state, auth, popup, restaurantsService, productFormats) {
    'ngInject';

    this.addressAutocompleter = new google.maps.places.AutocompleteService();
    this.geocoder = new google.maps.Geocoder();

    this.$q = $q;
    this.$state = $state;
    this.auth = auth;
    this.popup = popup;
    this.restaurantsService = restaurantsService;
    this.availableProductFormats = productFormats;

    this.customer = {};
    this.productFormats = [{format: {}, quantity: 1}];
    this.deliveryAddress = {};
    this.deliveryAddressDetails = '';
    this.comment = '';
  }

  filterProductFormats(input) {
    const selectedIds = this.productFormats
      .filter(selectedProductFormat => _.has(selectedProductFormat, 'format.id'))
      .map(selectedProductFormat => selectedProductFormat.format.id);

    const availableProductFormats = this.availableProductFormats
      .filter(productFormat => selectedIds.indexOf(productFormat.id) === -1);

    return !input ? availableProductFormats : availableProductFormats
      .filter(productFormat => productFormat.text.toLowerCase().includes(input.toLowerCase()));
  }

  productFormatChanged(index, format, quantity) {
    if (format && index === (this.productFormats.length - 1)) {
      this.productFormats[index] = {format, quantity};
      this.productFormats.push(this.getEmptyProductFormat());
    }
  }

  removeProductFormat(index) {
    this.productFormats.splice(index, 1);
  }

  getEmptyProductFormat() {
    return {
      format: {},
      quantity: 1
    };
  }

  getProductFormatsInBackendFormat() {
    const productFormats = {};

    this.productFormats.forEach(productFormat => {
      if (_.has(productFormat, 'format.id') && productFormat.quantity) {
        productFormats[productFormat.format.id] = productFormat.quantity;
      }
    });

    return productFormats;
  }

  searchAddress(input) {
    const deferred = this.$q.defer();

    this.predictAddress(input).then(predictions => {
      deferred.resolve(predictions.map(prediction => {
        return {
          text: prediction.description,
          placeId: prediction.place_id
        };
      }));
    });

    return deferred.promise;
  }

  predictAddress(input) {
    const deferred = this.$q.defer();

    if (input) {
      this.addressAutocompleter.getPlacePredictions({input}, data => {
        deferred.resolve(data || []);
      });
    } else {
      deferred.resolve([]);
    }

    return deferred.promise;
  }

  deliveryAddressChanged() {
    // nothing to do
  }

  pushOrder() {
    const customer = _.cloneDeep(this.customer);
    customer.phoneNumber = `33${customer.phoneNumber.substring(1)}`;

    const productFormats = this.getProductFormatsInBackendFormat();

    this.geocoder.geocode({placeId: this.deliveryAddress.placeId}, places => {
      const place = places[0];
      const deliveryAddress = {
        street: place.formatted_address.split(',')[0],
        details: this.deliveryAddressDetails,
        latitude: place.geometry.location.G,
        longitude: place.geometry.location.K
      };

      this.restaurantsService.pushExternalOrder(
        this.auth.getUserId(),
        customer,
        productFormats,
        deliveryAddress,
        this.comment
      )
        .then(() => {
          this.$state.go('dashboard.orders');
        }, response => {
          this.popup.fromResponse(response);
        });
    });
  }

}
