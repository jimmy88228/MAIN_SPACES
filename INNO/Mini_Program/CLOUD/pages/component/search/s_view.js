// pages/component/search/s_order.js
import Utils from "../../../support/utils/utils.js"
const app = getApp();
Component(app.BTAB({
  properties: {
    placeText: {
      type: String,
      value: "输入单号/手机号/收货人搜索"
    },
    searchType:{
      type: String,
      value:"order", // goods,  activity 
      observer(n,o){
        console.log("searchType",n,o)
        let brand_info = this.data.brand_info || {};
        let img_search = brand_info.icon_url + "micro_mall/search_gray.png"; 
        let goods_search = brand_info.icon_url + "micro_mall/search_icon.png"; 
        this.setData({
          img_search: n == "order" ? img_search : goods_search
        })
      }
    },
    hideBtn:{
      type:Boolean,
      value:false
    }
  },

  data: {
    // place_text:"输入单号/手机号/收货人搜索",
    o_s_val:"",
  },
  ready(){
    if(!this.data.img_search){
      this.setData({
        img_search: this.data.brand_info.icon_url + "micro_mall/search_gray.png"
      })
    }
  },
  methods: {
    onInput(e){
      // console.log(e);
      let dataset = e.currentTarget.dataset||{};
      let detail = e.detail||{};
      let key = dataset.key||"";
      let value = e.value||"";
      this.setData({
        [key]:detail.value||""
      })
      this.triggerEvent('inputCallback', {value : detail.value || ""});
    },
    onTap(e){
      controlClick.call(this,fn => {
        let dataset = e.currentTarget.dataset||{};
        let type = dataset.type||"";
        if(type=='confirm'){
          this.triggerEvent('onTapConfirm',this.data.o_s_val || "");
        }
      })
    },
    setVal(val){

      this.setData({
        o_s_val:val
      })
    },
  }
}))
let controlClick = Utils.debounce(fn => {
  fn();
}, 400);