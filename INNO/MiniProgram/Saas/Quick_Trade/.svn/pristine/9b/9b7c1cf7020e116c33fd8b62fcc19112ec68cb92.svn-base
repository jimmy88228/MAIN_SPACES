import WxApi from "../../../utils/wxapi/index";
import SMH from "../../../helper/show-message-helper/index";
let loadingObj = {};
export default {
  getPublicComponent(id) {
    this.publicComponent = this.publicComponent || this.selectComponent("#public-component");
    let component = this.publicComponent && this.publicComponent.getComponent(id);
    return component
  },

  getComponent(id,instance){
    console.log('getComponent',id,this,)
    return instance || this.selectComponent(id);
  },

  findView(id, key) {
    let v = this.selectComponent(id);
    if (v) return v;
    else if (key) {
        this.setData({ [key]: true });
        v = this.selectComponent(id);
    }
    return v;
  },

  setView(viewData){
    Object.defineProperties(this, viewData);
  },
  
  showLoading() {
    let loadingComponent = this.getPublicComponent("loading");
    return loadingComponent ? loadingComponent.showLoading() : Promise.reject("showLoadingError") 
  },

  hideLoading() {
    let loadingComponent = this.getPublicComponent("loading");
    return loadingComponent ? loadingComponent.hideLoading() : Promise.reject("hideLoadingError") 
  },
  
  getDataset(e,type) {
    let dataset = e && e.currentTarget && e.currentTarget.dataset || {};
    if(type)return dataset[type]
    return dataset;
  },

  jumpAction(e){
    console.log('jumpAction',e)
    let url=e;
    if(e && typeof(e) == 'object'){
      url = this.getDataset(e,'url')||"";
    }
    url = (!url || url.indexOf('/') == 0) ? url : ('/'+url);
    if(url){
      wx.navigateTo({
        url,
        fail:(e)=>{
          console.log('e',e)
          wx.reLaunch({
            url,
          })
        }
      })
    } 
  },
  tabBarToggle(show = undefined) {
    let pages = getCurrentPages() || [],
      curPage = pages[pages.length - 1],
      tabBar = curPage.getTabBar && curPage.getTabBar() || null;
    if (tabBar && typeof tabBar.tabBarToggle === "function") {
      tabBar.tabBarToggle(show);
    }
  },
  onInputPublic(e){
    let {key,name} = this.getDataset(e)||""; 
    let value = e.detail && e.detail.value; 
      this.setData({
        [`${name}.${key}`]: value
      }) 
  },
  _showModal(modalInfo={}){
    modalInfo.title = modalInfo.title || "提示";
    return WxApi.showModal(modalInfo||{}).then(res=>{
      if(res && res.confirm){
        return res;
      }else{
        return Promise.reject(res);
      }
    })
  },
  _checkAllValid(isShowErr=true){ 
    this.oriInputArr = this.selectAllComponents('.ori-label');
    let prmArr = this.oriInputArr.map((item,index)=>item.checkValid(index));
    return Promise.all(prmArr).then(()=>{
      return true
    }).catch(e=>{
      console.log('catch',e);
      if(e && e.err){
        isShowErr && SMH.showToast({title:e.err});
        let cmpt = this.oriInputArr[e.index]||{};
        if(typeof(cmpt.showError == 'function')){
          cmpt.showError(); //第一个非法input的报错动画
        }
      }
      return Promise.reject(e);
    })
  },
  _setPageLoading(key="normal",time=500){
    let page = getCurrentPages().pop();
    !loadingObj[page] && (loadingObj[page] = {});
    if(loadingObj[page][key]){
      throw false;
    }
    loadingObj[page][key] = true;
    let timer = setTimeout(() => {
      clearTimeout(timer);
      delete loadingObj[page][key];
    }, time);
  },
  _selectQuery(id,fromType='page',selectType=""){
    return new Promise((rs,rj)=>{
      if(!id)return rj();
      const query = fromType=='page'?wx.createSelectorQuery():wx.createSelectorQuery().in(this);
      if (!selectType) {
        query.select(id).boundingClientRect();
      } else {
        query.selectAll(id).boundingClientRect()
      }
      query.selectViewport().scrollOffset().exec(res => { 
          // console.log('_selectorQuery',res);
          return rs(res); 
        }
      )  
    })
  },
  noAction(){
    return false
  }
}