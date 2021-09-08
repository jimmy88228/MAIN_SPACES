// pages/component/calendar/signContinuous/signContinuous.js
import {setArc} from './arcHelp'
const app = getApp();
const W = app.SIH.screenWidth;
const ratio =  (app.SIH.screenWidth * app.SIH.pixelRatio / W) || 1; //画布放大倍数,否则会有锯齿
Component(app.BTAB({  
  properties: {
    info:{
      type:Object,
      value:{},
    },
    signStyleBox:{
      type:String,
      value:""
    },
    prizeLevel:{
      type:Number,
      value:4
    },
    baseWH:{ //外圆的宽高 (rpx)
      type:Number,
      value:228
    },
  }, 
  data: {},  
  lifetimes:{
    attached(){
      let type_reward = this.data.brand_info.default_icon_url + 'sign/type_reward.png'
      this.setData({
        type_reward,
        activeWH:this.properties.baseWH*0.84,//内圆的宽高 (rpx)
        prizeImgWH:this.properties.baseWH*0.48
      })
    }
  }, 
  methods: {
    init(){
      initCirPoint.call(this);
    }

  }, 
}))
 

function initCirPoint(){
  let info = this.data.info||{};
  let detailList = info.detailList||[];
  let prizeLevel = detailList.length;
  let curLevel = info.curSort; 
  let curProgress = info.currentContinueDay;
  let allProgress = info.nextGetContinueInfo.continueDay;
  let cirArr = [];
  for(let i = 1,len=detailList.length;i<=len;i++){
    cirArr.push({
      i,
      rotate:180+(360*i/len),
      active: i <= (curLevel - 1) ? true:false //当前档的上一档高亮
    })
  }
  this.setData({
    cirArr
  })
  console.log('initCir',curLevel,curProgress,allProgress,info);
  console.log('cirArr',cirArr) 
  wx.createSelectorQuery().in(this)
    .select('#canvas-cir')
    .fields({ node: true, size: true })
    .exec((res) => {
      let canvas = res[0].node;
      let width = res[0].width;
      let height = res[0].height;
      let arc = getProgress(curProgress,allProgress,curLevel - 1,prizeLevel);
      console.log('arcarc',arc)
      let x = (this.data.baseWH)/2*ratio,r=(this.data.activeWH)/2*ratio;
      setArc({canvas,width,height,arc,startArc:0.5,lineWidth:4,color:"rgb(255,58,0)",ratio,x,y:x,r});
    })
}

function getProgress(curProgress,allProgress,curLevel,prizeLevel){
  let perArc = (2/prizeLevel);
  return 0.5 + perArc * curLevel + (curProgress/allProgress)*perArc
} 