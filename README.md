# app.udia.ca

* [app.udia.ca](https://app.udia.ca)

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
# Start the application interactively
iex -S mix phx.server
```

Application should now be running and accessible at [`localhost:4000`](http://localhost:4000) from your browser.

### Dependencies and Tools

* [Visual Studio Code](https://code.visualstudio.com/)
    * [jakebecker.elixir-ls](https://marketplace.visualstudio.com/items?itemName=JakeBecker.elixir-ls)
    * [RoyalMist.vscode-eex-format](https://marketplace.visualstudio.com/items?itemName=RoyalMist.vscode-eex-format)
* [Kiex](https://github.com/taylor/kiex)
* [Kerl](https://github.com/kerl/kerl)

## Production Environment

* [Gigalixir](https://www.gigalixir.com/) - Platform as a Service.
```bash
gigalixir version
# 1.2.0

# Deploy app https://gigalixir.readthedocs.io/en/latest/getting-started-guide.html#deploy
git push gigalixir
# Run DB migrations https://gigalixir.readthedocs.io/en/latest/database.html#how-to-run-migrations
gigalixir run mix ecto.migrate
```
* [Supabase](https://supabase.io/) - Managed PostgreSQL database.
  * Ensure that the [pool mode is set to `Session`](https://supabase.io/blog/2021/04/02/supabase-pgbouncer#pool-modes) (not `Transaction` or `Statement`) otherwise runtime SQL statement errors may occur
  * Manually enable the [`citext` extension](https://www.postgresql.org/docs/9.1/citext.html) (data type for case-insensitive character strings)

## Notable Environment Variables

* `MIX_ENV`: [Elixir Mix environment selection](https://hexdocs.pm/mix/1.12/Mix.html#module-environments)
* `SECRET_KEY_BASE`: generate one by calling `mix phx.gen.secret`
* `APP_HOST`: [FQDN](https://en.wikipedia.org/wiki/Fully_qualified_domain_name) of web application (e.g. "app.udia.ca")
* `PORT`: http server port to bind on
* `DATABASE_URL`: [PostgreSQL Connection URI](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)
* `POOL_SIZE`: PostgreSQL connection pool size
* `AWS_DEFAULT_REGION`: [Amazon Web Services Region](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html#cli-configure-quickstart-region) for Simple Email Service
* `AWS_ACCESS_KEY`: [Amazon Web Services Access Key ID](https://docs.aws.amazon.com/general/latest/gr/aws-access-keys-best-practices.html) for Simple Email Service
* `AWS_SECRET`: [Amazon Web Services Secret Key](https://docs.aws.amazon.com/general/latest/gr/aws-access-keys-best-practices.html) for Simple Email Service

# License

[GNU Affero General Public License, Version 3](https://www.gnu.org/licenses/agpl-3.0.html)
```text
Copyright (C) 2021 Alexander William Wong

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
```