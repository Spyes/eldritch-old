defmodule Eldritch.Server do
	use GenServer

	### External API
	def start_link do
		GenServer.start_link __MODULE__, %{lobby: []}, name: __MODULE__
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

  def create_room(room_id) when is_atom(room_id) do
		GenServer.call __MODULE__, {:create_room, room_id}
	end

	def get_all_room_names do
		GenServer.call __MODULE__, :get_all_room_names
	end
	
	### GenServer implementation
	def handle_cast({:player_joined, where, username}, rooms) do
		case rooms[where] do
			nil -> {:noreply, Map.put(rooms, where, [username])}
			_   -> {:noreply, update_in(rooms[where], &(&1 ++ [username]))} 
		end
	end
  def handle_cast({:player_left, where, username}, rooms) do
    {:noreply, update_in(rooms[where], &(&1 -- [username]))}
  end

	def handle_call({:create_room, room_id}, _from, rooms) do
    case rooms[room_id] do
		  nil -> {:reply, :ok, update_in(rooms[room_id], fn _ -> [] end)}
		  _   -> {:reply, {:error, %{msg: "Room name already taken!"}}, rooms} 
    end
	end
	def handle_call({:get_all_players, where}, _from, rooms) do
		{:reply, rooms[where], rooms}
	end
	def handle_call(:get_all_room_names, from, rooms) do
		{:reply, Map.keys(rooms), rooms}
	end
end
