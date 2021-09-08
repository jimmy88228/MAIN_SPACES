import WindowBehaviors from "../../../../../components/ui/cps/window/window-behaviors.js";
const app = getApp();
Component(app.BTAB({
    behaviors: [WindowBehaviors],
    properties: {
        skuObj: {
            type: Object,
            value: {},
            observer:function(n,o){
              console.log('info',n,o)
            }
        },
        goodsExtend: {
            type: Object,
            value: {}
        },
        default_id:{
          type: String,
          value: ''
        },
        productInfo: {
            type: Object,
            value: {},
            // observer:function(n,o){
            //   console.log('info',n,o)
            // }
        },
        cur_color_id:{
          type: Number,
          value: 0
        },
        picture:{
          type: String,
          value: ''
        },
        canBuy:{
          type: Boolean,
          value: false
        },
        colorArr:{
          type: Array,
          value: [],
          observer:function(n,o){
            console.log('colorArr',n,o)
            }
        },
        sizeArr:{
          type: Array,
          value: []
        },
        selectShipInfo:{
          type: Object,
          value: {}
        },
    },
    data: {
      cur_color_id: 0,
      ac_conf: app.Conf.style.n_sk_color || {},
      boxStyle: "bottom: -100%;transition: bottom 300ms ease-in-out"
    },
    ready(){
      let ls_icon2 = this.data.brand_info.icon_url + "micro_mall/return_active.png";
      let ls_icon1 = this.data.brand_info.icon_url + "micro_mall/return.png";
      this.setData({
        ls_icon2,
        ls_icon1
      })
    },
    methods: {
        onAttached() {
            this.setData({
                boxStyle: "bottom: 0;transition: bottom 300ms ease-in-out"
            });
            let index = this.data.cur_color_id;
        },
        onDetached() {
            this.setData({
                boxStyle: "bottom: -100%;transition: bottom 300ms ease-in-out"
            });
            return 300;
        },
        colorSelect(e) { 
          let dataset = e.currentTarget.dataset || {};
          console.log(dataset)
          // if (this.data.goodsExtend.attrCount == 1 && (!dataset.invent || dataset.invent <= 0)) return
          let color_id = dataset.color_id || 0;
          
          if (color_id == this.data.cur_color_id)return
          this.triggerEvent('colorSelect',{color_id});
        },
        sizeSelect(e) {
          let dataset = e.currentTarget.dataset || {};
          console.log(dataset)
          // if (!dataset.invent || dataset.invent<=0)return
          let size_id = dataset.size_id || 0;
          if (size_id == this.data.cur_size_id) return
          this.setData({
            cur_size_id : size_id || 0
          })
          this.triggerEvent('sizeSelect', { size_id });
        },
        clearSize(){
          this.setData({
            cur_size_id: 0
          })
        },
        skuConfirm(e) {
          if (this.isLoading)return
          throttle.call(this);
          this.triggerEvent('skuConfirm');
        },
        onTap(e){
          if (this.isLoading)return
          let dataset = e.currentTarget.dataset||{};
          let type = dataset.type||"";
          let index = dataset.index || "2";
          throttle.call(this,this.lastIndex == index?500:200);
          this.lastIndex = index;
          if (type =="shipSelect"){
            this.triggerEvent('shipSelect',{index});
          } else if (type == "selectStore"){
            this.triggerEvent('shipSelect', { index,jump:true});
            setTimeout(()=>{
              this.triggerEvent('selectStore', { index, jump: true });
            },150)
          }
        },
        _noFn(){}
    }
}))


function throttle(time=350){
  this.isLoading = true;
  let _timer = setTimeout(()=>{
    this.isLoading = false;
    clearTimeout(_timer);
  },time)
}