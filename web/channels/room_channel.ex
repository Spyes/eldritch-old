defmodule Eldritch.RoomChannel do
	use Phoenix.Channel
	alias Eldritch.Server
  alias Eldritch.Repo
	require IEx

	def join("rooms:" <> room_id, params, socket) do
		String.to_atom(room_id) |> Server.player_joined(params["username"])
		send(self, :after_join)
    socket = assign(socket, :username, params["username"])
    room = String.to_atom(room_id) |> Server.get_room
		{:ok, room, assign(socket, :room, String.to_atom(room_id))}
	end
  def terminate(_params, socket) do
    socket.assigns[:room] |> Server.player_left(socket.assigns[:username])
    players = socket.assigns[:room] |> Server.get_all_players_in_room
    broadcast! socket, "players_in_room", %{players: players}
    {:ok, socket}
  end
	
	def handle_info(:after_join, socket) do
		players = Server.get_all_players_in_room(socket.assigns[:room])
		broadcast! socket, "player:entered_room", %{players: players}
		{:noreply, socket}
	end

  def handle_info(:after_ready, socket) do
    room_id = socket.assigns[:room]
    if all_players_ready?(room_id) do
      room = Server.get_room(room_id)
      investigators =
      Map.keys(room[:selected_investigators])
      |> Enum.scan([], fn investigator_name, _acc ->
        investigator = 
          Repo.get_by!(Eldritch.Investigator, name: investigator_name)
        |> transform_from_repo(Eldritch.Investigator)
        put_in(investigator[:current_location], investigator[:starting_location])
        |> Map.put(:player, room[:selected_investigators][investigator_name])
      end)
      broadcast! socket, "all_players_ready", %{investigators: investigators}
    end
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
			  "locations"     -> Eldritch.Location
			  "ancient_ones"  -> Eldritch.AncientOne
        _               -> {:noreply, socket}
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

	def handle_in("player_ready", _params, socket) do
    username = socket.assigns[:username]
    room = socket.assigns[:room]
    ready = Server.player_ready(room, username)
    broadcast! socket, "player_ready", %{"players_ready" => ready}
    send(self, :after_ready)
    {:noreply, assign(socket, :ready, true)}
	end
  
  defp all_players_ready?(room) do
    room = Server.get_room(room)
    ready = room[:ready]
    players = room[:players]
    Enum.sort(ready) == Enum.sort(players)
  end
  
  defp get_from_repo(collection) do
    Repo.all(collection)
		|> Enum.scan([], fn entity,_acc ->
      transform_from_repo(entity, collection)
		end)
  end

  defp transform_from_repo(entity, collection) do
		collection.__schema__(:fields)
		|> Enum.scan(%{},
			fn (key,_acc) ->
				{key, Map.get(entity, key)}
			end)
		|> Enum.into(%{})
  end
end
