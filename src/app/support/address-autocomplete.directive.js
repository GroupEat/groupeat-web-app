/* global google */
export default function addressAutocompleteDirective() {
  const autocompleter = new google.maps.places.AutocompleteService();
  const geocoder = new google.maps.Geocoder();

  function predict(input) {
    return new Promise(resolve => {
      if (input) {
        autocompleter.getPlacePredictions({ input }, data => {
          resolve(data || []);
        });
      } else {
        resolve([]);
      }
    });
  }

  function search(input) {
    return predict(input).then(predictions => predictions.map(prediction => ({
      text: prediction.description,
      placeId: prediction.place_id,
    })));
  }

  function placeToAddress(placeId) {
    return new Promise(resolve => {
      geocoder.geocode({ placeId }, places => {
        const place = places[0];

        resolve({
          googlePlaceId: placeId,
          street: place.formatted_address.split(',')[0],
          formattedAddress: place.formatted_address,
          coordinates: {
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
          },
        });
      });
    });
  }

  return {
    restrict: 'E',
    scope: {
      address: '=',
      required: '=',
    },
    template: require('./address-autocomplete.html'),
    link: (scope) => {
      scope.input = '';
      scope.search = search;
      scope.change = placeId => {
        placeToAddress(placeId).then(address => {
          scope.address = address;
        });
      };
    },
  };
}
