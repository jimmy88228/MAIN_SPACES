// components/input-fill/fill/fill.js
const app = getApp();
Component(app.BTAB({
  properties: {
    item:{
      type:Object,
      value:{}
    },

  }, 
  data: {
     
  }, 
  methods: {
    onInput(e){
      // console.log(e);
      let val = e.detail.value || "";
      this.triggerEvent('change',val);
    },
  }
}))