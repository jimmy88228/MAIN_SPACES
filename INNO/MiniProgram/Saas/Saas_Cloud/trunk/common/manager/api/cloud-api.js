const barCodeApi = "";
const visitApi = "";
//注册
export const CL_RegApiList = {
  /*
  Wechat
  */
  login: {
    u: "/api/Wechat/Login",
    m: "post"
  },
  userRegister: {
    u: "/api/Wechat/Register",
    m: "post"
  },
  registerByUserProfile: {
    u: "/api/Wechat/RegisterByUserProfile",
    m: "post"
  },
  createSession: {
    u: "/api/Wechat/createSession",
    m: "post"
  },
  checkSession: "/api/Wechat/checkSession?sessionId={sessionId}",
  bindWxPhone: {
    u: "/api/Wechat/BindWxPhone",
    m: "post"
  },
  getGroupUserInfo: {
    u: "/api/Wechat/GetGroupUserInfo",
    m: "post"
  },
  changeWxPhone: {
    u: "/api/Wechat/ChangeWxPhone",
    m: "post"
  },
  }
//品牌
export const CL_BrandApiList = {
  /*
  Brand
  */
  getMenuList: "/api/Brand/Get_MenuList",
  getWxappShareConfigEntity: "/api/Brand/Get_WxappShareConfigEntity?cfgType={cfgType}",
  getStartPageConfigList: "/api/Brand/GetStartPageConfigList", // 欢迎页配置(旧接口)
  getBottomMenuList: "/api/Brand/Get_Bottom_MenuList",
  getVisitStoreRule: "/api/Brand/GetVisitStoreRule",
  getShippingList:"/api/Brand/GetShippingList",
  getTpls: {
    u: "/api/Brand/GetTpls",
    m: "post"
  },
  setSubscribe: {
    u: "/api/Brand/SetSubscribe",
    m: "post"
  },
  getWelcomePage: "/api/Page/Get_WelcomePage", //欢迎页配置(新接口)
}
//用户
export const CL_UserApiList = {
  /*
  User
  */
  getVisitStore: "/api/User/GetVisitStore?storeCode={storeCode}&provinceName={provinceName}&cityName={cityName}&lat={lat}&lon={lon}",
  getVisitStoreList: "/api/User/GetVisitStoreList?provinceName={provinceName}&cityName={cityName}&lat={lat}&lon={lon}&pageIndex={pageIndex}&pageSize={pageSize}&searchStr={searchStr}",
  changeVisitStore: {
    u: "/api/User/ChangeVisitStore",
    m: "post"
  },
  /*
  Coupon
  */
  getUsefulCouponCount: "/api/Coupon/Get_UsefulCouponCount",
  getBonusList: "/api/Coupon/GetUserBonusList?type={type}&pageNum={pageNum}&sort={sort}",
  writeOffCoupon: {
    u: "/api/Coupon/WriteOffCoupon",
    m: "post"
  },
  postUserReceiveBonus: {
    u: "/api/Coupon/Post_UserReceiveBonus",
    m: "post"
  },
  receiveSharedCoupon: {
    u: "/api/Coupon/Receive_SharedCoupon",
    m: "post"
  },
  BeginSharingCoupon: {
    u: "/api/Coupon/BeginSharingCoupon",
    m: "post"
  },
  getSharingCoupon: "/api/Coupon/Get_SharingCoupon?bonusId={bonusId}&fromUserToken={fromUserToken}",
  getAppSign: "/api/SignIn/Get_AppSign?userToken={userToken}&brandCode={brandCode}",
  get_SignOrderActivityInfo: "/api/SignIn/Get_SignOrderActivityInfo?userToken={userToken}&brandCode={brandCode}",
  get_UserSignOrderActivityReward:"/api/SignIn/Get_UserSignOrderActivityReward?userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}&receiveType={receiveType}&brandCode={brandCode}",
  createAppSign: {
    u: "/api/SignIn/Create_AppSign",
    m: "post"
  },
  getSignRecord: "/api/signin/Get_UserSignRecord?userToken={userToken}&brandCode={brandCode}&beginDate={beginDate}&endDate={endDate}",
  getUserPointAmount:"/api/User/GetUserPointAmount?userToken={userToken}&brandCode={brandCode}",
  getPopupAdvert: "/api/PopupAdvert/GetPopupAdvert?pageId={pageId}&pageType={pageType}",
  searchUserInfo:"/api/User/SearchUserInfo?mobilePhone={mobilePhone}", // 查询会员信息
  get_XianKuH5: "/api/User/Get_XianKuH5", // 获取仙库量体url(目前GOSO用)
  get_UserInfo: "/api/User/Get_UserInfo", 
}
//订单
export const CL_BuyApiList = {
  /* 
  Order
  */
  getUserOrderCount: "/api/Order/Get_UserOrderCount",
  cancelOrder: {
    u: "/api/Order/CancelOrder",
    m: "post"
  },
  cancelOrderGoods: {
    u: "/api/Order/CancelOrderGoods",
    m: "post"
  },
  updateOrderAddress: {
    u: "/api/Order/UpdateOrderAddress",
    m: "post"
  },
  receiveOrderGoods: {
    u: "/api/Order/ReceiveOrderGoods",
    m: "post"
  }, 
  getCancelReasonList: "/api/Order/GetCancelReasonList",
  getReturnReasonList: "/api/Order/GetReturnReasonList",
  getOrderList: "/api/Order/GetOrderList?orderType={orderType}&pageIndex={pageIndex}&pageSize={pageSize}&searchStr={searchStr}",
  getOrderDetail: "/api/Order/GetOrderDetail?orderId={orderId}",
  getInvoiceList:"/api/Order/GetInvoiceList?orderId={orderId}",
  getInvoiceInfo:"/api/Order/GetInvoiceInfo?orderId={orderId}&shippingId={shippingId}&invoiceNo={invoiceNo}",
  checkOrderPay:"/api/Order/CheckOrderPay?orderId={orderId}",

  /* 
  Checkout
  */
  checkout: {
    u: "/api/Checkout/Checkout",
    m: "post"
  },
  addOrder: {
    u: "/api/Checkout/AddOrder",
    m: "post"
  },
  getCheckoutBonusList: {
    u: "/api/Checkout/GetCheckoutBonusList",
    m: "post"
  },
  orderForCustom:{
    u: "/api/Checkout/OrderForCustom", // 代客下单
    m:"post"
  },
  extendOrderReceiptTime: {
    u: "/api/Order/ExtendOrderReceiptTime",
    m: "post"
  },

  /*
  ReturnOrder
  */
  createReturnOrder:{
    u:"/api/ReturnOrder/CreateReturnOrder",
    m:"post"
  },
  getReturnOrderList:"/api/ReturnOrder/GetReturnOrderList?returnType={returnType}&searchStr={searchStr}&pageIndex={pageIndex}&pageSize={pageSize}",
  getReturnOrderDetail:"/api/ReturnOrder/GetReturnOrderDetail?returnId={returnId}",
  updateReturnOrderShipping:{
    u:"/api/ReturnOrder/UpdateReturnOrderShipping",
    m:"post"
  }, 
  createReturnOrderBatch:{
    u:"/api/ReturnOrder/CreateReturnOrderBatch",
    m:"post"
  }, 
  /*
  RefundOrder
  */
 getRefundOrderList:"/api/RefundOrder/GetRefundOrderList?searchStr={searchStr}&pageIndex={pageIndex}&pageSize={pageSize}",
 getRefundOrderDetail:"/api/RefundOrder/GetRefundOrderDetail?refundId={refundId}",
 applyCancelOrder:"/api/Order/ApplyCancelOrder?orderId={orderId}",
}
//商品
export const CL_GoodsApiList = {
  /*
  Goods
  */
  getSumaryGoodsDetailData: "/api/Goods/Get_Sumary_GoodsDetailData?goodsId={goodsId}&productId={productId}&colorId={colorId}&issue_id={issue_id}",
  getSumaryGoodsProductInfo: "/api/Goods/Get_Sumary_GoodsProductInfo?goodsId={goodsId}&colorId={colorId}&issueId={issueId}",
  getGoodsSpecInfo:"/api/Goods/GetGoodsSpecInfo?goodsId={goodsId}",
  getGoodsServices: "/api/Goods/Get_GoodsServices?goodsId={goodsId}",
  get_Goods_Param_Attr_List: "/api/Goods/Get_Goods_Param_Attr_List?goodsId={goodsId}",
  getSumaryGoodsProductInfoByShippingStore: "/api/Goods/Get_Sumary_GoodsProductInfoByShippingStore?goodsId={goodsId}",
  getPromotionGoodsList: "/api/Goods/GetPromotionGoodsList?ruleId={ruleId}&pageIndex={pageIndex}&pageSize={pageSize}",
  getGoodsDefaultImage: "/api/Goods/GetGoodsDefaultImage?goodsId={goodsId}",
  getSumaryALLGoodsList: "/api/Goods/Get_Sumary_ALLGoodsList?functype={functype}&cate_Id={cate_Id}&strWhere={strWhere}&pageSize={pageSize}&pageIndex={pageIndex}&sort_field={sort_field}&sort_by={sort_by}&goods_brand_ids={goods_brand_ids}",
  searchGoodsList: {
    u:"/api/Goods/Get_Sumary_SearchGoodsList",
    // u:"/api/Goods/Get_Sumary_SearchGoodsList?functype={functype}&catId={catId}&strAttrId={strAttrId}&strAttrValue={strAttrValue}&colorCatId={colorCatId}&startPrice={startPrice}&endPrice={endPrice}&strWhere={strWhere}&pageSize={pageSize}&pageIndex={pageIndex}&sortField={sortField}&sortBy={sortBy}&goods_brand_ids={goods_brand_ids}&storeId={storeId}",
    m:"post"
  },
  getSearchGoodsListBySkip: "/api/Goods/GetSearchGoodsListBySkip?functype={functype}&catId={catId}&strAttrId={strAttrId}&strAttrValue={strAttrValue}&colorCatId={colorCatId}&startPrice={startPrice}&endPrice={endPrice}&strWhere={strWhere}&pageSize={pageSize}&skipCount={skipCount}&sortField={sortField}&sortBy={sortBy}&goods_brand_ids={goods_brand_ids}&storeId={storeId}",
  getALLGoodsListByGoodsIds:
  {
    u:"/api/Goods/GetALLGoodsListByGoodsIds",
    m: "post"
  },
  getGoodsPropertyList: "/api/Goods/Get_GoodsPropertyList?functype={functype}&catId={catId}&strWhere={strWhere}",
  get_recommend_template_List: "/api/Goods/Get_recommend_template_List?goodsId={goodsId}",
  getMatchLinkGoodList: "/api/Goods/Get_MatchLinkGoodList?goodsId={goodsId}",
  get_Goods_DimensionPlan:"/api/Goods/Get_Goods_DimensionPlan?goodsId={goodsId}",
  getGoodsPromotionRuleList:"/api/Goods/GetGoodsPromotionRuleList?goodsId={goodsId}",
  getGoodsNextPromotionInfo: "/api/Goods/GetGoodsNextPromotionInfo?goodsId={goodsId}&productId={productId}",
  getGoodsRecommendTemplate:"/api/Goods/Get_GoodsRecommendTemplate?goodsId={goodsId}",
  getGoodsLableInfo: "/api/Goods/GetGoodsLableInfo?goodsId={goodsId}",
  /*
  GoodsExtend
  */
  checkHasAddFav: {
    u: "/api/GoodsExtend/Check_HasAddFav",
    m: "post"
  },
  addFavGoodsLog: {
    u: "/api/GoodsExtend/Add_Fav_Goods_Log",
    m: "post"
  },
  delFavGoodsLog: {
    u: "/api/GoodsExtend/Del_Fav_Goods_Log",
    m: "post"
  },
  addGoodsVisitLog: {
    u: "/api/GoodsExtend/Op_GoodsVisitLog",
    m: "post"
  },
  getGoodsVisitLogList: "/api/GoodsExtend/Get_GoodsVisitLog_List?pageIndex={pageIndex}&pageSize={pageSize}",
  getFavLogList: "/api/GoodsExtend/Get_Fav_LogList?pageIndex={pageIndex}&pageSize={pageSize}",  
  getGoodsReceiveBonusActivity: "/api/GoodsExtend/GetGoodsReceiveBonusActivity?goodsId={goodsId}",
  getGoodsReceiveBonusActivityDetail: "/api/GoodsExtend/GetGoodsReceiveBonusActivityDetail?goodsId={goodsId}",
  receiveBonusFromGoods: {
    u:"/api/GoodsExtend/ReceiveBonusFromGoods",
    m:"post"
  },
  /*
  ShoppingCart
  */
  getCartStoageCount: {
    u: "/api/ShoppingCart/GetCartStoage_Count",
    m: "post"
  },
  createBuyCarInsert: {
    u: "/api/ShoppingCart/Create_BuyCar_Insert",
    m: "post"
  },
  createBuyCarInserts: {
    u: "/api/ShoppingCart/Create_BuyCar_Inserts",
    m: "post"
  },
  getShoppingCartList: "/api/ShoppingCart/GetShoppingCartList",
  addCartStroageNum: {
    u: "/api/ShoppingCart/Add_CartStroage_Num",
    m: "post"
  },
  delCartStroage: {
    u: "/api/ShoppingCart/Del_CartStroage",
    m: "post"
  },
  subtractCartStroageNum: {
    u: "/api/ShoppingCart/Subtract_CartStroage_Num",
    m: "post"
  },
  countPromotionInfoByJieSuan: {
    u: "/api/ShoppingCart/CountPromotionInfoByJieSuan",
    m: "post"
  },
  getShoppingAds: "/api/ShoppingCart/Get_ShoppingCartRecommendTemplate",
  changeShoppingCartPromotionRule:{
    u:"/api/ShoppingCart/ChangeShoppingCartPromotionRule",
    m:"post"
  },
  getPromotionRuleInfo:"/api/ShoppingCart/GetPromotionRuleInfo?ruleId={ruleId}",
  changeCartStorageShippingWay:{
    u:"/api/ShoppingCart/ChangeCartStorageShippingWay",
    m:"post"
  },
  /*
  GoodsComment
  */
  getGoodsCommentListOnline: "/api/GoodsComment/Get_Goods_CommentList_Online?goodsId={goodsId}&pageIndex={pageIndex}&pageSize={pageSize}",
  getOnlineOrderCommentDetail: "/api/GoodsComment/Get_Online_Order_Comment_Detail?orderId={orderId}",
  commentOnlineOrder: {
    u: "/api/GoodsComment/CommentOnlineOrder",
    m: "post"
  },
  commentOnlineOrderGoods: {
    u: "/api/GoodsComment/CommentOnlineOrderGoods",
    m: "post"
  },
  commentOfflineOrderGoods: {
    u: "/api/GoodsComment/CommentOfflineOrderGoods",
    m: "post"
  },
  commentOfflineOrder: {
    u: "/api/GoodsComment/CommentOfflineOrder",
    m: "post"
  },
  getOfflineOrderCommentDetail: "/api/GoodsComment/Get_Offline_Order_Comment_Detail?orderSn={orderSn}",
  getMyCommentList: "/api/GoodsComment/Get_MyCommentList?pageIndex={pageIndex}&pageSize={pageSize}",
  getMyCommentDetail: "/api/GoodsComment/Get_MyCommentDetail?orderId={orderId}&goodsId={goodsId}&isOnlineOrder={isOnlineOrder}",
  /* 
  PAGE
  */
  getCustomPagesInfo: "/api/Page/Get_CustomPagesInfo?param={param}&pageType={pageType}",
  getCustomPageDataScript: "/api/Page/Get_CustomPageDataScript?pageId={pageId}",
  getCustomCategoryList: "/api/Page/Get_CustomCategoryList?pageId={pageId}",
  
  /*
    分销佣金
  */
  //分销提成
  getGoodsCommissionAmount: "/api/goods/Get_GoodsCommissionAmount?brandCode={brandCode}&byStore={byStore}", // goodsIds={goodsIds}&goodsId={goodsId}
  getGoodsCommissionAmountByType: "/api/goods/Get_GoodsCommissionAmountByType?goodsId={goodsId}&brandCode={brandCode}&goodsType={goodsType}&relatedId={relatedId}", //goodsType = COLLAGEGROUP(拼团) , PRESALE(预售) , NORMAL(正常商品) , SKILL(秒杀),POINTMKT(积分商城)
  getGoodsCommissionAmountByTypeAll: "/api/Goods/Get_GoodsCommissionAmountByType?goodsIds={goodsIds}&goodsType={goodsType}&relatedId={relatedId}&brandCode={brandCode}", //goodsType = COLLAGEGROUP(拼团) , PRESALE(预售) , NORMAL(正常商品) , SKILL(秒杀),POINTMKT(积分商城)
  getVirtualGoodsShare:"/api/Goods/Get_VirtualGoodsShare?catId={catId}",
  getGoodsStyle:{
    u:"/api/Goods/GetGoodsStyle",
    m:"post"
  },
  getActivityGoodsList:"/api/DiscountBuy/GetActivityGoodsList?activityId={activityId}&orderAmount={orderAmount}",
  getActivityGoodsDetail:"/api/DiscountBuy/GetActivityGoodsDetail?activityId={activityId}&goodsId={goodsId}",
  getActivityGoodsProduct:"/api/DiscountBuy/GetActivityGoodsProduct?activityId={activityId}&goodsId={goodsId}&colorId={colorId}",

  get_GoodsPackageList:"/api/GoodsPackage/Get_GoodsPackageList?goodsId={goodsId}&pageIndex={pageIndex}&pageSize={pageSize}",
  get_GoodsPackageInfo:"/api/GoodsPackage/Get_GoodsPackageInfo?packageId={packageId}",
  get_UserGoodsPackageDetail:"/api/GoodsPackage/Get_UserGoodsPackageDetail?packageId={packageId}",
  get_GoodsPackageProductInfo:"/api/GoodsPackage/Get_GoodsPackageProductInfo?packageId={packageId}&goodsId={goodsId}&shippingStoreId={shippingStoreId}",
  get_ValidGoodsPackageList:"/api/GoodsPackage/Get_ValidGoodsPackageList?activityIds={activityIds}&searchStr={searchStr}",
  // get_ValidGoodsPackageList:"/api/GoodsPackage/Get_ValidGoodsPackageList?activityIds={activityIds}&searchStr={searchStr}&pageIndex={pageIndex}&pageSize={pageSize}",
  get_CustomPageShareActivity:"/api/Page/Get_CustomPageShareActivity?pageId={pageId}"
}
//日志
export const CL_VSlogApiList = {
  /*
  Log
  */
  writePageLog: {
    u: `${visitApi}/Common/Write_Page_Log`,
    m: "post"
  },
  CreateLogSession: {
    u: `${visitApi}/Log/CreateLogSession`,
    m: "post"
  },
  CreateLogSessionExtend:{
    u: `${visitApi}/Log/CreateLogSessionExtend`,
    m:"post"
  },
  AddPageLog: {
    u: `${visitApi}/Log/UploadVisitLogList`,
    m: "post"
  },
  AddActionLog: {
    u: `${visitApi}/Log/UploadLogActionList`,
    m: "post"
  },
  createExtendChannelLog:{
    u:`${visitApi}/Log/CreateExtendChannelLog`,
    m:"post"
  },
  postUpdateClientSession: {
    u: `${visitApi}/Log/UpdateClientSession`,
    m: "post"
  },
  uploadLogActionList: {
    u: `${visitApi}/Log/UploadLogActionList`,
    m:"post"
  },
  postCustomPageVisitRecord:{
    u: `${visitApi}/log/Post_CustomPageVisitRecord`,
    m:"post"
  },
  get_CustomPageShareActivity:{
    u: `${visitApi}/log/get_CustomPageShareActivity`,
    m:"post"
  },
}
//支付
export const CL_PayApiList = {
  // UnifiedorderByOrderId: "/InnoPayApi/api/Pay/UnifiedorderByOrderId?userToken={userToken}&payType={payType}&payMethod={payMethod}&orderId={orderId}&brandCode={brandCode}",
  unifiedCloudShopOrder:"/api/Pay/UnifiedCloudShopOrder?payType={payType}&orderId={orderId}&brandCode={brandCode}",
  unifiedCloudShopOrderByCode: "/api/Pay/UnifiedCloudShopOrderByCode?payType={payType}&orderId={orderId}&brandCode={brandCode}"
}

