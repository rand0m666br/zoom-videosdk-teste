import ZoomVideo from '@zoom/videosdk'

let client = ZoomVideo.createClient();
let videoDevices;
let localVideoTrack;
let microphoneDevices
let localAudioTrack
let speakerDevices

client.init('en-US', 'Global', { patchJsMedia: true }).then(() => {
    ZoomVideo.getDevices().then((devices) => {
        videoDevices = devices.filter((device) => {
            return device.kind === 'videoinput'
        });

        localVideoTrack = ZoomVideo.createLocalVideoTrack(videoDevices[0].deviceId);

        microphoneDevices = devices.filter((device) => {
            return device.kind === 'audioinput'
        })

        localAudioTrack = ZoomVideo.createLocalAudioTrack(microphoneDevices[0].deviceId)

        localAudioTrack.start()

        speakerDevices = devices.filter((device) => {
            return device.kind === 'audiooutput'
        })
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



    document.getElementById("startAudio").onclick = function () {
        previewMicrophoneButton();
    }
    // turn on microphone preview
    function previewMicrophoneButton() {
        localAudioTrack.unmute();
        console.log(localMicrophoneTrack.getCurrentVolume());

        // add logic to display microphone volume level using localMicrophoneTrack.getCurrentVolume()
    }

    // turn off microphone preview
    function stopPreviewMicrophoneButton() {
        localAudioTrack.mute()
    }


    let microphoneTester = undefined;
    document.body.addEventListener("click", (event) => {
        const target = event.target;
        const inputLevelElm = document.querySelector("#mic-input-level");
        if (target.classList.contains("test-microphone")) {
            const value = target.dataset["start"];
            /**
             * 0 - undefined - init
             * 1 - start
             * 2 - recording
             * 3 - playing recording
             */
            if (value === "1" || value === "3") {
                if (microphoneTester) {
                    microphoneTester.stop();
                    target.dataset["start"] = "0";
                    target.textContent = "Test Microphone";
                }
            } else if (!value || value === "0") {
                microphoneTester = localAudioTrack.testMicrophone({
                    microphoneId: microphoneDevices[0].deviceId,
                    speakerId: speakerDevices[0].deviceId,
                    onAnalyseFrequency: (v) => {
                        inputLevelElm.value = v;
                    },
                    recordAndPlay: true,
                    onStartRecording: () => {
                        target.textContent = "Recording";
                        target.dataset["start"] = "2";
                    },
                    onStartPlayRecording: () => {
                        target.textContent = "Playing";
                        target.dataset["start"] = "3";
                    },
                    onStopPlayRecording: () => {
                        target.textContent = "Stop test";
                        target.dataset["start"] = "1";
                    },
                });
                target.dataset["start"] = "1";
                target.textContent = "Stop test";
            } else if (value === "2") {
                microphoneTester.stopRecording();
            }
        }
    });
});


// to change the microphone stop the track and recreate it with a new microphoneId
// switchMicrophone(microphoneId) {
//   localAudioTrack.stop().then(() => {
//     localAudioTrack = ZoomVideo.createLocalAudioTrack(microphoneId)
//     localAudioTrack.start().then(() => {
//       this.localAudioTrack.unmute()
//     })
//   })
// }

document.getElementById("enter").onclick = function () {
    window.location.href = "http://localhost:5173/meeting.html";
}