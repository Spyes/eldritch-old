angular.element(document).ready(function() {  
  angular.bootstrap(document, ['Eldritch']);
});
angular
  .module('Eldritch', ['ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/lobby');

    $stateProvider
      .state('lobby', {
	url: '/lobby',
	templateUrl: "views/lobby.html",
	controller: "LobbyController as vm"
      })
      .state('start', {
	url: '/start',
	templateUrl: "views/start.html",
	controller: "StartController as vm"
      })
      .state('board', {
	url: '/board',
	templateUrl: "views/board.html",
	controller: "BoardController as vm"
      });
  })
  .run(function ($rootScope) {
    $rootScope.socket = new Socket("/socket", {params: {token: window.userToken}})
    $rootScope.socket.connect()    
  });
