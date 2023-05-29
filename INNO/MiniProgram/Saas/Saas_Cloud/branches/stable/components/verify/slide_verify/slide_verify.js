// pages/component/login/login_by_phone.js
import WindowBehaviors from "../../../components/ui/cps/window/window-behaviors";
const app = getApp();

Component(app.BTAB({
  behaviors: [WindowBehaviors],
  /**
   * 组件的属性列表
   */
  properties: {
    handleType:{
      type:String,
      value:""
    }
  },
  attached() {
  },
  detached() {

  },
  /**
   * 组件的初始数据
   */
  data: {
    canBindPhone: false,
    boxStyle: "opacity:0;transition: opacity 300ms ease-in-out;",
    slideW: 560,
    mWidth: 80,
    mHeight: 80,
    moveLeft: 0,
    targetLeft: 0,
    mTop: 100,
    deviation: 10
  },
  activeLeft: 0,
  ready(){
    let brand_info = this.data.brand_info || {};
    this.setData({
      slideImg: brand_info.icon_url + 'micro_mall/bargain/bargain_banner.jpg'
    })
  },
  methods: {
    onAttached() {
      this.setData({
        boxStyle: "opacity:1;transition: opacity 300ms ease-in-out;"
      });
      wx.nextTick(()=>{
        this.initSlide();
      })
    },
    onDetached() {
      this.setData({
        boxStyle: "opacity:0;transition: opacity 300ms ease-in-out;"
      });
      let timer = setTimeout(()=>{
        this.initVal();
        clearTimeout(timer);
      },300)
      return 300;
    },
    initSlide(){
      let slideW = this.data.slideW;
      let mWidth = this.data.mWidth;
      let _left = ((Math.random() * 100) / 100) * slideW;
      let targetLeft = 0;
      if((_left + mWidth) > slideW){
        targetLeft = slideW - mWidth;
      } else if(_left < mWidth){
        targetLeft = mWidth
      } else {
        targetLeft = _left
      }
      targetLeft = targetLeft / (750 / app.SIH.windowWidth);
      this.setData({
        targetLeft: targetLeft
      })
    },
    showSlide(callback){
      this.slideCallback = callback;
      this.show();
    },
    slideEnd(e){
      let targetLeft = this.data.targetLeft || 0; 
      let deviation = this.data.deviation || 10;
      this.getSelectorQuery("#targetView", "left").then((pLeft)=>{
        this.getSelectorQuery("#movePoint", "left").then((left)=>{
          this.activeLeft = (parseFloat(left) - parseFloat(pLeft)) || 0;
          console.log("this.activeLeft", this.activeLeft);
          console.log("this.targetLeft", targetLeft);
          let result = null;
          if(this.activeLeft > (targetLeft - deviation) && this.activeLeft < (targetLeft + deviation)){
            result = true;
            //成功回调
            setTimeout(()=>{
              this.dismiss();
              typeof(this.slideCallback) == "function" && this.slideCallback();
            },500);
            console.log("验证成功");
          } else {
            result = false;
            console.log("验证失败");
          }
          if(result){
            app.SMH.showToast({
              title: '验证成功',
            })
          }
          this.setData({
            operateResult: result ? "success" : "fail"
          })
        })
      })
    },
    getSelectorQuery(select, key){
      select = JSON.parse(JSON.stringify(select));
      return new Promise((rs,rj)=>{
        if(select == "#targetView"){
          if(this.targetViewRect) {
            if(key){
              return rs(this.targetViewRect[key] || 0)
            }
            return rs(this.targetViewRect)
          }
        }
        this.query = this.createSelectorQuery();
        this.query.select(select).boundingClientRect();
        this.query.exec(function(res){
          let rect = res[0] || {};
          if(select == "#targetView"){
            this.targetViewRect = rect;
          }
          if(key){
            return rs(rect[key] || 0);
          } else {
            return rs(rect);
          }
        })
      })
    },
    initVal(){
      this.setData({
        moveLeft: 0,
        targetLeft: 0,
        mTop: 120,
        operateResult: ""
      })
    },
    _func(){}
  }
}))