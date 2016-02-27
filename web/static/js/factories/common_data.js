angular
  .module("Eldritch")
  .factory("CommonData", CommonData);

function CommonData() {
  function getCollection(coll, channel, callback = function(payload){}) {
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
    getCollection: getCollection,
    getCollections: getCollections
  };
}
