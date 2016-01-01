app.factory('util', [function () {
  'use strict';

  function findConnection (loc1, loc2) {
    if (loc1 === undefined || loc2 === undefined) return false;
  }

  return {
    findConnection: findConnection
  };
}]);
