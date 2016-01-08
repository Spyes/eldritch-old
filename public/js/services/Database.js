angular.module('eldritch')
  .factory('Database', Database);
function Database($http, $rootScope) {
  'use strict';

  function getCollection(coll) {
    if (coll === undefined || !_.isString(coll))
      return false;
    $http.get('/api/' + coll.toLowerCase()).then(function (res) {
      $rootScope[coll] = res.data.coll;
    });
  }
  
  return {
    getCollection: getCollection
  };
};
