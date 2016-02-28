angular
  .module('Eldritch')
  .controller('BoardController', BoardController);

function BoardController($controller, $rootScope, Map) {
  var vm = this; 
  $controller('GameController', {$scope: vm});

  vm.isLocationInhabited = function (location, entity_type) {
    var res = false;
    switch (entity_type) {
    case 'investigators':
      
      break;
    default:
      break;
    }
    return res;
  };
  vm.locationCoords = function (location) {
    return Map.locationCoords(location);
  };
  vm.getLocationStyle = function (location) {
    return Map.getLocationStyle(location);
  };
  vm.clickLocation = function (location) {
    console.log(location);
  };
}
