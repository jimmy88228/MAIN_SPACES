"use strict";module.exports={name:"Arc",handler:function(){var p=this,m=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};return new Promise(function(e,r){var t=m.x,i=void 0===t?0:t,n=m.y,o=void 0===n?0:n,d=m.r,v=void 0===d?0:d,s=m.start,c=void 0===s?0:s,x=m.end,a=void 0===x?0:x,l=m.reverse,u=void 0!==l&&l,h=m.lineStyle;p.setLineStyle(h),p.ctx.beginPath(),p.ctx.arc(p.xDpr(i),p.xDpr(o),p.xDpr(v),c,a,u),p.ctx.stroke(),e()})}};