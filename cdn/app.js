/* global Calling */

const accessToken = document.querySelector('#access-token');
const authStatusElm = document.querySelector('#access-token-status');
const localAudioElem = document.querySelector('#local-audio');
const remoteAudioElem = document.querySelector('#remote-audio');
const callDetailsElm = document.querySelector('#call-details');
const registerStatus = document.querySelector('#registration-status');

let calling;
let line;
let localAudioStream;
let call;

async function init() {
    const webexConfig = {
        config: {
          logger: {
            level: 'debug', // set the desired log level
          },
          meetings: {
            reconnection: {
              enabled: true,
            },
            enableRtx: true,
          },
          encryption: {
            kmsInitialTimeout: 8000,
            kmsMaxTimeout: 40000,
            batcherMaxCalls: 30,
            caroots: null,
          },
          dss: {},
        },
        credentials: {
          access_token: accessToken.value,
        }
      };
      
    const callingConfig = {
      clientConfig : {
        calling: true,
        contact: true,
        callHistory: true,
        callSettings: true,
        voicemail: true,
      },
      callingClientConfig: {
        logger: {
          level: 'info'
        },
      },
      logger: {
        level: 'info'
      }
    }

    calling = await Calling.init({webexConfig, callingConfig});

    authStatusElm.innerHTML = 'Initializing...';

    calling.on("ready", () => {
        calling.register().then(() => {
            callingClient = calling.callingClient;  
            authStatusElm.innerHTML = 'Ready';
        });
    });
}

function authorize() {
  line = Object.values(callingClient.getLines())[0];
  line.on("registered", (lineInfo) => {
    console.log("Line information: ", lineInfo);
    registerStatus.innerHTML = `Registered,\n DeviceId: ${lineInfo.mobiusDeviceId}\n UserId: ${lineInfo.userId}\n Sip Address: ${lineInfo.sipAddresses[0]}`;
  });

  line.register();
}

function deregister() {
  line.deregister();
}

async function getMedia() {
  localAudioStream  = await Calling.createMicrophoneStream({audio: true});
  localAudioElem.srcObject = localAudioStream.outputStream;
}

async function makeCall() {
  await getMedia();

  const destination = document.querySelector('#destination-number').value;
  
  call = line.makeCall({
    type: 'uri',
    address: destination,
  });

  call.on('caller_id', (CallerIdEmitter) => {
    callDetailsElm.innerText = `Name: ${CallerIdEmitter.callerId.name}, Number: ${CallerIdEmitter.callerId.num}, Avatar: ${CallerIdEmitter.callerId.avatarSrc} , UserId: ${CallerIdEmitter.callerId.id}`;
  });

  call.on('progress', (correlationId) => {
    callDetailsElm.innerText = `${correlationId}: Call Progress`;
  });
  call.on('connect', (correlationId) => {
    callDetailsElm.innerText = `${correlationId}: Call Connect`;
  });
  call.on('established', (correlationId) => {
    callDetailsElm.innerText = `${correlationId}: Call Established`;
  });
  call.on('disconnect', (correlationId) => {
    callDetailsElm.innerText = `${correlationId}: Call Disconnected`;
  });

  call.on('remote_media', (track) => {
    console.log('Received remote media', track);
    remoteAudioElem.srcObject = new MediaStream([track]);
  });

  await call.dial(localAudioStream);
}

function endCall() {
  call.end();
  callDetailsElm.innerText = 'Call Disconnected';
}
