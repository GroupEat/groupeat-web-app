import _ from 'lodash';

export default class PushExternalOrderController {
  constructor($state, auth, popup, restaurantsService) {
    'ngInject';

    this.$state = $state;
    this.auth = auth;
    this.popup = popup;
    this.restaurantsService = restaurantsService;

    this.customer = {};
    this.orderedProductFormats = {};
    this.deliveryAddress = {};
    this.deliveryAddressDetails = '';
    this.comment = '';
    this.loadAvailableProductFormats();
  }

  loadAvailableProductFormats() {
    this.availableProductFormats = [];

    return this.restaurantsService.getProductFormats(this.auth.getUserId()).then(productFormats => {
      this.availableProductFormats = productFormats;
    });
  }

  pushOrder() {
    const customer = _.cloneDeep(this.customer);
    customer.phoneNumber = `33${customer.phoneNumber.substring(1)}`;

    const { street, coordinates } = this.deliveryAddress;
    const deliveryAddress = {
      street,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      details: this.deliveryAddressDetails,
    };

    this.restaurantsService.pushExternalOrder(
      this.auth.getUserId(),
      customer,
      this.orderedProductFormats,
      deliveryAddress,
      this.comment
    )
      .then(() => { this.$state.go('dashboard.groupOrders'); })
      .catch(response => { this.popup.fromResponse(response); });
  }
}
