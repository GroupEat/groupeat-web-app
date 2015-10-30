import _ from 'lodash';
import io from 'socket.io-client';

export default class SocketService {
  constructor(notifier, auth) {
    'ngInject';

    this.notifier = notifier;
    this.listeners = [];
    this.queuedListeners = [];

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

  on(events, action, callback) {
    (_.isArray(events) ? events : [events]) .map(event => {
      this.queueListener(event, action, callback);
    });

    if (this.socket) {
      this.attachQueuedListeners();
    }

    return this;
  }

  queueListener(event, action, callback) {
    const isSame = listener => {
      return listener.event === event && listener.action === action;
    };

    const sameListener = this.queuedListeners.find(isSame);

    if (sameListener) {
      sameListener.callback = callback;
    } else {
      this.queuedListeners.push({event, action, callback});
    }
  }

  attachQueuedListeners() {
    this.queuedListeners.forEach(queuedListener => {
      const isSame = listener => {
        return listener.event === queuedListener.event && listener.action === queuedListener.action;
      };

      const sameListener = this.listeners.find(isSame);

      if (sameListener) {
        sameListener.callback = queuedListener.callback;
      } else {
        const listener = this.listeners[this.listeners.push(queuedListener) - 1];
        this.socket.on(queuedListener.event, () => {
          this.notifier.notify();
          listener.callback();
        });
      }
    });

    this.queuedListeners = [];
  }
}
