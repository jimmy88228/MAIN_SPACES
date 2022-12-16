// components/micro-page/micro-mix/items/component/group-head/group-head.js
import mcBehavior from '../../../../help/mc-behavior'
const app = getApp();
Component(app.BTAB({
  behaviors: [mcBehavior],  
  properties: {
    showTab:{
      type:Boolean,
      value:false
    }, 
    group:{
      type:Array,
      value:[]
    },
    curTab:{
      type:Number,
      value:0
    },

  }, 
  data: {

  }, 
  methods: {
    onTap(e){
      let dataset = e.currentTarget.dataset||{};
      let type = dataset.type||"";
      if(type == 'tab'){
        let curTab = dataset.index||0;
        this.triggerEvent('onTap',{curTab,type});
      }
    }
  }
}))
