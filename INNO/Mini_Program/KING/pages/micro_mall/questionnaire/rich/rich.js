let WxParse = require("../../../../wxParse/wxParse.js");
const app = getApp();
Component(app.BTAB({
  properties: {
    info: {
      type: Object,
      value: {},
      observer:function(n,o){
        if(n){
          this.loadData(n);
        }
      }
    },
    label: {
      type: Number,
      value: 0,
    },
  },

  data: { 
  },
  methods: {
    loadData(options = {}){
      options = options || {};
      let data = options.txt_html ;
      WxParse.wxParse('article', 'html', data, this, 0);
    },
    getData(e){
      let check = true;
      let data = {
        type : "html",
        value : ""
      }; 
      data.label = this.data.label || 0;
      return {
        check,
        data
      }
    }
  }
}))
