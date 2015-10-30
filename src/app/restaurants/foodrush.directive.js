const tickInSeconds = 1;

export default function foodrushDirective() {
  return {
    restrict: 'E',
    scope: {groupOrder: '='},
    controller: ($scope, $timeout) => {
      'ngInject';

      const groupOrder = $scope.groupOrder;

      if (groupOrder.closedAt) {
        $scope.over = true;
        $scope.closedAt = new Date(groupOrder.closedAt);
      } else {
        $scope.over = false;
        $scope.createdAt = new Date(groupOrder.createdAt);
        $scope.endingAt = new Date(groupOrder.endingAt);
        const foodrushInSeconds = $scope.endingAt - $scope.createdAt;

        const refresh = () => {
          const elapsedSeconds = new Date() - $scope.createdAt;
          $scope.progress = Math.round(100 * Math.min(elapsedSeconds / foodrushInSeconds, 1));
          $timeout(refresh, 1000 * tickInSeconds);
        };

        refresh();
      }
    },
    templateUrl: 'restaurants/foodrush.html'
  };
}


