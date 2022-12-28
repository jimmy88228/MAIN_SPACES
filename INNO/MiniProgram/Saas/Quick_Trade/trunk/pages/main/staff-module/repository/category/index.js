
const App = getApp();
Page(App.BP({
  handleAddCateBtnTap() {
    this.createPop = this.createPop || this.selectComponent("#create-pop");
    this.createPop.showModal()
  }
}))