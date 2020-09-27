import CheckVideo from "../../../../helper/manager/check-video-update.js";

const app = getApp();
Page(app.BP({
  data: {

  },
  onLoad: function (options) {

  },
  onShow: function (options) {
    jump_rd.call(this)
    // let page = getCurrentPages().pop();
    // let check = CheckVideo.checkRoute(page && page.route);
    // if(check){
    //   console.log('123456 进入视频页')
    //   setTimeout(() => {
    //     jump.call(this);
    //   }, 500)
    // }else{
    //   console.log('123456 回到主页')
    //   return
    // } 
  },
}))

function jump() {
  let path = "/pages/micro_mall/video_shopping/v_page/index"
  wx.navigateTo({
    url: path,
  })
}

function jump_rd() {
  let path = "/pages/micro_mall/video_shopping/v_page/index"
  wx.redirectTo({
    url: path,
  })
}
