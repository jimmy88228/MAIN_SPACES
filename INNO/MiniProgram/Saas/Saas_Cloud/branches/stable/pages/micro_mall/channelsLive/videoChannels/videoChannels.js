const app = getApp();
Page(app.BP({
  data: {
    liveInfo: {},
    liveState: {
      isNormal: 1
    }
  },
  onLoad: function (options) {
    this.options = options || {};
  },
  onShow() {
    let ops = this.options || {};
    if(!ops.channelsId) {
      this.setLiveStateTxt(2, "无效视频号ID");
      return;
    };
    let that = this;
    wx.getChannelsLiveInfo({
      finderUserName: ops.channelsId,
      success(res){
        console.log("res", res)
        that.setLiveStateTxt(1, "");
        that.setData({
          liveInfo: res
        })
        if(res.nickname){
          wx.setNavigationBarTitle({
            title: res.nickname,
          })
        }
      },
      fail(error){
        console.log("error", error)
      }
    })
  },
  onHide(){
  },
  goJump(e) {
    let ops = this.options || {};
    if(!ops.channelsId) {
      this.setLiveStateTxt(2, "无效视频号ID");
      return;
    };
    let liveInfo = this.data.liveInfo || {};
    wx.openChannelsLive({
      finderUserName: ops.channelsId,
      feedId: liveInfo.feedId,
      nonceId: liveInfo.nonceId
    })
  },
  setLiveStateTxt(isNormal, txt) {
    this.setData({
      liveState: {
        isNormal,
        txt
      }
    })
  },
  initParams(){}
}))
