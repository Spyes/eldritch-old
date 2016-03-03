angular
  .module('Eldritch')
  .controller('LobbyController', LobbyController);

function LobbyController($rootScope, $controller, CommonData, $state) {
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
    vm.currentRoom = resp;
    registerSocketEvents($rootScope.channel);
    vm.showNewRoomForm = false;
    vm.chatMessages.push({sender: null,
			  msg: `--Joined room ${resp.name}--`,
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
    //console.log("Joined " + vm.newRoom.name + " successfully", resp);
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
      .receive("error", resp => { alert("Unable to join") });
  }

  function registerSocketEvents(channel) {
    channel.on("player:entered_room", payload => {
      vm.currentRoom.players = payload.players;
      $rootScope.$apply();
    });
    channel.on("players_in_room", payload => {
      vm.currentRoom = payload;
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
    channel.on("player_selected_investigator", payload => {
      vm.currentRoom.selected_investigators = payload.selected_investigators;
      $rootScope.$apply();
    });
    channel.on("selected_ancient_one", payload => {
      vm.currentRoom.ancient_one = payload.ancient_one;
      $rootScope.$apply();
    });
    channel.on("player_ready", payload => {
      vm.currentRoom.ready = payload.players_ready;
      $rootScope.$apply();
    });
    channel.on("all_players_ready", payload => {
      var params = {room: vm.currentRoom,
                    username: vm.username,
                    investigators: payload.investigators};
      $state.go('board', params);
//      $rootScope.$apply();
    });
  };
  
  function isAdmin(player) {
    return vm.currentRoom.admin === player;
  }

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

  vm.clickInvestigator = function (investigator) {
    $rootScope.channel.push("player_selected_investigator", {investigator: investigator.name});
  };

  vm.clickAncientOne = function (ancient_one) {
    if (!isAdmin(vm.username)) return;
    $rootScope.channel.push("select_ancient_one", {ancient_one: ancient_one.name});
  };

  vm.investigatorSelectedBy = function (investigator) {
    if (_.isUndefined(vm.currentRoom.selected_investigators) || _.isUndefined(vm.currentRoom.selected_investigators[investigator.name])) return "";
    return "[" + vm.currentRoom.selected_investigators[investigator.name] + "]";
  };

  vm.isAncientOneSelected = function (ancient_one) {
    if (_.isUndefined(vm.currentRoom.ancient_one)) return "";
    return "[selected]";
  };

  vm.playerReady = function () {
    if (vm.player_ready) return;
    $rootScope.channel.push("player_ready", {});
    vm.player_ready = true;
  };

  vm.isPlayerReady = function (player) {
    if (_.isUndefined(vm.currentRoom.ready)) return false;
    if (_.indexOf(vm.currentRoom.ready, player) > -1) return true;
    return false;
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
      .receive("error", resp => { alert("Unable to join!"); });
    $rootScope.channel.push("rooms:all", {});
  };
}
