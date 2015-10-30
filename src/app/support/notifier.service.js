export default class NotifierService {
  constructor($window, favicon) {
    'ngInject';

    this.favicon = favicon;

    this.tabFocused = true;
    $window.onfocus = () => {
      this.tabFocused = true;
      this.reset();
    };
    $window.onblur = () => {
      this.tabFocused = false;
    };
  }

  notify() {
    if (!this.tabFocused) {
      new Audio('/sounds/notification.wav').play();
      this.favicon.increment();
    }
  }

  reset() {
    this.favicon.reset();
  }
}
