const app = getApp();
Page(app.BP({
     data: {
          recordList:[],
          totalUser: 0,
          timeList: [{key: 1, name: "今日"},{key: 2, name: "本周"},{key: 3, name: "本月"},{key: 0, name: "所有"}]
     },
     page: 0,
     hasMore: true,
     onLoad (options) {},
     onShow () {
          this.getInitData();
     },
     setTimeInfo(e){
          let index = e.detail.value;
          let timeInfo = this.data.timeList[index];
          this.setData({
               timeInfo: timeInfo
          })
          this.page = 0;
          this.hasMore = true;
          this.getInitData();
     },
      scrolltolowerCallback(e){
           
          if (this.hasMore) {
               this.getInitData();
          } else {
              app.SMH.showToast({
                  "title": "已经到底啦！"
              })
          }
      },
      refreshCallback(e){
           this.page = 0;
           this.hasMore = true;
           this.getInitData().then(()=>{
              this.list = this.list || this.selectComponent("#list");
              this.list.refreshEnd();
          })
      },
     getInitData() {
          let page = this.page ? this.page + 1 : 1;
          let timeInfo = this.data.timeInfo || {};
          return app.UserApi.getUserUpgradeShareBenefit({
               data: {
                    timeType: timeInfo.key || 0,
                    userToken: app.LM.userToken,
                    brandCode: app.Conf.BRAND_CODE,
                    pageIndex: page,
                    pageSize: app.Conf.PAGE_SIZE
               },
               other: {
                    isShowLoad: true
               }
          }).then((res)=>{
               if(res.code == 1){
                    this.page = page;
                    let data = res.data || {};
                    let list = data.list || [];
                    let recordList = this.data.recordList || [];
                    if(list.length == 0){
                         this.hasMore = false;
                    } else {
                         this.hasMore = true;
                    }
                    if(page == 1){
                         recordList = data.list;
                    } else {
                         recordList = recordList.concat(data.list);
                    }
                    console.log("this.hasMore",this.hasMore);
                    this.setData({
                         totalUser: data.totalUser,
                         recordList
                    })
               }
          })
     }
}))