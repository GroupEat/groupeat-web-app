export default class ApiService {
  constructor(auth, $http) {
    'ngInject';

    this.auth = auth;
    this.$http = $http;
  }

  get(url) {
    return this.send('GET', url, {});
  }

  post(url, data) {
    return this.send('POST', url, data);
  }

  put(url, data) {
    return this.send('PUT', url, data);
  }

  patch(url, data) {
    return this.send('PATCH', url, data);
  }

  delete(url, data) {
    return this.send('DELETE', url, data);
  }

  send(method, url, data) {
    let request = {
      method,
      url: `/api/${url}`,
      headers: {
        Accept: 'application/vnd.groupeat.v1+json'
      }
    };

    if (method !== 'GET') {
      request.data = data;
    }

    if (this.auth.isLoggedIn()) {
      request.headers.Authorization = `Bearer ${this.auth.getToken()}`;
    }

    return this.$http(request);
  }
}
