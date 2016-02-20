export default class LogOutController {
  constructor(auth) {
    'ngInject';

    auth.logOut();
  }
}
