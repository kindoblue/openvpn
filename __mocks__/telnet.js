const util = require("util");
const EventEmitter = require("events").EventEmitter;

const Telnet = function() {
  // mocking the telnet client object
};

Telnet.prototype.connect = function(opts) {
  this.emit("data", ">HOLD:Waiting for hold release:0");
};
Telnet.prototype.write = function(command) {
  this.emit("data", ">>REMOTE:to-be-set-by-vpn-manager,9999,udp");
};
util.inherits(Telnet, EventEmitter);

module.exports = exports = Telnet;
