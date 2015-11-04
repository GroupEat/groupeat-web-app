export default function timeAgoDirective() {
  return {
    restrict: 'E',
    scope: {date: '='},
    templateUrl: 'support/time-ago.html'
  };
}
