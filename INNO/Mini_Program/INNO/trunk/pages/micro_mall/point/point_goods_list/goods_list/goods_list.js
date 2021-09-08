const app = getApp();
import MyDate from '../../../../../common/support/utils/date-util'
Component(app.BTAB({
    data: {
        brand_info: app.globalData.brand_info,
        listData: [],
        currentIndex: -1,
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
    let request = tabIndex == 0 ? 'getPointMkBonusListByUser' : 'getPointMkGoodsListByUser';
    let params = {
        brandCode: app.Conf.BRAND_CODE || '',
        pageIndex: this.page,
        pageSize: app.Conf.PAGE_SIZE,
        userToken:app.LM.userToken
    }
    if(tabIndex != 0){
        params.searchVal = this.keyWord || ""
    }
    return app.PointApi[request]({
        params: params,
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") { 
            let data = e.data || {};
            console.log('data', data)
            let list = data.list || [];
            if (list.length == 0) {
                this.hasMore = false;
            }
            for (let i = 0; i < list.length; i++){
              let item = list[i] || {};
              item.start_time && (item.stime = MyDate.format(MyDate.parse(item.start_time),'yyyy-MM-dd HH:mm:ss'));
              item.end_time && (item.etime = MyDate.format(MyDate.parse(item.end_time),'yyyy-MM-dd HH:mm:ss'));
              if(tabIndex == 1){
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
            let listData;
            if (this.page == 1) {
                listData = list;
            } else {
                listData = listData.concat(list);
            }
            this.setData({
                listData
            });
            wx.nextTick(()=>{
                listData.forEach((item,index)=>{
                    initCountDownData.call(this,item,index,data.serverTime);
                })
            })
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

function initCountDownData(data,index,serverTime){
    if(!data)return;
    let result = {};
    result.stime = data.stime || "";
    result.etime = data.etime || "";
    result.serverTime = serverTime || "";
    result.acName = "兑换";
    result.type = "list-point"
    let id = `actCountDownId-${this.data.currentIndex}-${index}`;
    let component = this.selectComponent(`#${id}`);
    component.initData(result,()=>{
        let index = this.data.currentIndex||0;
        this.installData(index);
    });
}