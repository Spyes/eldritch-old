defmodule Eldritch.Player do
	use Eldritch.Web, :model

	schema "player" do
		field :username, :string
		field :investigator, :map
		field :ready, :boolean
	end

	@required_fields ~w()
	@optional_fields ~w()
	
	def changeset(model, params \\ :empty) do
		model
		|> cast(params, @required_fields, @optional_fields)
	end
end
