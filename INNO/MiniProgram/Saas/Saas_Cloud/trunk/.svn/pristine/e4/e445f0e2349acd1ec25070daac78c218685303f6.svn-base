export default function checkUpdateManager() {
  try {
    //检测是否兼容getUpdateManager
    if (wx.getUpdateManager) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
      })
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })

      })
      updateManager.onUpdateFailed(function () {
        // 新的版本下载失败
        wx.showToast({
          title: '更新下载失败！',
          image: '/images/micro_mall/cn/err_tip_icon.png'
        })
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  } catch (e) {
    console.log(e)
  }

}