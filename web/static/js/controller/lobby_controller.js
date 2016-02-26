angular
  .module('Eldritch')
  .controller('LobbyController', LobbyController);

function LobbyController($rootScope) {
  var vm = this;
  vm.showLobby = false;
  vm.username = undefined;
  vm.chat_message = "";
  vm.chatMessages = [];
  vm.showNewRoomForm = false;
  vm.currentRoom = {name: "",
		    players: []};
  vm.newRoom = {name: "",
		password: undefined,
		max_players: 6};

  vm.registerSocketEvents = function (channel) {
    channel.on("player:entered_room", function (payload) {
      vm.currentRoom.players = payload.players;
      $rootScope.$apply();
    });
    channel.on("player:sent_message", function (payload) {
      vm.chatMessages.push({sender: payload.sender, msg: payload.msg});
      $rootScope.$apply();
    });
  };
  
  vm.sendChatMessage = function () {
    $rootScope.channel.push("player:sent_message", {msg: vm.chat_message});
    vm.chat_message = "";
  };
  
  vm.openNewRoomForm = function () {
    vm.showNewRoomForm = true;
  };
  vm.closeNewRoomForm = function () {
    vm.showNewRoomForm = false;
  };
  vm.createNewRoom = function () {
    $rootScope.channel.push("create_room", {room: vm.newRoom})
      .receive("ok", resp => {})
      .receive("error", resp => {return;});
    $rootScope.channel.on("new_room_created", resp => {
      $rootScope.channel.leave();
      $rootScope.channel = $rootScope.socket.channel("rooms:" + vm.newRoom.name, {username: vm.username});
      $rootScope.channel.join()
	.receive("ok", resp => {
	  console.log(resp);
	  vm.currentRoom.name = vm.newRoom.name;
	  vm.currentRoom.players = resp.players;
	  vm.registerSocketEvents($rootScope.channel);
	  $rootScope.$apply();
	  console.log("Joined " + vm.newRoom.name + " successfully", resp);
	})
	.receive("error", resp => { console.log("Unable to join", resp) });
    });
  };
  
  vm.enterLobby = function () {
    if (!vm.username) return;
    $rootScope.channel = $rootScope.socket.channel("rooms:lobby", {username: vm.username});
    $rootScope.channel.join()
      .receive("ok", resp => {
	vm.currentRoom.name = "lobby";
	vm.currentRoom.players = resp.players;
	vm.showLobby = true;
	vm.registerSocketEvents($rootScope.channel);
	$rootScope.$apply();
	console.log("Joined successfully", resp)
      })
      .receive("error", resp => { console.log("Unable to join", resp) });
  }
}
