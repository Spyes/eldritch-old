angular
  .module('Eldritch')
  .controller('GameController', GameController);

function GameController($http, $rootScope) {
  var vm = this;
  vm.investigators = [];
  $rootScope.channel.push("get_investigators", {});
  $rootScope.channel.on("sent_investigators", function (payload) {
    vm.investigators = payload.body;
    $rootScope.$apply();
  });
}