export const CL_BarCodeApiList = {
  //获取二维码
  getWxCode: {
    u: `${barCodeApi}/api/WXBarCode/GetWxCode`,
    m: "post"
  },
  //分销员ScanWXCodeLog
  scanWXCodeLog: {
    u: `${barCodeApi}/api/WXBarCode/ScanWXCodeLog`,
    m: "post"
  }
}

export const CL_ActApiList = {
  getBuyBonusActivitList: "/api/BuyBonus/Get_BuyBonusActivitList?userToken={userToken}&pageSize={pageSize}&pageIndex={pageIndex}&brandCode={brandCode}",
  getBuyBonusActivitDetail: "/api/BuyBonus/Get_BuyBonusActivitDetail?activityId={activityId}&userToken={userToken}&brandCode={brandCode}",
  getBuyBonusOrderList: "/api/BuyBonus/Get_BuyBonusOrderList?userToken={userToken}&pageSize={pageSize}&pageIndex={pageIndex}&brandCode={brandCode}",
  createBuyBonusOrder:{
    u:"/api/BuyBonus/Create_BuyBonusOrder",
    m:"post"
  },
  getBuyBonusOrderPayStatus: "/api/BuyBonus/Get_BuyBonusOrderPayStatus?orderId={orderId}&brandCode={brandCode}",
  activeBonusList:"/api/BuyBonus/Get_ActiveBonusList?activityId={activityId}&brandCode={brandCode}",
  active_Order_BonusList:"/api/BuyBonus/Get_Active_Order_BonusList?orderId={orderId}&brandCode={brandCode}",
}

