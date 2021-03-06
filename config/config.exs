# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :app,
  ecto_repos: [App.Repo],
  generators: [binary_id: true]

# Configures the endpoint
config :app, AppWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "DEYzFjMr8J1i0M9Ktq8DcydNYNQ5xDnQT6ZtX0Dlt6Shdj5d+jnlG2Lrgjpnzh4P",
  render_errors: [view: AppWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: App.PubSub,
  live_view: [signing_salt: "RPtS41ed"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Common Locale Data Repository (CLDR)
# https://github.com/elixir-cldr/cldr
config :ex_cldr,
  default_locale: "en",
  default_backend: App.Cldr,
  json_library: Jason

config :gettext, :default_locale, "en"

# Stripe Payments Integration
config :stripity_stripe,
  api_key: System.get_env("STRIPE_SECRET_KEY"),
  signing_secret: System.get_env("STRIPE_WEBHOOK_SIGNING_SECRET")

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
