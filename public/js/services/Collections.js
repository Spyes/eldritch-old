app.factory('Collections', [function () {
  function findByName(collection, name) {
    return _.find(collection, {name: name});
  }

  return {
    findByName: findByName
  };
}]);
