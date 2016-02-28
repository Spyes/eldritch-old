defmodule Eldritch.Server do
	use GenServer

	### External API
	def start_link do
		GenServer.start_link __MODULE__, %{lobby: %{players: [], admin: ""}}, name: __MODULE__
	end

	def player_joined(where, username) when is_atom(where) do
		GenServer.cast __MODULE__, {:player_joined, where, username}
	end

  def player_left(where, username) when is_atom(where) do
    GenServer.cast __MODULE__, {:player_left, where, username}
  end

	def get_all_players(where) when is_atom(where) do
		GenServer.call __MODULE__, {:get_all_players, where}
	end

  def create_room(room_id, username)
	when is_atom(room_id) and is_bitstring(username) do
		GenServer.call __MODULE__, {:create_room, room_id, username}
	end

  def player_selected_investigator(username, where, investigator) do
    GenServer.call __MODULE__, {:player_selected_investigator, username, where, investigator}
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
		  nil -> {:reply, :ok, update_in(rooms[room_id], fn _ -> %{players: [], admin: creator} end)}
		  _   -> {:reply, {:error, %{msg: "Room name already taken!"}}, rooms} 
    end
	end
	def handle_call({:get_all_players, where}, _from, rooms) do
		{:reply, rooms[where], rooms}
	end
	def handle_call(:get_all_room_names, _from, rooms) do
		{:reply, Map.keys(rooms), rooms}
	end
  def handle_call({:player_selected_investigator, username, where, investigator}, _from, rooms) do
    selected_investigators = Map.update(rooms[where], :selected_investigators, %{investigator => username}, %{investigator => username})
    {:reply, selected_investigators, Map.put(rooms, where, selected_investigators)}
  end
end
