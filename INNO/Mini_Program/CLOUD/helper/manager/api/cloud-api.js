// import Conf from "../../../conf.js"
// const VISIT_APICONF = {
//   "1": "/InnoLogApi",
//   "2": "/VisitLogApi",
//   "3": "",
// }
// const BARCODE_APICONF = {
//   "1": "",
//   "2": "/BarCodeApi",
//   "3": "",
// }
// const visitApi = Conf.visitApiType ? VISIT_APICONF[Conf.visitApiType] : VISIT_APICONF[1];
// const barCodeApi = Conf.barCodeApiType ? BARCODE_APICONF[Conf.barCodeApiType] : BARCODE_APICONF[1];
const visitApi = "";
export const CL_RegApiList = {
  userLogin: {
    u: "/api/Wechat/Login",
    m: "post"
  },
  userRegister: {
    u: "/api/Wechat/Register",
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
}
export const CL_BrandApiList = {
  getMenuList: "/api/Brand/Get_MenuList",
  getWxappShareConfigEntity: "/api/Brand/Get_WxappShareConfigEntity?cfgType={cfgType}",
  getStartPageConfigList: "/api/Brand/GetStartPageConfigList",
  getBottomMenuList: "/api/Brand/Get_Bottom_MenuList",
  getVisitStoreRule: "/api/Brand/GetVisitStoreRule"
}
export const CL_UserApiList = {
  //USER
  changeVisitStore: {
    u: "/api/User/ChangeVisitStore",
    m: "post"
  },
  getVisitStore: {
    u: "/api/User/GetVisitStore?storeCode={storeCode}",
    m: "post"
  },
  getBonusList: "/api/Coupon/GetUserBonusList?type={type}&pageNum={pageNum}&sort={sort}",
  writeOffCoupon: {
    u: "/api/Coupon/WriteOffCoupon",
    m: "post"
  },
  getUsefulCouponCount: "/api/Coupon/Get_UsefulCouponCount",
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
  changeVisitStore: {
    u: "/api/User/ChangeVisitStore",
    m: "post"
  }
}
export const CL_BuyApiList = {
  getUserOrderCount: "/api/Order/Get_UserOrderCount",
  getCheckoutBonusList: {
    u: "/api/Checkout/GetCheckoutBonusList",
    m: "post"
  },
  checkout: {
    u: "/api/Checkout/Checkout",
    m: "post"
  },
  addOrder: {
    u: "/api/Checkout/AddOrder",
    m: "post"
  },



  cancelOrder: {
    u: "/api/Order/CancelOrder",
    m: "post"
  },
  cancelOrderGoods: {
    u: "/api/Order/CancelOrderGoods",
    m: "post"
  },
  getCancelReasonList: "/api/Order/GetCancelReasonList",
  getReturnReasonList: "/api/Order/GetReturnReasonList",
  getOrderList: "/api/Order/GetOrderList?orderType={orderType}&pageIndex={pageIndex}&pageSize={pageSize}&searchStr={searchStr}",
  getOrderDetail: "/api/Order/GetOrderDetail?orderId={orderId}"
}
export const CL_GoodsApiList = {
  /*
    Goods
  */
  getSumaryGoodsDetailData: "/api/Goods/Get_Sumary_GoodsDetailData?goodsId={goodsId}&productId={productId}&colorId={colorId}&issue_id={issue_id}",
  getSumaryGoodsProductInfo: "/api/Goods/Get_Sumary_GoodsProductInfo?goodsId={goodsId}&colorId={colorId}&issueId={issueId}",
  getGoodsServices: "/api/Goods/Get_GoodsServices?goodsId={goodsId}",
  get_Goods_Param_Attr_List: "/api/Goods/Get_Goods_Param_Attr_List?goodsId={goodsId}",
  getSumaryGoodsProductInfoByShippingStore: "/api/Goods/Get_Sumary_GoodsProductInfoByShippingStore?goodsId={goodsId}",
  getPromotionGoodsList: "/api/Goods/GetPromotionGoodsList?ruleId={ruleId}&pageIndex={pageIndex}&pageSize={pageSize}",
  getGoodsDefaultImage: "/api/Goods/GetGoodsDefaultImage?goodsId={goodsId}",
  getSumaryALLGoodsList: "/api/Goods/Get_Sumary_ALLGoodsList?functype={functype}&cate_Id={cate_Id}&strWhere={strWhere}&pageSize={pageSize}&pageIndex={pageIndex}&sort_field={sort_field}&sort_by={sort_by}&goods_brand_ids={goods_brand_ids}",
  searchGoodsList: "/api/Goods/Get_Sumary_SearchGoodsList?functype={functype}&catId={catId}&strAttrId={strAttrId}&strAttrValue={strAttrValue}&colorCatId={colorCatId}&startPrice={startPrice}&endPrice={endPrice}&strWhere={strWhere}&pageSize={pageSize}&pageIndex={pageIndex}&sortField={sortField}&sortBy={sortBy}&goods_brand_ids={goods_brand_ids}&storeId={storeId}",
  getSearchGoodsListBySkip: "/api/Goods/GetSearchGoodsListBySkip?functype={functype}&catId={catId}&strAttrId={strAttrId}&strAttrValue={strAttrValue}&colorCatId={colorCatId}&startPrice={startPrice}&endPrice={endPrice}&strWhere={strWhere}&pageSize={pageSize}&skipCount={skipCount}&sortField={sortField}&sortBy={sortBy}&goods_brand_ids={goods_brand_ids}&storeId={storeId}",
  getALLGoodsListByGoodsIds:
  {
    u:"/api/Goods/GetALLGoodsListByGoodsIds",
    m: "post"
  },
  getGoodsPropertyList: "/api/Goods/Get_GoodsPropertyList?functype={functype}&catId={catId}&strWhere={strWhere}",
  get_recommend_template_List: "/api/Goods/Get_recommend_template_List?goodsId={goodsId}",
  getMatchLinkGoodList: "/api/Goods/Get_MatchLinkGoodList?goodsId={goodsId}",
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
  getGoodsReceiveBonusActivityDetail: "/api/GoodsExtend/GetGoodsReceiveBonusActivityDetail?goodsId={goodsId}&activityId={activityId}",

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
  //
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
}
export const CL_VSlogApiList = {
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
  }
}
export const CL_PayApiList = {
  UnifiedorderByOrderId: "/InnoPayApi/api/Pay/UnifiedorderByOrderId?userToken={userToken}&payType={payType}&payMethod={payMethod}&orderId={orderId}&brandCode={brandCode}",
}
