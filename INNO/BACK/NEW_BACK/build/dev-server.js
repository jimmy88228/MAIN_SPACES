'use strict'
const LOCAL_IP = getIPAddress()

module.exports = {
  dev: {
    assetsPublicPath: '/',
    host: LOCAL_IP, //ip address
    port: 8088,
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true
  }
}

function getIPAddress(){
  var interfaces = require('os').networkInterfaces();
  for(var devName in interfaces){
      var iface = interfaces[devName];
      for(var i=0;i<iface.length;i++){
          var alias = iface[i];
          if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
              return alias.address;
          }
      }
  }
}
