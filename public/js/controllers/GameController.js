angular.module('eldritch')
  .controller('GameController', GameController);
function GameController($routeParams, $rootScope, Collections, mommy, Map, util) {
  'use strict';

  var vm = this;

  function moveInvestigator(investigator, location) {
    var currLocation = Collections.findByName('locations', investigator.current_location);
    if (!mommy.canMoveTo(currLocation, location)) return;
    var connections = util.findConnection(currLocation, location, 2);
    if (connections.length > 0) {
      investigator.current_location = location.name;
    }
  }
  
  function setupPlayer(player) {
    player.investigator.current_location = player.investigator.starting_location;
  }

  vm.locationCoords = function (location) {
    return Map.locationCoords(location);
  };

  vm.getLocationStyle = function (location) {
    return Map.getLocationStyle(location);
  };

  vm.clickLocation = function (location) {
    vm.fsm._emit('onClickLocation', [location]);
  };
  
  vm.init = function () {
    vm.GODMODE = false;
    vm.player = {
      investigator: Collections.findByName('investigators', $routeParams.investigator),
    };
    vm.game = {
      ancient_one: Collections.findByName('ancient_ones', $routeParams.ancient_one),
      players: [vm.player]
    };
    vm.fsm = new Stately();
    var states = {
      action: {
        canPlayerDoAction: function (player, action) {
	  return true;
	},
	onClickLocation: function (location) {
	  moveInvestigator(vm.player.investigator, location);
	}
      }
    };
    vm.fsm.create({
      initialState: 'action',
      states: states
    });
    setupPlayer(vm.player);
  };
};
