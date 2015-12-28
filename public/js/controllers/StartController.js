app.controller('StartController', ['$scope', 'Database', function ($scope, Database) {
  'use strict';

  $scope.startGame = function () {
    
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
