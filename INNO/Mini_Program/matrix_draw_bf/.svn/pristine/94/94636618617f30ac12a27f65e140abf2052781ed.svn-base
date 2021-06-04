import GetTabList from "../helper/manager/getTabList.js"
const app = getApp();
Component(app.BTAB({
  data: {
    color: "#7f7f7f",
    selectedColor: app.Conf.style.bg_color,
    list: [],
    isHideTab: true,
  }, 
  methods: {
    switchTab(e) {
      let data = e.currentTarget.dataset||{};
      let url = data.path
      let id = data.id; 
      let type = data.type||""; 
      if(type.indexOf('define') != -1){
        url && navJump(url)
        return
      }
      url && wx.switchTab({
        url:"/" + url,
        success(){}
      })
    },
    setTab(){
      GetTabList.getList().then(res=>{
        !this.initBool && (this.initBool = true);
        console.log('GET菜单',res)
        this.setData({
          list:res,
        })
      })
    }
  }
}))

function filter(data={}){
  let cur_id = this.data.selected || "";
  if (cur_id == 'videoShopping' && (cur_id == data.id)){
    return false
  }
  return true;
}

function navJump(url=""){
  if(url.indexOf('/') != 0){
    url = '/' + url;
  } 
  console.log('进来navjump')
  wx.navigateTo({
    url: url,
    fail:res=>{
      console.log('进来失败',res)
      wx.switchTab({ 
        url: url,
        success(){}
       })
    }
  })
}