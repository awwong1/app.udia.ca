defmodule AppWeb.SessionSetTimezoneController do
  use AppWeb, :controller

  def set(conn, %{"timezone" => timezone}) when is_binary(timezone) do
    conn |> put_session(:timezone, timezone) |> json(%{timezone: timezone})
  end
end
