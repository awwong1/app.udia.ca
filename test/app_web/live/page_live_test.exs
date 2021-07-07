defmodule AppWeb.PageLiveTest do
  use AppWeb.ConnCase

  import Phoenix.LiveViewTest

  test "path to controller renders disconnected live component", %{conn: conn} do
    conn = get(conn, Routes.home_path(conn, :index))
    assert html_response(conn, 200) =~ "time"
  end

  test "disconnected and connected render in isolation", %{conn: conn} do
    {:ok, page_live, html} = live_isolated(conn, AppWeb.PageLive, session: %{})
    assert html =~ "time"
    assert render(page_live) =~ "time"
  end
end
