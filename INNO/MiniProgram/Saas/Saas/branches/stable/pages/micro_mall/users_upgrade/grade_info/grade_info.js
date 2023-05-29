var app = getApp();
Page(app.BP({
     data: {
          activityInfo:{},
          activity_user_info:{},
          user_info: app.globalData.userInfo,
          isLogin: false
     },
     onLoad(options) {},
     onShow() {
          this.initLogin().then(()=>{
               this.initPageData();
          })
     },
     initPageData(){
          return app.UserApi.get_UserUpgradeInfo({
               params: {
                    userToken: app.LM.userToken,
                    brandCode: app.Conf.BRAND_CODE
               },
               other: {
                    isShowLoad: true
               }
          }).then(e => {
               if(e.code == 1){
                    let data = e.data || {};
                    this.setData({
                         activityInfo: data,
                         shareInfo: data.shareInfo || {}
                    })
               }
          })
     },
     onPullDownRefresh() {
          this.initPageData().finally(()=>{
               wx.stopPullDownRefresh()
          })
     },
     onShareAppMessage() {
          let options = this.options || {};
          this.addActionLog("UPGRADE_SHARE", "GRADE_INDEX",{
               activityId: options.activityId,
          })
          return {
               isCustom: true,
               title: '付费会员活动',
               path: '/pages/micro_mall/users_upgrade/grade_buy/grade_buy?activityId=' + (options.activityId || 0)
          };
     },
     onShareAppMessage() {
          let shareInfo = this.data.shareInfo || {};
          let activityInfo = this.data.activityInfo || {};
          let shareObj = {
               isCustom: true,
               title: shareInfo.shareTitle || '付费会员活动',
               path: '/pages/micro_mall/users_upgrade/grade_buy/grade_buy?activityId=' + activityInfo.activityId,
               addActionName: "UPGRADE_SHARE"
          };
          if(shareInfo.shareImg){
               shareObj.imageUrl = shareInfo.shareImg
          }
          this.addActionLog("UPGRADE_SHARE", "GRADE_INDEX",{
               activityId: activityInfo.activityId,
          })
          return shareObj;
     },
     toBuy(){
          let activityInfo = this.data.activityInfo || {};
          var activityId = activityInfo.activityId;
          wx.navigateTo({
               url: '/pages/micro_mall/users_upgrade/grade_buy/grade_buy?activityId=' + activityId
          })
     },
     goRecordList() {
          wx.navigateTo({
               url: '/pages/micro_mall/users_upgrade/grade_record/grade_bennefit_record'
          })
     },
     valiteUser(e){
          var that = this;
          app.getUserInfo(function (info) {
               that.setData({
                    user_info:info
               }) ;
               that.initPageData();
          });
     },
     initLogin(){
        return  app.LM.loginAsync().then(()=>{
               if(this.data.isLogin != app.LM.isLogin){
                    this.setData({
                         isLogin: app.LM.isLogin,
                         userInfo: app.LM.userInfo || {}
                    })
               }
          })
     },
     // loginCallback(){
     //      app.SMH.showToast({
     //           "title": "已登录请重新！"
     //       })
     // }
}))