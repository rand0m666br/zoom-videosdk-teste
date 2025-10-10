import ZoomVideo from '@zoom/videosdk'

let client = ZoomVideo.createClient();
let videoDevices;
let localVideoTrack;

client.init('en-US', 'Global', { patchJsMedia: true }).then(() => {
    ZoomVideo.getDevices().then((devices) => {
        videoDevices = devices.filter((device) => {
            return device.kind === 'videoinput'
        });

        localVideoTrack = ZoomVideo.createLocalVideoTrack(videoDevices[0].deviceId)
    });

    document.getElementById("toggleVideo").onclick = function () {
        // turn on camera preview
        localVideoTrack.start(document.querySelector('#myVideo'));
    }
    // turn on camera preview with blur or virtual background image url
    //   localVideoTrack.start(document.querySelector('#local-preview-video'), {
    //     imageUrl: 'blur'
    //   });

    // turn off camera preview
    //   localVideoTrack.stop();

    // to change the camera, stop the track and recreate it with a new cameraId
    //   localVideoTrack.switchCamera(cameraId);
});

document.getElementById("enter").onclick = function () {
    window.location.href = "http://localhost:5173/meeting.html";
}