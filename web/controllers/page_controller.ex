defmodule Eldritch.PageController do
  use Eldritch.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
