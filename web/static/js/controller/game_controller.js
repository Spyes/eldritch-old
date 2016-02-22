angular
  .module('Eldritch')
  .controller('GameController', GameController);

function GameController($http, $rootScope) {
  var vm = this;
  vm.investigators = $rootScope.investigators; 

  vm.init = function () {
    $rootScope.channel.push("get_collection", {coll: "investigators"});
    $rootScope.channel.push("get_collection", {coll: "locations"});
    $rootScope.channel.on("sent_collection", function (payload) {
      switch (payload.coll) {
      case "investigators":
	vm.investigators = payload.data;
	break;
      case "locations":
	vm.locations = payload.data;
	break;
      default:
	break;
      }
      $rootScope.$apply();
    });
  }
}
