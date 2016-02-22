defmodule Eldritch.RoomChannel do
	use Phoenix.Channel

	def join("rooms:lobby", _message, socket) do
		{:ok, socket}
	end
	def join("rooms:" <> _private_room_id, _params, _socket) do
		{:error, %{reason: "unauthorized"}}
	end

	def handle_in("get_collection", %{"coll" => coll}, socket) do
		case coll do
			"investigators" -> collection = Eldritch.Investigator
			"locations" -> collection = Eldritch.Location
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
end
