## openvpn client management
This module can be used to pilot an openvpn client. The main 
reason is to switch the vpn remote servers by scripting, on the fly. 

The openvpn client has to be started with a configuration file like this one:

    management localhost 7505
    management-hold
    management-query-remote
    client
    dev tun
    proto udp
    <connection>
      remote <<server>> <<port>>
      nobind
      tun-mtu 1500
      tun-mtu-extra 32
      mssfix 1450
    </connection>
    resolv-retry infinite
    remote-random
    persist-key
    ping 15
    ping-restart 0
    ping-timer-rem
    reneg-sec 0
    comp-lzo no
    
 With `management localhost 7505` the openvpn client will listen to port 7505 
 on localhost and could be managed by sending commands using telnet or netcat. 
 
 The parameters and their meaning to configure the openvpn client are listed
  here [here](https://github.com/OpenVPN/openvpn/blob/master/sample/sample-config-files/client.conf)
