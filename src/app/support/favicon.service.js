import Favico from 'favico.js';

export default class FaviconService {
  constructor() {
    this.favicon = new Favico({bgColor: '#4b9a3e'});
    this.reset();
  }

  increment() {
    this.badge = this.badge + 1;
    this.favicon.badge(this.badge);
  }

  reset() {
    this.badge = 0;
    this.favicon.reset();
  }
}
