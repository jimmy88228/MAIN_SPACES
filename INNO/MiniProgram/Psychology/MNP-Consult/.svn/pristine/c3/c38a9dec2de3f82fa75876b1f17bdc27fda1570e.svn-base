const EPlatform = {
  /**App*/
  AppPlus : 'APP-PLUS',
  /**App nvue Plus*/
  AppPlusNvue : 'APP-PLUS-NVUE',
  /**App nvue*/
  AppNvue : 'APP-NVUE',
  /**H5*/
  H5 : 'H5',
  /**微信小程序*/
  MpWeixin : 'MP-WEIXIN',
  /**支付宝小程序*/
  MpAlipay : 'MP-ALIPAY',
  /**百度小程序*/
  MpBaidu : 'MP-BAIDU',
  /**字节跳动小程序*/
  MpToutiao : 'MP-TOUTIAO',
  /**QQ小程序*/
  MpQq : 'MP-QQ',
  /**360小程序*/
  Mp360 : 'MP-360',
  /**微信小程序/支付宝小程序/百度小程序/字节跳动小程序/QQ小程序/360小程序*/
  Mp : 'MP',
  /**快应用通用(包含联盟、华为)*/
  QuickappWebview : 'quickapp-webview',
  /**快应用联盟*/
  QuickappWebviewUnion : 'quickapp-webview-union',
  /**快应用华为*/
  QuickappWebviewHuawei : 'quickapp-webview-huawei',
}

function getPlatform(type){
  let platform = "";
  //#ifdef APP-PLUS
  platform = EPlatform.AppPlus
  //#endif

  //#ifdef APP-PLUS-NVUE
  platform = EPlatform.AppPlusNvue
  //#endif

  //#ifdef APP-NVUE
  platform = EPlatform.AppNvue
  //#endif

  //#ifdef H5
  platform = EPlatform.H5
  //#endif

  //#ifdef MP-WEIXIN
  platform = EPlatform.MpWeixin
  //#endif

  //#ifdef MP-ALIPAY
  platform = EPlatform.MpAlipay
  //#endif

  //#ifdef MP-BAIDU
  platform = EPlatform.MpBaidu
  //#endif

  //#ifdef MP-TOUTIAO
  platform = EPlatform.MpToutiao
  //#endif

  //#ifdef MP-QQ
  platform = EPlatform.MpQq
  //#endif

  //#ifdef MP-360
  platform = EPlatform.Mp360
  //#endif

  //#ifdef MP
  if(type!='precise'){
    platform = EPlatform.Mp
  }
  //#endif

  //#ifdef quickapp-webview
  platform = EPlatform.QuickappWebview
  //#endif

  //#ifdef quickapp-webview-union
  platform = EPlatform.QuickappWebviewUnion
  //#endif

  //#ifdef quickapp-webview-huawei
  platform = EPlatform.QuickappWebviewHuawei
  //#endif
  return platform;
}

export default {
  PrecisePlatform:getPlatform('precise'),
  Platform:getPlatform(),
  isH5:getPlatform() == 'H5',
  isMP:getPlatform() == 'MP', 
};
export const PrecisePlatform = getPlatform('precise');
export const Platform = getPlatform();
export const isH5 = (getPlatform() == 'H5');
export const isMP = (getPlatform() == 'MP');