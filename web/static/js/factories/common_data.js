angular
  .module("Eldritch")
  .factory("CommonData", CommonData);

function CommonData($rootScope) {
  'use strict';

  function getByName(coll, name, channel, callback = payload => {}) {
    if ($rootScope[coll]) {
      return _.find($rootScope[coll], entity => {
        return entity.name === name;
      });
    } else {
      getCollection(coll, channel);
      return getByName(coll, name);
    }
  }

  function getCollection(coll, channel, callback = payload => {}) {
    channel.push("get_collection", {coll: coll});
    channel.on("sent_collection", callback);
  }

  function getCollections(collections, channel, callback = payload => {}) {
    collections.forEach(coll => {
      channel.push("get_collection", {coll: coll});
    });
    channel.on("sent_collection", callback);
  }
  
  return {
    getByName: getByName,
    getCollection: getCollection,
    getCollections: getCollections
  };
}
