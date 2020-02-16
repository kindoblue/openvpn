"use strict";
const Telnet = require("telnet");

// https://stackoverflow.com/questions/34930771/why-is-this-undefined-inside-class-method-when-using-promises

describe("Test openvpn manager", () => {
  let VPNManagerFactory = require("../index");

  let telnet;
  let manager;
  beforeEach(() => {
    telnet = new Telnet();
    manager = VPNManagerFactory.create(telnet);
  });

  it("should connect", async () => {
    let state = await manager.connect({});
    expect(state).toBe("HOLD");
  });

  it("should connect and release", async () => {
    let state = await manager.connect({}).then(() => manager.release());

    expect(state).toBe("REMOTE");
  });

  it("should connect and release and catch", async () => {
    let state = await manager
      .connect({})
      .then(() => manager.release())
      .catch(() => manager.send_signal());

    expect(state).toBe("REMOTE");
  });
});
