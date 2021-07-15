defmodule AppWeb.ThreeJSController do
  use AppWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end

  def basic_scene(conn, _params) do
    render(conn, "basic_scene.html")
  end

  def fancy_cube(conn, _params) do
    render(conn, "fancy_cube.html")
  end
end
