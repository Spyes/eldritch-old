app.factory('Database', ['$http', function ($http) {
  'use strict';

  function getCollection(coll) {
    if (coll === undefined || !_.isString(coll))
      return false;
    return $http.get('/api/' + coll.toLowerCase());
  }

  function getInvestigator(inv) {
    return $http.get('/api/get_entity', {params: {investigator: inv}});
  }
  function getAncientOne(ao) {
    return $http.get('/api/get_entity', {params: {ancient_one: ao}});
  }
  
  return {
    getCollection: getCollection,
    getInvestigator: getInvestigator,
    getAncientOne: getAncientOne
  };
}]);
