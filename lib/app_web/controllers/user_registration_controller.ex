defmodule AppWeb.UserRegistrationController do
  use AppWeb, :controller

  alias App.Accounts
  alias App.Accounts.User
  alias AppWeb.UserAuth

  def create(conn, %{"user" => user_params}) do
    case Accounts.register_user(user_params) do
      {:ok, user} ->
        {:ok, _} =
          Accounts.deliver_user_confirmation_instructions(
            user,
            &Routes.user_confirmation_url(conn, :confirm, &1)
          )

        conn
        |> put_flash(:info, "User created successfully.")
        |> UserAuth.log_in_user(user)

      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> redirect(to: Routes.user_registration_path(conn, :new), changeset: changeset)
    end
  end
end
