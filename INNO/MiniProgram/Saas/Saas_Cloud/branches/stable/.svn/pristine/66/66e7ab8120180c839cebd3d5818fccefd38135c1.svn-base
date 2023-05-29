import PageJump from "../../common/helper/page-jump";

const app = getApp();
Component(app.BTAB({
  attached() {
    
  },
  data: {
    scrollTop: 0
  },
  methods: {
    loadData(data = {}) { // conditionType 1满减 2满件
      this.setData({
        promoteData: data,
        scrollTop: 0
      }, () => {this.emitComHeight()})
    },

    emitComHeight(height) {
      if (height != undefined) {
        this.triggerEvent("height-change", height);
        return 
      }
      this.querySelector = this.querySelector || wx.createSelectorQuery().in(this);
      this.querySelector.select(".pa_con")
      .boundingClientRect()
      .exec(result => {
        let paConHeight = result[0] && result[0].height || 0;
        this.triggerEvent("height-change", paConHeight)
      })
    },

    handleCouDan() {
      let promoteData = this.data.promoteData || {};
      if (promoteData.pageId) { // 跳转自定义页
        PageJump({code: "pageUrl", id: promoteData.pageId})
      } else {
        wx.navigateTo({
          url: `/pages/micro_mall/goods/promote_activity/promote_activity?ruleId=${promoteData.ruleId}&goods_id=${promoteData.goods_id}`,
        })
      }
    },

    close() {
      this.loadData({})
    }
  }
}))
