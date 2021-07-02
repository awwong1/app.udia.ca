defmodule AppWeb.PageLiveTest do
  use AppWeb.ConnCase

  import Phoenix.LiveViewTest

  test "disconnected and connected render", %{conn: conn} do
    {:ok, page_live, disconnected_html} = live(conn, "/")
    assert disconnected_html =~ "time"
    assert render(page_live) =~ "time"
  end
end
