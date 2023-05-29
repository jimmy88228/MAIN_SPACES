// pages/micro_mall/shopping/shop-nav/shop-nav.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isEdit:{
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    editCart(){
      let page = getCurrentPages().slice(-1)[0];
      page.setData({
        isEdit: !this.properties.isEdit
      })
    }
  }
})
