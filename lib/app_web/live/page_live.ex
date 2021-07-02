defmodule AppWeb.PageLive do
  use AppWeb, :live_view

  def mount(_params, session, socket) do
    socket =
      socket
      |> assign(refresh: 1, time: Timex.now())
      |> assign_timezone(session)

    if connected?(socket), do: schedule_refresh(socket)
    {:ok, socket}
  end

  def assign_timezone(socket, session) do
    if Phoenix.LiveView.connected?(socket) do
      timezone =
        case Phoenix.LiveView.get_connect_params(socket) do
          %{"timezone" => timezone} -> timezone
          _ -> session["timezone"] || 0
        end

      assign(socket, timezone: timezone)
    else
      assign(socket, timezone: session["timezone"] || 0)
    end
  end

  def handle_info(:tick, socket) do
    socket = assign(socket, time: Timex.now())
    schedule_refresh(socket)
    {:noreply, socket}
  end

  defp schedule_refresh(socket) do
    Process.send_after(self(), :tick, socket.assigns.refresh * 1000)
  end

  def to_datestring(date, _locale, _timezone) when date == nil or date == "" do
    ""
  end

  def to_datestring(date, locale, timezone) when is_binary(date) do
    {:ok, parsed_date, _} = DateTime.from_iso8601(date)

    {:ok, str} =
      App.Cldr.DateTime.to_string(parsed_date |> Timex.shift(hours: timezone), locale: locale)

    str
  end

  @spec to_datestring(DateTime.t() | String.t(), String.t(), integer()) :: String.t()
  def to_datestring(date, locale, timezone) do
    {:ok, str} = App.Cldr.DateTime.to_string(date |> Timex.shift(hours: timezone), locale: locale)

    str
  end
end
