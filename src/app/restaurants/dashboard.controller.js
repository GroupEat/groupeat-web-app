export default class DashboardController {
  constructor($q, $mdSidenav, auth, restaurantsService) {
    'ngInject';

    this.$q = $q;
    this.$mdSidenav = $mdSidenav;

    this.menuItems = [
      {
        state: 'dashboard.groupOrders',
        icon: 'history',
      },
      {
        state: 'dashboard.pushExternalOrder',
        icon: 'add_circle_outline',
      },
    ];

    restaurantsService.get(auth.getUserId()).then(restaurant => {
      this.restaurant = restaurant;
    });
  }

  toggleSidenav() {
    this.$q.when(true).then(() => this.$mdSidenav('left').toggle());
  }
}
