"use strict";module.exports={name:"Text",handler:function(){var b=this,A=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};return new Promise(function(t,i){var e=A.x,o=void 0===e?0:e,n=A.y,c=void 0===n?0:n,l=A.color,r=void 0===l?"#000":l,a=A.fontSize,x=void 0===a?12:a,d=A.fontWeight,f=void 0===d?"":d,v=A.width,s=void 0===v?1/0:v,h=A.baseline,g=void 0===h?"top":h,p=A.align,u=void 0===p?"left":p,m=A.text,S=void 0===m?"":m,D=A.ellipsis,w=void 0===D?0:D,y=A.lineHeight,E=void 0===y?A.fontSize||12:y,T=0,z=[];b.ctx.textAlign=u,b.ctx.textBaseline=g,b.ctx.fillStyle=r,b.ctx.font="".concat(f," ").concat(b.xDpr(x),"px ").concat(b.fontFamily),[].concat(S).forEach(function(o,t){var n=0;String(o).split("").forEach(function(t,i){var e=String(o).slice(n,i+1);b.ctx.measureText(e).width<b.xDpr(s)?z[T]=e:(z[T+1]=t,n=i,T++)}),T++}),w&&z.length>w&&((z=z.slice(0,w))[w-1]=z[w-1].slice(0,-1)+"..."),z.forEach(function(t,i){b.ctx.fillText(t,b.xDpr({left:o,start:o,right:o+s,end:o+s,center:o+s/2}[u]||o),b.xDpr(c+E*i+(E-x)/2))}),t()})}};