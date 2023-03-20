const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

// Access the camera and display the video
navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } })
  .then(function(stream) {
    video.srcObject = stream;
    video.play();
  })
  .catch(function(err) {
    console.log("An error occurred: " + err);
  });

// Start recording on button click
startBtn.addEventListener("click", function() {
  startBtn.disabled = true;
  stopBtn.disabled = false;
  startRecording();
});

// Stop recording on button click
stopButton.addEventListener("click", function() {
  startBtn.disabled = false;
  stopBtn.disabled = true;
  stopRecording();
});

let mediaRecorder;
let chunks = [];

// Start recording function
function startRecording() {
  chunks = [];
  mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  mediaRecorder.ondataavailable = function(e) {
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
  setTimeout(function() {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}
