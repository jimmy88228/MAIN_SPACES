const app = getApp();
Component(app.BTAB({
  properties: {
    activityList:{
      type: Array,
      value: []
    },
    cur_num:{
      type:Number,
      value:0,
    },
  }, 
  data: {
    ac_conf: app.Conf.style.n_sk_color, 
    cur_view:""
  }, 
  ready(){
  },
  methods: {
    handle_tab(e){
      let dataset = e.currentTarget.dataset || {};
      let acId = dataset && dataset.acId || 0; 
      let num = dataset && dataset.num || 0; 
      if (!this.cur_acId){
        this.cur_acId = this.data.cur_num
      }
      if (this.cur_acId == acId) return
      let cur_num = acId;
      let cur_view = 'view_' + acId; 
      let params = {
        cur_num,
        // cur_view
      }
      this.cur_acId = acId;
      this.setData({
        cur_num,
        // cur_view
      }); 
      throttle.call(this,()=>{
        this.triggerEvent('tab', { cur_num, acId, num})
      });
    },
    init(_cur_num = 0) {
      let cur_num = _cur_num || 0;
      let cur_view = 'view_' + cur_num;
      this.setData({
        cur_num,
        cur_view
      })
      setTimeout(()=>{
        this.setData({
          cur_view: this.data.cur_view
        })
      },1000)
    }
  }
}))

function throttle(fn){
  clearTimeout(this.throttleId)
  this.throttleId = setTimeout(()=>{
    fn();
  },300)
}