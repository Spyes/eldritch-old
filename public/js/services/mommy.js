app.factory('mommy', ['util', function (util) {
  'use strict';

  function canMoveTo(player, src, dest) {
    if (player === undefined || src === undefined || dest === undefined) return false;
    var connection = util.findConnection(src, dest);
  }

  return {
    canMoveTo: canMoveTo
  };
}]);
