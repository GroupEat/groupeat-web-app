import _ from 'lodash';
import io from 'socket.io-client';

export default class SocketService {
  constructor(broadcastUrl, notifier, auth) {
    'ngInject';

    this.notifier = notifier;
    this.listeners = [];
    this.queuedListeners = [];

    if (auth.isLoggedIn()) {
      const socket = io.connect(broadcastUrl);
      socket.on('connect', () => {
        socket.emit('authentication', { token: auth.getToken() });
        socket.on('authenticated', () => {
          this.socket = socket;
          this.attachListeners();
        });
      });
    }
  }

  on($scope, events, callback) {
    (_.isArray(events) ? events : [events]).forEach(event => {
      this.addListener($scope, event, callback);
    });

    if (this.socket) {
      this.attachListeners();
    }

    return this;
  }

  addListener($scope, event, callback) {
    const wrappedCallback = this.wrapCallback(event, callback);
    this.queuedListeners.push({ event, callback: wrappedCallback });

    $scope.$on('$destroy', () => {
      const listenerStillQueuedIndex = this.queuedListeners.findIndex(
        listener => listener.event === event && listener.callback === wrappedCallback
      );

      if (listenerStillQueuedIndex > -1) {
        this.queuedListeners.splice(listenerStillQueuedIndex);
      } else if (this.socket) {
        this.socket.removeListener(event, wrappedCallback);
      }
    });
  }

  attachListeners() {
    this.queuedListeners.forEach(listener => {
      this.listeners.push(listener);
      this.socket.on(listener.event, listener.callback);
    });

    this.queuedListeners = [];
  }

  wrapCallback(eventName, callback) {
    return event => {
      const needToNotify = callback(event);

      if (needToNotify === true) {
        this.notifier.notify();
      }
    };
  }
}
