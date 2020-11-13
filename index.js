// We use latest Javascript feature to import external libraries to
// the page without using <script> tags

import Websocket from "https://cdn.skypack.dev/reconnecting-websocket";
import * as Tone from "https://cdn.skypack.dev/tone";

// Replace with your personal channelname for testing
// Will be connected to https://elektron.live/residence

const channel = "residence";

// User ID and name will be used when posting
// messages to elektron.live. You can use existing
// user credentials or come up with a new ones

const userId = "sadeaaasidyrawa";
const userName = "ToneJS user";

// Open websocket connection

const url = "wss://ws-fggq5.ondigitalocean.app";
const socket = new Websocket(url);

// Set up the synth

const synth = new Tone.Synth().toDestination();

// Browsers require an user action to start audio
// so we create a button to start an audio engine

const button = document.getElementById("start");
button.addEventListener("click", () => Tone.start());

// Send HTML slider value to websocket

const slider = document.getElementById("slider");
slider.addEventListener("input", (e) => {
  socket.send(
    createMessage({
      userId,
      userName,
      channel,
      type: "ANYTHING",
      // Convert form slider value to a number
      value: parseFloat(e.target.value),
    })
  );
});

// Receive a slider value from websocket

socket.addEventListener("message", ({ data }) => {
  const message = safeJsonParse(data);
  if (message.type === "ANYTHING" && message.channel === channel) {
    // Message value is between 0 and 127, we map it to 0 to 1270 Hz
    synth.triggerAttackRelease(message.value * 10, "2n");
    // Also set a local slider value
    slider.value = message.value;
  }
});

// Helper function to create a websocket message

const createMessage = (message) => {
  const id = "abcdefghijklmnopqrstuvwxyz"
    .split("")
    .sort(() => Math.random() - 0.5)
    .slice(0, 16)
    .join("");
  return JSON.stringify({
    id,
    datetime: new Date().toISOString(),
    type: "",
    channel: "",
    userId: "",
    userName: "",
    value: "",
    ...message,
  });
};

// Helper function to parse string and binaries into JSON

const safeJsonParse = (str) => {
  try {
    return JSON.parse(str);
  } catch (err) {
    return null;
  }
};
