// components/more-view/more-view.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:{
      type:Object,
      observer(n){
        if(this.isAttached){
          this.change();
        }
      }
    },
    hide:{
      type:Boolean,
      value:false,
    }
  },
  attached(){
    this.isAttached = true;
  },
  data: {

  },
  methods: {
    change(){
      let data = this.properties.data||{};
      let loading = data.loading||false;
      let end = data.end||false;
      let mode = end?'end':loading?'loading':'';
      if(mode){
        this.setData({
          [mode]:true
        })
        wx.nextTick(()=>{
          this.setData({
            animMode:mode
          })
        })
      }else{
        this.setData({
          animMode:''
        })
      } 
    },
    animationend(e){
    }
  }
})
 