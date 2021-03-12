const app = getApp();
Page(app.BP({

    data: {
        filter: false,
        leftWidth:0,
        list: [],
        none: [],
        filterInfo:{}
    },
    hasMore: true,
    isLoading: false,
    page: 1,
    onLoad: function(options) {
        let staff_right = this.data.brand_info.icon_url + "micro_mall/staff/staff_right.png";
        let team_search = this.data.brand_info.icon_url + "micro_mall/staff/team_search.png";
        let l_bg_color = app.getColor(this.data.brand_info.style.bg_color, 50, 132, 105, 1)
        this.setData({
            staff_right: staff_right,
            team_search: team_search,
          l_bg_color: 'background:#efefef;'
        })
        reset.call(this);
        loadDataList.call(this, 0);
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
}))

function loadDataList(type = 0) {
    let paramType = 1;
    if (type == 1) {
        paramType = 2;
    }
    if (this.hasMore && !this.isLoading && this.reflash) {
        this.isLoading = true;
        return app.DistrApi.getStaffDstbDevelopUserList({
            params: {
              pageIndex: this.page || 1,
              pageSize: app.Conf.PAGE_SIZE,
              brandCode: app.Conf.BRAND_CODE,
              userToken: app.LM.userKey
            },
            extraData: {
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

function reset(single = false) {
    this.isLoading = false;
    this.hasMore = true;
    this.page = 1;
    this.reflash = true;
}