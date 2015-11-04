export default function titleFilter($filter) {
  'ngInject';

  return input => $filter('capitalize')($filter('translate')(input), 'first');
}
