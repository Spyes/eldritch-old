defmodule Eldritch.AncientOne do
	use Eldritch.Web, :model

	schema "ancient_ones" do
		field :name, :string
		field :doom, :integer
		field :mythos_deck, :map
	end
end
