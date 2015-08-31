export default class DashboardController {
  constructor($q, $mdSidenav, restaurant) {
    'ngInject';

    this.$q = $q;
    this.$mdSidenav = $mdSidenav;
    this.restaurant = restaurant;

    this.menuItems = [
      {
        state: 'dashboard.currentOrders',
        icon: 'schedule'
      },
      {
        state: 'dashboard.pushExternalOrder',
        icon: 'group_add'
      }
    ];
  }

  toggleSidenav() {
    this.$q.when(true).then(() => this.$mdSidenav('left').toggle());
  }
}
