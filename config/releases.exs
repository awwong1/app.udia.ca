import Config

app_host = System.get_env("APP_HOST")

config :app, AppWeb.Endpoint,
  server: true,
  url: [host: app_host, scheme: "https"],
  http: [port: {:system, "PORT"}],
  cache_static_manifest: "priv/static/cache_manifest.json",
  check_origin: ["//#{app_host}", "//app-udia-ca.gigalixirapp.com/"]
