const app = getApp();
const animation = "animation:animShow 0.8s linear";
const animation_l = "animation:animShow_l 0.8s linear";
const animation_r = "animation:animShow_r 0.8s linear";
Component(app.BTAB({
  properties: { 
  },
  data: {
    showArr:[]  
  },
  ready(){
    let showArr = [];
    let icon_url = this.data.brand_info.icon_url || '';
    let like_action = icon_url + "micro_mall/video_shop/v_like_action.png";
    for(let i = 0;i<5;i++){
      showArr.push({
        toggle: false, animation: "",
        left: 0, top: 0
      })
    }
    this.setData({
      showArr,
      like_action
    })
  },
  methods: {
    showAnim(data={}){
      toggleFnc.call(this, data);
    },
  }
}))

function toggleFnc(data={},obj = {}){
  let that = this;
  let showArr = this.data.showArr || 0; 
  let full = true;
  for (let i = 0; i < showArr.length;i++){
    if (!showArr[i].toggle) {
      animSet.call(this, showArr, i, data);
      full = false;
      break
    } else if (showArr[i].toggle){
      continue
    }
  }
}

function animSet(showArr=[],i=0,position={}) {
  if (!showArr || !showArr[i])return
  position = position || {};
  showArr[i].left = position.x;
  showArr[i].top = position.y;
  showArr[i].toggle = true;
  this.setData({
    [`showArr[${i}]`]: showArr[i]
  })
  setTimeout(() => {
    showArr[i].animation = i == 0 ? animation : i % 2 == 0 ? animation_r : animation_l
    this.setData({
      [`showArr[${i}]`]: showArr[i]
    })
  }, 50)
  setTimeout(() => {
    showArr[i].toggle = false;
    showArr[i].animation = ""
    this.setData({
      [`showArr[${i}]`]: showArr[i]
    })
  }, 850)
}