defmodule Eldritch.RoomChannel do
	use Phoenix.Channel
	alias Eldritch.Server
	require IEx

	def join("rooms:" <> room, params, socket) do
		String.to_atom(room) |> Server.player_joined(params["username"])
		players = String.to_atom(room) |> Server.get_all_players_in_room
		send(self, :after_join)
    socket = assign(socket, :username, params["username"])
		{:ok, put_in(players, [:room], room), assign(socket, :room, String.to_atom(room))}
	end
  def terminate(_params, socket) do
    socket.assigns[:room] |> Server.player_left(socket.assigns[:username])
    players = socket.assigns[:room] |> Server.get_all_players_in_room
    broadcast! socket, "players_in_room", players
    {:ok, socket}
  end
	
	def handle_info(:after_join, socket) do
		players = Server.get_all_players_in_room(socket.assigns[:room])
		broadcast! socket, "player:entered_room", players
		{:noreply, socket}
	end

	def handle_in("rooms:all", _params, socket) do
		rooms = Server.get_all_room_names
		broadcast! socket, "rooms:names", %{rooms: rooms}
		{:noreply, socket}
	end
	def handle_in("create_room", params, socket) do
		status = String.to_atom(params["room"]["name"]) |> Server.create_room(socket.assigns[:username])
    case status do
      {:error, msg} -> {:reply, {:error, %{error: msg}}, socket}
      :ok -> rooms = Server.get_all_room_names
		    broadcast! socket, "rooms:names", %{status: status, rooms: rooms}
		    {:reply, :ok, socket}
    end
	end

	def handle_in("player:sent_message", %{"msg" => msg}, socket) do
		player = socket.assigns[:username]
		broadcast! socket, "player:sent_message", %{sender: player, msg: msg}
		{:noreply, socket}
	end
	
	def handle_in("get_collection", %{"coll" => coll}, socket) do
    collection =
		  case coll do
			  "investigators" -> Eldritch.Investigator
			  "locations" -> Eldritch.Location
			  "ancient_ones" -> Eldritch.AncientOne
        _ -> {:noreply, socket}
		  end
		data = get_from_repo(collection)
		broadcast! socket, "sent_collection", %{collection: coll, data: data}
		{:noreply, socket}
	end

  def handle_in("player_selected_investigator", %{"investigator" => investigator}, socket) do
    room = socket.assigns[:room]
    username = socket.assigns[:username]
    selected_investigators = Server.player_selected_investigator(username, room, investigator)
    broadcast! socket, "player_selected_investigator", %{selected_investigators: selected_investigators}
    {:noreply, socket}
  end

  def handle_in("select_ancient_one", %{"ancient_one" => ancient_one}, socket) do
    room = socket.assigns[:room]
    username = socket.assigns[:username]
    if Server.get_room_admin(room) !== username, do: {:noreply, socket}
    Server.selected_ancient_one(room, ancient_one)
    broadcast! socket, "selected_ancient_one", %{"ancient_one" => ancient_one}
    {:noreply, socket}
  end

	def handle_in("player_ready", params, socket) do
		alias Eldritch.Player
		player = %Player{username: params["username"], investigator: params["investigator"], ready: True}
		{:reply, :ok, assign(socket, :player, player)}
	end

	defp all_players_ready?(room) do
		Enum.all?(room.players.all, fn (player) -> player.ready end)
	end
  defp get_from_repo(collection) do
    Eldritch.Repo.all(collection)
		|> Enum.scan([], fn entity,_acc ->
			collection.__schema__(:fields)
			|> Enum.scan(%{},
				fn (key,_acc) ->
					{key, Map.get(entity, key)}
				end)
			|> Enum.into(%{})
		end)
  end
end
