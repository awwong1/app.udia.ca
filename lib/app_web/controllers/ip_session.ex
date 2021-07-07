defmodule AppWeb.IpSession do
  import Plug.Conn

  @doc """
  Puts the remote_ip conn variable into the conn assignments and session.
  """
  def assign_remote_ip(conn, _opts) do
    conn
    |> assign(:remote_ip, conn.remote_ip)
    |> put_session(:remote_ip, conn.remote_ip)
  end
end
