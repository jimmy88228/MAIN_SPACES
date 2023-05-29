// pages/component/Quick_Find/module/list.js
const app = getApp();
Component(app.BTAB({
  relations:{
    '../Quick_Find': {
      type: 'parent', // 关联的目标节点应为父节点 
    },
  },
  properties: { 
    listArr: {
      type: Array,
      value: [],
    },
    listMod: {
      type: Object,
      value: {},
    },
    key: {
      type: String,
      value: "",
    },
    active:{
      type:Boolean,
      value:false
    } 
  }, 
  data: {
  },
  methods: {
    onTap(e) {
      let dataset = e.currentTarget && e.currentTarget.dataset || {};
      this.triggerEvent('listTap', dataset, {
        bubbles: true,
        composed: true
      });
    },
    getQuery() {
      const id = "#box";
      const query = wx.createSelectorQuery().in(this);
      query.select(id).boundingClientRect(res => {
        this.top = res.top;
        this.height = res.height;
        this.key = this.data.key;
        // let node = {
        //   top:that.top,
        //   height:that.height,
        //   key:that.key,
        //   type:"list"
        // }
        // if(that.data.num == 0){
        //   that.triggerEvent('firstNodeBack',node,{bubbles: true, composed: true }) 
        // } 
      }).exec();
    },
    setActivivate(bool) {
      this.setData({
        active: bool
      });
    }
  }
}))