import SIH from "../../common/helper/sys-infos-helper";
let app = getApp();
const homePages = {
   "pages/micro_mall/index/index": true,
   "pages/micro_mall/user/user": true,
   "pages/micro_mall/shopping/shopping_cart": true
}
let homePage = "pages/micro_mall/index/index"
Component(app.BTAB({
    properties: {
        holdStay: {
            type: Boolean,
            value: false
        },
        title:{
            type: String,
            value:""
        },
        type:{
            type:String,
            value:"index",
        },
        isCustom: {
            type: Boolean,
            value: false
        },
        bgStyle: {
            type: String,
            value: ""
        },
        isHoldBack: {
            type: Boolean,
            value: false
        }
    },
    data:{
        statusH: 20,
        style: `height:44px;padding:0px 10px;`,
        navH: 64,
        navType: 0 // 0：不显示，1：返回首页，2：返回上一页
    },
    pages: null,
    pageLifetimes: {
        show: function() {
           let timer = setTimeout(()=>{
                this.pages = this.pages || getCurrentPages();
                let thisPage = this.pages.slice(-1)[0],navType = 0;
                console.log("pageLifetimes",thisPage)
                if(thisPage && !homePages[thisPage.route]){
                    if(this.pages.length == 1){
                        navType = 1
                    }else{
                        navType = 2
                    }
                }else{
                    navType = 0;
                }
                console.log("navType",navType)
                if(this.data.navType != navType){
                    this.setData({
                        navType: navType
                    })
                }
                clearTimeout(timer)
                timer = null;
            },200)
        }
    },
    ready(){
        let menuObject = SIH.getMenuObject;
        let systemInfo = SIH.systemInfo;
        let menuTop = ( menuObject.top - systemInfo.statusBarHeight)
        let navH = systemInfo.statusBarHeight + menuObject.height + menuTop * 2;
        let lWidth = systemInfo.screenWidth - menuObject.right;
        let contH = menuTop * 2 + menuObject.height;
        this.setData({
            statusH: systemInfo.statusBarHeight,
            style: `height:${contH}px;padding:0px ${lWidth}px;`,
            navH: navH
        })
        this.triggerEvent('getNavH',{navH: navH, statusH: systemInfo.statusBarHeight});
    },
    methods: {
        goBack(){
            wx.navigateBack()
        },
        goHome(){
            wx.switchTab({
              url: '/' + homePage,
            })
        }
    }
}));