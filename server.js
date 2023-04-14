const express = require('express');
const app = express();

const cors = require('cors');
const multer = require('multer');
const path = require('path');

const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const fs = require('fs');
ffmpeg.setFfmpegPath(ffmpegPath);

const recordingDatetime = Date.now();

// Storing recording in repo
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'recordings/');
        },
        filename: (req, file, cb) => {
            cb(null, "capture-" + recordingDatetime + path.extname(file.originalname));
        }
    })
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/comp445_lab2/index.html', upload.single('video'), (req, res) => {
    const video = req.file;
    console.log('Received video data:', video);
    const outputDir = 'recordings/';
    // Converting webm to 4 second long MP4 segments
    ffmpeg(video.path)
        .outputOptions('-f segment')
        .outputOptions('-segment_time 3')
        .outputOptions('-reset_timestamps 1')
        .outputOptions('-segment_format mp4')
        .output(outputDir + 'segment-' + recordingDatetime + "-" + '%d.mp4')
        .on('end', () => {
            console.log('Segmentation successful');
        })
        .on('error', (err) => {
            console.error(err);
            res.sendStatus(500);
        })
        .run();
});

// Open localhost port
app.listen(8080, () => {
    console.log('Server listening on port 8080');
});