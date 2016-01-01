app.controller('PanelController', ['$scope', '$controller', function ($scope, $controller) {
  'use strict';

  $controller('GameController', {$scope: $scope});

  $scope.init = function () {
    $scope.showPanel = true;
  };
}]);
