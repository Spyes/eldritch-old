angular.element(document).ready(function () {
  angular.bootstrap(document, ['Eldritch']);
});
angular.module('Eldritch', ['ui.router']).config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/lobby');

  $stateProvider.state('lobby', {
    url: '/lobby',
    templateUrl: "views/lobby.html",
    controller: "LobbyController as vm"
  }).state('start', {
    url: '/start',
    templateUrl: "views/start.html",
    controller: "StartController as vm"
  }).state('board', {
    url: '/board',
    templateUrl: "views/board.html",
    controller: "BoardController as vm"
  });
}).run(function ($rootScope) {
  $rootScope.socket = new Socket("/socket", { params: { token: window.userToken } });
  $rootScope.socket.connect();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVsZHJpdGNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFFBQVEsT0FBUixDQUFnQixRQUFoQixFQUEwQixLQUExQixDQUFnQyxZQUFXO0FBQ3pDLFVBQVEsU0FBUixDQUFrQixRQUFsQixFQUE0QixDQUFDLFVBQUQsQ0FBNUIsRUFEeUM7Q0FBWCxDQUFoQztBQUdBLFFBQ0csTUFESCxDQUNVLFVBRFYsRUFDc0IsQ0FBQyxXQUFELENBRHRCLEVBRUcsTUFGSCxDQUVVLFVBQVUsY0FBVixFQUEwQixrQkFBMUIsRUFBOEM7QUFDcEQscUJBQW1CLFNBQW5CLENBQTZCLFFBQTdCLEVBRG9EOztBQUdwRCxpQkFDRyxLQURILENBQ1MsT0FEVCxFQUNrQjtBQUNyQixTQUFLLFFBQUw7QUFDQSxpQkFBYSxrQkFBYjtBQUNBLGdCQUFZLHVCQUFaO0dBSkcsRUFNRyxLQU5ILENBTVMsT0FOVCxFQU1rQjtBQUNyQixTQUFLLFFBQUw7QUFDQSxpQkFBYSxrQkFBYjtBQUNBLGdCQUFZLHVCQUFaO0dBVEcsRUFXRyxLQVhILENBV1MsT0FYVCxFQVdrQjtBQUNyQixTQUFLLFFBQUw7QUFDQSxpQkFBYSxrQkFBYjtBQUNBLGdCQUFZLHVCQUFaO0dBZEcsRUFIb0Q7Q0FBOUMsQ0FGVixDQXNCRyxHQXRCSCxDQXNCTyxVQUFVLFVBQVYsRUFBc0I7QUFDekIsYUFBVyxNQUFYLEdBQW9CLElBQUksTUFBSixDQUFXLFNBQVgsRUFBc0IsRUFBQyxRQUFRLEVBQUMsT0FBTyxPQUFPLFNBQVAsRUFBaEIsRUFBdkIsQ0FBcEIsQ0FEeUI7QUFFekIsYUFBVyxNQUFYLENBQWtCLE9BQWxCLEdBRnlCO0NBQXRCLENBdEJQIiwiZmlsZSI6ImVsZHJpdGNoLmpzIiwic291cmNlUm9vdCI6Ii93ZWIvc3RhdGljL2pzLyJ9

// Phoenix Channels JavaScript client
//
// ## Socket Connection
//
// A single connection is established to the server and
// channels are multiplexed over the connection.
// Connect to the server using the `Socket` class:
//
//     let socket = new Socket("/ws", {params: {userToken: "123"}})
//     socket.connect()
//
// The `Socket` constructor takes the mount point of the socket,
// the authentication params, as well as options that can be found in
// the Socket docs, such as configuring the `LongPoll` transport, and
// heartbeat.
//
// ## Channels
//
// Channels are isolated, concurrent processes on the server that
// subscribe to topics and broker events between the client and server.
// To join a channel, you must provide the topic, and channel params for
// authorization. Here's an example chat room example where `"new_msg"`
// events are listened for, messages are pushed to the server, and
// the channel is joined with ok/error/timeout matches:
//
//     let channel = socket.channel("rooms:123", {token: roomToken})
//     channel.on("new_msg", msg => console.log("Got message", msg) )
//     $input.onEnter( e => {
//       channel.push("new_msg", {body: e.target.val}, 10000)
//        .receive("ok", (msg) => console.log("created message", msg) )
//        .receive("error", (reasons) => console.log("create failed", reasons) )
//        .receive("timeout", () => console.log("Networking issue...") )
//     })
//     channel.join()
//       .receive("ok", ({messages}) => console.log("catching up", messages) )
//       .receive("error", ({reason}) => console.log("failed join", reason) )
//       .receive("timeout", () => console.log("Networking issue. Still waiting...") )
//
//
// ## Joining
//
// Creating a channel with `socket.channel(topic, params)`, binds the params to
// `channel.params`, which are sent up on `channel.join()`.
// Subsequent rejoins will send up the modified params for
// updating authorization params, or passing up last_message_id information.
// Successful joins receive an "ok" status, while unsuccessful joins
// receive "error".
//
//
// ## Pushing Messages
//
// From the previous example, we can see that pushing messages to the server
// can be done with `channel.push(eventName, payload)` and we can optionally
// receive responses from the push. Additionally, we can use
// `receive("timeout", callback)` to abort waiting for our other `receive` hooks
//  and take action after some period of waiting. The default timeout is 5000ms.
//
//
// ## Socket Hooks
//
// Lifecycle events of the multiplexed connection can be hooked into via
// `socket.onError()` and `socket.onClose()` events, ie:
//
//     socket.onError( () => console.log("there was an error with the connection!") )
//     socket.onClose( () => console.log("the connection dropped") )
//
//
// ## Channel Hooks
//
// For each joined channel, you can bind to `onError` and `onClose` events
// to monitor the channel lifecycle, ie:
//
//     channel.onError( () => console.log("there was an error!") )
//     channel.onClose( () => console.log("the channel has gone away gracefully") )
//
// ### onError hooks
//
// `onError` hooks are invoked if the socket connection drops, or the channel
// crashes on the server. In either case, a channel rejoin is attemtped
// automatically in an exponential backoff manner.
//
// ### onClose hooks
//
// `onClose` hooks are invoked only in two cases. 1) the channel explicitly
// closed on the server, or 2). The client explicitly closed, by calling
// `channel.leave()`
//
//
// ## Presence
//
// The `Presence` object provides features for syncing presence information
// from the server with the client and handling presences joining and leaving.
//
// ### Syncing initial state from the server
//
// `Presence.syncState` is used to sync the list of presences on the server
// with the client's state. An optional `onJoin` and `onLeave` callback can
// be provided to react to changes in the client's local presences across
// disconnects and reconnects with the server.
//
// `Presence.syncDiff` is used to sync a diff of presence join and leave
// events from the server, as they happen. Like `syncState`, `syncDiff`
// accepts optional `onJoin` and `onLeave` callbacks to react to a user
// joining or leaving from a device.
//
// ### Listing Presences
//
// `Presence.list` is used to return a list of presence information
// based on the local state of metadata. By default, all presence
// metadata is returned, but a `listBy` function can be supplied to
// allow the client to select which metadata to use for a given presence.
// For example, you may have a user online from different devices with a
// a metadata status of "online", but they have set themselves to "away"
// on another device. In this case, they app may choose to use the "away"
// status for what appears on the UI. The example below defines a `listBy`
// function which prioritizes the first metadata which was registered for
// each user. This could be the first tab they opened, or the first device
// they came online from:
//
//     let state = {}
//     Presence.syncState(state, stateFromServer)
//     let listBy = (id, {metas: [first, ...rest]}) => {
//       first.count = rest.length + 1 // count of this user's presences
//       first.id = id
//       return first
//     }
//     let onlineUsers = Presence.list(state, listBy)
//
//
// ### Example Usage
//
//     // detect if user has joined for the 1st time or from another tab/device
//     let onJoin = (id, current, newPres) => {
//       if(!current){
//         console.log("user has entered for the first time", newPres)
//       } else {
//         console.log("user additional presence", newPres)
//       }
//     }
//     // detect if user has left from all tabs/devices, or is still present
//     let onLeave = (id, current, leftPres) => {
//       if(current.metas.length === 0){
//         console.log("user has left from all devices", leftPres)
//       } else {
//         console.log("user left from a device", leftPres)
//       }
//     }
//     let presences = {} // client's initial empty presence state
//     // receive initial presence data from server, sent after join
//     myChannel.on("presences", state => {
//       Presence.syncState(presences, state, onJoin, onLeave)
//       displayUsers(Presence.list(presences))
//     })
//     // receive "presence_diff" from server, containing join/leave events
//     myChannel.on("presence_diff", diff => {
//       Presence.syncDiff(presences, diff, onJoin, onLeave)
//       this.setState({users: Presence.list(room.presences, listBy)})
//     })
//
const VSN = "1.0.0";
const SOCKET_STATES = { connecting: 0, open: 1, closing: 2, closed: 3 };
const DEFAULT_TIMEOUT = 10000;
const CHANNEL_STATES = {
  closed: "closed",
  errored: "errored",
  joined: "joined",
  joining: "joining"
};
const CHANNEL_EVENTS = {
  close: "phx_close",
  error: "phx_error",
  join: "phx_join",
  reply: "phx_reply",
  leave: "phx_leave"
};
const TRANSPORTS = {
  longpoll: "longpoll",
  websocket: "websocket"
};

class Push {

  // Initializes the Push
  //
  // channel - The Channel
  // event - The event, for example `"phx_join"`
  // payload - The payload, for example `{user_id: 123}`
  // timeout - The push timeout in milliseconds
  //
  constructor(channel, event, payload, timeout) {
    this.channel = channel;
    this.event = event;
    this.payload = payload || {};
    this.receivedResp = null;
    this.timeout = timeout;
    this.timeoutTimer = null;
    this.recHooks = [];
    this.sent = false;
  }

  resend(timeout) {
    this.timeout = timeout;
    this.cancelRefEvent();
    this.ref = null;
    this.refEvent = null;
    this.receivedResp = null;
    this.sent = false;
    this.send();
  }

  send() {
    if (this.hasReceived("timeout")) {
      return;
    }
    this.startTimeout();
    this.sent = true;
    this.channel.socket.push({
      topic: this.channel.topic,
      event: this.event,
      payload: this.payload,
      ref: this.ref
    });
  }

  receive(status, callback) {
    if (this.hasReceived(status)) {
      callback(this.receivedResp.response);
    }

    this.recHooks.push({ status, callback });
    return this;
  }

  // private

  matchReceive({ status, response, ref }) {
    this.recHooks.filter(h => h.status === status).forEach(h => h.callback(response));
  }

  cancelRefEvent() {
    if (!this.refEvent) {
      return;
    }
    this.channel.off(this.refEvent);
  }

  cancelTimeout() {
    clearTimeout(this.timeoutTimer);
    this.timeoutTimer = null;
  }

  startTimeout() {
    if (this.timeoutTimer) {
      return;
    }
    this.ref = this.channel.socket.makeRef();
    this.refEvent = this.channel.replyEventName(this.ref);

    this.channel.on(this.refEvent, payload => {
      this.cancelRefEvent();
      this.cancelTimeout();
      this.receivedResp = payload;
      this.matchReceive(payload);
    });

    this.timeoutTimer = setTimeout(() => {
      this.trigger("timeout", {});
    }, this.timeout);
  }

  hasReceived(status) {
    return this.receivedResp && this.receivedResp.status === status;
  }

  trigger(status, response) {
    this.channel.trigger(this.refEvent, { status, response });
  }
}

export class Channel {
  constructor(topic, params, socket) {
    this.state = CHANNEL_STATES.closed;
    this.topic = topic;
    this.params = params || {};
    this.socket = socket;
    this.bindings = [];
    this.timeout = this.socket.timeout;
    this.joinedOnce = false;
    this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout);
    this.pushBuffer = [];
    this.rejoinTimer = new Timer(() => this.rejoinUntilConnected(), this.socket.reconnectAfterMs);
    this.joinPush.receive("ok", () => {
      this.state = CHANNEL_STATES.joined;
      this.rejoinTimer.reset();
      this.pushBuffer.forEach(pushEvent => pushEvent.send());
      this.pushBuffer = [];
    });
    this.onClose(() => {
      this.socket.log("channel", `close ${ this.topic }`);
      this.state = CHANNEL_STATES.closed;
      this.socket.remove(this);
    });
    this.onError(reason => {
      this.socket.log("channel", `error ${ this.topic }`, reason);
      this.state = CHANNEL_STATES.errored;
      this.rejoinTimer.scheduleTimeout();
    });
    this.joinPush.receive("timeout", () => {
      if (this.state !== CHANNEL_STATES.joining) {
        return;
      }

      this.socket.log("channel", `timeout ${ this.topic }`, this.joinPush.timeout);
      this.state = CHANNEL_STATES.errored;
      this.rejoinTimer.scheduleTimeout();
    });
    this.on(CHANNEL_EVENTS.reply, (payload, ref) => {
      this.trigger(this.replyEventName(ref), payload);
    });
  }

  rejoinUntilConnected() {
    this.rejoinTimer.scheduleTimeout();
    if (this.socket.isConnected()) {
      this.rejoin();
    }
  }

  join(timeout = this.timeout) {
    if (this.joinedOnce) {
      throw `tried to join multiple times. 'join' can only be called a single time per channel instance`;
    } else {
      this.joinedOnce = true;
    }
    this.rejoin(timeout);
    return this.joinPush;
  }

  onClose(callback) {
    this.on(CHANNEL_EVENTS.close, callback);
  }

  onError(callback) {
    this.on(CHANNEL_EVENTS.error, reason => callback(reason));
  }

  on(event, callback) {
    this.bindings.push({ event, callback });
  }

  off(event) {
    this.bindings = this.bindings.filter(bind => bind.event !== event);
  }

  canPush() {
    return this.socket.isConnected() && this.state === CHANNEL_STATES.joined;
  }

  push(event, payload, timeout = this.timeout) {
    if (!this.joinedOnce) {
      throw `tried to push '${ event }' to '${ this.topic }' before joining. Use channel.join() before pushing events`;
    }
    let pushEvent = new Push(this, event, payload, timeout);
    if (this.canPush()) {
      pushEvent.send();
    } else {
      pushEvent.startTimeout();
      this.pushBuffer.push(pushEvent);
    }

    return pushEvent;
  }

  // Leaves the channel
  //
  // Unsubscribes from server events, and
  // instructs channel to terminate on server
  //
  // Triggers onClose() hooks
  //
  // To receive leave acknowledgements, use the a `receive`
  // hook to bind to the server ack, ie:
  //
  //     channel.leave().receive("ok", () => alert("left!") )
  //
  leave(timeout = this.timeout) {
    let onClose = () => {
      this.socket.log("channel", `leave ${ this.topic }`);
      this.trigger(CHANNEL_EVENTS.close, "leave");
    };
    let leavePush = new Push(this, CHANNEL_EVENTS.leave, {}, timeout);
    leavePush.receive("ok", () => onClose()).receive("timeout", () => onClose());
    leavePush.send();
    if (!this.canPush()) {
      leavePush.trigger("ok", {});
    }

    return leavePush;
  }

  // Overridable message hook
  //
  // Receives all events for specialized message handling
  onMessage(event, payload, ref) {}

  // private

  isMember(topic) {
    return this.topic === topic;
  }

  sendJoin(timeout) {
    this.state = CHANNEL_STATES.joining;
    this.joinPush.resend(timeout);
  }

  rejoin(timeout = this.timeout) {
    this.sendJoin(timeout);
  }

  trigger(triggerEvent, payload, ref) {
    this.onMessage(triggerEvent, payload, ref);
    this.bindings.filter(bind => bind.event === triggerEvent).map(bind => bind.callback(payload, ref));
  }

  replyEventName(ref) {
    return `chan_reply_${ ref }`;
  }
}

export class Socket {

  // Initializes the Socket
  //
  // endPoint - The string WebSocket endpoint, ie, "ws://example.com/ws",
  //                                               "wss://example.com"
  //                                               "/ws" (inherited host & protocol)
  // opts - Optional configuration
  //   transport - The Websocket Transport, for example WebSocket or Phoenix.LongPoll.
  //               Defaults to WebSocket with automatic LongPoll fallback.
  //   timeout - The default timeout in milliseconds to trigger push timeouts.
  //             Defaults `DEFAULT_TIMEOUT`
  //   heartbeatIntervalMs - The millisec interval to send a heartbeat message
  //   reconnectAfterMs - The optional function that returns the millsec
  //                      reconnect interval. Defaults to stepped backoff of:
  //
  //     function(tries){
  //       return [1000, 5000, 10000][tries - 1] || 10000
  //     }
  //
  //   logger - The optional function for specialized logging, ie:
  //     `logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
  //
  //   longpollerTimeout - The maximum timeout of a long poll AJAX request.
  //                        Defaults to 20s (double the server long poll timer).
  //
  //   params - The optional params to pass when connecting
  //
  // For IE8 support use an ES5-shim (https://github.com/es-shims/es5-shim)
  //
  constructor(endPoint, opts = {}) {
    this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] };
    this.channels = [];
    this.sendBuffer = [];
    this.ref = 0;
    this.timeout = opts.timeout || DEFAULT_TIMEOUT;
    this.transport = opts.transport || window.WebSocket || LongPoll;
    this.heartbeatIntervalMs = opts.heartbeatIntervalMs || 30000;
    this.reconnectAfterMs = opts.reconnectAfterMs || function (tries) {
      return [1000, 2000, 5000, 10000][tries - 1] || 10000;
    };
    this.logger = opts.logger || function () {}; // noop
    this.longpollerTimeout = opts.longpollerTimeout || 20000;
    this.params = opts.params || {};
    this.endPoint = `${ endPoint }/${ TRANSPORTS.websocket }`;
    this.reconnectTimer = new Timer(() => {
      this.disconnect(() => this.connect());
    }, this.reconnectAfterMs);
  }

  protocol() {
    return location.protocol.match(/^https/) ? "wss" : "ws";
  }

  endPointURL() {
    let uri = Ajax.appendParams(Ajax.appendParams(this.endPoint, this.params), { vsn: VSN });
    if (uri.charAt(0) !== "/") {
      return uri;
    }
    if (uri.charAt(1) === "/") {
      return `${ this.protocol() }:${ uri }`;
    }

    return `${ this.protocol() }://${ location.host }${ uri }`;
  }

  disconnect(callback, code, reason) {
    if (this.conn) {
      this.conn.onclose = function () {}; // noop
      if (code) {
        this.conn.close(code, reason || "");
      } else {
        this.conn.close();
      }
      this.conn = null;
    }
    callback && callback();
  }

  // params - The params to send when connecting, for example `{user_id: userToken}`
  connect(params) {
    if (params) {
      console && console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor");
      this.params = params;
    }
    if (this.conn) {
      return;
    }

    this.conn = new this.transport(this.endPointURL());
    this.conn.timeout = this.longpollerTimeout;
    this.conn.onopen = () => this.onConnOpen();
    this.conn.onerror = error => this.onConnError(error);
    this.conn.onmessage = event => this.onConnMessage(event);
    this.conn.onclose = event => this.onConnClose(event);
  }

  // Logs the message. Override `this.logger` for specialized logging. noops by default
  log(kind, msg, data) {
    this.logger(kind, msg, data);
  }

  // Registers callbacks for connection state change events
  //
  // Examples
  //
  //    socket.onError(function(error){ alert("An error occurred") })
  //
  onOpen(callback) {
    this.stateChangeCallbacks.open.push(callback);
  }
  onClose(callback) {
    this.stateChangeCallbacks.close.push(callback);
  }
  onError(callback) {
    this.stateChangeCallbacks.error.push(callback);
  }
  onMessage(callback) {
    this.stateChangeCallbacks.message.push(callback);
  }

  onConnOpen() {
    this.log("transport", `connected to ${ this.endPointURL() }`, this.transport.prototype);
    this.flushSendBuffer();
    this.reconnectTimer.reset();
    if (!this.conn.skipHeartbeat) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = setInterval(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
    }
    this.stateChangeCallbacks.open.forEach(callback => callback());
  }

  onConnClose(event) {
    this.log("transport", "close", event);
    this.triggerChanError();
    clearInterval(this.heartbeatTimer);
    this.reconnectTimer.scheduleTimeout();
    this.stateChangeCallbacks.close.forEach(callback => callback(event));
  }

  onConnError(error) {
    this.log("transport", error);
    this.triggerChanError();
    this.stateChangeCallbacks.error.forEach(callback => callback(error));
  }

  triggerChanError() {
    this.channels.forEach(channel => channel.trigger(CHANNEL_EVENTS.error));
  }

  connectionState() {
    switch (this.conn && this.conn.readyState) {
      case SOCKET_STATES.connecting:
        return "connecting";
      case SOCKET_STATES.open:
        return "open";
      case SOCKET_STATES.closing:
        return "closing";
      default:
        return "closed";
    }
  }

  isConnected() {
    return this.connectionState() === "open";
  }

  remove(channel) {
    this.channels = this.channels.filter(c => !c.isMember(channel.topic));
  }

  channel(topic, chanParams = {}) {
    let chan = new Channel(topic, chanParams, this);
    this.channels.push(chan);
    return chan;
  }

  push(data) {
    let { topic, event, payload, ref } = data;
    let callback = () => this.conn.send(JSON.stringify(data));
    this.log("push", `${ topic } ${ event } (${ ref })`, payload);
    if (this.isConnected()) {
      callback();
    } else {
      this.sendBuffer.push(callback);
    }
  }

  // Return the next message ref, accounting for overflows
  makeRef() {
    let newRef = this.ref + 1;
    if (newRef === this.ref) {
      this.ref = 0;
    } else {
      this.ref = newRef;
    }

    return this.ref.toString();
  }

  sendHeartbeat() {
    if (!this.isConnected()) {
      return;
    }
    this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: this.makeRef() });
  }

  flushSendBuffer() {
    if (this.isConnected() && this.sendBuffer.length > 0) {
      this.sendBuffer.forEach(callback => callback());
      this.sendBuffer = [];
    }
  }

  onConnMessage(rawMessage) {
    let msg = JSON.parse(rawMessage.data);
    let { topic, event, payload, ref } = msg;
    this.log("receive", `${ payload.status || "" } ${ topic } ${ event } ${ ref && "(" + ref + ")" || "" }`, payload);
    this.channels.filter(channel => channel.isMember(topic)).forEach(channel => channel.trigger(event, payload, ref));
    this.stateChangeCallbacks.message.forEach(callback => callback(msg));
  }
}

