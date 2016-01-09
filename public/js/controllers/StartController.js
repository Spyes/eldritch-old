angular
  .module('eldritch')
  .controller('StartController', StartController);

function StartController($rootScope, $location, Database) {
  'use strict';

  var vm = this;

  vm.startGame = function () {
    if (!vm.selected_investigator || !vm.selected_ancient_one) return;
    $location.path('/board').search({investigator: vm.selected_investigator,
                                     ancient_one: vm.selected_ancient_one});
  };

  vm.clickInvestigator = function (investigator) {
    vm.selected_investigator = investigator.name;
  };
  vm.clickAncientOne = function (ancient_one) {
    vm.selected_ancient_one = ancient_one.name;
  };

  vm.init = function () {
    vm.selected_investigator = undefined;
    vm.selected_ancient_one = undefined;
  };
};
