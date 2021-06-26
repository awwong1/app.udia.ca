# LiveView Studio

Following the Live View course.

## Development Environment

`elixir --version`
```
Erlang/OTP 23 [erts-11.2.1] [source] [64-bit] [smp:8:8] [ds:8:8:10] [async-threads:1]
Elixir 1.11.4 (compiled with Erlang/OTP 23)
```
`node --version`
```
v14.17.1
```
`docker --version`
```
Docker version 20.10.7, build f0df350
```

```bash
# fetch Postgres from Docker and mount a local volume for persistence
docker pull postgres:12.7-alpine
mkdir -p pgdata
docker run \
  --rm \
  --name pg-app-udia \
  --env POSTGRES_DB=app_udia_dev \
  --env POSTGRES_USER=postgres \
  --env POSTGRES_PASSWORD=postgres \
  --publish 5432:5432 \
  --volume pgdata:/var/lib/postgresql/data \
  --detach \
  postgres:12.7-alpine

# Fetch elixir dependencies, setup DB, and install Node.js dependencies
mix setup
# Start the application
mix phx.server
```

### Dependencies and Tools

* [Visual Studio Code](https://code.visualstudio.com/)
    * [jakebecker.elixir-ls](https://marketplace.visualstudio.com/items?itemName=JakeBecker.elixir-ls)
    * [RoyalMist.vscode-eex-format](https://marketplace.visualstudio.com/items?itemName=RoyalMist.vscode-eex-format)
* [Kiex](https://github.com/taylor/kiex)
* [Kerl](https://github.com/kerl/kerl)


## Installation

1. Set up the project:

    ```sh
    mix setup
    ```

2. Fire up the Phoenix endpoint:

    ```sh
    mix phx.server
    ```

3. Visit [`localhost:4000`](http://localhost:4000) from your browser.

## App Generation

This app was generated using:

```sh
mix phx.new app --live --binary-id --verbose
```
