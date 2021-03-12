// pages/micro_mall/presal/activity_list.js
var app = getApp();
import MyDate from '../../../../support/utils/date-util.js'; 
Page(app.BP({
    data: {
        activity_list: [],
        sys_info: {},
        swiper_current: 0,
        brand_info: app.globalData.brand_info,
        jumpType: "custom", 
        tabHei:[],
        show:false,
        none:null
    },
    page: 1,
    is_more: true,
    is_pull_down: false,
    isLoading:false,
    hasMore:true,
    onLoad: function(options) {
        this.tababr = this.selectComponent("#custom_tabbar");
        let l_color = app.getColor(this.data.brand_info.style.bg_color, 0, 0, 0, 0.7);
        this.setData({
            l_color
        })
     },
    onReady: function() { 
        this.iniTabbar(this.data.brand_info);
        scroll_height.call(this); 
    },
    onShow(){
        reset.call(this);
        getPresaleGoodsList.call(this); 
    },
    onUnload(){ 
    },
    onHide(){  
    },
    onPullDownRefresh: function() {
        reset.call(this);
        getPresaleGoodsList.call(this); 
        let _timer =setTimeout(() => {
            clearTimeout(_timer);
            wx.stopPullDownRefresh();
            app.SMH.showToast({
                "title": "刷新成功"
            });
        }, 500);
    },  
    onReachBottom: function() {
        if (this.hasMore) {
            getPresaleGoodsList.call(this)
        } else {
            app.SMH.showToast({
                title:"已经到底啦！"
            })
        }
    },
    getKeywork(e){
        let value = e.detail.value;
        this.keyWord = value;
    },
    handleFilterSearch(){
        reset.call(this);
        getPresaleGoodsList.call(this)
    },

    goToDetail: function(e) {
        var activity_id = e.currentTarget.dataset.activity_id;
        wx.navigateTo({
            url: 'presale_activity_detail?activity_id=' + activity_id
        });
    },
    iniTabbar(brand_info) {
        this.tababr.setTabbar([{
                "pagePath": "pages/micro_mall/plugins/presale/presale_activity_list",
                "text": "限量预售",
                "iconPath": brand_info.icon_url + "micro_mall/tabbar/pre_sale/PreHome.png",
                "selectedIconPath": brand_info.icon_url + "micro_mall/tabbar/pre_sale/PreHomeActive.png",
                "is_this_page": true,
                "select_color": brand_info.style.font_color,
                "is_original_tab": false
            },
            {
                "pagePath": "pages/micro_mall/plugins/presale/presale_order_list",
                "text": "我的预售",
                "iconPath": brand_info.icon_url + "micro_mall/tabbar/pre_sale/PreMine.png",
                "selectedIconPath": brand_info.icon_url + "micro_mall/tabbar/pre_sale/PreMineActive.png",
                "is_this_page": false,
                "select_color": brand_info.style.font_color,
                "is_original_tab": false,
                "need_login": true,
            }
        ]);
    },
    handleScrollToLower(e) {
        getPresaleGoodsList.call(this)
    }
}))

function getPresaleGoodsList() { 
    if (!this.isLoading && this.hasMore) {
        this.isLoading = true;
        return app.PreSaleApi.getPresaleGoodsList({
            params: {
                pageIndex: this.page,
                pageSize: app.Conf.PAGE_SIZE,
                brandCode: app.Conf.BRAND_CODE,
                searchVal: this.keyWord || ""
            },
            extraData:{
                isShowLoad:false
            }
        }).then(res => {
            if (res.code == 1) {
                let data = res.data || {};
                let dataList = data && data.dataList || [];
                dataList && dataList.forEach(item => {
                    if (item.is_show_sale_number == 1){
                      let sale_number = parseFloat(item.sale_number) || 0;
                      let ex_number_str = sale_number;
                      if (sale_number > 10000) {
                        ex_number_str = parseFloat(sale_number / 10000).toFixed(2) + "万";
                      }
                    //   if (sale_number > 100000) {
                    //     ex_number_str = parseFloat(sale_number / 10000) + "万+";
                    //   }
                      item.sale_number_str = ex_number_str;
                      if(item.status==1){
                          item.stime =  MyDate.format(MyDate.parse(item.presale_begin_time || ''), "MM-dd HH:mm");
                      }
                    }
                    return {
                        activity_name: item.activity_name,
                        min_presale_price: item.min_presale_price,
                        max_presale_price: item.max_presale_price,
                        min_market_price: item.min_market_price,
                        max_market_price: item.max_market_price,
                        sale_number: item.sale_number,
                        sale_number_str: item.sale_number_str
                    }
                })
              
                this.setData({
                    activity_list: [...this.data.activity_list, ...dataList]
                });
                
                console.log('activity_list', this.data.activity_list)
                if(this.data.activity_list.length>0){
                }
                this.hasMore = data.totalCount > (app.Conf.PAGE_SIZE * this.page)
                this.page+=1;
            }
        }).finally(()=>{ 
            this.setData({
                show: true,
            })
            this.isLoading = false;
        })
    } 
}

function scroll_height() {
    let _this = this;
    const query = wx.createSelectorQuery();
    query.select('.tabbar').boundingClientRect(res => {
        _this.setData({
            scrollHeight: `calc(100% - ${300*this.data.tabHei.length}rpx)`,
            allHeight: `calc(100% - ${res.height}px)`
        })
    }).exec();
}
function reset(){
    // this.setData({
    //     activity_list:[]
    // })
    this.data.activity_list = [];
    this.page = 1;
    this.hasMore = true;
    this.isLoading = false;
}