import ZoomVideo from '@zoom/videosdk'

const client = ZoomVideo.createClient()

var sessionName = 'testeum';
var jwtToken = import.meta.env.VITE_JWT_TOKEN; // precisa ser o token jwt de vídeo
var userName = 'Teste';


// TODO: arrumar o bug que, caso um usuário entre na sessão mas não permita usar a câmera, o quadrado de vídeo não é gerado para o outro participante
//  Fazer talvez com que ele peça para permitir a câmera, ou gere um quadrado de vídeo mesmo assim
// Esse código está desorganizado pra caralho por enquanto
// client.init('en-US', 'Global', { patchJsMedia: true }).then(() => {
client.init('pt-BR', 'Global', { stayAwake: true }, { leaveOnPageUnload: true }, { patchJsMedia: true }).then(() => {
  // Se usuário entra
  client.on('user-added', (payload) => {
    payload.forEach((item) => {
      // const stream = client.getMediaStream();
      // const cameras = stream.getCameraList();
      console.log(`${item.userId} joined the session.`);

      console.log(`Video status: ${item.isVideoConnect}`);

      // console.log(item.userVideo);
      // document.querySelector('video-player-container').appendChild(userVideo);
    });
  });

  // Se usuário é removido
  client.on('user-removed', (payload) => {
    payload.forEach((item) => {
      console.log(`${item.userId} left the session.`);
      document.querySelector('video-player-container').removeChild(document.querySelector(`[node-id="${item.userId}"]`));
      document.querySelector('video-player-container').removeChild(document.querySelector('[node-id="0"]'));
    });
  });

  // Pausar/Iniciar vídeo ao entrar na sessão
  client.on('peer-video-state-change', (payload) => {
    const stream = client.getMediaStream();
    if (payload.action === 'Start') {
      console.log('user ' + payload.userId + ' ' + payload.action + ' their video');
      // a user turned on their video, render it
      stream.attachVideo(payload.userId, 3).then((userVideo) => {
        //document.querySelector('video-player-container').removeChild(document.getElementById(client.getCurrentUserInfo().userId));
        userVideo.style.display = "inline-block";
        document.querySelector('video-player-container').appendChild(userVideo);
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

  // Iniciar vídeo ao entrar na sessão
  // --------------------------------------------------
  client
    .join(sessionName, jwtToken, userName)
    .then(() => {
      const stream = client.getMediaStream();

      return stream.startVideo().then(() => { // Background normal
        // return stream.startVideo({ virtualBackground: { imageUrl: '../public/background_hnsggg.png' } }).then(() => { // Background com imagem
        // return stream.startVideo({ virtualBackground: { imageUrl: 'blur' } }).then(() => { // Background borrado
        return stream.attachVideo(client.getCurrentUserInfo().userId);
      }).then((userVideo) => {
        // document.querySelector('video-player-container').appendChild(userVideo);
        userVideo.style.display = "inline-block";
        document.querySelector('video-player-container').replaceChild(userVideo, document.getElementById("myVideo")); // Vídeo de quem está vendo sempre estará em primeiro
        console.log(userVideo);
      });
    })
    .catch((error) => {
      console.error('Erro ao iniciar vídeo:', error);
      
      let msg;
      if (!error.message) {
        console.log("asjdhsakjhdkjsahdkahkdksadsa");
        msg = error.reason;
      }else {
        msg = error.message;
      }

      if (error.message == "Permission dismissed" || error.message == "Permission denied") {
        document.getElementById("modal").style.display = "flex";
        document.getElementById("pMsg").innerHTML = "Acesso à câmera bloqueado.<br>Por favor, recarregue a página e permita que o navegador utilize a <strong>câmera e microfone</strong>.";
      } else if (error.message == "Requested device not found") {
        document.getElementById("modal").style.display = "flex";
        document.getElementById("pMsg").innerHTML = "Nenhuma câmera foi encontrada. Certifique-se de que seu dispositivo de vídeo está funcionando corretamente e recarregue a página.";
      } else {
        document.getElementById("modal").style.display = "flex";
        document.getElementById("pMsg").innerHTML = "Erro inesperado : <strong>" + msg + "</strong><br>Recarregue a página e tente novamente.";
      }
    })
  // --------------------------------------------------

  client.on('device-permission-change', (payload) => {
    const { name, state } = payload;
    /**
     * name contains 'microphone' or 'camera'
     * state contains 'denied', 'granted' or 'prompt'
     * */
    if (state === 'denied') {
      console.warn(`${name} permission is denied, please grant it`);
    }
    if (state === 'granted') {
      console.warn(`${name} granted`);
    }
    if (state === 'prompt') {
      console.warn(`${name} granted`);
    }
  });


  // Gambiarra desgracenta pra tirar qualquer quadrado de vídeo que seja node-id 0
  // Provavelmente não vou mais precisar disso
  // setInterval(() => {
  //   if (document.querySelector('[node-id="0"]')) {
  //     console.log('ok');
  //     document.querySelector('video-player-container').removeChild(document.querySelector('[node-id="0"]'));
  //   }
  // }, 8000);

  // Inútil por enquanto
  // --------------------------------------------------
  client.on("user-update", async (payload) => {
    console.log('user-update');
  });

  client.on('connection-change', (payload) => {
    console.log(payload);
  });
  // --------------------------------------------------

  // Chat
  // --------------------------------------------------
  // Enviar mensagem ao clicar no botão
  var btnEnviar = document.getElementById("btnEnviar");
  btnEnviar.addEventListener('click', () => {
    const chat = client.getChatClient();
    const msg = document.getElementById("chatInput").value;
    chat.sendToAll(msg);
  });

  // Enviar mensagem ao apertar Enter
  document.addEventListener('keydown', (event) => {
    if (event.key == 'Enter') {
      const chat = client.getChatClient();
      const msg = document.getElementById("chatInput").value;
      chat.sendToAll(msg);
    }
  });

  client.on('chat-on-message', (payload) => {
    console.log(payload)
    console.log(`Message: ${payload.message}, from ${payload.sender.name} to ${payload.receiver.name}`)
    // document.querySelector('.messages').appendChild(`<span>${payload.message}</span>`)
    document.querySelector('.messages').innerHTML += `<span class="senderName">${payload.sender.name}:</span><span class="sentMessage">${payload.message}</span>`;
    document.getElementById("chatInput").value = "";
  })
  // --------------------------------------------------

  // Ligar ou desligar a câmera
  // --------------------------------------------------
  var videoOn = true;
  document.getElementById('toggleVideo').addEventListener('click', () => {
    const mediaStream = client.getMediaStream();
    if (!videoOn) {
      mediaStream.startVideo()
        .then(() => {
          videoOn = true;
          console.log("Video started");
        })
        .catch(err => console.error("Start video failed", err));
    } else {
      mediaStream.stopVideo()
        .then(() => {
          videoOn = false;
          console.log("Video stopped");
        })
        .catch(err => console.error("Stop video failed", err));
    }
  });
  // --------------------------------------------------

  // Iniciar / Mutar áudio
  var muteOn = true;
  document.getElementById('startAudio').addEventListener('click', () => {
    const stream = client.getMediaStream();
    if (muteOn) {
      stream.startAudio();
      console.log('Audio iniciado');
      muteOn = false;
    } else {
      stream.muteAudio();
      console.log('Audio mutado');
      muteOn = true;
    }
  });

  //The active-speaker event fires quickly for each active microphone. So it's useful for animating the microphone icon or putting a border around the active speaker so users in the session can visualize who is speaking.
  // Não vou usar agora, mas será útil depois
  client.on('active-speaker', (payload) => {
    console.log('Active speaker, use for CSS visuals', payload) // new active speaker, for example, use for microphone visuals, css video border, etc.
  })

  // Listar microfones
  document.getElementById('listSpeaker').addEventListener('click', () => {
    // Valida se o microfone está habilitado. Se não estiver, retorna uma mensagem
    if (muteOn == false) {
      const stream = client.getMediaStream();
      let microphones = stream.getMicList();
      // stream.switchMicrophone(microphones[1].deviceId)
      for (let i = 0; i < microphones.length; i++) {
        console.log(microphones[i]);
      }
    } else {
      console.log("Microfone está desabilitado!");
    }
  });

  // Listar câmeras
  document.getElementById('listCameras').addEventListener('click', () => {
    const stream = client.getMediaStream();
    let cameras = stream.getCameraList();
    if (cameras.length == 0) {
      console.log("Sem câmera");
    }
    for (let i = 0; i < cameras.length; i++) {
      console.log(cameras[i]);
    }
  });

  // Listar participantes
  document.getElementById('listParticipants').addEventListener('click', () => {
    let participants = client.getAllUser()
    participants.forEach(element => {
      console.log(element);
    });
  });



  // Sair da reunião
  document.getElementById('leave').addEventListener('click', () => {
    client.leave();
    window.location.replace("success.html");
  });




  // Parar o vídeo (botão Stop Video)
  //   document.getElementById("stopVideo").onclick = function () {
  //     const stream = client.getMediaStream();
  //     stream.stopVideo();
  //     // stream.stopVideo().then(() => {
  //     // stream.detachVideo(client.getCurrentUserInfo().userId);

  //     // document.querySelector('video-player-container').removeChild(document.getElementById(client.getCurrentUserInfo().userId));
  //     // })
  //   }

  //   // Iniciar o vídeo (botão Start Video)
  //   document.getElementById("startVideo").onclick = function () {
  //     const stream = client.getMediaStream();
  //     stream.startVideo();
  //   }
})