//助力秒杀
export const CL_SecKillApiList = {
  getActivityGroup: "/Activity/GetActivityGroup?groupId={groupId}",
  getActivity: "/Activity/GetActivity?activityId={activityId}",
  getProgress: "/Activity/GetProgress?activityId={activityId}",
  checkCondition: "/Activity/CheckCondition?activityId={activityId}",
  getFriends: "/Activity/GetFriends?activityId={activityId}",
  getGoodsList:"/Goods/GetGoodsList?activityId={activityId}&pageIndex={pageIndex}&pageSize={pageSize}",
  getGoodsDetail:"/Goods/GetGoodsDetail?activityId={activityId}&goodsId={goodsId}",
  getProducts:"/Goods/GetProducts?activityId={activityId}&goodsId={goodsId}",
  getTargetProgress:"/Activity/GetTargetProgress?activityId={activityId}&target={target}&own={own}",
  addActivityLaunch:{
    u: "/Activity/AddActivityLaunch",
    m:"post"
  },
  helpTarget:{
    u: "/Activity/HelpTarget",
    m:"post"
  },
  addOrder:{
    u: "/Order/AddOrder",
    m:"post"
  },
  getOrderInfos:"/Order/GetOrderInfos?orderId={orderId}",
  getPayInfos:"/Order/GetPayInfos?akId={akId}&userAddressId={userAddressId}",
  getPayStatus:"/Order/GetPayStatus?orderId={orderId}",
  checkPay:"/Order/CheckPay?akId={akId}",
  getOrderList:"/Order/GetOrderList?type={type}&pageIndex={pageIndex}&pageSize={pageSize}",
  unifiedorder:{
    u: "/Wx/Unifiedorder?orderId={orderId}",
    m:"post"
  },
  cancelOrder:{
    u: "/Order/CancelOrder?orderId={orderId}",
    m:"post"
  },
  checkUserRank: "/Activity/CheckUserRank?activityId={activityId}",
  checkLimit: "/Order/CheckLimit?activityId={activityId}&goodsId={goodsId}",
  getTpls:{
    u:"/WxMsg/GetTpls",
    m:"post"
  },
  setSubscribe:{
    u:"/WxMsg/SetSubscribe",
    m:"post"
  },
  getActivitySubscribeStatus: "/WxMsg/GetActivitySubscribeStatus?activityId={activityId}",
  getActivityGoodsUsableBonusList:"/Order/GetActivityGoodsUsableBonusList?akId={akId}&userAddressId={userAddressId}&shippingType={shippingType}&storeId={storeId}",
  getGuideFollowWechatInfo:"/Guide/GetGuideFollowWechatInfo?cookieId={cookieId}",
  pushGuideFollowWechat:{
    u:"/Guide/PushGuideFollowWechat",
    m:"post"
  }
}

