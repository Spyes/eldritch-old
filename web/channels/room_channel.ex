defmodule Eldritch.RoomChannel do
	use Phoenix.Channel

	def join("rooms:lobby", _message, socket) do
		{:ok, socket}
	end
	def join("rooms:" <> _private_room_id, _params, _socket) do
		{:error, %{reason: "unauthorized"}}
	end

	def handle_in("get_investigators", %{}, socket) do
		investigators = Eldritch.Repo.all(Eldritch.Investigator)
		data = Enum.scan(investigators, [], fn investigator,_acc ->
			Eldritch.Investigator.__schema__(:fields)
			|> Enum.scan(%{},
				fn (key,_acc) ->
					{key, Map.get(investigator, key)}
				end)
			|> Enum.into %{}
		end)
		broadcast! socket, "sent_investigators", %{body: data}
		{:noreply, socket}
	end
end
