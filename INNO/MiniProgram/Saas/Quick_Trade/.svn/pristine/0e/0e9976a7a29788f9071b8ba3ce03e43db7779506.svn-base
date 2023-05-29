import {
  WxCanvas2d,
  SaveToAlbum
} from "../../../../common/support/wx-canvas-2d/index";
import WxApi from "../../../../common/utils/wxapi/index";
import getGoodsSeries from "./process/goods";
import getIndexSeries from "./process/home";
import { pageColor } from "../../../../common/helper/style-helper/page";
const App = getApp();
WxCanvas2d.use(SaveToAlbum)
Component(App.BC({
  data: {
    windowDuration: 300, // 弹窗duration (ms)
    show: false,
    posterLoaded: false, // 海报是否加载完成
  },

  ready() {
    
  },

  methods: {
    showModal(posterData = {}){
      this.showPoster(posterData);
    },
    dismiss() {
      this.canvasInstance && this.canvasInstance.off("afterDraw");
      this.canvasInstance = null;
      this.setData({
        show: false,
      })
    },
    showPoster({type, data}) {
      this.setData({show: true, posterLoaded: false}, () => {
        setTimeout(() => createAndDrawPoster.call(this, {type, data}), this.data.windowDuration)
      })
    },

    handleSaveBtnTap() {
      if (this.canvasInstance) {
        this.canvasInstance.save()
          .then(() => {
            console.log("handleSaveBtnTap 已保存");
            App.SMH.showToast({title: "保存成功"})
          })
      }
    }
  }
}))

function createAndDrawPoster({type, data}) {
  let canvas = this.canvasInstance = new WxCanvas2d();
  console.log('canvas',canvas)
  let getSeries;
  if (type === "goods") {
    getSeries = getGoodsSeries;
  } else if (type === "index") {
    getSeries = getIndexSeries;
  }
  WxApi.showLoading({title: '加载中'});
  getSeries(data)
    .then(series => {
      return new Promise(rs => {
        canvas.create({
          query: '.poster-canvas', // 必传，canvas元素的查询条件
          rootWidth: 750, // 参考设备宽度 (即开发时UI设计稿的宽度，默认375，可改为750)
          bgColor: pageColor["main-color"], // 背景色，默认透明
          component: this, // 自定义组件内需要传 this
          radius: 0 // 海报图圆角，如果不需要可不填
        })
        let finishedCount = 0;
        let timer = setTimeout(() => {
          clearTimeout(timer);
          timer = null;
          rs({});
        }, 3000)
        canvas.draw({series})
        canvas.on("afterDraw", res => {
          console.log("afterDraw res: ", res, finishedCount);
          finishedCount++;
          if (finishedCount === series.length) {
            clearTimeout(timer);
            timer = null;
            rs(res);
          }
        })
      })
    })
    .then(() => {
      this.setData({posterLoaded: true})
    })
    .finally(() => {
      WxApi.hideLoading();
    })
}