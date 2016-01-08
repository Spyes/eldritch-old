function Stately(params) {
  'use strict';

  var stately = this;
  stately.current_state = "";

  stately.create = function (create_params) {
    if (create_params === undefined) return;
    if (create_params.states && typeof create_params.states === "object")
      stately.states = create_params.states;
    if (create_params.initialState && typeof create_params.initialState === "string")
      stately._transition(create_params.initialState);
    if (create_params.transitions && _.isArray(create_params.transitions))
      stately.transitions = create_params.transitions;
    if (create_params.globals && _.isObject(create_params.globals))
      stately.globals = create_params.globals;
  };

  if (params !== undefined && typeof params === "object")
    stately.create(params);

  function getCurrentState() {
    return _.result(stately.states, stately.current_state);
  }

  function getCurrentStateName() {
    return _.first(stately.current_state.split('.'));
  }

  function inSubstate() {
    return !_.isEmpty(getCurrentSubstateName().replace(/ /g, ''));
  }

  function getCurrentSubstateName() {
    if (stately.current_state.split('.').length < 2) // no substate
      return '';
    return _.last(stately.current_state.split('.'));
  }
  
  function callOnEnter(state, onEnterParams) {
    if (state === undefined) state = getCurrentState();
    if (state._onEnter === undefined ||	typeof state._onEnter !== "function") return;
    if (onEnterParams === undefined) onEnterParams = [];
    return state._onEnter.apply(stately, Array.prototype.slice.call(onEnterParams));
  }

  function callOnExit(state, onExitParams) {
    if (state === undefined) return;
    if (state._onExit === undefined || typeof state._onExit !== "function") return;
    if (onExitParams === undefined) onExitParams = [];
    return state._onExit.apply(stately, Array.prototype.slice.call(onExitParams));
  }

  function getState(state) {
    return _.result(stately.states, state);
  }

  function findTransition(from) {
    return _.find(stately.transitions, {from: from});
  }
  
  function transition(to_state, enter_params, exit_params, type) {
    if (to_state === undefined) {
      var found;
      if ((found = findTransition(getCurrentStateName()))) {
	to_state = found.to;
      } else {
	console.log("ERROR! No state specified and no transition exists");
	return;
      }
    }
    if (typeof to_state !== "string") {
      console.log("ERROR! state name must be a string!");
      return;
    }
    if (type === undefined) {
      console.log("ERROR! No transition type specified");
      return;
    }
    var old_state = getCurrentState();
    if (type === "state") {
      if (getState(to_state) === undefined) {
	console.log("ERROR! No such state!");
	return;
      }
      stately.current_state = to_state;
      callOnExit(old_state, exit_params);
    } else if (type === "substate") {
      if (old_state[to_state] === undefined) {
	console.log("ERROR! No such substate!");
	return;
      }
      stately.current_state = stately.current_state + '.' + to_state;
    }
    callOnEnter(getCurrentState(), enter_params);
  }

  stately._emit = function (func, func_params) {
    if (func === undefined) {
      console.log("ERROR! No function supplied");
      return;
    }
    if (func_params === undefined) func_params = [];
    var cur_state = getCurrentState();
    if (cur_state[func] === undefined) {
      if (!inSubstate() && stately.globals.states[func]) {
	return stately.globals.states[func].apply(getCurrentState(), Array.prototype.slice.call(func_params));
      } else if (inSubstate() && stately.globals.substates[func]) {
	return stately.globals.substates[func].apply(getCurrentState(), Array.prototype.slice.call(func_params));
      } else if (stately.globals.all[func]) {
	return stately.globals.all[func].apply(getCurrentState(), Array.prototype.slice.call(func_params));
      }
      return;
    }
    if (cur_state[func] !== undefined && typeof cur_state[func] !== "function") return;
    return cur_state[func].apply(stately, Array.prototype.slice.call(func_params));
  };

  stately._transition = function (to_state, enter_params, exit_params) {
    transition(to_state, enter_params, exit_params, "state");
  };

  stately._transitionSubstate = function (to_state, enter_params, exit_params) {
    transition(to_state, enter_params, exit_params, "substate");
  };
}
