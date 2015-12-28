app.factory('Database', ['$http', function ($http) {
  'use strict';

  function getCollection(coll) {
    if (coll === undefined || !_.isString(coll))
      return false;
    return $http.get('/api/' + coll.toLowerCase());
  }

  return {
    getCollection: getCollection
  };
}]);
