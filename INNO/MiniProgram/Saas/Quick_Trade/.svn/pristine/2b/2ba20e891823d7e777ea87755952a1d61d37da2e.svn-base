const App = getApp();
Component(App.BC({
  externalClasses: ['ext-title-class','ext-content-class'],
  options:{
    multipleSlots:true
  },
  data: {
    showBool: false,   
  }, 
  properties: { 
    title:String,
    content:String,
    transitionName:String,
    titleStyle:String,
    contentStyle:String,
    show:Boolean,
    hideCancel:Boolean,
    hideConfirm:Boolean,
    isCatchConfirm:Boolean,
    cancelText:{
      type:String,
      value:"取消"
    },
    confirmText:{
      type:String,
      value:"确定"
    },
  },  
  observers:{
    show(nV){
      this.setData({showBool:nV})
    }
  },
  methods: { 
    showModal(rs, rj) { //把父组件调用时的异步函数先存起来
      this.resolveF = rs;
      this.rejectF = rj;
      this.customPop = this.getComponent('#custom-pop',this.customPop);
      this.customPop.showModal();
      return new Promise((rs2,rj2)=>{
        this.resolveF2 = rs2;
        this.rejectF2 = rj2;
      })
    },
    dismiss() {
      this.customPop = this.getComponent('#custom-pop',this.customPop);
      this.customPop.dismiss().then(()=>{
        typeof this.rejectF === "function" && this.rejectF();
        typeof this.rejectF2 === "function" && this.rejectF2();
        this.resolveF = this.rejectF = null;
      });
    }, 
    confirm(){ //父组件接收confirm事件, e.detail = dismiss->调用存起来的异步函数->销毁存起来的函数
      let cb = (_arg)=>{
        this.customPop = this.getComponent('#custom-pop',this.customPop);
        this.customPop.dismiss().then(()=>{
          typeof this.resolveF === "function" && this.resolveF(_arg);
          typeof this.resolveF2 === "function" && this.resolveF2(_arg);
          this.resolveF = this.rejectF = null;
        })
      }
      this.triggerEvent('confirm',cb);
      !this.properties.isCatchConfirm && cb();
    }
  }
}))