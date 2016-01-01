app.controller('GameController', ['$scope', '$routeParams', '$rootScope', 'Collections', 'mommy', function ($scope, $routeParams, $rootScope, CD, mommy) {
  'use strict';

  function moveInvestigator(investigator, location) {
    var currLocation = CD.findByName('locations', investigator.current_location);
    if (!canMoveTo(currLocation, location)) return;
  }
  
  $scope.locationCoords = function (location) {
    if (location === undefined) { return ""; }
    var c = location.coords;
    var type = location.type;
    var r = 23;
    if (type.toLowerCase().indexOf("major") > -1 ||
        type.toLowerCase().indexOf("expedition") > -1) {
      r = 80;
    }
    // TODO : Maybe store this in DB?
    location.coords.r = r;
    return c.x + "," + c.y + "," + r;
  };

  $scope.getLocationInfoStyle = function (location) {
    if (location === undefined) { return {}; }
    var coords = location.coords;
    var left = coords.x - coords.r;
    var top = coords.y;
    var style = {
      "position": "absolute",
      "background-color": "white",
      "left": left + "px",
      "top": top + "px"
    };
    return style;
  };

  $scope.clickLocation = function (location) {
    $scope.fsm.emit('onClickLocation', [location]);
  };
  
  function setupPlayer(player) {
    player.investigator.current_location = player.investigator.starting_location;
  }
  
  $scope.init = function () {
    $scope.GODMODE = false;
    $scope.player = {
      investigator: CD.findByName($rootScope.investigators, $routeParams.investigator),
    };
    $scope.game = {
      ancient_one: CD.findByName($rootScope.ancient_ones, $routeParams.ancient_one),
      players: [$scope.player]
    };
    $scope.fsm = new Stately();
    var states = {
      action: {
	onClickLocation: function (location) {
	  if (!mommy.canPlayerDoAction($scope.player, 'move')) return;
	  moveInvestigator($scope.player.investigator, location);
	}
      }
    };
    $scope.fsm.create({
      initialState: 'action',
      states: states
    });
    setupPlayer($scope.player);
  };
}]);
