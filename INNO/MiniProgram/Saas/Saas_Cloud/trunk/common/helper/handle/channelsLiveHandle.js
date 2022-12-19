import SMH from "../show-msg-helper";
class channelsLiveManager {
  static getInstance() {
    if (!channelsLiveManager.instance) {
      channelsLiveManager.instance = new channelsLiveManager();
    }
    return channelsLiveManager.instance;
  }
  constructor() {
    this._channelsInfo = {}
  }
  get channelsInfo(){
    return this._channelsInfo;
  }
  getChannelsInfo(ops){
    if(!(ops.func_type == 'CHANNELSLIVE' && ops.link_url)) return;
    let that = this;
    if(that._channelsInfo[ops.link_url]) return;
    wx.getChannelsLiveInfo({
      finderUserName: ops.link_url,
      success(res){
        console.log("getChannelsLiveInfo res", res)
        that._channelsInfo[ops.link_url] = res;
      },
      fail(error){
        console.log("error", error)
      }
    })
    
  }
  jumpChannelsInfo(ops){
    let warn = "";
    if(ops.func_type == 'CHANNELSLIVE' && ops.link_url){
      if(this.channelsInfo[ops.link_url]){
        let channels = this.channelsInfo[ops.link_url];
        SMH.showLoading();
        wx.openChannelsLive({
          finderUserName: ops.link_url,
          feedId: channels.feedId,
          nonceId: channels.nonceId,
          fail(error){
            console.log("error", error)
            SMH.hideLoading();
          },
          success(){
            SMH.hideLoading();
          }
        })
      } else {
        warn = "无效视频号ID";
      }
    } else {
      warn = "无效视频号跳转"
    }
    if(warn){
      SMH.showToast({
        title: warn
      })
    }
  }
}

export default channelsLiveManager.getInstance();