// 砍价
export const CL_BargainApiList = {
  getHagglePriceActivityList: "/api/HagglePrice/Get_HagglePriceActivityList?pageIndex={pageIndex}&pageSize={pageSize}&activityIds={activityIds}",
  getUserHagglePriceActivityList: "/api/HagglePrice/Get_UserHagglePriceActivityList?status={status}&pageIndex={pageIndex}&pageSize={pageSize}",
  getHagglePriceActivityDetail: "/api/HagglePrice/Get_HagglePriceActivityDetail?userToken={userToken}&activityId={activityId}&brandCode={brandCode}",
  getHagglePriceActivityGoodsDetail: "/api/HagglePrice/Get_HagglePriceActivityGoodsDetail?activityId={activityId}",
  createUserHagglePriceActivity: {
      u: "/api/HagglePrice/Create_UserHagglePriceActivity",
      m: "post"
  },
  getUserHagglePriceActivityDetail: "/api/HagglePrice/Get_UserHagglePriceActivityDetail?userActivityId={userActivityId}",
  postUserHagglePrice: {
      u: "/api/HagglePrice/Post_UserHagglePrice",
      m: "post"
  },
  getUserHagglePriceActivityDetailRecord:"/api/HagglePrice/Get_UserHagglePriceActivityDetailRecord?userActivityId={userActivityId}&pageIndex={pageIndex}&pageSize={pageSize}",
  getUserHagglePriceSettlementPage: "/api/HagglePrice/Get_UserHagglePriceSettlementPage?userActivityId={userActivityId}&addressId={addressId}",
  postHagglePriceAddOrder: {
      u: "/api/HagglePrice/Post_HagglePriceAddOrder",
      m: "post"
  },
  getUserHagglePriceOrderDetail: "/api/HagglePrice/Get_UserHagglePriceOrderDetail?userActivityId={userActivityId}",
  getTpls:{
    u:"/api/WxMsg/GetTpls",
    m:"post"
  },
  setSubscribe:{
    u:"/api/WxMsg/SetSubscribe",
    m:"post"
  },
  get_HagglePricePayStatus:"/api/HagglePrice/Get_HagglePricePayStatus?orderId={orderId}",
  cancelUserHagglePriceActivity:{
    u:"/api/HagglePrice/Cancel_UserHagglePriceActivity",
    m:"post"
  }, 
}
//预售
export const CL_PreSaleApiList = {
  getPresaleGoodsList: "/api/Presale/GetPresaleGoodsList?pageIndex={pageIndex}&pageSize={pageSize}&activityIds={activityIds}",
  getPresaleGoodsDetail: "/api/Presale/GetPresaleGoodsDetail?activityId={activityId}",
  getPresaleGoodsProductList: "/api/Presale/GetPresaleGoodsProductList?activityId={activityId}",
  getPreOrderInfoList: "/api/Presale/Get_PreOrderInfoList?pageIndex={pageIndex}&pageSize={pageSize}",
  getPresaleDepositSettlementPage:"/api/Presale/GetPresaleDepositSettlementPage?activityId={activityId}&activityGoodsId={activityGoodsId}&goodsNumber={goodsNumber}&bonusId={bonusId}&isUsedPoint={isUsedPoint}",
  postAddPresaleOrder: {
      u: "/api/Presale/PostAddPresaleOrder",
      m: "post"
  },
  getPresaleOrderDetail: "/api/Presale/GetPresaleOrderDetail?preOrderId={preOrderId}&bonusId={bonusId}&isUsedPoint={isUsedPoint}",
  cancelPresaleOrder: {
      u: "/api/Presale/CancelPresaleOrder",
      m: "post"
  },
  presaleOrderDetailUsePointCoupon: {
      u: "/api/Presale/PresaleOrderDetailUsePointCoupon",
      m:"post"
  },
  lockPreOrderByPay: {
      u: "/api/Presale/LockPreOrderByPay",
      m:"post"
  },
  logThePresaleDetail:{
      u:"/api/Presale/LogThePresaleDetail",
      m:"post"
  },
  getPreSalePayStatus:"/api/Presale/GetPreSalePayStatus?preOrderId={preOrderId}&payKind={payKind}",
  
  getPresaleUsableBonusList:"/api/Presale/GetPresaleUsableBonusList?preOrderId={preOrderId}&activityId={activityId}&activityGoodsId={activityGoodsId}&goodsNumber={goodsNumber}&bonusIds={bonusIds}",
  getPresaleDepositSettlement:"/api/Presale/GetPresaleDepositSettlement?activityId={activityId}&activityGoodsId={activityGoodsId}&goodsNumber={goodsNumber}&bonusIds={bonusIds}&isUsedPoint={isUsedPoint}",
  getPresaleOrderData:"/api/Presale/GetPresaleOrderData?preOrderId={preOrderId}&bonusIds={bonusIds}&isUsedPoint={isUsedPoint}",
  getGoodsCommissionAmount: "/api/Presale/Get_GoodsCommissionAmount?brandCode={brandCode}&byStore={byStore}",
  presaleDepositAddOrder:{
      u:"/api/Presale/PresaleDepositAddOrder",
      m:"post"
  },
  presaleOrderTailUsePointCoupon:{
      u:"/api/Presale/PresaleOrderTailUsePointCoupon",
      m:"post"
  },
}
//积分
export const CL_PointApiList = {
  getPointMkBonusListByMain: "/api/PointMk/GetPointMkBonusListByMain?userToken={userToken}&brandCode={brandCode}",
    getPointMkGoodsListMain: "/api/PointMk/GetPointMkGoodsListMain?userToken={userToken}&brandCode={brandCode}",
    getPointMkBonusList: "/api/PointMk/GetPointMkBonusList?pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    getPointMkBonusListByUser: "/api/PointMk/GetPointMkBonusListByUser?pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}&userToken={userToken}",
    getPointMkGoodsList: "/api/PointMk/GetPointMkGoodsList?pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}&activityIds={activityIds}",
    getPointMkGoodsListByUser: "/api/PointMk/GetPointMkGoodsListByUser?pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}&activityIds={activityIds}&userToken={userToken}",
    getPointMkBonusDetail: "/api/PointMk/GetPointMkBonusDetail?mkBonusId={mkBonusId}&userToken={userToken}&brandCode={brandCode}",
    getPointMkGoodsDetail: "/api/PointMk/GetPointMkGoodsDetail?mkGoodsId={mkGoodsId}&goodsId={goodsId}&userToken={userToken}&brandCode={brandCode}",
    checkBuyPointMkGoods: "/api/PointMk/CheckBuyPointMkGoods?mkGoodsId={mkGoodsId}&userToken={userToken}&brandCode={brandCode}",
    checkExchangeBonus: "/api/PointMk/CheckExchangeBonus?mkBonusId={mkBonusId}&userToken={userToken}&brandCode={brandCode}",
    exchangeBonus: {
        u: "/api/PointMk/ExchangeBonus",
        m: "post"
    },
    pointMkGoodsCheckout: {
        u: "/api/PointMk/PointMkGoodsCheckout",
        m: "post"
    },
    PointMkGoodAddOrder: {
        u: "/api/PointMk/PointMkGoodAddOrder",
        m: "post"
    },
    GetMkOrderPayStatus: "/api/PointMk/GetMkOrderPayStatus?orderSn={orderSn}&brandCode={brandCode}",
    GetExchangeLogList: "/api/PointMk/GetExchangeLogList?userToken={userToken}&brandCode={brandCode}&pageIndex={pageIndex}&pageSize={pageSize}",
    cancelPointMkGoodOrder: {
        u: "/api/PointMk/CancelPointMkGoodOrder",
        m: "post"
    },
    getGoodsCommissionAmount: "/api/PointMk/Get_GoodsCommissionAmount?brandCode={brandCode}&byStore={byStore}",
    getPointMkGoodOrderDetail: "/api/PointMk/GetPointMkGoodOrderDetail?mkOrderId={mkOrderId}&brandCode={brandCode}"
}
// 拼团
export const CL_CollageApiList = {
  //活动列表
  getCollageGroupActivityList: '/api/CollageGroup/Get_CollageGroupActivityList?pageIndex={pageIndex}&pageSize={pageSize}&searchVal={searchVal}&activityIds={activityIds}',
  //活动详情
  getCollageGroupActivityDetail: '/api/CollageGroup/Get_CollageGroupActivityDetail?activityId={activityId}',
  //参与活动记录
  getCollageGroupJoinList: '/api/CollageGroup/Get_ALLowJoinGroupGoodActivityList?activityId={activityId}&userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}',
  //获取参与活动订单列表
  getUserCollageGroupOrderList: "/api/CollageGroup/Get_UserCollageGroupOrderList?userToken={userToken}&status={status}&pageIndex={pageIndex}&pageSize={pageSize}",
  //
  getUserJoingGroupGoodActivityList: "/api/CollageGroup/Get_UserJoingGroupGoodActivityList?userActivityId={userActivityId}&pageIndex={pageIndex}&pageSize={pageSize}",
  //拼团详情
  getUserCollageDetail: "/api/CollageGroup/Get_UserCollageDetail?userId={userId}&userToken={userToken}&activityId={activityId}&userActivityId={userActivityId}",
  //拼团结算详情
  getCollageGroupSettlementList: "/api/CollageGroup/Get_CollageGroupSettlementList?userToken={userToken}&activityId={activityId}&userActivityId={userActivityId}&addressId={addressId}&goodsId={goodsId}&productId={productId}&productNum={productNum}",
  //拼团下单
  collageGroupAddOrder: {
      u: "/api/CollageGroup/Post_CollageGroupAddOrder",
      m: "post"
  },
  //拼团订单支付状态查询
  getCollageGroupOrderPayStatus: "/api/CollageGroup/Get_CollageGroupOrderPayStatus?userToken={userToken}&orderId={orderId}",
  //
  getCollageGroupGoodsDetail: "/api/CollageGroup/Get_CollageGroupGoodsDetail?userToken={userToken}&activityId={activityId}&userActivityId={userActivityId}&goodsId={goodsId}&colorId={colorId}&sizeId={sizeId}",
  //检测数量
  checkProductNumber: "/api/CollageGroup/CheckProductNumber?activityId={activityId}&goodsId={goodsId}&productId={productId}&productNum={productNum}",
  getCollageGroupGoodsList:"/api/CollageGroup/Get_CollageGroupGoodsList?pageSize={pageSize}&pageIndex={pageIndex}&activityIds={activityIds}",
  getGoodsCommissionAmount: "/api/CollageGroup/Get_GoodsCommissionAmount?brandCode={brandCode}&byStore={byStore}",
  setSubscribe: {
    u: "/api/CollageGroup/SetSubscribe",
    m: "post"
},
}

