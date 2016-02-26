angular
  .module('Eldritch')
  .controller('StartController', StartController);

function StartController($controller, $rootScope) {
  var vm = this;
  $controller('GameController', {$scope: vm});

  vm.clickInvestigator = function (investigator) {
    vm.selected_investigator = investigator;
  };
  vm.accept = function () {
    if (!vm.selected_investigator && !vm.username) return;
    console.log(vm.username);
    $rootScope.channel.push("player_ready", {username: vm.username, investigator: vm.selected_investigator});
    $rootScope.channel.push("get_username", {});
    $rootScope.channel.on("sent_username", function (payload) {
      console.log(payload);
    });
  };
  vm.init = function () {
    vm.selected_investigator = undefined;
    vm.username = undefined;
    $rootScope.channel.on("all_players_ready", function (payload) {
      $location.go('/game');
    });
  };
}
