angular.module('eldritch', ['ngRoute', 'ui.bootstrap'])
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    'use strict';
    $routeProvider.when('/start', {
      templateUrl: 'views/start.html',
      controller: 'StartController',
      controllerAs: 'start'
    }).when('/board', {
      templateUrl: 'views/game.html',
      controller: 'GameController',
      controllerAs: 'game'
    }).otherwise({redirectTo: '/start'});
    
    $locationProvider.html5Mode(true);
  }]).run(['$rootScope', 'Database', function ($rootScope, Database) {
    /*
      $rootScope.ws = new WebSocket('ws://localhost:8081');

      $rootScope.ws.onopen = function () {
      $rootScope.ws.send(JSON.stringify({get: 'investigators'}));
      $rootScope.ws.send(JSON.stringify({get: 'ancient_ones'}));
      $rootScope.ws.send(JSON.stringify({get: 'locations'}));
      };

      $rootScope.ws.onmessage = function (evt) {
      if (evt.data && JSON.parse(evt.data)) {
      var r = JSON.parse(evt.data);
      if (r.collection) {
      $rootScope[r.collection] = r.data;
      $rootScope.$apply();
      }
      }
      };
    */
    Database.getCollection('investigators');
    Database.getCollection('ancient_ones');
    Database.getCollection('locations');
  }]);
