"use strict";var _qrcodeMin=require("../modules/qrcode.min.js");module.exports={name:"Qrcode",handler:function(){var e=this,o=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},r=o.text,i=void 0===r?"":r,d=o.x,n=void 0===d?0:d,c=o.y,t=void 0===c?0:c,v=o.size,s=void 0===v?0:v,x=o.color,p=void 0===x?"#000":x,u=o.bgColor,a=void 0===u?"#fff":u,l=o.ecc,m=void 0===l?2:l;return new Promise(function(o,r){_qrcodeMin.api.draw(i,e.ctx,e.xDpr(n),e.xDpr(t),e.xDpr(s),e.xDpr(s),a,p,e.component,m),o()})}};