export class LongPoll {

  constructor(endPoint) {
    this.endPoint = null;
    this.token = null;
    this.skipHeartbeat = true;
    this.onopen = function () {}; // noop
    this.onerror = function () {}; // noop
    this.onmessage = function () {}; // noop
    this.onclose = function () {}; // noop
    this.pollEndpoint = this.normalizeEndpoint(endPoint);
    this.readyState = SOCKET_STATES.connecting;

    this.poll();
  }

  normalizeEndpoint(endPoint) {
    return endPoint.replace("ws://", "http://").replace("wss://", "https://").replace(new RegExp("(.*)\/" + TRANSPORTS.websocket), "$1/" + TRANSPORTS.longpoll);
  }

  endpointURL() {
    return Ajax.appendParams(this.pollEndpoint, { token: this.token });
  }

  closeAndRetry() {
    this.close();
    this.readyState = SOCKET_STATES.connecting;
  }

  ontimeout() {
    this.onerror("timeout");
    this.closeAndRetry();
  }

  poll() {
    if (!(this.readyState === SOCKET_STATES.open || this.readyState === SOCKET_STATES.connecting)) {
      return;
    }

    Ajax.request("GET", this.endpointURL(), "application/json", null, this.timeout, this.ontimeout.bind(this), resp => {
      if (resp) {
        var { status, token, messages } = resp;
        this.token = token;
      } else {
        var status = 0;
      }

      switch (status) {
        case 200:
          messages.forEach(msg => this.onmessage({ data: JSON.stringify(msg) }));
          this.poll();
          break;
        case 204:
          this.poll();
          break;
        case 410:
          this.readyState = SOCKET_STATES.open;
          this.onopen();
          this.poll();
          break;
        case 0:
        case 500:
          this.onerror();
          this.closeAndRetry();
          break;
        default:
          throw `unhandled poll status ${ status }`;
      }
    });
  }

