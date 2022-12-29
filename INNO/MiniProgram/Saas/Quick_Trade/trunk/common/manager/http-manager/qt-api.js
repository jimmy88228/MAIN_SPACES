import Conf from "../../../config/index"
const VISIT_APICONF = {
  "1": "/InnoLogApi",
  "2": "/VisitLogApi",
  "3": "",
}
const visitApi = Conf.visitApiType ? VISIT_APICONF[Conf.visitApiType] : VISIT_APICONF[1];

/**分域名**/

// 品牌(域名跟User一样)
const QT_BrandApiList = {
  getMenuList: "/api/Brand/Get_MenuList?brandCode={brandCode}",
  getShippingList: "/api/Brand/getShippingList?brandCode={brandCode}"
}
// 用户
export const QT_UserApiList = {
  ...QT_BrandApiList,
  /**
   * 优惠券
   */
  postUserReceiveBonus: {
    u: "/api/Coupon/Post_UserReceiveBonus",
    m: "post"
  },
  getBalanceCheckCoupon: "/api/Coupon/Get_BalanceCheck_Coupon?couponCode={couponCode}&brandCode={brandCode}",
  receiveSharedCoupon: {
    u: "/api/Coupon/Receive_SharedCoupon",
    m: "post"
  },
  BeginSharingCoupon: {
    u: "/api/Coupon/BeginSharingCoupon",
    m: "post"
  },
  getSharingCoupon: "/api/Coupon/Get_SharingCoupon?bonusId={bonusId}&fromUserToken={fromUserToken}&brandCode={brandCode}",
  getBalanceCheckCoupon: "/api/Coupon/Get_BalanceCheck_Coupon?couponCode={couponCode}&brandCode={brandCode}",

  /**
   * SMS
   */
  //发送验证码
  sendMsg: {
    u: "/api/SMS/Send_SMSWithUserId",
    m: "post"
  },
  /**/
  changeModifyPwd: {
    u: "/api/User/ModifyPwd",
    m: "post"
  },
  getSearchUserInfo: "/api/User/Get_SearchUserInfo?searchStr={searchStr}&isFans={isFans}&brandCode={brandCode}&type={type}&userToken={userToken}", // 
  sendSmsForValetOrder: {
    u: "/api/SMS/SendSmsForValetOrder",
    m: "post"
  },
  checkValetOrderSms: {
    u: "/api/SMS/CheckValetOrderSms",
    m: "post"
  },

  /**
   * Store
   */
  //附近店铺
  getNearbyStoreList: "/api/Store/Get_NearbyStoreList?searchName={searchName}&lat={lat}&lon={lon}&brandCode={brandCode}&sType={sType}",
  getSearchStoreListByWx: "/api/Store/Get_Search_StoreListByWx?lat={lat}&lon={lon}&brandCode={brandCode}&sType={sType}",
  getNearyByInStoreListWithInventory: "/api/Order/Get_NearyByInStoreListWithInventory?userToken={userToken}&recIds={recIds}&searchName={searchName}&lat={lat}&lon={lon}&brandCode={brandCode}",
  /**
   * UserAddress
   */
  //地址
  getAddressList: "/api/UserAddress/Get_UserAddressList?userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
  createAddress: {
    u: "/api/UserAddress/CreateUserAddress",
    m: "post"
  },
  updateAddress: {
    u: "/api/UserAddress/UpdateUserAddress",
    m: "post"
  },
  deleteAddress: {
    u: "/api/UserAddress/DeleteUserAddress",
    m: "post"
  },
  setAddressDefault: {
    u: "/api/UserAddress/UpdateUserAddressDefault",
    m: "post"
  },
  bindWxAddress: {
    u: "/api/UserAddress/BindWxAddress",
    m: "post"
  },
  /**
   * User
   */
  updatePortraitPath: {
    u: "/api/user/Update_PortraitPath",
    m: "post"
  },
  modifyUserPortrait: { // 更新用户昵称和头像 头像链接要用base64
    u: "/api/User/ModifyUserPortrait",
    m: "post"
  },
  getUserInfoWap: "/api/User/GetUserInfo_Wap?userToken={userToken}&brandCode={brandCode}",
  getUserInfoNew: "/api/User/GetUserCenter?userToken={userToken}&brandCode={brandCode}",
  getUsefulCouponCount: "/api/Coupon/Get_UsefulCouponCount?userToken={userToken}&brandCode={brandCode}",
  getUserRedpackAmount: "/api/Redpack/GetUserRedpackAmount?userToken={userToken}&brandCode={brandCode}",
  //积分
  getUserPointAmount: "/api/User/GetUserPointAmount?userToken={userToken}&brandCode={brandCode}",
  //积分列表
  pointList: "/api/User/Get_PointList?userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
  //用户积分
  userBalacePoint: "/api/User/Get_User_Balance_Point?userToken={userToken}&brandCode={brandCode}",
  //优惠券
  getBonusList: "/api/User/Get_MemberInfo_BonusList?userToken={userToken}&type={type}&page_num={page_num}&sort={sort}&brandCode={brandCode}",
  writeOffCoupon: {
    u: "/api/Coupon/WriteOffCoupon",
    m: "post"
  },
  //储值卡
  getUserStoredValueAmount: "/api/User/GetUserStoredValueAmount?userToken={userToken}&brandCode={brandCode}",
  getPrePaidCardList: "/api/User/Get_UserPrepaidCardList?userToken={userToken}&storeId={storeId}&prepaidCards={prepaidCards}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
  //个人资料
  getUserBaseInfo: "/api/User/GetUserBaseInfo?userToken={userToken}&brandCode={brandCode}",
  //个人资料带自定义字段
  getUserExtendInfo: "/api/User/Get_UserExtendInfo?userToken={userToken}&brandCode={brandCode}",
  //保存个人资料
  completeUserInfo: {
    u: "/api/User/CompleteUserInfo",
    m: "post"
  },
  //更改手机
  changeMobile: {
    u: "/api/User/ChangeMobile",
    m: "post"
  },
  //绑定手机
  bindMobile: {
    u: "/api/User/SystemWeiXin_BindMobile",
    m: "post"
  },
  changeWxPhone: {
    u: "/api/user/ChangeWxPhone",
    m: "post"
  },
  //合并资料
  sysTransferUserInfo: {
    u: "/api/User/SysTransferUserInfo",
    m: "post"
  },
  //三级地区
  getAllRegionList: "/api/UserAddress/Get_AllRegionList",
  //检测绑定手机
  checkUserBindPhone: "/api/User/CheckUserBindPhone?userToken={userToken}&brandCode={brandCode}",
  //检测是否绑定公众号
  checkUserSubscribeWechat: "/api/User/CheckUserSubscribeWechat?userToken={userToken}&brandCode={brandCode}",
  //查询用户是否关注企微
  checkUserIsSubscribeEnterpriseWechat: "/api/User/CheckUserIsSubscribeEnterpriseWechat?userToken={userToken}&brandCode={brandCode}",
  // 查询用户是否在企微群(微伴助手)
  getUserIsGroupChatWeChat: "/api/User/GetUserIsGroupChatWeChat?userToken={userToken}&brandCode={brandCode}&bonusTypeId={bonusTypeId}",
  //派样机
  getPickupCode: "/api/SampleMachine/GetPickupCode?userToken={userToken}&brandCode={brandCode}",
  refreshPickupCode: "/api/SampleMachine/RefreshPickupCode?userToken={userToken}&brandCode={brandCode}",
  getBindStoreList: "/api/SampleMachine/GetBindStoreList?userToken={userToken}&brandCode={brandCode}&pageIndex={pageIndex}&pageSize={pageSize}&searchStr={searchStr}",
  //会员卡信息
  getUserCardInfo: "/api/User/Get_UserCardInfo?userToken={userToken}&brandCode={brandCode}",
  getCrossOrderUserInfo: "/api/Order/Get_Cross_Order_UserInfo?userToken={userToken}&brandCode={brandCode}",
  //签到
  getAppSign: "/api/SignIn/Get_AppSign?userToken={userToken}&brandCode={brandCode}",
  get_SignOrderActivityInfo: "/api/SignIn/Get_SignOrderActivityInfo?userToken={userToken}&brandCode={brandCode}",
  get_UserSignOrderActivityReward: "/api/SignIn/Get_UserSignOrderActivityReward?userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}&receiveType={receiveType}&brandCode={brandCode}",
  createAppSign: {
    u: "/api/SignIn/Create_AppSign",
    m: "post"
  },
  getSignRecord: "/api/signin/Get_UserSignRecord?userToken={userToken}&brandCode={brandCode}&beginDate={beginDate}&endDate={endDate}",

  getUserStoredValueInfo: "/api/StoredValue/Get_UserStoredValueInfo?userToken={userToken}&brandCode={brandCode}",
  getUserStoredValueCaptcha: "/api/StoredValue/Get_UserStoredValueCaptcha?userToken={userToken}&brandCode={brandCode}",
  getStoredValueActivity: "/api/StoredValue/Get_StoredValueActivity?userToken={userToken}&activityId={activityId}&brandCode={brandCode}",
  getCurrentStoredValueActivity: "/api/StoredValue/Get_CurrentStoredValueActivity?brandCode={brandCode}",
  createStoredValueCardOrder: {
    u: "/api/StoredValue/CreateStoredValueCardOrder",
    m: "post"
  },
  getUserStoredValueFlowList: "/api/StoredValue/Get_UserStoredValueFlowList?userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
  //判断该用户是否为店员导购
  getStoreStaffInfo: "/api/StoreStaff/GetStoreStaffInfo?userToken={userToken}&brandCode={brandCode}",
  getStoreStaffList: "/api/StoreStaff/GetStoreStaffList?storeId={storeId}&searchText={searchText}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
  getWxCodeForWap: {
    u: "/api/WXBarCode/GetWxCodeForWap",
    m: "post"
  },
  getWechatSchemeShort: {
    u: "/api/Wechat/GetWechatSchemeShort",
    m: "post"
  },
  //获取导购配置的背景
  getStoreStaffBar: "/api/StoreStaff/GetStoreStaffBarcodeBackground?brandCode={brandCode}",
  //获取会员所属店铺
  getMemeberBelongStore: "/api/Store/getMemeberBelongStore?lat={lat}&lon={lon}&isUseLocation={isUseLocation}&userToken={userToken}&brandCode={brandCode}",
  //选择店铺导购
  getCustomerServiceInfo: "/api/StoreStaff/GetCustomerServiceInfo?storeId={storeId}&staffId={staffId}&lat={lat}&lon={lon}&brandCode={brandCode}&isStore={isStore}",
  /**
   * 协议
   */
  getUserAgreementArticle: "/api/User/Get_User_Agreement_Article?articleId={articleId}&brandCode={brandCode}",
  getUserAgreement: "/api/User/Get_User_Agreement?brandCode={brandCode}&agreementType={agreementType}",
  checkIsUserAgreement: "/api/User/CheckIsUserAgreement?brandCode={brandCode}&agreementType={agreementType}",
  checkUserIsCompleteInfo: "/api/User/CheckUserIsCompleteInfo?brandCode={brandCode}&userToken={userToken}",
  /**
   * 
   */
  searchUserInfo: "/api/User/SearchUserInfo?mobilePhone={mobilePhone}&brandCode={brandCode}",
  get_UserExpirePoint: "/api/UserPoint/Get_UserExpirePoint?userToken={userToken}&brandCode={brandCode}",
  get_UserPointCaptcha: "/api/UserPoint/Get_UserPointCaptcha?userToken={userToken}&brandCode={brandCode}",

  getAccountChangeList: "/api/User/Get_AccountChangeList?userToken={userToken}&brandCode={brandCode}&pageIndex={pageIndex}&pageSize={pageSize}",
  storedValueCard: {
    u: "/api/StoredValue/ExchangeStoredValueCard",
    m: "post"
  },
  /***/
  getCustomPageShareActivity: "/api/Page/Get_CustomPageShareActivity?pageId={pageId}&userToken={userToken}&brandCode={brandCode}",
  getPayCode: "/api/User/GetPayCode?userToken={userToken}&brandCode={brandCode}",
  refreshPayCode: "/api/User/RefreshPayCode?userToken={userToken}&brandCode={brandCode}",
  //绑定导购
  bindFromStaffId: {
    u: "/api/StoreStaff/BindFromStaffId",
    m: "post"
  },
  getUserBarcodeBackground: "/api/User/GetUserBarcodeBackground?brandCode={brandCode}",
  getPopupAdvert: "/api/PopupAdvert/GetPopupAdvert?userToken={userToken}&pageId={pageId}&isIndex={isIndex}&brandCode={brandCode}",
  /*更改所属店铺*/
  bindFromStore: {
    u: "/api/store/BindFromStore",
    m: "post"
  },
  getUserRedpackList: "/api/Redpack/GetUserRedpackList?userToken={userToken}&type={type}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
  getUserDockList: "/api/UserDock/Get_UserDockList?userToken={userToken}&brandCode={brandCode}",
  get_UserDockStoreList: "/api/UserDock/Get_UserDockStoreList?searchStr={searchStr}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
  create_UserDockPoolByStaff: {
    u: "/api/UserDock/Create_UserDockPoolByStaff",
    m: "post"
  },
  createUserDockPool: {
    u: "/api/UserDock/Create_UserDockPool",
    m: "post"
  },
  // 店员代码转店员id
  getStoreStaffByCode: "/api/StoreStaff/GetStoreStaffByCode?staffCode={staffCode}&brandCode={brandCode}",
  getInviteUserActivity: "/api/InviteUser/GetInviteUserActivity?brandCode={brandCode}",
  getInviteUserRecord: "/api/InviteUser/GetInviteUserRecord?userToken={userToken}&activityId={activityId}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
  getInviteUserLogList: "/api/InviteUser/GetInviteUserLogList?activityId={activityId}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
  // N单有礼
  getOrderGiftActivity: "/api/OrderGift/GetOrderGiftActivity?userToken={userToken}&brandCode={brandCode}",
  getOrderGiftActivityDetail: "/api/OrderGift/GetOrderGiftActivityDetail?activityId={activityId}&userToken={userToken}&brandCode={brandCode}",
  exchangeOrderGift: {
    u: "/api/OrderGift/ExchangeOrderGift",
    m: "post"
  },
  getExchangeList: "/api/OrderGift/GetExchangeList?userToken={userToken}&brandCode={brandCode}&pageIndex={pageIndex}&pageSize={pageSize}",
  getExchangeDetail: "/api/OrderGift/GetExchangeDetail?exchangeId={exchangeId}&userToken={userToken}&brandCode={brandCode}",
  //付费会员
  createUserUpgradeOrder: {
    u: "/api/UserUpgrade/CreateUserUpgradeOrder",
    m: "post"
  },
  get_UserUpgradeInfo: '/api/UserUpgrade/Get_UserUpgradeInfo?userToken={userToken}&brandCode={brandCode}',
  get_UserUpgradeActivityInfo: '/api/UserUpgrade/Get_UserUpgradeActivityInfo?activityId={activityId}&userToken={userToken}&brandCode={brandCode}',
  getUserUpgradeShareBenefit: '/api/UserUpgrade/GetUserUpgradeShareBenefit?userToken={userToken}&brandCode={brandCode}&timeType={timeType}&pageIndex={pageIndex}&pageSize={pageSize}',
  checkUserUpgradeOrderPay: '/api/UserUpgrade/CheckUserUpgradeOrderPay?orderId={orderId}',
  getUserErpCoupon: '/api/Coupon/Get_UserErpCoupon?userToken={userToken}&brandCode={brandCode}',
  getThirdPpartyChannelActivity: "/api/User/GetThirdPpartyChannelActivity?channelKey={channelKey}&brandCode={brandCode}",
  postThirdPpartyChannelActivityLog: {
    u: "/api/user/PostThirdPpartyChannelActivityLog",
    m: "post"
  },
  getUserBelongStore: "/api/User/GetUserBelongStore?userToken={userToken}&lat={lat}&lon={lon}&isUseLocation={isUseLocation}&dstbStaffCode={dstbStaffCode}&brandCode={brandCode}",

  getVisitStore: "/api/User/GetVisitStore",
  changeVisitStore: {
    u: "/api/User/ChangeVisitStore",
    m: "post"
  },
  getUserOrderCount: "/api/Order/Get_UserOrderCount",
  getUserSimpleInfo: "/api/User/Get_UserSimpleInfo?userToken={userToken}&brandCode={brandCode}",

}

