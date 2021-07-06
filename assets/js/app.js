// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import "../css/app.scss"

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import deps with the dep name or local files with a relative path, for example:
//
//     import {Socket} from "phoenix"
//     import socket from "./socket"
//
import "phoenix_html"
import { Socket } from "phoenix"
import topbar from "topbar"
import { LiveSocket } from "phoenix_live_view"

function sendCoordinatedUniversalTimeOffset(csrfToken, {utcOffset, timezone}) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", '/api/session/set-timezone', true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("x-csrf-token", csrfToken);
  const payload = JSON.stringify({utcOffset, timezone})
  xhr.send(payload);
}

function main() {
  const csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
  const utcOffset = -(new Date().getTimezoneOffset() / 60);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  sendCoordinatedUniversalTimeOffset(csrfToken, {utcOffset, timezone})

  const params = { _csrf_token: csrfToken, utcOffset, timezone };
  const liveSocket = new LiveSocket("/live", Socket, { params });

  // Show progress bar on live navigation and form submits
  topbar.config({ barColors: { 0: "#29d" }, shadowColor: "rgba(0, 0, 0, .3)" })
  window.addEventListener("phx:page-loading-start", info => topbar.show())
  window.addEventListener("phx:page-loading-stop", info => topbar.hide())

  // connect if there are any LiveViews on the page
  liveSocket.connect()

  // expose liveSocket on window for web console debug logs and latency simulation:
  // >> liveSocket.enableDebug()
  // >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
  // >> liveSocket.disableLatencySim()
  window.liveSocket = liveSocket
}

if (document.readyState === "complete") {
  main();
} else {
  window.addEventListener("load", main);
}