  send(body) {
    Ajax.request("POST", this.endpointURL(), "application/json", body, this.timeout, this.onerror.bind(this, "timeout"), resp => {
      if (!resp || resp.status !== 200) {
        this.onerror(status);
        this.closeAndRetry();
      }
    });
  }

  close(code, reason) {
    this.readyState = SOCKET_STATES.closed;
    this.onclose();
  }
}

export class Ajax {

  static request(method, endPoint, accept, body, timeout, ontimeout, callback) {
    if (window.XDomainRequest) {
      let req = new XDomainRequest(); // IE8, IE9
      this.xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback);
    } else {
      let req = window.XMLHttpRequest ? new XMLHttpRequest() : // IE7+, Firefox, Chrome, Opera, Safari
      new ActiveXObject("Microsoft.XMLHTTP"); // IE6, IE5
      this.xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback);
    }
  }

  static xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback) {
    req.timeout = timeout;
    req.open(method, endPoint);
    req.onload = () => {
      let response = this.parseJSON(req.responseText);
      callback && callback(response);
    };
    if (ontimeout) {
      req.ontimeout = ontimeout;
    }

    // Work around bug in IE9 that requires an attached onprogress handler
    req.onprogress = () => {};

    req.send(body);
  }

  static xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback) {
    req.timeout = timeout;
    req.open(method, endPoint, true);
    req.setRequestHeader("Content-Type", accept);
    req.onerror = () => {
      callback && callback(null);
    };
    req.onreadystatechange = () => {
      if (req.readyState === this.states.complete && callback) {
        let response = this.parseJSON(req.responseText);
        callback(response);
      }
    };
    if (ontimeout) {
      req.ontimeout = ontimeout;
    }

    req.send(body);
  }

  static parseJSON(resp) {
    return resp && resp !== "" ? JSON.parse(resp) : null;
  }

  static serialize(obj, parentKey) {
    let queryStr = [];
    for (var key in obj) {
      if (!obj.hasOwnProperty(key)) {
        continue;
      }
      let paramKey = parentKey ? `${ parentKey }[${ key }]` : key;
      let paramVal = obj[key];
      if (typeof paramVal === "object") {
        queryStr.push(this.serialize(paramVal, paramKey));
      } else {
        queryStr.push(encodeURIComponent(paramKey) + "=" + encodeURIComponent(paramVal));
      }
    }
    return queryStr.join("&");
  }

  static appendParams(url, params) {
    if (Object.keys(params).length === 0) {
      return url;
    }

    let prefix = url.match(/\?/) ? "&" : "?";
    return `${ url }${ prefix }${ this.serialize(params) }`;
  }
}

