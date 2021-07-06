defmodule AppWeb.PageLive do
  use AppWeb, :live_view

  def mount(_params, session, socket) do
    socket = assign_timezone(socket, session)
    socket = assign(socket, refresh: 1, time: Timex.now(socket.assigns.timezone))

    if connected?(socket), do: schedule_refresh(socket)
    {:ok, socket}
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

  def handle_info(:tick, socket) do
    timezone = socket.assigns.timezone
    socket = assign(socket, time: Timex.now(timezone))
    schedule_refresh(socket)
    {:noreply, socket}
  end

  defp schedule_refresh(socket) do
    Process.send_after(self(), :tick, socket.assigns.refresh * 1000)
  end

  def to_datestring(date, locale) do
    {:ok, str} = App.Cldr.DateTime.to_string(date, locale: locale, format: :long)
    str
  end

  def render(assigns) do
    ~L"""
    <section class="time">
      <h1><%= to_datestring(@time, "en") %></h1>
    </section>
    """
  end
end
