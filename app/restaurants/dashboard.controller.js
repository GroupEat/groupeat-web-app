export default class DashboardController {
  constructor($q, $mdSidenav) {
    'ngInject';

    this.$q = $q;
    this.$mdSidenav = $mdSidenav;

    this.menuItems = ['foo', 'bar', 'baz'];
  }

  toggleSidenav() {
    this.$q.when(true).then(() => this.$mdSidenav('left').toggle());
  }
}
