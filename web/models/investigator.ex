defmodule Eldritch.Investigator do
	use Eldritch.Web, :model

	schema "investigators" do
		field :name, :string
		field :health, :float
		field :influence, :float
		field :lore, :float
		field :max_health, :float
		field :max_sanity, :float
		field :observation, :float
		field :occupation, :string
		field :sanity, :float
		field :starting_location, :string
		field :strength, :float
		field :will, :float
		field :starting_items, :map
	end

	@required_fields ~w(name)
  @optional_fields ~w()

  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end
end
