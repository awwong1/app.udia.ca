defmodule WebhooksController do
  use AppWeb, :controller

  def webhooks(%Plug.Conn{assigns: %{stripe_event: stripe_event}} = conn, _params) do
    case handle_webhook(stripe_event) do
      {:ok, _} -> handle_success(conn)
      {:error, error} -> handle_error(conn, error)
      _ -> handle_error(conn, "error")
    end
  end

  defp handle_success(conn) do
    conn
    |> put_resp_content_type("text/plain")
    |> send_resp(200, "ok")
  end

  defp handle_error(conn, error) do
    conn
    |> put_resp_content_type("text/plain")
    |> send_resp(422, error)
  end

  defp handle_webhook(%{type: "invoice.created"} = stripe_event) do
    # handle invoice created webhook
    {:ok, "success"}
  end

  defp handle_webhook(%{type: "invoice.payment_succeeded"} = stripe_event) do
    # handle invoice payment_succeeded webhook
    {:ok, "success"}
  end

  defp handle_webhook(%{type: "invoice.payment_failed"} = stripe_event) do
    # handle invoice payment_failed webhook
    {:ok, "success"}
  end
end
