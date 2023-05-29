// pages/micro_mall/classify/adaptive_ classify/classify_two/classify_two.js
const app = getApp(); 
Component(app.BTAB({
  /**
   * 组件的属性列表
   */
  properties: {
    customTab:{
      type:Boolean,
      value:false,
    }
  },
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的初始数据
   */
  data: {
    tabList: [],
    dataItem: [],
    classify_list: {},
    cl_curr: 0,
    cur_tab: 0,
    scrollTop: 0,
    goodsList: {},
    tabTemp: [{}, {}, {}, {}, {}],
    detailsTemp: [{}, {}],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init() {
      this.setData({
        showPage: true
      })
    },
    onShowFnc(){
      if (this.saveData) {
        this.jump = false;
        this.saveData = false;
        return
      }
      goodsCategoryStyle.call(this);
    },
    onHideFnc(){
      if (this.jump) {
        this.saveData = true;
      } else {
        this.saveData = false;
      }
    },
    onTap(e) {
      let dataset = e.currentTarget.dataset;
      let cur = dataset.cur || 0;
      let type = dataset.type || '';
      let linkData = dataset.linkData || '';
      let linkType = dataset.linkType || ''; 
      let categoryArr = this.data.categoryArr || [];
      if (type == "tab") {
        let cur_view = "tab" + cur;
        this.setData({
          cur_tab: cur,
          cur_view
        })
      }
      if (type == "item") {
        let childCategorys = categoryArr[this.data.cur_tab].childCategorys || [];
        childCategorys[cur].isActive = !childCategorys[cur].isActive;
        this.setData({
          [`categoryArr[${this.data.cur_tab}].childCategorys[${cur}]`]: childCategorys[cur]
        })
      }
      if (type == "child") {
      }
      console.log(type, dataset)
      if(!linkType && !linkType)return
      this.jump = true;
      let obj = {
        func_type:linkType,
        related_id: linkData
      }
      app.pageJump(obj);
    },
  }
}))



function goodsCategoryStyle() {
  this.categoryArr = this.categoryArr || 　[];
  let params = {
    brandCode: app.Conf.BRAND_CODE
  }
  return app.RunApi.go('GoodsApi', 'goodsCategoryStyle', params, { diy: true }).then(res => {
    console.log('goodsCategoryStyle');
    let data = res.data || [];
    this.categoryArr = backtrack.call(this, data);
    console.log('categoryArr', this.categoryArr);
    this.setData({
      styleType: this.styleType,
      categoryArr: this.categoryArr
    })
  })
}

function backtrack(data = [], depth = 1) {
  // console.log('深度',depth);
  data = data || [];
  if (data.length > 0) {
    data.forEach((item, index) => {
      item.isActive = false;
      if (depth == 1 && !this.styleType) {
        this.styleType = item.styleType;
      }
      if (item.childCategorys && item.childCategorys.length > 0) {
        depth += 1;
        backtrack.call(this, item.childCategorys, depth);
        depth -= 1;
        // console.log('深度出来',depth);
      } else {
        // console.log('结束1', depth)
        return
      }
    })
    // console.log('结束2',depth)
    if (depth == 1) {
      return data
    }
  } else {
    return
  }
}