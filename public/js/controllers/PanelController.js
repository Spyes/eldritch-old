angular.module('eldritch')
  .controller('PanelController', PanelController);
function PanelController($scope, $controller) {
  'use strict';

  $controller('GameController', {$scope: $scope});

  $scope.init = function () {
    $scope.showPanel = true;
  };
};
