app.controller('StartController', ['$scope', '$location', 'Database', function ($scope, $location, Database) {
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
    Database.getCollection('ancient_ones').then(function (res) {
      $scope.AncientOnes = res.data.ancient_ones;
    });
    Database.getCollection('investigators').then(function (res) {
      $scope.Investigators = res.data.investigators;
    });
    $scope.selected_investigator = undefined;
    $scope.selected_ancient_one = undefined;
  };
}]);
