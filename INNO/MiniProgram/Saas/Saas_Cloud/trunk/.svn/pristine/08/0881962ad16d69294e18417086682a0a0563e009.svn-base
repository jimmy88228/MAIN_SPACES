class ShakingHelp {
  static getInstance() {
    if (!ShakingHelp.instance) {
      ShakingHelp.instance = new ShakingHelp();
    }
    return ShakingHelp.instance;
  }
  constructor() {
    this.canShaking = true;
  }
  init(){
    this.canShaking = true;
  }
  end(){
    this.canShaking = false;
    console.log('关闭监听')
    wx.offAccelerometerChange(); 
    return Promise.resolve();
  }
  start(ignoreShake){
    this.init();
    return new Promise((rs,rj)=>{
      if(ignoreShake){
        return rs(true)
      }
      let axisX = 0.5,axisY = 0.5,axisZ = 0.5,limit = 1,times=0,shakeTime=null;
       wx.onAccelerometerChange(res => {
          if (!this.canShaking) {
              return Promise.reject();
          }
          if((axisX < res.x && axisY < res.y) || (axisZ < res.z && axisY < res.y)){//检测左右摇，上下摇 
              times+=1;
          } 
          if(times >= limit || ignoreShake){
              if(shakeTime){
                  clearTimeout(shakeTime);
                  shakeTime = null;
              }
              times = 0;
              this.canShaking = false;
              return rs(true); 
          }
      });
    })
  }
} 

export default ShakingHelp.getInstance();