// 注册登录
export const QT_RegApiList = {
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

export const QT_VSlogApiList = {
  writePageLog: {
    u: `${visitApi}/api/Common/Write_Page_Log`,
    m: "post"
  },
  CreateLogSession: {
    u: `${visitApi}/api/Log/CreateLogSession`,
    m: "post"
  },
  CreateLogSessionExtend: {
    u: `${visitApi}/api/Log/CreateLogSessionExtend`,
    m: "post"
  },
  AddPageLog: {
    u: `${visitApi}/api/Log/UploadVisitLogList`,
    m: "post"
  },
  AddActionLog: {
    u: `${visitApi}/api/Log/UploadLogActionList`,
    m: "post"
  },
  createExtendChannelLog: {
    u: `${visitApi}/api/Log/CreateExtendChannelLog`,
    m: "post"
  },
  postUpdateClientSession: {
    u: `${visitApi}/api/Log/UpdateClientSession`,
    m: "post"
  },
  uploadLogActionList: {
    u: `${visitApi}/api/Log/UploadLogActionList`,
    m: "post"
  },
  postCustomPageVisitRecord: {
    u: `${visitApi}/api/log/Post_CustomPageVisitRecord`,
    m: "post"
  }
}

// 分销
export const QT_DstbApiList = {
  //创建分销关系
  buildDstbRelation: {
    u: "/api/StaffDstb/Build_DstbRelation",
    m: "post"
  },
  //是否分销员
  checkIfStaffDstb: "/api/StaffDstb/CheckIfStaffDstb?userToken={userToken}&brandCode={brandCode}",
  getMyFanList: "/api/StaffDstb/GetMyFanList?userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
  //通过分销员code找店员id
  getStaffIdByStaffCode: "/api/StaffDstb/GetStaffIdByStaffCode?staffCode={staffCode}&brandCode={brandCode}",
  get_StaffDstbInfo:"/api/Staff/Get_StaffDstbInfo"
}

// 商品
export const QT_GoodsApiList = {
  activityDetail: "/api/Activity/ActivityDetail",
  getActivityNoCachDetail: "/api/Activity/GetActivityNoCachDetail",
  activityUpdateOrInsert:{
    u:"/api/Activity/ActivityUpdateOrInsert",
    m:"post"
  },
  getActivityGoodsInfo:{
    u:"/api/Activity/GetActivityGoodsInfo",
    m:"post"
  },
  getActivityGoodsInfo: "/api/Goods/GetActivityGoodsInfo",
  get_Sumary_GoodsDetailData: "/api/Goods/Get_Sumary_GoodsDetailData?goodsId={goodsId}",
  get_Sumary_GoodsProductInfo: "/api/Goods/Get_Sumary_GoodsProductInfo?goodsId={goodsId}&colorId={colorId}",
  getGoodsInfo: "/api/Goods/GetGoodsInfo?activityId={activityId}", 
  activityGoodsInfo: "/api/Activity/ActivityGoodsInfo?activityId={activityId}",
  activityGoodsUpdateOrInsert:{
    u:"/api/Activity/ActivityGoodsUpdateOrInsert",
    m:"post"
  },
  activityProductUpdateOrInsert:{
    u:"/api/Activity/ActivityProductUpdateOrInsert",
    m:"post"
  },
  activityGoodsProductInfo:{
    u:"/api/Activity/ActivityGoodsProductInfo",
    m:"post"
  }, 
  getGoodsProduct: "/api/Goods/GetGoodsProduct",
  deleteGoodsInfo: "/api/Goods/DeleteGoodsInfo?goodsId={goodsId}",
}

//订单
export const QT_BuyApiList = {
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
  updateOrderStatus: {
    u: "/api/Order/UpdateOrderStatus",
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

}

//支付
export const QT_PayApiList = {
  unifiedCloudShopOrder:"/api/Pay/UnifiedQuickTradeOrder?payType={payType}&orderId={orderId}&brandCode={brandCode}",
  unifiedCloudShopOrderByCode: "/api/Pay/UnifiedQuickTradeOrderByCode?payType={payType}&orderId={orderId}&brandCode={brandCode}"
}