Ajax.states = { complete: 4 };

export var Presence = {

  syncState(state, newState, onJoin, onLeave) {
    let joins = {};
    let leaves = {};

    this.map(state, (key, presence) => {
      if (!newState[key]) {
        leaves[key] = this.clone(presence);
      }
    });
    this.map(newState, (key, newPresence) => {
      let currentPresence = state[key];
      if (currentPresence) {
        let newRefs = newPresence.metas.map(m => m.phx_ref);
        let curRefs = currentPresence.metas.map(m => m.phx_ref);
        let joinedMetas = newPresence.metas.filter(m => curRefs.indexOf(m.phx_ref) < 0);
        let leftMetas = currentPresence.metas.filter(m => newRefs.indexOf(m.phx_ref) < 0);
        if (joinedMetas.length > 0) {
          joins[key] = newPresence;
          joins[key].metas = joinedMetas;
        }
        if (leftMetas.length > 0) {
          leaves[key] = this.clone(currentPresence);
          leaves[key].metas = leftMetas;
        }
      } else {
        joins[key] = newPresence;
      }
    });
    this.syncDiff(state, { joins: joins, leaves: leaves }, onJoin, onLeave);
  },

  syncDiff(state, { joins, leaves }, onJoin, onLeave) {
    if (!onJoin) {
      onJoin = function () {};
    }
    if (!onLeave) {
      onLeave = function () {};
    }

    this.map(joins, (key, newPresence) => {
      let currentPresence = state[key];
      state[key] = newPresence;
      if (currentPresence) {
        state[key].metas.unshift(...currentPresence.metas);
      }
      onJoin(key, currentPresence, newPresence);
    });
    this.map(leaves, (key, leftPresence) => {
      let currentPresence = state[key];
      if (!currentPresence) {
        return;
      }
      let refsToRemove = leftPresence.metas.map(m => m.phx_ref);
      currentPresence.metas = currentPresence.metas.filter(p => {
        return refsToRemove.indexOf(p.phx_ref) < 0;
      });
      onLeave(key, currentPresence, leftPresence);
      if (currentPresence.metas.length === 0) {
        delete state[key];
      }
    });
  },

  list(presences, chooser) {
    if (!chooser) {
      chooser = function (key, pres) {
        return pres;
      };
    }

    return this.map(presences, (key, presence) => {
      return chooser(key, presence);
    });
  },

  // private

  map(obj, func) {
    return Object.getOwnPropertyNames(obj).map(key => func(key, obj[key]));
  },

  clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
};