// 店员分销模块
export const CL_StoreCommApiList = {
  getStoreCommConfig: "/api/StoreComm/GetStoreCommConfig", // 获取店员分销配置
  // 绑定店员关系
  buildStaffRelation:{
    u:"/api/StoreComm/BuildStaffRelation",
    m:"post"
  },
  getStaffManageStore: "/api/StoreComm/GetStaffManageStore", //获取店长管理的店铺列表
  getStaffCommRateList: "/api/StoreComm/GetStaffCommRateList?searchStr={searchStr}&pageIndex={pageIndex}&pageSize={pageSize}&manageStoreId={manageStoreId}", // 获取店铺下店员的提成比例
  changeStaffCommRate: { // 设置单个店员提成比例
    u:"/api/StoreComm/ChangeStaffCommRate",
    m:"post"
  },
  changeAllStaffCommRate: { // 设置所有店员提成比例
    u: "/api/StoreComm/ChangeAllStaffCommRate",
    m: "post"
  },
  getStaffInfo: "/api/StoreComm/GetStaffInfo?manageStoreId={manageStoreId}", // 获取店员信息(店铺分享)
  getMyStaffInfo: "/api/StoreComm/GetMyStaffInfo", // 获取我的店员基础信息
  getStaffCommOrderList: "/api/StoreComm/GetStaffCommOrderList?beginDate={beginDate}&endDate={endDate}&sType={sType}&pageIndex={pageIndex}&pageSize={pageSize}&staffIds={staffIds}&fromUserId={fromUserId}&manageStoreId={manageStoreId}", // 获取店员提成订单列表
  getStaffAmountOrderList: "/api/StoreComm/GetStaffAmountOrderList?beginDate={beginDate}&endDate={endDate}&sType={sType}&pageIndex={pageIndex}&pageSize={pageSize}&staffIds={staffIds}&fromUserId={fromUserId}&manageStoreId={manageStoreId}", // 获取店员收益订单列表
  getOrderInfoByStaff: "/api/StoreComm/GetOrderInfoByStaff?orderSn={orderSn}&manageStoreId={manageStoreId}", // 获取店员提成订单详情 
  getOrderInfoByStaffAmount: "/api/StoreComm/GetOrderInfoByStaffAmount?orderSn={orderSn}&manageStoreId={manageStoreId}", // 获取店员收益订单详情
  getStaffAccountFlow: "/api/StoreComm/GetStaffAccountFlow?pageIndex={pageIndex}&pageSize={pageSize}&type={type}", // 获取佣金明细列表
  cashOut: { // 提现
      u: "/api/StoreComm/ApplyStaffCashout",
      m: "post"
  },
  getApplyCashoutList: "/api/StoreComm/GetApplyCashoutList", // 提现记录列表
  getStaffUserReport: "/api/StoreComm/GetStaffUserReport?isToday={isToday}&begin={begin}&end={end}", // 分享记录
  getStaffRankReport: "/api/StoreComm/GetStaffRankReport?pageIndex={{pageIndex}}&pageSize={{pageSize}}&isStore={isStore}&type={type}&manageStoreId={manageStoreId}", // 排行榜
  /**
   * /api/StoreCommShare/xxxx
   */
  getStaffDstbShareActivityGoodsListByGroup:"/api/StoreCommShare/Get_StaffDstbShareActivityGoodsListByGroup?searchStr={searchStr}&groupId={groupId}&pageIndex={pageIndex}&pageSize={pageSize}&manageStoreId={manageStoreId}",  // 获取热门活动列表(按分类)
  goodsList: '/api/StoreCommShare/Get_StaffDstbShareActivityGoodsList?searchStr={searchStr}&pageIndex={pageIndex}&pageSize={pageSize}&manageStoreId={manageStoreId}', // 获取热销商品列表
  activityPageList: '/api/StoreCommShare/Get_StaffDstbShareActivityPageList?pageIndex={pageIndex}&pageSize={pageSize}&manageStoreId={manageStoreId}', // 获取热门活动列表
  getStaffDstbShareActivityPageListByGroup:"/api/StoreCommShare/Get_StaffDstbShareActivityPageListByGroup?groupId={groupId}&pageIndex={pageIndex}&pageSize={pageSize}&manageStoreId={manageStoreId}", // 获取热销商品列表(按分类)
  getStaffDstbShareGroupList:"/api/StoreCommShare/GetStaffDstbShareGroupList?activityType={activityType}",  // 获取热门活动/热销商品 分类列表
}

