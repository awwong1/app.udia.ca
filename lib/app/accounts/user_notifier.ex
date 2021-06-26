defmodule App.Accounts.UserNotifier do
  import Swoosh.Email
  alias App.Mailer

  defp deliver(to_email, subject_line, body) do
    require Logger
    Logger.debug(subject_line, body)

    new()
    |> to(to_email)
    |> from({"UDIA", "noreply@udia.ca"})
    |> subject(subject_line)
    |> text_body(body)
    |> Mailer.deliver

    {:ok, %{to: to_email, body: body}}
  end

  @doc """
  Deliver instructions to confirm account.
  """
  def deliver_confirmation_instructions(user, url) do
    deliver(user.email, "Confirm Email Address", """

    ==============================

    Hi #{user.email},

    You can confirm your account by visiting the URL below:

    #{url}

    If you didn't create an account with us, please ignore this.

    ==============================
    """)
  end

  @doc """
  Deliver instructions to reset a user password.
  """
  def deliver_reset_password_instructions(user, url) do
    deliver(user.email, "Reset Account Password", """

    ==============================

    Hi #{user.email},

    You can reset your password by visiting the URL below:

    #{url}

    If you didn't request this change, please ignore this.

    ==============================
    """)
  end

  @doc """
  Deliver instructions to update a user email.
  """
  def deliver_update_email_instructions(user, url) do
    deliver(user.email, "Update Email Address", """

    ==============================

    Hi #{user.email},

    You can change your email by visiting the URL below:

    #{url}

    If you didn't request this change, please ignore this.

    ==============================
    """)
  end
end
