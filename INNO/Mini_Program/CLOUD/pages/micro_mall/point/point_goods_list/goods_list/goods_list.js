const app = getApp();

Component(app.BTAB({

    properties: {

    },

    data: {
        brand_info: app.globalData.brand_info,
        listData: [],
        currentIndex: 0,
        showWrapper: true,
        showWrapperCouopn: true,
        showWrapperGoods: true,
        matchArr: []
    },
    hasMore: true,
    page: 0,
    attached() {
        let menuStr = this.data.brand_info.icon_url + "micro_mall/point/coupons.png";
        this.setData({
            menu_url: menuStr
        });
    },
    ready(){
      let bInfo = this.data.brand_info || {};
      let o_bg_color = app.getColor(bInfo.style.bg_color,0,0,0,0.3);
      this.setData({
        o_bg_color: o_bg_color
      }) 
    },
    methods: {
        installData(index) {
            this.page = 0;
            this.hasMore = true;
            getIntegralBonusGoods.call(this, index);
        },
        handleMore() {
            console.log(this.data.listData)
            if (!this.hasMore) {
                app.SMH.showToast({
                    title: "已经到底啦！"
                })
                return;
            }
            getIntegralBonusGoods.call(this, this.data.currentIndex);
        },
        getKeywork(e){
            let value = e.detail.value;
            this.keyWord = value;
        },
        handleFilterSearch(){
            this.installData(1)
        },
        jumpAction(e) {
            let dataset = e.currentTarget.dataset;
            let url = dataset.url;
            if (!url) return;
            wx.navigateTo({
                url: url,
            })
        },
        getReal(e) {
            console.log(e)
        },
        exchange(e) {
            let id = e.currentTarget.dataset.id;
            wx.navigateTo({
                url: `/pages/micro_mall/point/point_coupon_detail/point_coupon_detail?mkBonusId=${id}`,
            })
        }
    }
}))

function getIntegralBonusGoods(tabIndex) {
    let currentIndex = this.data.currentIndex;
    let that = this;
    if (currentIndex != tabIndex) {
        this.page = 0;
        this.hasMore = true;
        this.setData({
            currentIndex: tabIndex
        })
    }
    this.page = this.page == null ? 1 : this.page + 1;
    let request = tabIndex == 0 ? 'getPointMkBonusList' : 'getPointMkGoodsList';
    let params = {
        brandCode: app.Conf.BRAND_CODE || '',
        pageIndex: this.page,
        pageSize: app.Conf.PAGE_SIZE
    }
    if(tabIndex != 0){
        params.searchVal = this.keyWord || ""
    }
    return app.PointApi[request]({
        params: params,
        extraData: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {


            let data = e.data;
            console.log('data', data)
            let list = data.list;
            let listData = this.data.listData;
            if (list.length == 0) {
                this.hasMore = false;
            }
            if(tabIndex == 1){
              for (let i = 0; i < list.length; i++){
                let item = list[i] || {};
                if (item.is_show_exchange_number == 1) {
                  let exchange_number = parseFloat(item.exchange_number) || 0;
                  let ex_number_str = exchange_number;
                  if (exchange_number > 10000) {
                    ex_number_str = parseFloat(exchange_number / 10000) + "万";
                  }
                  if (exchange_number > 100000) {
                    ex_number_str = parseFloat(exchange_number / 10000) + "万+";
                  }
                  item.exchange_number_str = ex_number_str
                }
              }
            }
            if (this.page == 1) {
                listData = list;
            } else {
                listData = listData.concat(list);
            }
            let clone = [...listData];

            // 这里的处理(兑换礼品):只有第一页加载呈现为位置负数，可避免图片重叠问题，后面多次加载页面就不需要
            if (this.page == 1 && tabIndex == 1) {
                clone.forEach(function (x) {
                    Object.assign(x, {
                        left: "-1000rpx"
                    })
                })
            }

            //
            this.setData({
                listData: clone,
                showWrapper: false
            });

            //
            if (tabIndex == 0) {
                this.setData({
                    showWrapperCouopn: false,
                    showWrapperGoods: true
                })
            } else {
                this.setData({
                    showWrapperCouopn: true,
                    showWrapperGoods: false
                });
                let _timer = setTimeout(() => {
                    clearTimeout(_timer);
                    // 索引值
                    let start = this.data.listData.length - list.length;
                    reLoad.call(this, start);
                }, 0);
            }


        }
    })
}

function reLoad(start) {
    const col = 2;
    let matchArr = [];
    let that = this;
    const query = wx.createSelectorQuery().in(this);
    query.selectAll('.goods_item').boundingClientRect();
    query.exec(function(res) {
        let result = res[0];
        if (result[0]){
          matchArr[0] = realMarker.call(that, result[0].height + (result[0].top));
        }
        if (result[1]){
          matchArr[1] = realMarker.call(that, result[1].height + (result[1].top));
        }
        let len = result.length;
        let clone = [...that.data.listData];
        let cloneLen = clone.length;
        for (let i = 0; i < len; i++) {
            let control = ((i + 1) % 2 === 0) ? 2 : 1;
            if (i < col) {
                clone[i].left = (i * 360) + (control * 10) + "rpx";
                clone[i].top = 0;
                that.setData({
                    [`listData[${i}].left`]: clone[i].left,
                    [`listData[${i}].top`]: clone[i].top
                });
            } else {
                let minH = Math.min.apply(null, matchArr);
                let minHItem = matchArr.indexOf(minH);
                clone[i].left = (minHItem * 360) + ((minHItem + 1) * 10) + "rpx";
                clone[i].top = minH + 50 - realMarker.call(that, result[0].top) + "rpx";
                matchArr[minHItem] += (realMarker.call(that, result[i].height) + 40);
                that.setData({
                    [`listData[${i}].left`]: clone[i].left,
                    [`listData[${i}].top`]: clone[i].top
                });
            }
        }
    })
}

function realMarker(w) {
  if(!w) return 0;
    let [scale, tranferWidth] = [0, 0];
    wx.getSystemInfo({
        success(res) {
            scale = (750 / res.windowWidth);
            tranferWidth = (w * scale);
        }
    });
    return tranferWidth;
}