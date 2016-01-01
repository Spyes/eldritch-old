app.factory('mommy', ['util', function ('util') {
  'use strit';

  function canPlayerDoAction(player, action) {
    if (player === undefined || actcion === undefined) return false;
    if (player.delayed) return false;
    if (action === 'move') {
      if (player.actions_taken.count >= 2 ||
	  (player.actions_taken.moves === 1 && connection.distance >= 2))
	return false;
    }
  }

  function canMoveTo(player, src, dest) {
    if (player === undefined || location === undefined) return false;
    var connection = findConnection(src, dest);
  }

  return {
    canPlayerDoAction: canPlayerDoAction,
    canMoveTo: canMoveTo
  };
}]);
