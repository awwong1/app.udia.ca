defmodule AppWeb.LiveHelpers do
  import Phoenix.LiveView
  alias App.Accounts

  def assign_current_user(socket, session) do
    assign_new(
      socket,
      :current_user,
      fn ->
        Accounts.get_user_by_session_token(session["user_token"])
      end
    )
  end

  def assign_locale(socket, session) do
    assign_new(
      socket,
      :locale,
      fn -> session["locale"] end
    )
  end

  def assign_timezone(socket, session) do
    if Phoenix.LiveView.connected?(socket) do
      timezone =
        case Phoenix.LiveView.get_connect_params(socket) do
          %{"timezone" => timezone} -> timezone
          _ -> session["timezone"] || "Etc/UTC"
        end

      assign(socket, timezone: timezone)
    else
      assign(socket, timezone: session["timezone"] || "Etc/UTC")
    end
  end

  def assign_remote_ip(socket, session) do
    assign_new(
      socket,
      :remote_ip,
      fn -> session["remote_ip"] end
    )
  end
end
