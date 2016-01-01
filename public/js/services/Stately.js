function Stately(params) {
  var stately = this;
  stately.current_state = '';
  stately.current_substate = '';
  stately.states = {};
  stately.transitions = [];

  stately.create = function(params) {
    var state_funcs = {};
    var substate_funcs = {};

    if (params === undefined) return;

    if (params.transitions) {
      stately.transitions = _.clone(params.transitions);
    }

    if (params.globals) {
      if (params.globals.all) {
	_.each(params.globals.all, function (func, name) {
	  if (typeof func === "function") {
	    state_funcs[name] = func;
	    substate_funcs[name] = func;
	  }
	});
      }
      if (params.globals.states) {
	_.each(params.globals.states, function (func, name) {
	  if (typeof func === "function") state_funcs[name] = func;
	});
	
      }
      if (params.globals.substates) {
	_.each(params.globals.substates, function (func, name) {
	  if (typeof func === "function") substate_funcs[name] = func;
	});
	
      }
    }

    if (params.states && typeof params.states === "object")  {
      _.each(params.states, function (state, name) {
	if (name && typeof state === "object") {
	  stately.states[name] = state;
	  _.each(state_funcs, function (f,n) {
	    if (!stately.states[name][n]) stately.states[name][n] = f;
	  });
	}
      });
    }

    if (params.events) {
      params.events.forEach(function (event) {
	stately[event.name] = function () {
	  console.log("Called " + event.name);
	  if (current_state === event.from) {
	    current_state = event.to;
	    console.log("Transitioned from " + event.from + " to " + event.to);
	  }
	};
      });
    }
    if (params.initialState) {
      stately._transition(params.initialState);
    }    
  };

  if (params !== undefined) { stately.create(params); }

  stately.emit = function (func, params) {
    if (params === undefined) params = [];
    var cur_state = stately.getCurrentState();
    var cur_substate = null;
    if (!_.isEmpty(stately.current_substate)) {
      cur_substate = stately.getCurrentSubstate();
    }
    if (cur_substate) {
      if (cur_substate[func] && typeof cur_substate[func] === "function") {
	cur_substate[func].apply(stately, Array.prototype.slice.call(params));
      } else if (cur_substate.delegates && cur_state[func] && typeof cur_state[func] === "function") {
	cur_state[func].apply(stately, Array.prototype.slice.call(params));
      }
    } else if (cur_state[func] && typeof cur_state[func] === "function") {
      cur_state[func].apply(stately, Array.prototype.slice.call(params));
    }
  };

  // params - parameters to be passed to the transitioned state's _onEnter function
  stately._transition = function (to_state, params) {
    var cur_state = stately.states[stately.current_state];
    if (cur_state && cur_state._onExit && typeof cur_state._onExit === "function") cur_state._onExit()
    if (to_state === undefined) {
      var transitions = _.where(stately.transitions, {from: stately.current_state});
      if (transitions.length > 1) {
	_.each(transitions, function (transition) {
	  if (transition.cond && !eval(transition.cond)) {
	    console.log('test');
	  }
	});
      }
      to_state = transitions[0].to;   /// first one for now. Later on we will implement conditions and such, so there could be multiple results
    }
    if (typeof to_state === "string") stately.current_state = to_state;
    stately.current_substate = '';
    cur_state = stately.getCurrentState();
    if (cur_state._onEnter && typeof cur_state._onEnter === "function") {
	if (params === undefined) params = [];
	cur_state._onEnter.apply(stately, Array.prototype.slice.call(params));
    }
  };

  // params - parameters to be passed to the transitioned substate's _onEnter function
  stately._transitionSubstate = function (to_substate, params) {
    var cur_state = stately.getCurrentState();
    if (cur_state.substates && cur_state.substates[to_substate] &&
	typeof cur_state.substates[to_substate] === "object") {
      stately.current_substate = to_substate;
      var cur_substate = stately.getCurrentSubstate();
      if (cur_substate._onEnter && typeof cur_substate._onEnter === "function") {
	if (params === undefined) params = [];
	cur_substate._onEnter.apply(stately, Array.prototype.slice.call(params));
      }
    }
  };

  stately._exitSubstate = function (params) {
    var cur_substate = stately.getCurrentSubstate();
    if (cur_substate) {
      if (params === undefined) params = [];
      if (cur_substate._onExit && typeof cur_substate._onExit === "function") {
	cur_substate._onExit.apply(stately, Array.prototype.slice.call(params));
      }
      var cur_state = stately.getCurrentState();
      if (cur_state._onReturn && typeof cur_state._onReturn === "function" ) {
	cur_state._onReturn.apply(stately, [stately.current_substate]);
      }
      stately.current_substate = '';
    }
  };

  stately.getCurrentState = function () {
    return stately.states[stately.current_state];
  };

  stately.getCurrentSubstate = function () {
    var cur_state = stately.getCurrentState();
    if (!cur_state.substates) return null;
    return cur_state.substates[stately.current_substate];
  };
}
