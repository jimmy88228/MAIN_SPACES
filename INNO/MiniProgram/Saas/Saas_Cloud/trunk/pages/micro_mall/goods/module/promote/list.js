import WindowBehaviors from "../../../../../components/ui/cps/window/window-behaviors";
import PromH from "../../../../../common/helper/handle/promHandle";
const app = getApp();
Component(
  app.BTAB({
    behaviors: [WindowBehaviors],
    properties: {
      isLogin: {
        type: Boolean,
        value: false
      },
    },
    data: {
      boxStyle: "transform: translate(0,110%); transition: all 300ms ease-in-out;",
      iconUrl: app.Conf.ICON_URL,
      couponList:[],
    }, 
    
    detached() {
    },
    methods: {
      onAttached() { 
        let server_close = this.data.brand_info.icon_url + "micro_mall/server_close.png"; 
        this.setData({
          boxStyle: "transform: translate(0,0);transition: all 300ms ease-in-out;",
          server_close: server_close
        });
      },
      onDetached() {
        this.setData({
          boxStyle: "transform: translate(0,110%);transition: all 300ms ease-in-out;"
        });
        return 300;
      },
      getGoodsPromotion(goods_id){
        this.goods_id = goods_id;
        return PromH.getGoodsPromotion(goods_id).then(res=>{
            let promoteData = res && res.promoteData || {};
            let data = res&&res.data||[];
            let promList = res&&res.promList||[];
            let page = getCurrentPages().slice(-1)[0];
            page.checkPromote = true;
            page.setData({
              checkPromote: data.length > 0 ? true : false,
              promoteData: promoteData
            })
            this.setData({
              promList
            })
        })
      },
      getMore(e) {
        let dataset = e.currentTarget.dataset || {};
        let ruleId = dataset.ruleId || '0';
        wx.navigateTo({
          url: `/pages/micro_mall/goods/promote_activity/promote_activity?ruleId=${ruleId}&goods_id=${this.goods_id}`,
        })
        return
      }
    }
  })
);
