defmodule AppWeb.HomeController do
  use AppWeb, :controller

  def index(conn, _params) do
    assign(conn, :remote_ip, conn.remote_ip)
    render(conn, "index.html")
  end
end