//分销模块
//分销中心
export const CL_DistributionApiList = {
  //分销信息
  staffDstbInfo: "/api/StaffDstb/Get_StaffDstbInfo",
  //分销订单列表
  staffCommOrderList: "/api/StaffDstb/GetStaffCommOrderList?beginDate={beginDate}&endDate={endDate}&sType={sType}&userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
  //分销订单详情
  orderInfo: "/api/StaffDstb/GetOrderInfoByStaffDstb?orderSn={orderSn}",
  setStaffCouponSub: {
    u:"/api/StaffDstbSendCoupon/SetSubscribe",
    m:"post"
  }, 
  applyStaffDstbInfoNoPhone:{
    u:"/api/StaffDstb/Apply_StaffDstbInfoNoPhone",
    m:"post"
  },
  pay_Result:"/api/StaffDstb/Get_ApplyStaffDstb_Pay_Result?orderId={orderId}&brandCode={brandCode}",
  getStaffDstbRankReport:"/api/StaffDstb/GetStaffDstbRankReport?type={type}&pageIndex={pageIndex}&pageSize={pageSize}&isStore={isStore}",
  getStaffDstbUserReport:"/api/StaffDstb/GetStaffDstbUserReport?isToday={isToday}&begin={begin}&end={end}",
}

// 抽奖
export const CL_LotteryApiList = {
  lotteryActivitDetail: "/api/Lottery/Get_LotteryActivitDetail?activityId={activityId}",
  lotteryWinningRecord: "/api/Lottery/Get_LotteryActivityWinningRecord?activityId={activityId}",
  userLotteryWinningRecord: "/api/Lottery/Get_UserLotteryActivityWinningRecord?activityId={activityId}&pageIndex={pageIndex}&pageSize={pageSize}",
  getLotteryResult: {
    u: "/api/Lottery/Post_GetLotteryResult",
    m: "post"
  },
  receivePrize: {
    u: "/api/Lottery/Post_ReceivePrize",
    m: "post"
  },
  lotteryWinningRecordDetail: "/api/Lottery/Get_LotteryWinningRecordDetail?activityId={activityId}&winningRecordId={winningRecordId}",
  getLotteryShippingInfo: "/api/Lottery/Get_LotteryShippingInfo?winningRecordId={winningRecordId}&invoiceNo={invoiceNo}&isBackground={isBackground}&isForce={isForce}",
  getLotteryAdSlot:"/api/Lottery/Get_LotteryAdSlot?activityId={activityId}",
  get_UserIsGroupChatWeChat:"/api/Lottery/Get_UserIsGroupChatWeChat?lotteryId={lotteryId}",
}