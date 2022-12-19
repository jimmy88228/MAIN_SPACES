const app = getApp();
Page(app.BP({ 
    data: {
        filterCurr:{
          key: 0,
          val: "全部"
        },
        list: [],
        none: false
    },
    page: 1,
    isLoading: false,
    hasMore: true, 
    onLoad: function(options) {
        loadData.call(this)
    },
    handleScroll(e) {
      if (this.hasMore){
        loadData.call(this);
      }else{
        app.SMH.showToast({
          title:"已经到底啦！"
        })
      }
        
    },
    getFilter(){
      let filterCurr = this.data.filterCurr || {};
      this.filter = this.filter || this.selectComponent("#filter");
      this.filter.getCurrFilter(filterCurr);
    },
    filtercallback(e){
      let detail = e.detail || {};
      this.setData({
        filterCurr: detail.filterCurr
      })
      this.hasMore = true;
      this.isLoading = false;
      this.page = 1;
      loadData.call(this);
    }   
}))

function loadData() {
    if (this.hasMore && !this.isLoading) {
        this.isLoading = true
        let filterCurr = this.data.filterCurr || {};
        app.CL_StoreCommApi.getStaffAccountFlow({
            params: {
                "pageIndex": this.page,
                "pageSize": app.Conf.PAGE_SIZE,
                "type": filterCurr.key
            },
            other: {
                isShowLoad: true
            }
        }).then(res => {
            if (res.code == 1) {
                const data = res.data || {};
                const list = data && data.list || [];
                let lists = [];
              console.log("list", list)
                if(this.page == 1){
                  lists = list;
                }else{
                  lists = [...this.data.list, ...list];
                }
                this.setData({
                    list: lists
                })
                if (data.totalRecords == 0 && !this.data.none) {
                    this.setData({
                        none: true
                    })
                }else{
                  if(this.data.none){
                    this.setData({
                      none: false
                    })
                  }
                }
                this.hasMore = this.page * app.Conf.PAGE_SIZE < (data && data.totalRecords || 0);
                this.page += 1;
            }
        }).finally(() => {
            this.isLoading = false
        })
    }
}