angular.element(document).ready(function() {  
  angular.bootstrap(document, ['Eldritch']);
});
angular
  .module('Eldritch', ['ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/state1');

    $stateProvider
      .state('state1', {
	url: '/state1',
	templateUrl: "views/game.html",
	controller: "GameController as vm"
      });
  })
  .run(function ($rootScope) {
    $rootScope.socket = new Socket("/socket", {params: {token: window.userToken}})
    $rootScope.socket.connect()
    
    // Now that you are connected, you can join channels with a topic:
    $rootScope.channel = $rootScope.socket.channel("rooms:lobby", {})
    $rootScope.channel.join()
      .receive("ok", resp => { console.log("Joined successfully", resp) })
      .receive("error", resp => { console.log("Unable to join", resp) })
  });
