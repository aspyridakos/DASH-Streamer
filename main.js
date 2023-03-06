let preview = document.getElementById("preview");
let recording = document.getElementById("recording");
let startButton = document.getElementById("startButton");
let stopButton = document.getElementById("stopButton");
let downloadButton = document.getElementById("downloadButton");
let logElement = document.getElementById("log");

let recordingTimeMS = 5000;

function startRecording(stream, lengthInMS) {
    let recorder = new MediaRecorder(stream);
    let data = [];
  
    recorder.ondataavailable = (event) => data.push(event.data);
    recorder.start();
    log(`${recorder.state} for ${lengthInMS / 1000} seconds…`);
  
    let stopped = new Promise((resolve, reject) => {
      recorder.onstop = resolve;
      recorder.onerror = (event) => reject(event.name);
    });
  
    let recorded = wait(lengthInMS).then(() => {
      if (recorder.state === "recording") {
        recorder.stop();
      }
    });
  
    return Promise.all([stopped, recorded]).then(() => data);
  }
  

function stop(){
    stream.getTracks().forEach((track) => track.stop());
   console.log("stopped")
}
