import ZoomVideo from '@zoom/videosdk'

const client = ZoomVideo.createClient()

var sessionName = 'testeum';
var jwtToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHBfa2V5IjoiTGduOU04QVFPeXQyZUowc2RVT3FvOG4ybW10OW02TTBaNHJZIiwicm9sZV90eXBlIjowLCJ0cGMiOiJ0ZXN0ZXVtIiwidmVyc2lvbiI6MSwiaWF0IjoxNzUxMzAxMjQxLCJleHAiOjE3NTEzMDg0NDF9.fMrnWlNag-8-urfsSyp3szoHo8kUlcyVXeMIVZKKJow'; // precisa ser o token jwt de vídeo
var userName = 'Teste';
var myId = "";

client.init('en-US', 'Global', { patchJsMedia: true }).then(() => {
  client.on('user-added', (payload) => {
    payload.forEach((item) => {
      console.log(`${item.userId} joined the session.`);
    });
  });

  client.on('user-removed', (payload) => {
    payload.forEach((item) => {
      console.log(`${item.userId} left the session.`);

      stream.detachVideo(item.userId); // N tá funcionando
    });
  });


  client.on('peer-video-state-change', (payload) => {
    const stream = client.getMediaStream();
    if (payload.action === 'Start') {
      // a user turned on their video, render it
      stream.attachVideo(payload.userId, 3).then((userVideo) => {
        document.querySelector('video-player-container').appendChild(userVideo)
      })
    } else if (payload.action === 'Stop') {
      // a user turned off their video, stop rendering it
      stream.detachVideo(payload.userId)
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
        myId = document.querySelector('video-player');
      });
    })
    .catch((error) => {
      console.error('Erro ao iniciar vídeo:', error);
    })


  // document.getElementById("stopVideo").onclick = function () {
  // console.log('ok');

  client.on("video-capturing-change", async (payload) => {
    console.log(payload);
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
    //   const stream = client.getMediaStream();
    //   stream.attachVideo(payload.userId, 3).then((userVideo) => {
    //     document.querySelector('video-player-container').appendChild(userVideo)
    //   })
    // } else {
    //   stream.detachVideo(payload.userId)
    // }
  });
  // }


  // Parar o vídeo (botão Stop Video)
  document.getElementById("stopVideo").onclick = function () {
    const stream = client.getMediaStream();
    stream.stopVideo().then(() => {
      stream.detachVideo(client.getCurrentUserInfo().userId);

      // document.querySelector('video-player-container').removeChild(document.getElementById(client.getCurrentUserInfo().userId));
    })
  }

  // Iniciar o vídeo (botão Start Video)
  document.getElementById("startVideo").onclick = function () {
    const stream = client.getMediaStream();
    stream.startVideo().then(() => {
      stream.attachVideo(client.getCurrentUserInfo().userId, 3).then((userVideo) => {
        // document.querySelector('video-player-container').appendChild(userVideo).id = client.getCurrentUserInfo().userId;
        document.querySelector('video-player-container').replaceChild(userVideo, myId);
      })
    })
  }
})


