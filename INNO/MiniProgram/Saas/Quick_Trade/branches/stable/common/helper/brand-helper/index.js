class BrandHelper{
  static getInstance() {
    if (!BrandHelper.instance) {
      BrandHelper.instance = new BrandHelper();
    }
    return BrandHelper.instance;
  }

  get BInfo() {
    if (!this._brandInfo) {
      this._brandInfo = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
    }
    return this._brandInfo || {};
  }
}
export default BrandHelper.getInstance();