import _ from 'lodash';

export default function orderedProductFormatsDirective() {
  function formatForBackend(selectedFormats) {
    const ordered = {};

    selectedFormats.forEach(productFormat => {
      const formatId = productFormat.id;

      if (!ordered[formatId]) {
        ordered[formatId] = 0;
      }

      ordered[formatId] = ordered[formatId] + 1;
    });

    return ordered;
  }

  function simplifyForComparison(text) {
    return _.deburr(text.toLocaleLowerCase());
  }

  return {
    restrict: 'E',
    scope: {
      available: '=',
      ordered: '=',
    },
    template: require('./ordered-product-formats.html'),
    link: scope => {
      scope.input = '';
      scope.selectedItem = null;
      scope.selectedFormats = [];
      scope.$watch('selectedFormats', selectedFormats => {
        scope.ordered = formatForBackend(selectedFormats);
      }, true);
      scope.transformChip = chip => {
        const newChip = Object.assign({}, chip);
        // To support multi selection of the same format, the chips must be different.
        newChip.random = Math.random();
        return newChip;
      };
      scope.search = input => {
        const query = simplifyForComparison(input);

        return scope.available.filter(format => simplifyForComparison(format.text).includes(query));
      };
    },
  };
}
