angular.module('eldritch')
  .factory('util', util);
function util(Collections) {
  'use strict';
  
  function findConnection_tail(loc1, loc2, max_steps, cur_step, connections, thru_type) {
    if (loc1 === undefined || loc2 === undefined) return;
    _.forEach(loc1.connections, function (connection, type) {
      if (_.includes(connection, loc2.name)) {
	if (thru_type !== undefined) connections.push(thru_type);
	connections.push(type);
      }
    });
    if (cur_step === max_steps) return;
    var location;
    _.forEach(loc1.connections, function (locations, type) {
      _.forEach(locations, function (location_name) {
	location = Collections.findByName('locations', location_name);
	if (location === undefined) return;
	findConnection_tail(location, loc2, max_steps, cur_step + 1, connections, type);
      });
    });
  }

  function findConnection(loc1, loc2, max_steps) {
    var connection_types = [];
    if (loc1 === undefined || loc2 === undefined) return connection_types;
    findConnection_tail(loc1, loc2, max_steps, 1, connection_types);
    return connection_types;
  }
  
  return {
    findConnection: findConnection
  };
};