// Creates a timer that accepts a `timerCalc` function to perform
// calculated timeout retries, such as exponential backoff.
//
// ## Examples
//
//    let reconnectTimer = new Timer(() => this.connect(), function(tries){
//      return [1000, 5000, 10000][tries - 1] || 10000
//    })
//    reconnectTimer.scheduleTimeout() // fires after 1000
//    reconnectTimer.scheduleTimeout() // fires after 5000
//    reconnectTimer.reset()
//    reconnectTimer.scheduleTimeout() // fires after 1000
//
class Timer {
  constructor(callback, timerCalc) {
    this.callback = callback;
    this.timerCalc = timerCalc;
    this.timer = null;
    this.tries = 0;
  }

  reset() {
    this.tries = 0;
    clearTimeout(this.timer);
  }

  // Cancels any previous scheduleTimeout and schedules callback
  scheduleTimeout() {
    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.tries = this.tries + 1;
      this.callback();
    }, this.timerCalc(this.tries + 1));
  }
}
//# sourceMappingURL=data:application/json;base64,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

angular.module('Eldritch').controller('BoardController', BoardController);

function BoardController($controller, $rootScope, Map) {
  var vm = this;
  $controller('GameController', { $scope: vm });

  vm.isLocationInhabited = function (location, entity_type) {
    var res = false;
    switch (entity_type) {
      case 'investigators':

        break;
      default:
        break;
    }
    return res;
  };
  vm.locationCoords = function (location) {
    return Map.locationCoords(location);
  };
  vm.getLocationStyle = function (location) {
    return Map.getLocationStyle(location);
  };
  vm.clickLocation = function (location) {
    console.log(location);
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyb2xsZXJzL2JvYXJkX2NvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsUUFDRyxNQURILENBQ1UsVUFEVixFQUVHLFVBRkgsQ0FFYyxpQkFGZCxFQUVpQyxlQUZqQzs7QUFJQSxTQUFTLGVBQVQsQ0FBeUIsV0FBekIsRUFBc0MsVUFBdEMsRUFBa0QsR0FBbEQsRUFBdUQ7QUFDckQsTUFBSSxLQUFLLElBQUwsQ0FEaUQ7QUFFckQsY0FBWSxnQkFBWixFQUE4QixFQUFDLFFBQVEsRUFBUixFQUEvQixFQUZxRDs7QUFJckQsS0FBRyxtQkFBSCxHQUF5QixVQUFVLFFBQVYsRUFBb0IsV0FBcEIsRUFBaUM7QUFDeEQsUUFBSSxNQUFNLEtBQU4sQ0FEb0Q7QUFFeEQsWUFBUSxXQUFSO0FBQ0EsV0FBSyxlQUFMOztBQUVFLGNBRkY7QUFEQTtBQUtFLGNBREY7QUFKQSxLQUZ3RDtBQVN4RCxXQUFPLEdBQVAsQ0FUd0Q7R0FBakMsQ0FKNEI7QUFlckQsS0FBRyxjQUFILEdBQW9CLFVBQVUsUUFBVixFQUFvQjtBQUN0QyxXQUFPLElBQUksY0FBSixDQUFtQixRQUFuQixDQUFQLENBRHNDO0dBQXBCLENBZmlDO0FBa0JyRCxLQUFHLGdCQUFILEdBQXNCLFVBQVUsUUFBVixFQUFvQjtBQUN4QyxXQUFPLElBQUksZ0JBQUosQ0FBcUIsUUFBckIsQ0FBUCxDQUR3QztHQUFwQixDQWxCK0I7QUFxQnJELEtBQUcsYUFBSCxHQUFtQixVQUFVLFFBQVYsRUFBb0I7QUFDckMsWUFBUSxHQUFSLENBQVksUUFBWixFQURxQztHQUFwQixDQXJCa0M7Q0FBdkQiLCJmaWxlIjoiY29udHJvbGxlcnMvYm9hcmRfY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIvd2ViL3N0YXRpYy9qcy8ifQ==

angular.module('Eldritch').controller('GameController', GameController);

function GameController($http, $rootScope, Map) {
  var vm = this;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyb2xsZXJzL2dhbWVfY29udHJvbGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxRQUNHLE1BREgsQ0FDVSxVQURWLEVBRUcsVUFGSCxDQUVjLGdCQUZkLEVBRWdDLGNBRmhDOztBQUlBLFNBQVMsY0FBVCxDQUF3QixLQUF4QixFQUErQixVQUEvQixFQUEyQyxHQUEzQyxFQUFnRDtBQUM5QyxNQUFJLEtBQUssSUFBTCxDQUQwQztDQUFoRCIsImZpbGUiOiJjb250cm9sbGVycy9nYW1lX2NvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiL3dlYi9zdGF0aWMvanMvIn0=

angular.module('Eldritch').controller('LobbyController', LobbyController);

function LobbyController($rootScope, $controller, CommonData) {
  var vm = this;
  $controller('GameController', { $scope: vm });
  vm.showLobby = false;
  vm.username = undefined;
  vm.chat_message = "";
  vm.chatMessages = [];
  vm.showNewRoomForm = false;
  vm.currentRoom = { name: "",
    admin: "",
    players: [] };
  vm.newRoom = { name: "",
    password: undefined,
    max_players: 6 };
  vm.selectedInvestigators = {};

  function after_join(resp) {
    console.log(resp);
    vm.currentRoom = resp;
    registerSocketEvents($rootScope.channel);
    vm.showNewRoomForm = false;
    vm.chatMessages.push({ sender: null,
      msg: `--Joined room ${ resp.room_id }--`,
      styles: { italic: true } });
    $rootScope.$apply();
    if (vm.currentRoom.room !== "lobby") {
      CommonData.getCollections(["investigators", "ancient_ones"], $rootScope.channel, payload => {
        $rootScope[payload.collection] = payload.data;
        $rootScope.$apply();
      });
    }
    //console.log("Joined " + vm.newRoom.name + " successfully", resp);
  };

  function change_channel(room = vm.selectedRoom) {
    $rootScope.channel.leave();
    $rootScope.channel = $rootScope.socket.channel("rooms:" + room, { username: vm.username });
    $rootScope.channel.join().receive("ok", resp => {
      after_join(resp);
    }).receive("error", resp => {
      alert("Unable to join");
    });
  }

  function registerSocketEvents(channel) {
    channel.on("player:entered_room", payload => {
      vm.currentRoom = payload;
      $rootScope.$apply();
    });
    channel.on("players_in_room", payload => {
      vm.currentRoom = payload;
      $rootScope.$apply();
    });
    channel.on("player:sent_message", payload => {
      vm.chatMessages.push({ sender: payload.sender, msg: payload.msg });
      $rootScope.$apply();
    });
    channel.on("rooms:names", payload => {
      vm.rooms = payload.rooms;
      $rootScope.$apply();
    });
    channel.on("player_selected_investigator", payload => {
      vm.currentRoom.selected_investigators = payload.selected_investigators;
      $rootScope.$apply();
    });
  };

  vm.sendChatMessage = function () {
    $rootScope.channel.push("player:sent_message", { msg: vm.chat_message });
    vm.chat_message = "";
  };

  vm.openNewRoomForm = function () {
    vm.showNewRoomForm = true;
  };

  vm.closeNewRoomForm = function () {
    vm.showNewRoomForm = false;
  };

  vm.createNewRoom = function () {
    if (!vm.newRoom.name) return;
    $rootScope.channel.push("create_room", { room: vm.newRoom }).receive("ok", resp => {
      change_channel(vm.newRoom.name);
      vm.newRoom = { name: "", password: undefined, max_players: 6 };
    }).receive("error", resp => {
      alert(resp.error.msg);
    });
  };

  vm.clickRoom = function (index) {
    if (vm.rooms[index] === vm.currentRoom.room) return;
    vm.selectedRoom = vm.rooms[index];
  };

  vm.joinSelectedRoom = function () {
    if (!vm.selectedRoom) return;
    if (vm.selectedRoom === "lobby") vm.enterLobby();else change_channel();
  };

  vm.clickInvestigator = function (investigator) {
    $rootScope.channel.push("player_selected_investigator", { username: vm.username, investigator: investigator.name });
  };

  vm.investigatorSelectedBy = function (investigator) {
    if (_.isUndefined(vm.currentRoom.selected_investigators) || _.isUndefined(vm.currentRoom.selected_investigators[investigator.name])) return "";
    return "[" + vm.currentRoom.selected_investigators[investigator.name] + "]";
  };

  vm.enterLobby = function () {
    if (!vm.username) return;
    if ($rootScope.channel) $rootScope.channel.leave();
    $rootScope.channel = $rootScope.socket.channel("rooms:lobby", { username: vm.username });
    $rootScope.channel.join().receive("ok", resp => {
      after_join(resp);
      vm.showLobby = true;
    }).receive("error", resp => {
      alert("Unable to join!");
    });
    $rootScope.channel.push("rooms:all", {});
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyb2xsZXJzL2xvYmJ5X2NvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsUUFDRyxNQURILENBQ1UsVUFEVixFQUVHLFVBRkgsQ0FFYyxpQkFGZCxFQUVpQyxlQUZqQzs7QUFJQSxTQUFTLGVBQVQsQ0FBeUIsVUFBekIsRUFBcUMsV0FBckMsRUFBa0QsVUFBbEQsRUFBOEQ7QUFDNUQsTUFBSSxLQUFLLElBQUwsQ0FEd0Q7QUFFNUQsY0FBWSxnQkFBWixFQUE4QixFQUFDLFFBQVEsRUFBUixFQUEvQixFQUY0RDtBQUc1RCxLQUFHLFNBQUgsR0FBZSxLQUFmLENBSDREO0FBSTVELEtBQUcsUUFBSCxHQUFjLFNBQWQsQ0FKNEQ7QUFLNUQsS0FBRyxZQUFILEdBQWtCLEVBQWxCLENBTDREO0FBTTVELEtBQUcsWUFBSCxHQUFrQixFQUFsQixDQU40RDtBQU81RCxLQUFHLGVBQUgsR0FBcUIsS0FBckIsQ0FQNEQ7QUFRNUQsS0FBRyxXQUFILEdBQWlCLEVBQUMsTUFBTSxFQUFOO0FBQ0EsV0FBTyxFQUFQO0FBQ2QsYUFBUyxFQUFULEVBRkosQ0FSNEQ7QUFXNUQsS0FBRyxPQUFILEdBQWEsRUFBQyxNQUFNLEVBQU47QUFDZCxjQUFVLFNBQVY7QUFDQSxpQkFBYSxDQUFiLEVBRkEsQ0FYNEQ7QUFjNUQsS0FBRyxxQkFBSCxHQUEyQixFQUEzQixDQWQ0RDs7QUFnQjVELFdBQVMsVUFBVCxDQUFvQixJQUFwQixFQUEwQjtBQUN4QixZQUFRLEdBQVIsQ0FBWSxJQUFaLEVBRHdCO0FBRXhCLE9BQUcsV0FBSCxHQUFpQixJQUFqQixDQUZ3QjtBQUd4Qix5QkFBcUIsV0FBVyxPQUFYLENBQXJCLENBSHdCO0FBSXhCLE9BQUcsZUFBSCxHQUFxQixLQUFyQixDQUp3QjtBQUt4QixPQUFHLFlBQUgsQ0FBZ0IsSUFBaEIsQ0FBcUIsRUFBQyxRQUFRLElBQVI7QUFDckIsV0FBSyxDQUFDLGNBQUQsR0FBaUIsS0FBSyxPQUFMLEVBQWEsRUFBOUIs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LEVBQVAsQ0FBckk7QUFDQSxXQUFPLE1BQU0sR0FBRyxXQUFILENBQWUsc0JBQWYsQ0FBc0MsYUFBYSxJQUFiLENBQTVDLEdBQWlFLEdBQWpFLENBRjJDO0dBQXhCLENBL0dnQzs7QUFvSDVELEtBQUcsVUFBSCxHQUFnQixZQUFZO0FBQzFCLFFBQUksQ0FBQyxHQUFHLFFBQUgsRUFBYSxPQUFsQjtBQUNBLFFBQUksV0FBVyxPQUFYLEVBQW9CLFdBQVcsT0FBWCxDQUFtQixLQUFuQixHQUF4QjtBQUNBLGVBQVcsT0FBWCxHQUFxQixXQUFXLE1BQVgsQ0FBa0IsT0FBbEIsQ0FBMEIsYUFBMUIsRUFBeUMsRUFBQyxVQUFVLEdBQUcsUUFBSCxFQUFwRCxDQUFyQixDQUgwQjtBQUkxQixlQUFXLE9BQVgsQ0FBbUIsSUFBbkIsR0FDRyxPQURILENBQ1csSUFEWCxFQUNpQixRQUFRO0FBQ3JCLGlCQUFXLElBQVgsRUFEcUI7QUFFNUIsU0FBRyxTQUFILEdBQWUsSUFBZixDQUY0QjtLQUFSLENBRGpCLENBS0csT0FMSCxDQUtXLE9BTFgsRUFLb0IsUUFBUTtBQUFFLFlBQU0saUJBQU4sRUFBRjtLQUFSLENBTHBCLENBSjBCO0FBVTFCLGVBQVcsT0FBWCxDQUFtQixJQUFuQixDQUF3QixXQUF4QixFQUFxQyxFQUFyQyxFQVYwQjtHQUFaLENBcEg0QztDQUE5RCIsImZpbGUiOiJjb250cm9sbGVycy9sb2JieV9jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6Ii93ZWIvc3RhdGljL2pzLyJ9

angular.module('Eldritch').controller('StartController', StartController);

function StartController($controller, $rootScope) {
  var vm = this;
  $controller('GameController', { $scope: vm });

  vm.clickInvestigator = function (investigator) {
    vm.selected_investigator = investigator;
  };
  vm.accept = function () {
    if (!vm.selected_investigator && !vm.username) return;
    console.log(vm.username);
    $rootScope.channel.push("player_ready", { username: vm.username, investigator: vm.selected_investigator });
    $rootScope.channel.push("get_username", {});
    $rootScope.channel.on("sent_username", function (payload) {
      console.log(payload);
    });
  };
  vm.init = function () {
    vm.selected_investigator = undefined;
    vm.username = undefined;
    $rootScope.channel.on("all_players_ready", function (payload) {
      $location.go('/game');
    });
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyb2xsZXJzL3N0YXJ0X2NvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsUUFDRyxNQURILENBQ1UsVUFEVixFQUVHLFVBRkgsQ0FFYyxpQkFGZCxFQUVpQyxlQUZqQzs7QUFJQSxTQUFTLGVBQVQsQ0FBeUIsV0FBekIsRUFBc0MsVUFBdEMsRUFBa0Q7QUFDaEQsTUFBSSxLQUFLLElBQUwsQ0FENEM7QUFFaEQsY0FBWSxnQkFBWixFQUE4QixFQUFDLFFBQVEsRUFBUixFQUEvQixFQUZnRDs7QUFJaEQsS0FBRyxpQkFBSCxHQUF1QixVQUFVLFlBQVYsRUFBd0I7QUFDN0MsT0FBRyxxQkFBSCxHQUEyQixZQUEzQixDQUQ2QztHQUF4QixDQUp5QjtBQU9oRCxLQUFHLE1BQUgsR0FBWSxZQUFZO0FBQ3RCLFFBQUksQ0FBQyxHQUFHLHFCQUFILElBQTRCLENBQUMsR0FBRyxRQUFILEVBQWEsT0FBL0M7QUFDQSxZQUFRLEdBQVIsQ0FBWSxHQUFHLFFBQUgsQ0FBWixDQUZzQjtBQUd0QixlQUFXLE9BQVgsQ0FBbUIsSUFBbkIsQ0FBd0IsY0FBeEIsRUFBd0MsRUFBQyxVQUFVLEdBQUcsUUFBSCxFQUFhLGNBQWMsR0FBRyxxQkFBSCxFQUE5RSxFQUhzQjtBQUl0QixlQUFXLE9BQVgsQ0FBbUIsSUFBbkIsQ0FBd0IsY0FBeEIsRUFBd0MsRUFBeEMsRUFKc0I7QUFLdEIsZUFBVyxPQUFYLENBQW1CLEVBQW5CLENBQXNCLGVBQXRCLEVBQXVDLFVBQVUsT0FBVixFQUFtQjtBQUN4RCxjQUFRLEdBQVIsQ0FBWSxPQUFaLEVBRHdEO0tBQW5CLENBQXZDLENBTHNCO0dBQVosQ0FQb0M7QUFnQmhELEtBQUcsSUFBSCxHQUFVLFlBQVk7QUFDcEIsT0FBRyxxQkFBSCxHQUEyQixTQUEzQixDQURvQjtBQUVwQixPQUFHLFFBQUgsR0FBYyxTQUFkLENBRm9CO0FBR3BCLGVBQVcsT0FBWCxDQUFtQixFQUFuQixDQUFzQixtQkFBdEIsRUFBMkMsVUFBVSxPQUFWLEVBQW1CO0FBQzVELGdCQUFVLEVBQVYsQ0FBYSxPQUFiLEVBRDREO0tBQW5CLENBQTNDLENBSG9CO0dBQVosQ0FoQnNDO0NBQWxEIiwiZmlsZSI6ImNvbnRyb2xsZXJzL3N0YXJ0X2NvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiL3dlYi9zdGF0aWMvanMvIn0=

angular.module('Eldritch').factory('Map', Map);
function Map() {
  'use strict';

  function locationCoords(location) {
    if (location === undefined) {
      return "";
    }
    var c = location.coords;
    var type = location.type;
    var r = 23;
    if (type.toLowerCase().indexOf("major") > -1 || type.toLowerCase().indexOf("expedition") > -1) {
      r = 80;
    }
    // TODO : Maybe store this in DB?
    location.coords.r = r;
    return c.x + "," + c.y + "," + r;
  };

  function getLocationStyle(location) {
    if (location === undefined) {
      return {};
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZhY3Rvcmllcy9NYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsUUFBUSxNQUFSLENBQWUsVUFBZixFQUNHLE9BREgsQ0FDVyxLQURYLEVBQ2tCLEdBRGxCO0FBRUEsU0FBUyxHQUFULEdBQWU7QUFDYixlQURhOztBQUdiLFdBQVMsY0FBVCxDQUF3QixRQUF4QixFQUFrQztBQUNoQyxRQUFJLGFBQWEsU0FBYixFQUF3QjtBQUFFLGFBQU8sRUFBUCxDQUFGO0tBQTVCO0FBQ0EsUUFBSSxJQUFJLFNBQVMsTUFBVCxDQUZ3QjtBQUdoQyxRQUFJLE9BQU8sU0FBUyxJQUFULENBSHFCO0FBSWhDLFFBQUksSUFBSSxFQUFKLENBSjRCO0FBS2hDLFFBQUksS0FBSyxXQUFMLEdBQW1CLE9BQW5CLENBQTJCLE9BQTNCLElBQXNDLENBQUMsQ0FBRCxJQUN0QyxLQUFLLFdBQUwsR0FBbUIsT0FBbkIsQ0FBMkIsWUFBM0IsSUFBMkMsQ0FBQyxDQUFELEVBQUk7QUFDakQsVUFBSSxFQUFKLENBRGlEO0tBRG5EOztBQUxnQyxZQVVoQyxDQUFTLE1BQVQsQ0FBZ0IsQ0FBaEIsR0FBb0IsQ0FBcEIsQ0FWZ0M7QUFXaEMsV0FBTyxFQUFFLENBQUYsR0FBTSxHQUFOLEdBQVksRUFBRSxDQUFGLEdBQU0sR0FBbEIsR0FBd0IsQ0FBeEIsQ0FYeUI7R0FBbEMsQ0FIYTs7QUFpQmIsV0FBUyxnQkFBVCxDQUEwQixRQUExQixFQUFvQztBQUNsQyxRQUFJLGFBQWEsU0FBYixFQUF3QjtBQUFFLGFBQU8sRUFBUCxDQUFGO0tBQTVCO0FBQ0EsUUFBSSxTQUFTLFNBQVMsTUFBVCxDQUZxQjtBQUdsQyxRQUFJLE9BQU8sT0FBTyxDQUFQLEdBQVcsT0FBTyxDQUFQLENBSFk7QUFJbEMsUUFBSSxNQUFNLE9BQU8sQ0FBUCxDQUp3QjtBQUtsQyxRQUFJLFFBQVE7QUFDVixrQkFBWSxVQUFaO0FBQ0EsMEJBQW9CLE9BQXBCO0FBQ0EsY0FBUSxPQUFPLElBQVA7QUFDUixhQUFPLE1BQU0sSUFBTjtLQUpMLENBTDhCO0FBV2xDLFdBQU8sS0FBUCxDQVhrQztHQUFwQyxDQWpCYTs7QUFnQ2IsU0FBTztBQUNMLG9CQUFnQixjQUFoQjtBQUNBLHNCQUFrQixnQkFBbEI7R0FGRixDQWhDYTtDQUFmIiwiZmlsZSI6ImZhY3Rvcmllcy9NYXAuanMiLCJzb3VyY2VSb290IjoiL3dlYi9zdGF0aWMvanMvIn0=

angular.module("Eldritch").factory("CommonData", CommonData);

function CommonData() {
  function getCollection(coll, channel, callback = function (payload) {}) {
    channel.push("get_collection", { coll: coll });
    channel.on("sent_collection", callback);
  }

  function getCollections(collections, channel, callback = payload => {}) {
    collections.forEach(coll => {
      channel.push("get_collection", { coll: coll });
    });
    channel.on("sent_collection", callback);
  }

  return {
    getCollection: getCollection,
    getCollections: getCollections
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZhY3Rvcmllcy9jb21tb25fZGF0YS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxRQUNHLE1BREgsQ0FDVSxVQURWLEVBRUcsT0FGSCxDQUVXLFlBRlgsRUFFeUIsVUFGekI7O0FBSUEsU0FBUyxVQUFULEdBQXNCO0FBQ3BCLFdBQVMsYUFBVCxDQUF1QixJQUF2QixFQUE2QixPQUE3QixFQUFzQyxXQUFXLFVBQVMsT0FBVCxFQUFpQixFQUFqQixFQUFxQjtBQUNwRSxZQUFRLElBQVIsQ0FBYSxnQkFBYixFQUErQixFQUFDLE1BQU0sSUFBTixFQUFoQyxFQURvRTtBQUVwRSxZQUFRLEVBQVIsQ0FBVyxpQkFBWCxFQUE4QixRQUE5QixFQUZvRTtHQUF0RTs7QUFLQSxXQUFTLGNBQVQsQ0FBd0IsV0FBeEIsRUFBcUMsT0FBckMsRUFBOEMsV0FBVyxXQUFXLEVBQVgsRUFBZTtBQUN0RSxnQkFBWSxPQUFaLENBQW9CLFFBQVE7QUFDMUIsY0FBUSxJQUFSLENBQWEsZ0JBQWIsRUFBK0IsRUFBQyxNQUFNLElBQU4sRUFBaEMsRUFEMEI7S0FBUixDQUFwQixDQURzRTtBQUl0RSxZQUFRLEVBQVIsQ0FBVyxpQkFBWCxFQUE4QixRQUE5QixFQUpzRTtHQUF4RTs7QUFPQSxTQUFPO0FBQ0wsbUJBQWUsYUFBZjtBQUNBLG9CQUFnQixjQUFoQjtHQUZGLENBYm9CO0NBQXRCIiwiZmlsZSI6ImZhY3Rvcmllcy9jb21tb25fZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIvd2ViL3N0YXRpYy9qcy8ifQ==
