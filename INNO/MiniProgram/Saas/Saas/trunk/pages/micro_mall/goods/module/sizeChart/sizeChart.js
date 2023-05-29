let app = getApp();
Component(app.BTAB({
  properties: {
    showTip: {
      type: Boolean,
      value: true
    },
    size_img1:{
      type:String,
      value:""
    },
    size_img2:{
      type:String,
      value:""
    },
  },
  options: {
    styleIsolation: 'apply-shared'
  },
  data: {
    isShow: true,
    imgL: "",
    imgR: "",
    imgWidth1: 0,
    maxH: 0
  },
  ready(){},
  observers:{
    'size_img1, size_img2': function(size_img1, size_img2){
      console.log(size_img1,"----", size_img2)
      let that = this;
      let maxH = 200;
      if((!size_img1 && size_img2) || (size_img1 && !size_img2)){
        let size_img = size_img1 || size_img2;
        // getImg.call(this, size_img).then(res=>{
        //   if(res.path){
        //     if(res.width > res.height){// 横图
        //       maxH = res.height;
        //     } else { // 1：1 || 长图
        //       maxH = 0
        //     }
        //     this.setData({
        //       oneImg: true,
        //       maxH: maxH,
        //       imgR: size_img
        //     })
        //   }
        // })
        this.setData({
          oneImg: true,
          maxH: 0,
          imgR: size_img
        })
        return;
      }
      //多图模式
      let leftLimitW = 100; //px
      Promise.all([getImg.call(this, size_img1), getImg.call(this, size_img2)]).then((res)=>{
        maxH = (leftLimitW * res[0].height) / res[0].width;
        console.log("输出数据", res)
        // for(let i = 0; i < res.length; i++){
        //   maxH = res[i].height > maxH ? res[i].height : maxH;
        // }
        //let imgWidth1 = ((maxH * res[0].width) / res[0].height) || 0;
        that.setData({
          imgWidth1: leftLimitW,
          maxH: maxH,
          imgL: size_img1,
          imgR: size_img2
        })
      }).catch(error=>{
        console.log("Promise.all", error)
      })
    }
  },
  methods: {
    switchChart(){
      this.setData({
        isShow: !this.data.isShow
      })
    }
  },
}))
function getImg(src){
  if(!src) return Promise.resolve({});
  return wx.getImageInfo({
    src: src
  }).then((res)=>{
    return res;
  }).catch((error)=>{
    return Promise.resolve({});
  })
}