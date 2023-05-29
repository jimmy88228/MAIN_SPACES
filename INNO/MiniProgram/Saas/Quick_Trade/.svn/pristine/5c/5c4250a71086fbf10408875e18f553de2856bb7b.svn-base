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
  }
}