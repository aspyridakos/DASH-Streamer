const constraints = {
  audio: false,
  video: { width: 1280, height: 720 }
};

let mediaRecorder;
let chunks = [];

navigator.mediaDevices.getUserMedia(constraints)
  .then(function(stream) {
    const video = document.querySelector('video');
    video.srcObject = stream;
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    };
    mediaRecorder.onstop = function() {
      const blob = new Blob(chunks, { type: 'video/mp4' });
      const videoURL = URL.createObjectURL(blob);
      const video = document.createElement('video');
      video.controls = true;
      video.src = videoURL;
      document.body.appendChild(video);
    };
  })
  .catch(function(err) {
    console.log(err.name + ": " + err.message);
  });

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

startBtn.addEventListener('click', function() {
  mediaRecorder.start(3000);
  startBtn.disabled = true;
  stopBtn.disabled = false;
});

stopBtn.addEventListener('click', function() {
  mediaRecorder.stop();
  startBtn.disabled = false;
  stopBtn.disabled = true;
});
