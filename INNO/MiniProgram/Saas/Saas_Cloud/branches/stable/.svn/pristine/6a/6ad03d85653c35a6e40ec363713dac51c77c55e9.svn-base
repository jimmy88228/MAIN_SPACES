// pages/component/Quick_Find/module/quick.js
const app = getApp();
Component(app.BTAB({
  relations: {
    '../Quick_Find': {
      type: 'parent', // 关联的目标节点应为父节点
    }
  },
  properties: {
    item:{
      type:Object,
      value:{}
    },
    key:{
      type:String,
      value:""
    },
  },
  data: {

  }, 
  methods: {
    onTap(e){
      let dataset = e.currentTarget && e.currentTarget.dataset||{};
      this.triggerEvent('quickTap',dataset,{ bubbles: true, composed: true });
    },
    getQuery(rpxR) {
      const id = "#box";
      const query = wx.createSelectorQuery().in(this);
      query.select(id).boundingClientRect(res => {
        this.top = res.top;
        this.height = res.height;
        this.key = this.data.key;
        let node = {
          top:this.top,
          height:this.height,
          key:this.key,
          type:"quick"
        }
        this.triggerEvent('firstNodeBack',node,{bubbles: true, composed: true }) 
      }).exec();
    },
    setActivivate(bool) {
      this.setData({
        active: bool
      });
    }
  }
}))
