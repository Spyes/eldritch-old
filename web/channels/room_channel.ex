defmodule Eldritch.RoomChannel do
	use Phoenix.Channel
	alias Eldritch.Server
	require IEx

	def join("rooms:lobby", params, socket) do
		Server.player_joined(:lobby, params["username"])
		players = Server.get_all_players(:lobby)
		send(self, :after_join)
		{:ok, %{players: players}, assign(socket, :username, params["username"])}
	end
	def join("rooms:" <> room_id, params, socket) do
		Server.player_joined(room_id, params["username"])
		players = Server.get_all_players(room_id)
		send(self, :after_join)
		{:ok, %{players: players}, assign(socket, :room, room_id)}
	end
	
	def handle_info(:after_join, socket) do
		players = Server.get_all_players(:lobby)
		broadcast! socket, "player:entered_lobby", %{players: players}
		{:noreply, socket}
	end

	def handle_in("create_room", params, socket) do
		Server.create_room(params["room"]["name"])
		rooms = Server.get_all_room_names
		broadcast socket, "room_names", %{rooms: rooms}
		{:reply, :ok, socket}
	end

	def handle_in("player:sent_message", %{"msg" => msg}, socket) do
		player = socket.assigns[:username]
		broadcast! socket, "player:sent_message", %{sender: player, msg: msg}
		{:noreply, socket}
	end
	
	def handle_in("get_collection", %{"coll" => coll}, socket) do
		case coll do
			"investigators" -> collection = Eldritch.Investigator
			"locations" -> collection = Eldritch.Location
			"ancient_ones" -> collection = Eldritch.AncientOne
		end
		data = Eldritch.Repo.all(collection)
		|> Enum.scan([], fn entity,_acc ->
			collection.__schema__(:fields)
			|> Enum.scan(%{},
				fn (key,_acc) ->
					{key, Map.get(entity, key)}
				end)
			|> Enum.into %{}
		end)
		broadcast! socket, "sent_collection", %{coll: coll, data: data}
		{:noreply, socket}
	end

	def handle_in("player_ready", params, socket) do
		alias Eldritch.Player
		player = %Player{username: params["username"], investigator: params["investigator"], ready: True}
		{:reply, :ok, assign(socket, :player, player)}
	end

	def handle_in("get_username", _msg, socket) do
		player = socket.assigns[:player]
		ret = %{username: Map.get(player, :username),
						investigator: Map.get(player, :investigator)}
		broadcast! socket, "sent_username", ret
		{:noreply, socket}
	end

	defp all_players_ready(room) do
		Enum.all?(room.players.all, fn (player) -> player.ready end)
	end
end
