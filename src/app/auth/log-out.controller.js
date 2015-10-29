export default class LogOutController {
  constructor($state, auth) {
    'ngInject';

    auth.logOut();
  }
}
