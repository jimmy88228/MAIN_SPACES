const app = getApp();
Component(app.BTAB({
  properties: {

  },
  data: {
    goodsGroupList: [ // 礼品分类列表
      {
        id: 0,
        status: 1,
        grouping_name: "全部"
      }
    ],
    goodsGroupCurrentId: 0,
    bonusGroupList: [ // 优惠券分类列表
      {
        id: 0,
        status: 1,
        grouping_name: "全部"
      }
    ],
    bonusGroupCurrentId: 0,
    currentType: "", // bonus是优惠券，goods是礼品；获取列表时会储存一下
  },
  attached() {
    this.goodsReq = { // 礼品分类请求
      params: {
        pageIndex: 1,
        pageSize: app.Conf.PAGE_SIZE
      },
      totalCount: 1,
      noMore: false,
    };
    this.bonusReq = { // 优惠券分类请求
      params: {
        pageIndex: 1,
        pageSize: app.Conf.PAGE_SIZE
      },
      totalCount: 1,
      noMore: false
    };
  },
  methods: {
    handleCatesReachRight() {
      let type = this.data.currentType;
      let reqObj = this[`${type}Req`];
      if (reqObj.noMore) return;
      reqObj.params && (reqObj.params.pageIndex += 1);
      getCategories.call(this)
    },
    handleMoreTap() {
      let type = this.data.currentType,
        groupList = this.data[`${type}GroupList`] || [],
        reqObj = this[`${type}Req`];
      if (!reqObj.noMore) return getCategories.call(this, {
        pageIndex: reqObj.params.pageIndex + 1,
        pageSize: reqObj.totalCount - groupList.length
      }).then(() => {
        showCatesPop.call(this, this.data[`${type}GroupList`]);
      })
      showCatesPop.call(this, this.data[`${type}GroupList`]);
    },
    changeCate(e) {
      console.log("切换分类", e)
      let type = this.data.currentType,
        id = e.currentTarget.dataset.id || (typeof e.detail === 'number' && e.detail) || 0;
      if (this.data[`${type}GroupCurrentId`] == id) return  
      this[`${type}GroupCurrentId`] != id && this.setData({ [`${type}GroupCurrentId`]: id }, () => {
        this.triggerEvent("catechange", id)
      })
    },
    loadData(params = {}) {
      // 优惠券暂时不用，需要时删掉条件
      if (params.currentIndex == 0) return Promise.resolve()
      return getCategories.call(this, params)
    }
  }
}))

function getCategories(nParams = {}, refresh = false) {
  let that = this;
  let type = nParams.currentIndex != undefined ? (nParams.currentIndex == 1 ? 'goods' : 'bonus') : (this.data.currentType); // 0是优惠券，1是礼品
  this.setData({currentType: type});
  let reqObj = this[`${type}Req`];
  if (reqObj.noMore || this.isLoading) return Promise.reject();
  let { pageIndex, pageSize } = reqObj.params;
  let reqMethod = '';
  if (type == 'goods') reqMethod = 'getPointMkGoodsGrouping';
  else return Promise.reject(); // 优惠券暂时不做
  this.isLoading = true;
  let params = {
    pageIndex,
    pageSize,
    brandCode: app.Conf.BRAND_CODE || '',
    ...nParams
  }
  return app.PointApi[reqMethod]({
    params,
    other: {
      isShowLoad: true
    }
  }).then(res => {
    console.log(`currentIndex: ${params.currentIndex}, type: ${type}, 分类结果: ${res}`);
    let list = res && res.data || [],
      totalCount = list[0] && list[0].totalCount + 1 || 1,
      groupList = params.pageIndex === 1 ? [...[{id: 0,status: 1,grouping_name: "全部"}] ,...list] : [...that.data[`${type}GroupList`], ...list];
    groupList.length >= totalCount && (reqObj.noMore = true);
    that[`${type}Req`].totalCount = totalCount;
    that.setData({
      [`${type}GroupList`]: groupList
    })
  }).finally(() => {
    that.isLoading = false
  })
}

function showCatesPop(groupList) {
  this.categoryPop = this.categoryPop || this.selectComponent("#categoryPop");
  this.categoryPop.showFn(groupList)
}