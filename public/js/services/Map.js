angular.module('eldritch')
  .factory('Map', Map);
function Map() {
  'use strict';

  function locationCoords(location) {
    if (location === undefined) { return ""; }
    var c = location.coords;
    var type = location.type;
    var r = 23;
    if (type.toLowerCase().indexOf("major") > -1 ||
        type.toLowerCase().indexOf("expedition") > -1) {
      r = 80;
    }
    // TODO : Maybe store this in DB?
    location.coords.r = r;
    return c.x + "," + c.y + "," + r;
  };

  function getLocationStyle(location) {
    if (location === undefined) { return {}; }
    var coords = location.coords;
    var left = coords.x - coords.r;
    var top = coords.y;
    var style = {
      "position": "absolute",
      "background-color": "white",
      "left": left + "px",
      "top": top + "px"
    };
    return style;
  };

  
  return {
    locationCoords: locationCoords,
    getLocationStyle: getLocationStyle
  };
};
