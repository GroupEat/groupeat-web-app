export default function timeAgoDirective() {
  return {
    restrict: 'E',
    scope: { date: '=' },
    template: require('./time-ago.html'),
  };
}
