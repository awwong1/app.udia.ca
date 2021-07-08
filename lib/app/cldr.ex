defmodule App.Cldr do
  @moduledoc """
  Define a backend module that will host our
  Cldr configuration and public API.

  Most function calls in Cldr will be calls
  to functions on this module.
  """
  use Cldr,
    # locales: ~w(en fr zh th),
    locales: ~w(en),
    gettext: AppWeb.Gettext,
    providers: [Cldr.Number, Cldr.Calendar, Cldr.DateTime]
end
