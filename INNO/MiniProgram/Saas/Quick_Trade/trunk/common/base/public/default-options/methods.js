export default {
  getPublicComponent(id) {
    this.publicComponent = this.publicComponent || this.selectComponent("#public-component");
    let component = this.publicComponent && this.publicComponent.getComponent(id);
    return component
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
}