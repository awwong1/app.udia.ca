defmodule AppWeb.ThreeJSController do
  use AppWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end

  def scene(conn, %{"id" => id}) do
    conn = assign(conn, :id, id)
    render(conn, "scene.html")
  end

  def fancy_cube(conn, _params) do
    render(conn, "fancy_cube.html")
  end
end
