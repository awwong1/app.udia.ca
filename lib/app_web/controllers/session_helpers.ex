defmodule AppWeb.SessionHelpers do
  import Plug.Conn
  import Cldr.Plug.SetLocale

  @doc """
  Puts the remote_ip conn variable into the conn assignments and session.
  """
  def assign_remote_ip(conn, _opts) do
    conn
    |> assign(:remote_ip, conn.remote_ip)
    |> put_session(:remote_ip, conn.remote_ip)
  end

  def assign_cldr_locale(conn, _opts) do
    locale = get_cldr_locale(conn)

    conn
    |> assign(:locale, locale)
    |> put_session(:locale, locale)
  end
end
