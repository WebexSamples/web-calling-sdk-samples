import Calling from "webex/calling";

let callingClient;
let line;
let calling;
const webexConfig = {
  config: {
    logger: {
      level: "debug", // set the desired log level
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
    access_token: "access_token",
  },
};

// Set calling configuration
const callingConfig = {
  clientConfig: {
    calling: true,
    contact: true,
    callHistory: true,
    callSettings: true,
    voicemail: true,
  },
  callingClientConfig: {
    logger: {
      level: "info",
    },
  },
  logger: {
    level: "info",
  },
};

async function callingInit() {
  calling = await Calling.init({
    webexConfig,
    callingConfig,
  });
  calling.on("ready", () => {
    calling.register().then(() => {
      callingClient = calling.callingClient;
    });
  });
}

async function registerLine() {
  line = Object.values(callingClient.getLines())[0];

  line.on("registered", (lineInfo) => {
    console.log("Line information: ", lineInfo);
  });

  line.register();
}

window.registerLine = registerLine;
window.callingInit = callingInit;
