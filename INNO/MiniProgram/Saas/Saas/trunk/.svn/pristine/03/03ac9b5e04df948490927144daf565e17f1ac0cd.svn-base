const app = getApp();
Page(app.BP({

    data: {
        filter: false,
        leftWidth:0,
        list: [],
        // current: 0,
        // tabs: ['直属粉丝', '我的下级'],
        none: [],
        filterInfo:{}
    },
    hasMore: true,
    isLoading: false,
    page: 1,
    onLoad: function(options) {
        let staff_right = this.data.brand_info.icon_url + "micro_mall/staff/staff_right.png";
        let team_search = this.data.brand_info.icon_url + "micro_mall/staff/team_search.png";
        // this.leftWidth = (750 / this.data.tabs.length).toFixed(2);
        let l_bg_color = app.getColor(this.data.brand_info.style.bg_color, 50, 132, 105, 1)
        this.setData({
            staff_right: staff_right,
            team_search: team_search,
          l_bg_color: 'background:#efefef;'
        })
        reset.call(this);
        loadDataList.call(this, 0);
        // loadDataBase.call(this);
    },
    handleScroll() {
        this.reflash = true;
        loadDataList.call(this, this.data.current);
    },
    showDetail: function(e) {
        let dataset = e.currentTarget.dataset || {};
        let index = dataset.index;
        let list = this.data.list || {};
        this.setData({
            filter: !this.data.filter,
            filterInfo: list[index] || {}
        })
    },
    // orderJump(e){
    //   let dataset = e.currentTarget.dataset || {};
    //   let fromUserId = dataset.userId || 0;
    //   wx.navigateTo({
    //     url: `/pages/micro_mall/distribution_center/distribution_orders_lists/distribution_orders_lists?currentIndex=0&type=commission&fromUserId=${fromUserId}`,
    //   })
    // },
    // handleTab(e) {
    //     let type = e.currentTarget.dataset.type || 0;
    //     this.setData({
    //         current: type,
    //         leftWidth: this.leftWidth * type + 'rpx'
    //     })
    //     loadDataList.call(this, this.data.current);
    // },
}))

function loadDataList(type = 0) {
    // console.log(this.page, this.hasMore, this.reflash, this.isLoading, this.data.list)
    // console.log('page', 'hasmore', 'reflash', 'isloading', 'list')
    let paramType = 1;
    if (type == 1) {
        paramType = 2;
    }
    if (this.hasMore && !this.isLoading && this.reflash) {
        this.isLoading = true;
        return app.DistrApi.getStaffDstbDevelopUserList({
            params: {
              userToken: app.LM.userToken, // 'd5bd7d517c2e207f' ||
              brandCode: app.Conf.BRAND_CODE,
              pageIndex: this.page || 1,
              pageSize: app.Conf.PAGE_SIZE,
            },
            other: {
                isShowLoad: true
            }
        }).then(res => {
            if (res.code == 1) {
                const data = res.data || {};
                let list = data && data.dataList || [];
                list.map((item, index) => {
                    item.lastClickTime = item.lastClickTime && item.lastClickTime.replace(/\//g,'-') || '';
                    item.joinTime = item.joinTime && item.joinTime.replace(/\//g,'-') || '';
                    let dateTemp = item.joinTime && item.joinTime.split(' ') || [];
                    list[index].date1 = dateTemp[0] || '';
                    list[index].date2 = dateTemp[1] || '';
                })
                this.setData({
                    list: [...this.data.list, ...list],
                    // [`none[${type}]`]: data.totalCount == 0 ? true : false
                })
                this.hasMore = this.page * app.Conf.PAGE_SIZE < (data && data.totalCount || 0);
                this.page += 1;
            }
            return res
        }).finally(() => { 
            this.isLoading = false; 
            this.reflash = false
        })
    }else{
        this.reflash = false;
    }
}

// function loadDataBase() {
//     return app.DistrApi.getMyTeamInfo({
//         params: {
//             userToken: app.LM.userToken,
//             brandCode: app.Conf.BRAND_CODE
//         },
//         other: {
//             isShowLoad: true
//         }
//     }).then(res => {
//         if (res.code == 1) {
//             const data = res.data || {};
//             this.setData({
//                 detail_info: data
//             })
//         }
//         return res
//     })
// }

function reset(single = false) {
    // let arrLen = this.data.tabs.length;
    // this.isLoading = [];
    // this.hasMore = [];
    //  this.page = [];
    // this.dataList = [];
    // this.none = [];
    // this.reflash = [];
    // for (let i = 0, len = arrLen; i < len; i++) {
    //     this.isLoading.push(false);
    //     this.hasMore.push(true);
    //     this.reflash.push(true);
    //     this.page.push(1);
    //     this.dataList.push([]);
    //     this.none.push(false)
    // }
    // this.setData({
    //     list: this.dataList,
    //     none: this.none
    // })
    this.isLoading = false;
    this.hasMore = true;
    this.page = 1;
    this.reflash = true;
    // console.log(this.page, this.hasMore, this.reflash, this.isLoading,)
}