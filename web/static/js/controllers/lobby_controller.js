angular
  .module('Eldritch')
  .controller('LobbyController', LobbyController);

function LobbyController($rootScope, $controller, CommonData) {
  var vm = this;
  $controller('GameController', {$scope: vm});
  vm.showLobby = false;
  vm.username = undefined;
  vm.chat_message = "";
  vm.chatMessages = [];
  vm.showNewRoomForm = false;
  vm.currentRoom = {name: "",
                    admin: "",
		    players: []};
  vm.newRoom = {name: "",
		password: undefined,
		max_players: 6};

  function after_join(resp) {
    vm.currentRoom.name = resp.room_id;
    vm.currentRoom.players = resp.players;
    vm.currentRoom.admin = resp.admin;
    registerSocketEvents($rootScope.channel);
    vm.showNewRoomForm = false;
    vm.chatMessages.push({sender: null,
			  msg: `--Joined room ${resp.room_id}--`,
			  styles: {italic: true}});
    $rootScope.$apply();
    if (vm.currentRoom.name !== "lobby") {
      CommonData.getCollections(["investigators", "ancient_ones"],
			       $rootScope.channel,
			       payload => {
				 $rootScope[payload.collection] = payload.data;
				 $rootScope.$apply();
			       });
    }
    console.log("Joined " + vm.newRoom.name + " successfully", resp);
  };

  function change_channel(room = vm.selectedRoom) {
    $rootScope.channel.leave();
    $rootScope.channel =
      $rootScope.socket.channel("rooms:" + room,
                                {username: vm.username});
    $rootScope.channel.join()
      .receive("ok", resp => {
        after_join(resp);
      })
      .receive("error", resp => { console.log("Unable to join", resp) });
  }

  function registerSocketEvents(channel) {
    channel.on("player:entered_room", payload => {
      vm.currentRoom.players = payload.players;
      $rootScope.$apply();
    });
    channel.on("players_in_room", payload => {
      vm.currentRoom.players = payload.players;
      $rootScope.$apply();
    });
    channel.on("player:sent_message", payload => {
      vm.chatMessages.push({sender: payload.sender, msg: payload.msg});
      $rootScope.$apply();
    });
    channel.on("rooms:names", payload => {
      vm.rooms = payload.rooms;
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
    if (!vm.newRoom.name) return;
    $rootScope.channel.push("create_room", {room: vm.newRoom})
      .receive("ok", resp => {
        change_channel(vm.newRoom.name);
        vm.newRoom = {name: "", password: undefined, max_players: 6};
      })
      .receive("error", resp => {
        alert(resp.error.msg);
      });
  };
  vm.clickRoom = function (index) {
    if (vm.rooms[index] === vm.currentRoom.name) return;
    vm.selectedRoom = vm.rooms[index];
  };
  vm.joinSelectedRoom = function () {
    if (!vm.selectedRoom) return;
    if (vm.selectedRoom === "lobby") vm.enterLobby();
    else change_channel();
  };

  vm.enterLobby = function () {
    if (!vm.username) return;
    if ($rootScope.channel) $rootScope.channel.leave();
    $rootScope.channel = $rootScope.socket.channel("rooms:lobby", {username: vm.username});
    $rootScope.channel.join()
      .receive("ok", resp => {
        after_join(resp);
	vm.showLobby = true;
      })
      .receive("error", resp => { console.log("Unable to join", resp); });
    $rootScope.channel.push("rooms:all", {});
  };
}
