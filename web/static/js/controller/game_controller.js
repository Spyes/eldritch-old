angular
  .module('Eldritch')
  .controller('GameController', GameController);

function GameController($http, $rootScope, Map) {
  var vm = this;
  
  $rootScope.channel.push("get_collection", {coll: "investigators"});
  $rootScope.channel.push("get_collection", {coll: "locations"});
  $rootScope.channel.on("sent_collection", function (payload) {
    switch (payload.coll) {
    case "investigators":
      $rootScope.investigators = payload.data;
      break;
    case "locations":
      $rootScope.locations = payload.data;
      break;
    default:
      break;
    }
    $rootScope.$apply();
  });
}
