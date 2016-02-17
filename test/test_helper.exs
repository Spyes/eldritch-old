ExUnit.start

Mix.Task.run "ecto.create", ~w(-r Eldritch.Repo --quiet)
Mix.Task.run "ecto.migrate", ~w(-r Eldritch.Repo --quiet)


