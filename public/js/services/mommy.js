angular.module('eldritch')
  .factory('mommy', mommy);
function mommy() {
  'use strict';

  function canMoveTo(src, dest) {
    if (src === undefined || dest === undefined) return false;
    return true;
//    return false;
  }

  return {
    canMoveTo: canMoveTo
  };
};
