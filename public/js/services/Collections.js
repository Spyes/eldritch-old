angular.module('eldritch')
  .factory('Collections', Collections);
function Collections($rootScope) {
  function findByName(collection, name) {
    return _.find($rootScope[collection], {name: name});
  }

  return {
    findByName: findByName
  };
};
