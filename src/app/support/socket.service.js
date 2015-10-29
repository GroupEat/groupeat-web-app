import io from 'socket.io-client';

export default class SocketService {
  constructor(auth) {
    'ngInject';

    this.listeners = [];

    if (auth.isLoggedIn()) {
      const socket = io.connect(`${window.location.origin}:3000`);
      socket.on('connect', () => {
        socket.emit('authentication', {token: auth.getToken()});
        socket.on('authenticated', () => {
          this.socket = socket;
          this.attachQueuedListeners();
        });
      });
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    } else {
      this.queueListener(event, callback);
    }

    return this;
  }

  queueListener(event, callback) {
    this.listeners.push({event, callback});
  }

  attachQueuedListeners() {
    this.listeners.map(listener => {
      this.socket.on(listener.event, listener.callback);
    });

    this.listeners = [];
  }
}
