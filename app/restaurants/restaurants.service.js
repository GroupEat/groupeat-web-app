const ENDPOINT = 'restaurants';

export default class Restaurants {
  constructor(api) {
    'ngInject';

    this.api = api;
  }

  get(id) {
    return this.api.get(`${ENDPOINT}/${id}`)
      .then(response => response.data.data);
  }
}
