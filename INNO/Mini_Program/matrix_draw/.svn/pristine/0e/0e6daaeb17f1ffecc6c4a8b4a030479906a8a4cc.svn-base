// pages/component/btnBackTop/btnBackTop.js
const app = getApp();
Component({ 
  behaviors: [Behavior.BaseBehavior],
  properties: {

  }, 
  data: {

  }, 
  attached(){
    let img_back_top = this.data.brand_info.default_icon_url + 'backTop.png';
    this.setData({
      img_back_top
    })
  },
  methods: {
    setShow(bool=false){
      if (bool) {
        this.zIndexId && clearTimeout(this.zIndexId);
        this.setData({
          zIndexShow: true
        }, function () {
          this.setData({
            animShow: 'transition: opacity 0.3s linear;opacity:1;',
          })
        })
      } else {
        this.setData({
          animShow: 'transition: opacity 0.1s linear;opacity:0;'
        },function(){
          this.zIndexId = setTimeout(()=>{
            this.setData({
              zIndexShow:false
            })
          },100)
        })
      }
    },
    goTop(){
     this.triggerEvent('backTopTap'); 
    }
  }
})
