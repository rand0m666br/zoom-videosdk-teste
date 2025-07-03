import ZoomVideo from '@zoom/videosdk'

let client = ZoomVideo.createClient()
let videoDevices
let localVideoTrack

client.init('en-US', 'Global', { patchJsMedia: true }).then(() => {
    ZoomVideo.getDevices().then((devices) => {
        videoDevices = devices.filter((device) => {
            return device.kind === 'videoinput'
        })

        localVideoTrack = ZoomVideo.createLocalVideoTrack(videoDevices[0].deviceId)

        // turn on camera preview
        localVideoTrack.start(document.querySelector('#local-preview-video'))
        // localVideoTrack.start(document.querySelector('#local-preview-video'), {
        // imageUrl: '../public/background_hnsggg.png'
        // })
    })

    //   // turn on camera preview with blur or virtual background image url
    //   localVideoTrack.start(document.querySelector('#local-preview-video'), {
    //     imageUrl: 'blur'
    //   })

    var videoOn = true;
    document.getElementById("stopCamera").addEventListener('click', () => {
        if (videoOn) {
            localVideoTrack.stop();
            videoOn = false;
            document.querySelector('canvas').remove();
        } else {
            localVideoTrack.start(document.querySelector('#local-preview-video'));
            videoOn = true;
        }
    });

    document.getElementById("consulta").addEventListener('click', () => {
        window.location.replace("./index.html");
    });

    //   // to change the camera, stop the track and recreate it with a new cameraId
    //   localVideoTrack.switchCamera(cameraId)
})