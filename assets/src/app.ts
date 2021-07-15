import "../css/app.scss"

import "phoenix_html"
import { Socket } from "phoenix"
import { LiveSocket } from "phoenix_live_view"

interface TimePayload {
  utcOffset: number;
  timezone: string;
}

declare global {
  interface Window {
    liveSocket: LiveSocket;
  }
}

function sendCoordinatedUniversalTimeOffset(csrfToken: string, { utcOffset, timezone }: TimePayload) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", '/api/session/set-timezone', true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("x-csrf-token", csrfToken);
  const payload = JSON.stringify({ utcOffset, timezone })
  xhr.send(payload);
}

function main() {
  const csrfDom = document.querySelector("meta[name='csrf-token']");
  const csrfToken = csrfDom && csrfDom.getAttribute("content") || "";
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
  const utcOffset = -(new Date().getTimezoneOffset() / 60);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  sendCoordinatedUniversalTimeOffset(csrfToken, { utcOffset, timezone })

  const params = { _csrf_token: csrfToken, utcOffset, timezone };
  const liveSocket = new LiveSocket("/live", Socket, { params });

  // Show progress bar on live navigation and form submits
  // topbar.config({ barColors: { 0: "#29d" }, shadowColor: "rgba(0, 0, 0, .3)" })
  // window.addEventListener("phx:page-loading-start", info => topbar.show())
  // window.addEventListener("phx:page-loading-stop", info => topbar.hide())

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