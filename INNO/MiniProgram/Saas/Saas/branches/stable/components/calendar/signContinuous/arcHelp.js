import SIH from '../../../common/helper/sys-infos-helper'
export const setArc = function ({canvas,ratio,width,height,color,lineWidth,startArc,arc,x,y,r}) {
      let ctx = canvas.getContext("2d");
      canvas.width = width*ratio;
      canvas.height = height*ratio;
      ctx.beginPath();
      ctx.lineWidth = toPx(lineWidth||2)*ratio;
      color && (ctx.strokeStyle = color);
      ctx.arc(toPx(x),toPx(y),toPx(r),(startArc)*Math.PI,arc*Math.PI);
      ctx.stroke();
}

function toPx(rpx){
  return rpx * SIH.ratio
}