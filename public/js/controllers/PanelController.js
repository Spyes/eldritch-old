angular
  .module('eldritch')
  .controller('PanelController', PanelController);

function PanelController($controller) {
  'use strict';

  var vm = this;

  $controller('GameController', {$scope: vm});

  vm.init = function () {
    vm.showPanel = true;
  };
};
