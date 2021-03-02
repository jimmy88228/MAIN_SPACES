import WindowBehaviors from "../../../../ui/cps/window/window-behaviors";
import MyDate from '../../../../support/utils/date-util.js';

const app = getApp();
Component(app.BTAB({
  behaviors: [WindowBehaviors], 
  properties:{
    isLogin:{
      type:Boolean,
      value:false
    },
  },
  data: {
    ac_conf: app.Conf.style.n_sk_color,
    boxStyle: "opacity:0;transition: opacity 300ms ease-in-out;",
  },
  methods: {
    onAttached() {
      this.setData({
        boxStyle: "opacity:1;transition: opacity 300ms ease-in-out;"
      });
    },
    onDetached() { 
      this.setData({
        boxStyle: "opacity:0;transition: opacity 300ms ease-in-out;"
      });
      return 300;
    },
    _noFn(){},
    loadData(target={},ac_info={},rank=true){
      let percent = 0;
      if (ac_info && ac_info.stime){
        ac_info.tipTime = MyDate.format(MyDate.parse(ac_info.stime || ''), "M月d日 · HH:mm");
      }
      if(target.target){
        percent = getPercent.call(this, target.now, target.target);
      }
      target.percent = percent || 0;
      this.rank = rank;
      this.setData({
        target:target || {},
        ac_info:ac_info || {},
      })
    },
    helpCallBack(e){
      this.setData({
        isLogin: app.LM.isLogin
      });
      let target = this.data.target || {};
      if (target.isHelped == 1 || target.isComplete == 1){
        checkUserRank.call(this);
      }else{
        this.triggerEvent('help');
      } 
     }, 
    close(){
      this.dismiss();
    }
  }
}))

 

function checkUserRank(){
  // console.log('等级', this.rank)
  if (this.rank){
    this.dismiss();
  }else{
    app.SMH.showToast({
      title: `该活动只对特定会员开放`
    })
    setTimeout(() => {
      this.dismiss();
    }, 1500)
  }
}

function getPercent(inven = 0, invenSum = 0) {
  let percent = (invenSum == 0) ? 0 : inven / invenSum >= 1 ? 100 : inven / invenSum > 0.01 ? parseInt(((inven / invenSum) * 100).toFixed(2)) : parseFloat((inven / invenSum) * 100);
  percent = percent > 0 && percent < 1 ? 1 : percent;
  return percent;
}