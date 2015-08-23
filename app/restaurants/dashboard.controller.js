export default class DashboardController {
  constructor($q, $mdSidenav, restaurant) {
    'ngInject';

    this.$q = $q;
    this.$mdSidenav = $mdSidenav;
    this.restaurant = restaurant;

    this.menuItems = ['foo', 'bar', 'baz'];
  }

  toggleSidenav() {
    this.$q.when(true).then(() => this.$mdSidenav('left').toggle());
  }
}
