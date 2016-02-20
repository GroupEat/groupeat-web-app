export default class ApiService {
  constructor(apiBaseUrl, auth, $http) {
    'ngInject';

    this.auth = auth;
    this.$http = $http;
    this.baseUrl = apiBaseUrl;
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

  config(key) {
    if (this.configValues) {
      return Promise.resolve(this.configValues[key]);
    }

    return this.get('config').then(response => {
      this.configValues = response.data.data;

      return this.configValues[key];
    });
  }

  send(method, url, data) {
    const request = {
      method,
      url: `${this.baseUrl}/${url}`,
      headers: {
        Accept: 'application/vnd.groupeat.v1+json',
      },
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
