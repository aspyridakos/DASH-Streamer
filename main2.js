const videoPreview = document.getElementById('video');
const startButton = document.getElementById('startBtn');
const stopButton = document.getElementById('stopBtn');

let mediaRecorder;
let chunks = [];

startButton.onclick = async () => {
    startButton.disabled = true;
    stopButton.disabled = false;
	const stream = await navigator.mediaDevices.getUserMedia({video: true});
	videoPreview.srcObject = stream;
	mediaRecorder = new MediaRecorder(stream, {
		mimeType: 'video/webm; codecs=h264',
		videoBitsPerSecond: 5000000 // 5 Mbps
	});
	mediaRecorder.ondataavailable = (event) => {
		chunks.push(event.data);
	};
	mediaRecorder.start();
};

stopButton.onclick = () => {
    startButton.disabled = false;
    stopButton.disabled = true;
	mediaRecorder.stop();
};

mediaRecorder.onstop = async () => {
	const blob = new Blob(chunks, {type: 'video/webm'});
	chunks = [];
	const formData = new FormData();
	formData.append('video', blob);
	await fetch('/upload', {method: 'POST', body: formData});
};
