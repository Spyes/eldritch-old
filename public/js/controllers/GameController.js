app.controller('GameController', ['$scope', '$location', 'Database', function ($scope, $location, Database) {
  'use strict';

  $scope.init = function () {
    Database.getInvestigator($location.search.investigator).then(function (res) {
      $scope.investigator = res.data.investigator;
    });
    Database.getAncientOne($location.search.ancient_one).then(function (res) {
      $scope.ancient_one = res.data.ancient_one;
    });
  };
}]);
