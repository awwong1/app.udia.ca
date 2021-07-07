# In this file, we load production configuration and secrets
# from environment variables. You can also hardcode secrets,
# although such is generally not recommended and you have to
# remember to add this file to your .gitignore.
use Mix.Config

database_url =
  System.get_env("DATABASE_URL") ||
    raise """
    environment variable DATABASE_URL is missing.
    For example: ecto://USER:PASS@HOST/DATABASE
    """

config :app, App.Repo,
  # ssl: true,
  url: database_url,
  pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10")

secret_key_base =
  System.get_env("SECRET_KEY_BASE") ||
    raise """
    environment variable SECRET_KEY_BASE is missing.
    You can generate one by calling: mix phx.gen.secret
    """

config :app, AppWeb.Endpoint,
  http: [
    port: String.to_integer(System.get_env("PORT") || "4000"),
    transport_options: [socket_opts: [:inet6]]
  ],
  secret_key_base: secret_key_base

config :app, App.Mailer,
  adapter: Swoosh.Adapters.SMTP,
  relay: "email-smtp.#{System.get_env("AWS_DEFAULT_REGION")}.amazonaws.com",
  username: {:system, "AWS_ACCESS_KEY"},
  password: {:system, "AWS_SECRET"},
  tls: :always,
  port: 587

# https://github.com/swoosh/swoosh/issues/344
# adapter: Swoosh.Adapters.AmazonSES,
# region: {:system, "AWS_DEFAULT_REGION"},
# access_key: {:system, "AWS_ACCESS_KEY"},
# secret: {:system, "AWS_SECRET"}

# ## Using releases (Elixir v1.9+)
#
# If you are doing OTP releases, you need to instruct Phoenix
# to start each relevant endpoint:
#
#     config :app, AppWeb.Endpoint, server: true
#
# Then you can assemble a release by calling `mix release`.
# See `mix help release` for more information.
