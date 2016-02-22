defmodule Eldritch.Location do
	use Eldritch.Web, :model
	use Ecto.Model
	use Eldritch.Schema

	schema "locations" do
		field :clue, :boolean
		field :continent, :string
		field :connections, :map
		field :coords, :map
		field :expedition_token, :boolean
		field :gate, :boolean
		field :monsters, {:array, :string}
		field :name, :string
		field :type, :string

		@required_fields ~w(name)
		@optional_fields ~w()

		def changeset(model, params \\ :empty) do
			model
			|> cast(params, @required_fields, @optional_fields)
		end
	end
end
