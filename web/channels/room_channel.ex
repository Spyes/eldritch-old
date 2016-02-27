defmodule Eldritch.RoomChannel do
	use Phoenix.Channel
	alias Eldritch.Server
	require IEx

	def join("rooms:" <> room_id, params, socket) do
		String.to_atom(room_id) |> Server.player_joined(params["username"])
		players = String.to_atom(room_id) |> Server.get_all_players
		send(self, :after_join)
    socket = assign(socket, :username, params["username"])
		{:ok, %{players: players, room_id: room_id}, assign(socket, :room, String.to_atom(room_id))}
	end
  def terminate(_params, socket) do
    socket.assigns[:room] |> Server.player_left(socket.assigns[:username])
    players = socket.assigns[:room] |> Server.get_all_players
    broadcast! socket, "players_in_room", %{players: players}
    {:ok, socket}
  end
	
	def handle_info(:after_join, socket) do
		players = Server.get_all_players(socket.assigns[:room])
		broadcast! socket, "player:entered_room", %{players: players}
		{:noreply, socket}
	end

	def handle_in("create_room", params, socket) do
		String.to_atom(params["room"]["name"]) |> Server.create_room
		rooms = Server.get_all_room_names
		broadcast! socket, "room_names", %{rooms: rooms}
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
        _ -> {:noreply, socket}
		end
		data = Eldritch.Repo.all(collection)
		|> Enum.scan([], fn entity,_acc ->
			collection.__schema__(:fields)
			|> Enum.scan(%{},
				fn (key,_acc) ->
					{key, Map.get(entity, key)}
				end)
			|> Enum.into(%{})
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
