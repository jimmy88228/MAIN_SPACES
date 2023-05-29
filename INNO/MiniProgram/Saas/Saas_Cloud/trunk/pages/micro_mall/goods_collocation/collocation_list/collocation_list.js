const app = getApp();
Page(app.BP({
    data: {
        package_list:[],
        packageNotEmpty: false
    },
    page: 1,
    isLoading: false,
    hasMore: true,
    onLoad: function(options) {
        this.options = options;
        loadData.call(this);
    },
    collocationJump: function(e) {
        console.log(e)
        let package_id = e.currentTarget.dataset.id || 0;
        wx.navigateTo({
            url: `/pages/micro_mall/goods_collocation/goods_collocation?package_id=${package_id}`,
        })
    },
    handleScroll: function() {
        console.log('handle');
        loadData.call(this);
    }
}))

function loadData() {
    console.log('this.options.goods_id', this.options.goods_id)
    if (!this.isLoading && this.hasMore) {
        this.isLoading = true;
        return app.CL_GoodsApi.get_GoodsPackageList({
            params: {
                goodsId: this.options.goods_id,
                pageIndex: this.page,
                pageSize: app.Conf.PAGE_SIZE,
            },
            other: {
                isShowLoad: true
            }
        }).then(res => {
            if (res.code == 1) {
                const data = res.data || {};
                let dataList = data && data.dataList || [];
                let packageNotEmpty = false;
                if (dataList.length >= 1) {
                    packageNotEmpty = true
                }
                this.setData({
                    package_list: [...this.data.package_list,...dataList],
                    packageNotEmpty: packageNotEmpty
                })
                this.hasMore = this.page * app.Conf.PAGE_SIZE   < data.totalCount 
                this.page += 1; 
            }
        }).finally(() => {
            this.isLoading = false;
        })
    }
} 