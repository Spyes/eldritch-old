defmodule Eldritch.Server do
	use GenServer

	### External API
	def start_link do
		GenServer.start_link __MODULE__, %{lobby: %{players: [], admin: "", ancient_one: ""}}, name: __MODULE__
	end

	def player_joined(where, username) when is_atom(where) do
		GenServer.cast __MODULE__, {:player_joined, where, username}
	end

  def player_left(where, username) when is_atom(where) do
    GenServer.cast __MODULE__, {:player_left, where, username}
  end

	def get_all_players_in_room(where) when is_atom(where) do
		GenServer.call __MODULE__, {:get_all_players_in_room, where}
	end

  def get_room_admin(where) when is_atom(where) do
    GenServer.call __MODULE__, {:get_room_admin, where}
  end

  def create_room(room_id, username)
	when is_atom(room_id) and is_bitstring(username) do
		GenServer.call __MODULE__, {:create_room, room_id, username}
	end

  def player_selected_investigator(username, where, investigator) do
    GenServer.call __MODULE__, {:player_selected_investigator, username, where, investigator}
  end

  def selected_ancient_one(where, ancient_one) do
    GenServer.call __MODULE__, {:selected_ancient_one, where, ancient_one}
  end

	def get_all_room_names do
		GenServer.call __MODULE__, :get_all_room_names
	end
	
	### GenServer implementation
	def handle_cast({:player_joined, where, username}, rooms) do
		case rooms[where] do
      nil -> {:noreply, rooms}
      _ -> {:noreply, Map.put(rooms, where, Map.put(rooms[where], :players, rooms[where][:players] ++ [username]))}
    end
	end
  def handle_cast({:player_left, where, username}, rooms) do
    {:noreply, Map.put(rooms, where, Map.put(rooms[where], :players, rooms[where][:players] -- [username]))}
  end

	def handle_call({:create_room, room_id, creator}, _from, rooms) do
    case rooms[room_id] do
		  nil -> {:reply, :ok, update_in(rooms[room_id], fn _ -> %{players: [], admin: creator, selected_investigators: %{}} end)}
		  _   -> {:reply, {:error, %{msg: "Room name already taken!"}}, rooms} 
    end
	end

	def handle_call({:get_all_players_in_room, where}, _from, rooms) do
		{:reply, rooms[where], rooms}
	end

  def handle_call({:get_room_admin, where}, _from, rooms) do
    {:reply, rooms[where][:admin], rooms}
  end

	def handle_call(:get_all_room_names, _from, rooms) do
		{:reply, Map.keys(rooms), rooms}
	end

  def handle_call({:player_selected_investigator, username, where, investigator}, _from, rooms) do
    selected_investigators =
		  case rooms[where][:selected_investigators][investigator] do
			  nil -> put_in(rooms[where][:selected_investigators][investigator], username)
			  _   -> update_in(rooms[where][:selected_investigators][investigator], fn _ -> username end)
		  end
    {:reply, selected_investigators[where][:selected_investigators], selected_investigators}
  end

  def handle_call({:selected_ancient_one, where, ancient_one}, _from, rooms) do
    ancient_one =
      case rooms[where][:ancient_one] do
        nil -> put_in(rooms[where][:ancient_one], ancient_one)
        _   -> update_in(rooms[where][:ancient_one], fn _ -> ancient_one end)
      end
    {:reply, ancient_one[where][:ancient_one], ancient_one}
  end
end
