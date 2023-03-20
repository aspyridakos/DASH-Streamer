navigator.mediaDevices.enumerateDevices().then((devices) => {
  devices.forEach((device) => {
    console.log(device); // an InputDeviceInfo object if the device is an input device, otherwise a MediaDeviceInfo object.
  });
});

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

let stream;
let mediaRecorder;
let chunks = [];

// Access the camera and display the video
navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } })
  .then(function (s) {
    stream = s;
    video.srcObject = stream;
    video.play();
  })
  .catch(function (err) {
    console.log("An error occurred: " + err);
  });

// Start recording on button click
startBtn.addEventListener("click", function () {
  startBtn.disabled = true;
  stopBtn.disabled = false;
  startRecording();
});

// Stop recording on button click
stopBtn.addEventListener("click", function () {
  startBtn.disabled = false;
  stopBtn.disabled = true;
  stopRecording();
});

// Start recording function
function startRecording() {
  chunks = [];
  mediaRecorder = new MediaRecorder(stream, {
    mimeType: "video/webm; codecs=avc1.64001F",
    videoBitsPerSecond: 5000000 // 5 Mbps
  });
  mediaRecorder.ondataavailable = function (e) {
    chunks.push(e.data);
  };
  mediaRecorder.start();
}

// Stop recording function
function stopRecording() {
  mediaRecorder.stop();
  const blob = new Blob(chunks, { type: "video/webm" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "recording.webm";
  document.body.appendChild(a);
  a.click();
  setTimeout(function () {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}

