import ZoomVideo from '@zoom/videosdk'

const client = ZoomVideo.createClient()

var sessionName = 'testeum';
var jwtToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHBfa2V5IjoiTGduOU04QVFPeXQyZUowc2RVT3FvOG4ybW10OW02TTBaNHJZIiwicm9sZV90eXBlIjowLCJ0cGMiOiJ0ZXN0ZXVtIiwidmVyc2lvbiI6MSwiaWF0IjoxNzUxMzk0NDM3LCJleHAiOjE3NTE0MDE2Mzd9.lasyuedu3dkIRYpkrCzV8YkNRtBaTQUNpv1THmArPhY'; // precisa ser o token jwt de vídeo
var userName = 'Teste';
var caralho = 0;

client.init('en-US', 'Global', { patchJsMedia: true }).then(() => {
  // Se usuário entra
  client.on('user-added', (payload) => {
    payload.forEach((item) => {
      console.log(`${item.userId} joined the session.`);
    });
  });

  // Se usuário é removido
  client.on('user-removed', (payload) => {
    payload.forEach((item) => {
      console.log(`${item.userId} left the session.`);

      stream.detachVideo(item.userId); // N tá funcionando
    });
  });


  client.on('peer-video-state-change', (payload) => {
    const stream = client.getMediaStream();
    if (payload.action === 'Start') {
      console.log('user ' + payload.userId + ' ' + payload.action + ' their video');
      // a user turned on their video, render it
      // if (usrId != null && usrId == payload.userId && joined == true) {
      stream.attachVideo(payload.userId, 3).then((userVideo) => {
        //document.querySelector('video-player-container').removeChild(document.getElementById(client.getCurrentUserInfo().userId));
        document.querySelector('video-player-container').appendChild(userVideo)
      })
      if (document.querySelector('[node-id="0"]')) {
        console.log('ok');
        document.querySelector('video-player-container').removeChild(document.querySelector('[node-id="0"]'));
      }
    } else if (payload.action === 'Stop') {
      console.log('user ' + payload.userId + ' ' + payload.action + ' their video');
      // a user turned off their video, stop rendering it
      stream.detachVideo(payload.userId);
    }
  })


  client
    .join(sessionName, jwtToken, userName)
    .then(() => {
      const stream = client.getMediaStream();
      return stream.startVideo().then(() => {
        return stream.attachVideo(client.getCurrentUserInfo().userId);
      }).then((userVideo) => {
        // document.querySelector('video-player-container').appendChild(userVideo).id = client.getCurrentUserInfo().userId;
        document.querySelector('video-player-container').appendChild(userVideo);
        // document.querySelector('video-player-container').replaceChild(userVideo, document.getElementById("video1")).id = "video1";
        // myId = document.querySelector('video-player');
      });
    })
    .catch((error) => {
      console.error('Erro ao iniciar vídeo:', error);
    })


  // document.getElementById("stopVideo").onclick = function () {
  // console.log('ok');

  // client.on("video-capturing-change", async (payload) => {
  client.on("user-video-status-changed", async (payload) => {
    console.log(payload.userId);
    // if (payload.state === "Started") {
    //   const stream = client.getMediaStream();
    //   stream.attachVideo(payload.userId, 3).then((userVideo) => {
    //     document.querySelector('video-player-container').appendChild(userVideo)
    //   })
    // } else {
    //   stream.detachVideo(payload.userId)
    // }
  });

  client.on("user-update", async (payload) => {
    console.log('user-update');
    // if (payload.state === "Started") {
    // const stream = client.getMediaStream();
    // stream.attachVideo(payload.userId, 3).then((userVideo) => {
    // document.querySelector('video-player-container').appendChild(userVideo)
    // })
    // }
    //  else {
    //   stream.detachVideo(payload.userId)
    // }
  });
  // }


  // let videoOn = true;

  // document.getElementById('toggleVideo').addEventListener('click', () => {
  //   const mediaStream = client.getMediaStream();

  //   if (!videoOn) {
  //     mediaStream.startVideo()
  //       .then(() => {
  //         videoOn = true;
  //         console.log("Video started");
  //       })
  //       .catch(err => console.error("Start video failed", err));
  //   } else {
  //     mediaStream.stopVideo()
  //       .then(() => {
  //         videoOn = false;
  //         console.log("Video stopped");
  //       })
  //       .catch(err => console.error("Stop video failed", err));
  //   }
  // });




  // Parar o vídeo (botão Stop Video)
  document.getElementById("stopVideo").onclick = function () {
    const stream = client.getMediaStream();
    stream.stopVideo();
    // stream.stopVideo().then(() => {
    // stream.detachVideo(client.getCurrentUserInfo().userId);

    // document.querySelector('video-player-container').removeChild(document.getElementById(client.getCurrentUserInfo().userId));
    // })
  }

  // Iniciar o vídeo (botão Start Video)
  document.getElementById("startVideo").onclick = function () {
    const stream = client.getMediaStream();
    stream.startVideo();
  }
})


