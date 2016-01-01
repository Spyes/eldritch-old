app.controller('StartController', ['$scope', '$rootScope', '$location', 'Database', function ($scope, $rootScope, $location, Database) {
  'use strict';

  $scope.startGame = function () {
    if (!$scope.selected_investigator || !$scope.selected_ancient_one) return;
    $location.path('/board').search({investigator: $scope.selected_investigator,
                                    ancient_one: $scope.selected_ancient_one});
  };

  $scope.clickInvestigator = function (investigator) {
    $scope.selected_investigator = investigator.name;
  };
  $scope.clickAncientOne = function (ancient_one) {
    $scope.selected_ancient_one = ancient_one.name;
  };

  $scope.init = function () {
    $scope.selected_investigator = undefined;
    $scope.selected_ancient_one = undefined;
  };
}]);
