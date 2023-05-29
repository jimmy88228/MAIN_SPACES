import wxApi from "../../../../common/helper/wx-api-helper"
const app = getApp();
Component(app.BTAB({
  properties: {
    info: {
      type: Object,
      value: {},
    }
  },
  attached() {
    this.setSwiperH()
  },
  data: {
    current: 0,
    swiperH: 268,
  },
  methods: {
    setSwiperH() {
      let that = this;
      setTimeout(()=>{
        let query = that.createSelectorQuery();
        query.selectAll('.g_info').boundingClientRect();
        query.exec(function (res) {
          console.log(res)
          let nodeList = res[0] || [];
          let maxHeight = nodeList[0] && nodeList[0].height
          for (let i = 1, length = nodeList.length; i < length; i++) {
            let height = nodeList[i].height;
            height > maxHeight && (maxHeight = height)
          }
          if (nodeList[0]) {
            that.setData({
              swiperH: maxHeight
            })
          }
          if (that.id) {
            app.EB.call(that.id, that);
          }
        })
      },600)
    },
    handleSwiperChange(e){
      const current = e.detail.current || 0;
      this.setData({current})
    },
    previewImage(e) {
      const {src = ""} = e.currentTarget.dataset;
      console.log(e)
      wxApi.previewImage({
        current: src,
        urls: (this.data.info || []).map((item = {}) => item.goodsImg)
      })
    }
  }
}))