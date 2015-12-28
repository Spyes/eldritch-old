var app = angular.module('eldritch', ['ngRoute', 'ui.bootstrap']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  'use strict';
  $routeProvider.when('/start', {
    templateUrl: 'views/start.html',
    controller: 'StartController'
  }).when('/board', {
    templateUrl: 'views/board.html',
    controller: 'GameController'
  }).otherwise({redirectTo: '/start'});

  $locationProvider.html5Mode(true);
}]);
