import MyStr from "../../../../common/support/utils/string-util.js";
const PAGE_TYPE = "STORE_STAFF_ACTIVITY";
const PAGE_TYPE_GOODS = "STORE_STAFF_GOODS";
const app = getApp();
Page(app.BP({
    data: {
        tabs: [{
                type: "goods",
                txt: "热销商品"
            },
            {
                type: "activity",
                txt: "热门活动"
            },

        ],
        sortList:[],
        tabIndex: 0,
    },
    onUnload: function() {
        app.LgMg.submitStaffActLog();
        unListen.call(this);
    },
    onLoad: function(options) {
        console.log('options', options)
        this.options = options;
        let tabs = this.data.tabs;
        if (options.user) {
            this.setData({
                user: options.user
            })
        }
        for (let item in tabs) {
            if (tabs[item].type == options.type) {
                this.setData({
                    tabIndex: item
                })
                break
            }
        }
        initTab.call(this);
    },
    onReady() {
        this.listDetail = this.selectComponent('#listDetail');
        listen.call(this)
    },
    changeTab(e) {
        let dataset = e.currentTarget.dataset;
        let index = dataset.index;
        this.setData({
            tabIndex: index,
        });

    },
    swiperCurrent(e) {
        this.setData({
            tabIndex: e.detail,
        });
    },
    onShareAppMessage(e) {
        console.log("分享",e);
        let dataset = e.target && e.target.dataset || {};
        let id = dataset.relatedId || 0;
        let type = dataset.type || 0;
        let title = dataset.title || '分享商品';
        let pic = dataset.pic || '';
        let actionActivityId = dataset.actionActivityId;
        let relatedType = dataset.relatedType;
        let relatedUrl = dataset.relatedUrl;
        if (!e.target) {
            type = this.data.tabIndex;
        }
        let shareTypeAct = app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL;
        let shareTypeGoods = app.ShareType[PAGE_TYPE_GOODS] || app.ShareType.NORMAL;
        let shareType = type == 0 ? shareTypeGoods : shareTypeAct;
        let name = type == 0 ? "GOODS_SHARE" : "ACTIVITY_SHARE";
        let position = type == 0 ? "STORE_STAFF_GOODS" : "STORE_STAFF_ACTIVITY";
        let params, btnPath;
        if(type == 0){
            params = { goods_id: id, activity_id: actionActivityId }
            btnPath = `/pages/micro_mall/goods/goods_info?goods_id=${id}&activityId=${actionActivityId}`;
        }else{
            if (relatedType == 1){
                let urlParams = MyStr.getUrlParam(relatedUrl);
                params = { activity_id: actionActivityId, ...urlParams};
                relatedUrl = MyStr.addUrlParams(relatedUrl,{staffActivityId:actionActivityId});
                btnPath = `/${relatedUrl}`;
            }else{
                params = { page_id: id, activity_id: actionActivityId };
                btnPath = `/pages/micro_mall/custom_page/custom_page?page_id=${id}&activityId=${actionActivityId}`;
            }
        }
        this.addActionLog(name, position, params);
        if (e.from == 'button') {
          return {
              addActionName: name,
              shareType: shareType,
              title: title,
              path: btnPath,
              imageUrl: pic,
              isCustom: true,
              ss:2
          }
        } else {
            return {
                addActionName: name,
                shareType: shareTypeAct,
                title: title,
                path: `/pages/micro_mall/employee_center/activity/activity?type=${type == 0 ? 'goods' :'activity'}&user=${this.data.user || ''}`,
            }
        }
    },
    init(){
        if(this.data.tabIndex == 0){
            this.listDetail.init(this.data.tabIndex); 
        }
    },
}))

function initTab() {
    let tabs = this.data.tabs || [];
    let tabW = (parseFloat(100 / tabs.length));
    this.setData({
        tabW
    })
} 

function listen() {
    let that = this;
    if (app.LM.isLogin) { 
        checkStoreStaff.call(this);
        return;
    }
    this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => { 
        if (app.LM.isLogin){
            checkStoreStaff.call(that);
        }
    });
}

function unListen() {
    app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
}

function checkStoreStaff() {
    return app.LM.checkIfStore()
        .then(data => {
            if (data && data.staff_id){ // 是店员或店长
              this.storeInfo = data || {};
              return Promise.resolve(data)
            }
            return Promise.reject(data)
        })
        .then(data => {
            console.log("店员信息: ", data);
            this.init()
            return data;
        })
        .catch(err => {
            console.log("获取店员信息失败: ", err)
            jumpIndex.call(this);
        })
}

function jumpIndex(){
    this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
    this.pageDialog.setTouchCancel(false);
    this.pageDialog.setCentent("敬请期待");
    this.pageDialog.setSingleBtn({
        name: "返回首页",
        tap: function () {
            wx.switchTab({
                url: '/pages/micro_mall/index/index',
            })
        }
    })
    this.pageDialog.show();
}


function getGroupList(){
    let params = {
        brandCode:app.Conf.BRAND_CODE,
        activityType:this.data.tabIndex
    }
    let extra = {
        diy:true
    }
    return app.RunApi.go('CL_StoreCommApi','getStaffDstbShareGroupList',params,extra).then(res=>{
      console.log('resres',res);
      let list = res.data||[];
      return list
      // for(let i = 0,len=list.length;i<len;i++){
      // }
    }).catch(e=>{
      return Promise.resolve([])
    })
}