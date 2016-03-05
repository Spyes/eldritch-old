angular
  .module('Eldritch')
  .controller('BoardController', BoardController);

function BoardController($controller, $rootScope, Map, $stateParams, CommonData, $scope) {
  'use strict';

  var vm = this; 
  $controller('GameController', {$scope: vm});

  vm.investigators = [];
  vm.locations = {};

  vm.investigatorAt = function (location_name) {
    if (vm.locations[location_name]) return vm.locations[location_name];
    return "";
  };
  
  vm.locationCoords = function (location) {
    return Map.locationCoords(location);
  };

  vm.getLocationStyle = function (location) {
    return Map.getLocationStyle(location);
  };

  vm.clickLocation = function (location_name) {
    $rootScope.channel.push("player_clicked_location", {location_name: location_name});
  };

  $scope.$watch(
    function watchInvestigators(scope) {
      return vm.investigators;
    },
    function handleInvestigatorsChange(n) {
      if (_.isEmpty(n)) return;
      vm.locations = {};
      _.forEach(vm.investigators, investigator => {
        vm.locations[investigator.current_location] = investigator.name;
      });
    }
  );

  vm.init = function () {
    CommonData.getCollections(["locations"], $rootScope.channel, locations => {
      $rootScope.locations = locations.data;
      $rootScope.$apply();
    });
    var params = $stateParams;
    vm.username = params.username;
    vm.investigators = params.investigators;
    _.forEach(vm.investigators, investigator => {
      vm.locations[investigator.current_location] = investigator.name;
    });
  };
}
