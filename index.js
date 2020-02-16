"use strict";

const regex = />(?<state>\w+):.+/g;

// let Telnet = require("./telnet.js");
// let telnet = new Telnet();
// telnet.on('data', function listener(data) {
//
//     const str = data.toString().replace(/(\r\n|\n|\r)/gm, "");;
//     // console.log(`==========[${str}]==========`);
// });

function OpenVPNManager(telnetClient) {
  this.telnet = telnetClient;
}

function request(client, method, param) {
  return new Promise(function(resolve, reject) {
    client.on("data", function listener(data) {
      const str = data.toString();
      let timer;

      if (data.toString().indexOf(">") > -1) {
        let m;
        let state;
        while ((m = regex.exec(str)) !== null) {
          // This is necessary to avoid infinite loops with zero-width matches
          if (m.index === regex.lastIndex) {
            regex.lastIndex++;
          }

          // The result can be accessed through the `m`-variable.
          state = m.groups.state;
        }
        if (timer) timer.clearTimeout();
        client.removeListener("data", listener);
        resolve(state);
      } else {
        if (data.toString().startsWith("SUCCESS")) {
          console.debug("waiting for remote");
          timer = setTimeout(reject, 5000);
        } else reject();
      }
    });

    client[`${method}`](param);
  });
}

OpenVPNManager.prototype.connect = function(params) {
  return request(this.telnet, "connect", params);
};

OpenVPNManager.prototype.release = function(params) {
  return request(this.telnet, "write", "hold release\r\n");
};

OpenVPNManager.prototype.send_signal = function(params) {
  return request(this.telnet, "write", "signal SIGUSR1\r\n");
};

OpenVPNManager.prototype.set_server = function(ip, port) {
  const self = this;
  return new Promise(function(resolve, reject) {
    self.telnet.once("data", function(data) {
      const str = data.toString();

      if (data.toString().startsWith("SUCCESS")) {
        resolve("SUCCESS");
      } else reject();
    });

    self.telnet.write(`remote MOD ${ip} ${port}\r\n`);
  });
};

module.exports.create = function(telnetClient) {
  return new OpenVPNManager(telnetClient);
};
