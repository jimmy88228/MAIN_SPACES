//测试api
//http://jwimtest.innourl.com/Help
//
import Conf from "../../conf.js"
const VISIT_APICONF = {
  "1": "/InnoLogApi",
  "2": "/VisitLogApi",
  "3": "",
}
const BARCODE_APICONF = {
  "1": "",
  "2": "/BarCodeApi",
  "3": "",
}
const visitApi = Conf.visitApiType ? VISIT_APICONF[Conf.visitApiType] : VISIT_APICONF[1];
const barCodeApi = Conf.barCodeApiType ? BARCODE_APICONF[Conf.barCodeApiType] : BARCODE_APICONF[1];

/** 分域名 **/
export const TestApiList = {
  getCustomPagesList: "/api/Goods/Get_Custom_Pages_List?param={param}&pageType={pageType}&userToken={userToken}&brandCode={brandCode}",
  getHomePageDataScriptList: "/api/Goods/GetHomePageDataScriptList?pageId={pageId}",
}
//商品
export const GoodsApiList = {
    canUseCouponByJieSuan:{
      u:"/api/Goods/Post_CanUseCouponByJieSuan",
      m:"post"
    }, 
    //结算页选择优惠券
    useBonusList: "/api/Coupon/Get_BonusList?bonus_ids={bonus_ids}&pageIndex={pageIndex}&pageSize={pageSize}",
    //自定义
    getPageDataById: "/api/Goods/GetHomePageDataList?pageId={pageId}",
    //Goods
    getAppCatalogList: "/api/Goods/Get_AppCatalogList",
    get_GoodsPackageList: "/api/GoodsPackage/Get_GoodsPackageList?goodsId={goodsId}&pageIndex={pageIndex}&pageSize={pageSize}",
    get_GoodsPackageInfo:"/api/GoodsPackage/Get_GoodsPackageInfo?packageId={packageId}",
    get_GoodsPackageProductInfo:"/api/GoodsPackage/Get_GoodsPackageProductInfo?packageId={packageId}&goodsId={goodsId}",
    post_GoodsPackageAddBuyCar:{
        u: "/api/GoodsPackage/Post_GoodsPackageAddBuyCar",
        m: "post"
    },
    getValidGoodsPackageList:"/api/GoodsPackage/Get_ValidGoodsPackageList?activityIds={activityIds}&searchStr={searchStr}&pageIndex={pageIndex}&pageSize={pageSize}",
    getBuyCarGoodList: "/api/Goods/GetBuyCarGood_List",
    //促销信息
    getPromotionInfo: "/api/Goods/GetPromotionInfo?recIds={recIds}",
    getGoodsPromotionRuleList:"/api/Goods/GetGoodsPromotionRuleList?goodsId={goodsId}",
    //加价购
    getGroupSaleGoodsList: "/api/Goods/GetGroupSaleGoodsList?goodsId={goodsId}&recId={recId}&activityId={activityId}",
    //结算
    postJieSuanListByStore: {
        u: "/api/Goods/Post_JieSuanListByStore",
        m: "post"
    },
    genterBuyCarByMwin: {
      u: "/api/Goods/GenterBuyCarByMwin",
      m: "post"
    },
    //商品搭配
    getMatchLinkGoodList: "/api/Goods/Get_MatchLinkGoodList?goodsId={goodsId}",
    //秒杀 
    seckillGetGoodsList: "/api/SecKill/GetSecKillActive?issueId={issueId}",
    //分销提成
    getGoodsCommissionAmount: "/api/goods/Get_GoodsCommissionAmount?goodsId={goodsId}",
    getGoodsCommissionAmountByType: "/api/goods/Get_GoodsCommissionAmountByType?goodsId={goodsId}&goodsType={goodsType}&relatedId={relatedId}", //goodsType = COLLAGEGROUP(拼团) , PRESALE(预售) , NORMAL(正常商品) , SKILL(秒杀),POINTMKT(积分商城)
    /**
     * 代客下单
    */
    orderForCustom:{
      u: "/api/GOODS/OrderForCustom",
      m:"post"
    },
    getGoodsPromotionInfo:"/api/Goods/GetGoodsPromotionInfo?goodsId={goodsId}",
    getSeckillGoodList:"/api/Goods/GetSeckillGoodList?issueId={issueId}&pageIndex={pageIndex}&pageSize={pageSize}&goodsIds={goodsIds}&platformSrc={platformSrc}",
    getALLGoodsListByGoodsIds: "/api/Page/GetALLGoodsListByGoodsIds?goodIds={goodIds}",
    get_recommend_template_List:"/api/Goods/Get_recommend_template_List?goodsId={goodsId}",
    //店铺 by goodsId
  	getShippingStoreList: "/api/Store/Get_Shipping_Store_List?goodsId={goodsId}&searchName={searchName}&pageIndex={pageIndex}&pageSize={pageSize}&lat={lat}&lon={lon}&goodsNum={goodsNum}",
    getShippingStoreListByCartId: "/api/Store/Get_Shipping_Store_ListByCartId?recId={recId}&searchName={searchName}&pageIndex={pageIndex}&pageSize={pageSize}&lat={lat}&lon={lon}",
    //领券模块
    getGoodsReceiveBonusActivity:"/api/GoodExtend/GetGoodsReceiveBonusActivity?goodsId={goodsId}",
    getGoodsReceiveBonusActivityDetail:"/api/GoodExtend/GetGoodsReceiveBonusActivityDetail?goodsId={goodsId}&activityId={activityId}",
    receiveBonusFromGoods:{
      u:"/api/GoodExtend/ReceiveBonusFromGoods",
      m:"post"
    },
    checkJieSuanCartstorage:"/api/Goods/CheckJieSuanCartstorage?recIds={recIds}",
    getGoodsActivityPrice: "/api/Goods/Get_GoodsActivityPrice?goodsId={goodsId}",
    goodsCategoryStyle: "/api/GoodsCategoryStyle/GetCategoryList",
    getShoppingAds: "/api/Goods/Get_shopping_recommend_template_List",
    limit_page_show_assembly: "/api/Page/Get_moto_limit_page_show_assembly?path={path}&assembly_type={assembly_type}",
    goodsSearchStyle:"/api/GoodsSearchStyle/GetStyle",
    getGoodsDetailVideoShopinggList:"/api/VideoShopping/GetGoodsDetailVideoShopingList?goodsId={goodsId}",
    getPopupAdvert: "/api/PopupAdvert/GetPopupAdvert?pageId={pageId}&isIndex={isIndex}",
    getGoodsIdByScan:"/api/Goods//GetGoodsIdByScan?sku={sku}",
    getGoodsScanInfo:"/api/Goods//GetGoodsScanInfo?searchVal={searchVal}",
    getParentPageDataScript:"/api/Goods/GetParentPageDataScript",
    
    //CLOUD1 GOODS
    /*
      Goods
    */  
    getSumaryGoodsDetailData: "/api/Goods/Get_Sumary_GoodsDetailData?goodsId={goodsId}&productId={productId}&colorId={colorId}&issue_id={issue_id}",
    getSumaryGoodsProductInfo: "/api/Goods/Get_Sumary_GoodsProductInfo?goodsId={goodsId}&colorId={colorId}&issueId={issueId}",
    getGoodsServices: "/api/Goods/Get_GoodsServices?goodsId={goodsId}",
    get_Goods_Param_Attr_List:"/api/Goods/Get_Goods_Param_Attr_List?goodsId={goodsId}",
    getSumaryGoodsProductInfoByShippingStore:"/api/Goods/Get_Sumary_GoodsProductInfoByShippingStore?goodsId={goodsId}",
    getPromotionGoodsList:"/api/Goods/GetPromotionGoodsList?ruleId={ruleId}&pageIndex={pageIndex}&pageSize={pageSize}",
    getGoodsDefaultImage: "/api/Goods/GetGoodsDefaultImage?goodsId={goodsId}",
    getSumaryALLGoodsList: "/api/Goods/Get_Sumary_ALLGoodsList?functype={functype}&cate_Id={cate_Id}&strWhere={strWhere}&pageSize={pageSize}&pageIndex={pageIndex}&sort_field={sort_field}&sort_by={sort_by}&goods_brand_ids={goods_brand_ids}",
    searchGoodsList: "/api/Goods/Get_Sumary_SearchGoodsList?functype={functype}&catId={catId}&strAttrId={strAttrId}&strAttrValue={strAttrValue}&colorCatId={colorCatId}&startPrice={startPrice}&endPrice={endPrice}&strWhere={strWhere}&pageSize={pageSize}&pageIndex={pageIndex}&sortField={sortField}&sortBy={sortBy}&goods_brand_ids={goods_brand_ids}&storeId={storeId}",
    getSearchGoodsListBySkip:"/api/Goods/GetSearchGoodsListBySkip?functype={functype}&catId={catId}&strAttrId={strAttrId}&strAttrValue={strAttrValue}&colorCatId={colorCatId}&startPrice={startPrice}&endPrice={endPrice}&strWhere={strWhere}&pageSize={pageSize}&skipCount={skipCount}&sortField={sortField}&sortBy={sortBy}&goods_brand_ids={goods_brand_ids}&storeId={storeId}",
    getGoodsPropertyList: "/api/Goods/Get_GoodsPropertyList?functype={functype}&catId={catId}&strWhere={strWhere}",
    /*
      GoodsExtend
    */
    checkHasAddFav:{
      u:"/api/GoodsExtend/Check_HasAddFav",
      m:"post"
    },
    addFavGoodsLog:{
      u:"/api/GoodsExtend/Add_Fav_Goods_Log",
      m:"post"
    },
    delFavGoodsLog:{
      u:"/api/GoodsExtend/Del_Fav_Goods_Log",
      m:"post"
    },
    addGoodsVisitLog: {
      u:"/api/GoodsExtend/Op_GoodsVisitLog",
      m:"post"
    },
    getGoodsVisitLogList: "/api/GoodExtend/Get_GoodsVisitLog_List?pageIndex={pageIndex}&pageSize={pageSize}",
    getFavLogList: "/api/GoodExtend/Get_Fav_LogList?pageIndex={pageIndex}&pageSize={pageSize}",
    /*
      ShoppingCart
    */
    getCartStoageCount: {
      u:"/api/ShoppingCart/GetCartStoage_Count",
      m:"post"
    },
    createBuyCarInsert: {
        u: "/api/ShoppingCart/Create_BuyCar_Insert",
        m: "post"
    },
    getShoppingCartList:"/api/ShoppingCart/GetShoppingCartList",
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
    countPromotionInfoByJieSuan:{
      u:"/api/ShoppingCart/CountPromotionInfoByJieSuan",
      m:"post"
    },
    /*
      GoodsComment
    */
     //线上商品评论列表
     getGoodsCommentListOnline: "/api/GoodsComment/Get_Goods_CommentList_Online?goodsId={goodsId}&pageIndex={pageIndex}&pageSize={pageSize}",
     //线上商品评论明细
     getOnlineOrderCommentDetail: "/api/GoodsComment/Get_Online_Order_Comment_Detail?orderId={orderId}",
     //评论线上订单
     commentOnlineOrder: {
         u: "/api/GoodsComment/CommentOnlineOrder",
         m: "post"
     },
     //评论线上商品明细
     commentOnlineOrderGoods: {
         u: "/api/GoodsComment/CommentOnlineOrderGoods",
         m: "post"
     },
     //评论线下商品明细
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
    getCustomPagesInfo:"/api/Page/Get_CustomPagesInfo?param={param}&pageType={pageType}",
    getCustomPageDataScript:"/api/Page/Get_CustomPageDataScript?pageId={pageId}",
    getCustomCategoryList:"/api/Page/Get_CustomCategoryList?pageId={pageId}",
}
//下单
export const BuyApiList = {
    //Order
    canUseCouponByJieSuan:{
      u:"/api/Goods/Post_CanUseCouponByJieSuan",
      m:"post"
    },
    //下单
    addNewOrderInfo: {
        u: "/api/Order/Add_New_OrderInfo",
        m: "post"
    },
    //订单
    //普通订单列表
    getAPPVariousTypeOrderList: "/api/Order/Get_APPVariousTypeOrderList?orderType={orderType}&orderKind={orderKind}&pageIndex={pageIndex}&pageSize={pageSize}&searchStr={searchStr}",
    //第三方订单
    getExAPPVariousTypeOrderList: "/api/Order/Get_Ex_APPVariousTypeOrderList?orderType={orderType}&orderKind={orderKind}&pageIndex={pageIndex}&pageSize={pageSize}",
    getOrderRefundList:"/api/Order/Get_OrderRefundList?pageIndex={pageIndex}&pageSize={pageSize}&searchStr={searchStr}",
    //店铺订单
    getStoreOrderList: "/api/Order/Get_StoreOrderList?pageIndex={pageIndex}&pageSize={pageSize}",
    getStoreOnlineOrderList: "/api/Order/Get_StoreOnlineOrderList?userId={userId}&pageIndex={pageIndex}&pageSize={pageSize}&brandId={brandId}",
    //店铺订单详情
    getStoreOrderDetail: "/api/Order/Get_StoreOrderDetail?orderSn={orderSn}",
    //订单明细
    getALLOrderEntity: "/api/Order/Get_ALLOrderEntity?orderId={orderId}",
    //订单原因
    getOrderCancelReasonList: "/api/Order/Get_OrderCancelReasonList",
    //确认订单
    confirmGetGoods: {
        u: "/api/Order/ConfirmGetGoods",
        m: "post"
    },
    getOrderPayStatus: "/api/Order/GetOrderPayStatus?orderId={orderId}",
    //取消原因
    getOrderCancelReasonList: "/api/Order/Get_OrderCancelReasonList",
    //申请取消订单
    cancelOrApplyCancelOrder: {
        u: "/api/Order/CancelOrApplyCancelOrder",
        m: "post"
    },
    //退换货
    getTuiHuanHuoDetailList: "/api/Order/Get_TuiHuanHuoDetailList?returnId={returnId}",
    getOrderRefundDetail:"/api/Order/Get_OrderRefundDetail?refundId={refundId}",
    createReshipOrder: {
        u: "/api/Order/Create_Reship_Order",
        m: "post"
    },
    createBatchReshipOrder: {
        u: "/api/Order/Create_BatchReship_Order",
        m: "post"
    },
    //退换货原因
    getOrderReturnReasonList: "/api/Brand/Get_Order_Return_ReasonList",
    updateReturnOrderShippingNo: {
        u: "/api/order/Update_ReturnOrderShippingNo",
        m: "post"
    },
    //换货接口
    createExchangeReshipOrder:{
      u:"/api/Order/Create_ExchangeReship_Order",
      m:"post"
    },
    //查看物流
    getWuLiuInfo: "/api/Order/GetWuLiuInfo?invoiceNo={invoiceNo}",
    getOrderShippingInfo:"/api/Order/GetOrderShippingInfo?orderId={orderId}&invoiceNo={invoiceNo}&isBackground={isBackground}&isForce={isForce}",
    getInvoiceList:"/api/Order/GetInvoiceList?orderId={orderId}",
    //商品操作接口
    getBuyCarGoodList: "/api/Goods/GetBuyCarGood_List",
    //促销信息
    getPromotionInfo: "/api/Goods/GetPromotionInfo?recIds={recIds}",
    //加价购
    getGroupSaleGoodsList: "/api/Goods/GetGroupSaleGoodsList?goodsId={goodsId}&recId={recId}&activityId={activityId}",
    //结算
    postJieSuanListByStore: {
        u: "/api/Goods/Post_JieSuanListByStore",
        m: "post"
    },
    get_Valet_OrderList:"/api/Order/Get_Valet_OrderList?orderType={orderType}&orderKind={orderKind}&pageIndex={pageIndex}&pageSize={pageSize}&searchStr={searchStr}",
    get_Valet_Ex_APPVariousTypeOrderList:"/api/Order/Get_Valet_Ex_APPVariousTypeOrderList?orderType={orderType}&orderKind={orderKind}&pageIndex={pageIndex}&pageSize={pageSize}",
    cancelOneGood:{
      u:"/api/Order/CancelOrApplyCancelOrderByOneGood",
      m:"post"
    },
    update_OrderAddress:{
      u:"/api/Order/Update_OrderAddress",
      m:"post"
    },
    oneMoreOrder:{
      u:"/api/Order/OneMoreOrder",
      m:"post"
    },
    /*延迟收货*/
    extendOrderReceiptTime:{
      u:"/api/Order/ExtendOrderReceiptTime",
      m:"post"
    },
    changeCartStorageShippingWay: {
      u:"/api/Goods/ChangeCartStorageShippingWay",
      m:"post"
    },
    //个人中心-查询订单
    getUserOrderCount:"/api/Order/Get_UserOrderCount"
}
//注册/登录
export const RegApiList = {
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
  checkSession: "/api/Wechat/checkSession",

  bindWxPhone: {
      u: "/api/Wechat/BindWxPhone",
      m: "post"
  },
  getGroupUserInfo:{
    u: "/api/Wechat/GetGroupUserInfo",
    m: "post"
  }
}
//用户/User
export const UserApiList = {
/**
 * 优惠券
 */
postUserReceiveBonus: {
    u: "/api/Coupon/Post_UserReceiveBonus",
    m: "post"
},
getBalanceCheckCoupon: "/api/Coupon/Get_BalanceCheck_Coupon?couponCode={couponCode}",
receiveSharedCoupon: {
    u: "/api/Coupon/Receive_SharedCoupon",
    m: "post"
},
BeginSharingCoupon: {
    u: "/api/Coupon/BeginSharingCoupon",
    m: "post"
},
getSharingCoupon: "/api/Coupon/Get_SharingCoupon?bonusId={bonusId}&fromUserToken={fromUserToken}",
getBalanceCheckCoupon: "/api/Coupon/Get_BalanceCheck_Coupon?couponCode={couponCode}",

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
sendSmsForValetOrder:{
  u:"/api/SMS/SendSmsForValetOrder",
  m:"post"
},
checkValetOrderSms:{
  u:"/api/SMS/CheckValetOrderSms",
  m:"post"
},

/**
 * Store
 */
//附近店铺
getNearbyStoreList: "/api/Store/Get_NearbyStoreList?searchName={searchName}&lat={lat}&lon={lon}&sType={sType}",
getSearchStoreListByWx: "/api/Store/Get_Search_StoreListByWx?lat={lat}&lon={lon}&sType={sType}",
getNearyByInStoreListWithInventory: "/api/Order/Get_NearyByInStoreListWithInventory?recIds={recIds}&searchName={searchName}&lat={lat}&lon={lon}",
/**
 * UserAddress
 */
//地址
getAddressList: "/api/UserAddress/Get_UserAddressList?pageIndex={pageIndex}&pageSize={pageSize}",
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
updatePortraitPath:{
  u: "/api/user/Update_PortraitPath",
  m: "post"
} ,
getUserInfoWap: "/api/User/GetUserInfo_Wap",
getUserInfoNew: "/api/User/GetUserCenter",
getUsefulCouponCount: "/api/Coupon/Get_UsefulCouponCount",
getUserRedpackAmount:"/api/Redpack/GetUserRedpackAmount",
//积分
getUserPointAmount:"/api/User/GetUserPointAmount",
//积分列表
pointList: "/api/User/Get_PointList?pageIndex={pageIndex}&pageSize={pageSize}",
//用户积分
userBalacePoint: "/api/User/Get_User_Balance_Point",
//优惠券
getBonusList: "/api/User/Get_MemberInfo_BonusList?type={type}&page_num={page_num}&sort={sort}",
writeOffCoupon: { 
    u: "/api/Coupon/WriteOffCoupon",
    m:"post"
},
//储值卡
getUserStoredValueAmount:"/api/User/GetUserStoredValueAmount",
getPrePaidCardList: "/api/User/Get_UserPrepaidCardList?storeId={storeId}&prepaidCards={prepaidCards}&pageIndex={pageIndex}&pageSize={pageSize}",
//个人资料
getUserBaseInfo: "/api/User/GetUserBaseInfo",
//个人资料带自定义字段
getUserExtendInfo: "/api/User/Get_UserExtendInfo",
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
changeWxPhone:{
  u:"/api/user/ChangeWxPhone",
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
checkUserBindPhone: "/api/User/CheckUserBindPhone",
//检测是否绑定公众号
checkUserSubscribeWechat: "/api/User/CheckUserSubscribeWechat",
//派样机
getPickupCode: "/api/SampleMachine/GetPickupCode",
refreshPickupCode: "/api/SampleMachine/RefreshPickupCode",
getBindStoreList: "/api/SampleMachine/GetBindStoreList?pageIndex={pageIndex}&pageSize={pageSize}&searchStr={searchStr}",
//会员卡信息
getUserCardInfo: "/api/User/Get_UserCardInfo",
getUserSimpleInfo: "/api/User/Get_UserSimpleInfo",
getCrossOrderUserInfo:"/api/Order/Get_Cross_Order_UserInfo",
//签到
getAppSign: "/api/SignIn/Get_AppSign",
createAppSign: {
  u: "/api/SignIn/Create_AppSign",
  m: "post"
},
getSignRecord: "/api/signin/Get_UserSignRecord?beginDate={beginDate}&endDate={endDate}",

getUserStoredValueInfo: "/api/StoredValue/Get_UserStoredValueInfo",
getUserStoredValueCaptcha: "/api/StoredValue/Get_UserStoredValueCaptcha",
getStoredValueActivity: "/api/StoredValue/Get_StoredValueActivity?activityId={activityId}",
createStoredValueCardOrder: {
    u: "/api/StoredValue/CreateStoredValueCardOrder",
    m: "post"
},
getUserStoredValueFlowList: "/api/StoredValue/Get_UserStoredValueFlowList?pageIndex={pageIndex}&pageSize={pageSize}",
//判断该用户是否为店员导购
getStoreStaffInfo: "/api/StoreStaff/GetStoreStaffInfo",
getWxCodeForWap:{
  u: "/api/WXBarCode/GetWxCodeForWap",
  m:"post"
},
//获取导购配置的背景
getStoreStaffBar: "/api/StoreStaff/GetStoreStaffBarcodeBackground",
//获取会员所属店铺
getMemeberBelongStore:"/api/Store/getMemeberBelongStore?lat={lat}&lon={lon}&isUseLocation={isUseLocation}",
//选择店铺导购
getCustomerServiceInfo:"/api/StoreStaff/GetCustomerServiceInfo?storeId={storeId}&staffId={staffId}&lat={lat}&lon={lon}&isStore={isStore}",
/**
 * 协议
*/
getUserAgreementArticle: "/api/User/Get_User_Agreement_Article?articleId={articleId}",
getUserAgreement: "/api/User/Get_User_Agreement?agreementType={agreementType}",
checkIsUserAgreement: "/api/User/CheckIsUserAgreement?agreementType={agreementType}",
checkUserIsCompleteInfo:"/api/User/CheckUserIsCompleteInfo",
/**
 * 
*/
searchUserInfo:"/api/User/SearchUserInfo?mobilePhone={mobilePhone}",
get_UserExpirePoint:"/api/UserPoint/Get_UserExpirePoint",
getAccountChangeList:"/api/User/Get_AccountChangeList?pageIndex={pageIndex}&pageSize={pageSize}",
storedValueCard:{
  u: "/api/StoredValue/ExchangeStoredValueCard",
  m:"post"
},
/***/
getCustomPageShareActivity: "/api/Page/Get_CustomPageShareActivity?pageId={pageId}",
getPayCode: "/api/User/GetPayCode",
refreshPayCode: "/api/User/RefreshPayCode",
//绑定导购
bindFromStaffId:{
  u:"/api/StoreStaff/BindFromStaffId",
  m:"post"
},
getUserBarcodeBackground:"/api/User/GetUserBarcodeBackground",
/*更改所属店铺*/
bindFromStore:{
  u:"/api/store/BindFromStore",
  m:"post"
},
getUserRedpackList:"/api/Redpack/GetUserRedpackList?type={type}&pageIndex={pageIndex}&pageSize={pageSize}",
getUserDockList:"/api/UserDock/Get_UserDockList",
createUserDockPool: {
  u: "/api/UserDock/Create_UserDockPool",
  m: "post"
},
getInviteUserActivity:"/api/InviteUser/GetInviteUserActivity",
getInviteUserRecord:"/api/InviteUser/GetInviteUserRecord?activityId={activityId}&pageIndex={pageIndex}&pageSize={pageSize}",
getInviteUserLogList:"/api/InviteUser/GetInviteUserLogList?activityId={activityId}&pageIndex={pageIndex}&pageSize={pageSize}",

// CLOUD2 USER
changeVisitStore:{
  u:"/api/User/ChangeVisitStore",
  m:"post"
},
getVisitStore:{
  u:"/api/User/GetVisitStore?storeCode={storeCode}",
  m:"post"
},

}
export const LiveApiList = {
  getLiveRoomList: "/api/LiveShow/GetLiveRoomList?pageIndex={pageIndex}&pageSize={pageSize}",
  getLiveShareAct: "/api/LiveShow/GetLiveRoomShareActivityDetaill?activityId={activityId}",
  getLiveActVisitRecord:"/api/LiveShow/GetLiveRoomShareActivityVisitRecord?activityId={activityId}&pageIndex={pageIndex}&pageSize={pageSize}",
  GetNextLiveRoom:"/api/LiveShow/GetNextLiveRoom",
  GetLiveRoomDetail:"/api/LiveShow/GetLiveRoomDetail?id={id}",
  postLiveActVisitRecord:{
    u:"/api/LiveShow/PostLiveShowShareActivityVisitRecord",
    m:"post"
  }
}
export const PayApiList = {
    getAppletPrepayId: "/api/pay/weixin3.36/getAppletPrepayId_kingking.php?order_id={order_id}&pay_type={pay_type}",
    payUnifiedorder: "/InnoPayApi/api/Pay/Unifiedorder?payType={payType}&payMethod={payMethod}&orderSn={orderSn}",
    UnifiedorderByOrderId: "/InnoPayApi/api/Pay/UnifiedorderByOrderId?payType={payType}&payMethod={payMethod}&orderId={orderId}",
}
//拼团
export const CollageApiList = {
    //**
    //*拼团 
    //**
    //活动列表
    getCollageGroupActivityList: '/api/CollageGroup/Get_CollageGroupActivityList?pageIndex={pageIndex}&pageSize={pageSize}',
    //活动详情
    getCollageGroupActivityDetail: '/api/CollageGroup/Get_CollageGroupActivityDetail?activityId={activityId}',
    //参与活动记录
    getCollageGroupJoinList: '/api/CollageGroup/Get_ALLowJoinGroupGoodActivityList?activityId={activityId}&pageIndex={pageIndex}&pageSize={pageSize}',
    //获取参与活动订单列表
    getUserCollageGroupOrderList: "/api/CollageGroup/Get_UserCollageGroupOrderList?status={status}&pageIndex={pageIndex}&pageSize={pageSize}",
    //
    getUserJoingGroupGoodActivityList: "/api/CollageGroup/Get_UserJoingGroupGoodActivityList?userActivityId={userActivityId}&pageIndex={pageIndex}&pageSize={pageSize}",
    //拼团详情
    getUserCollageDetail: "/api/CollageGroup/Get_UserCollageDetail?userId={userId}&activityId={activityId}&userActivityId={userActivityId}",
    //拼团结算详情
    getCollageGroupSettlementList: "/api/CollageGroup/Get_CollageGroupSettlementList?activityId={activityId}&userActivityId={userActivityId}&addressId={addressId}&goodsId={goodsId}&productId={productId}&productNum={productNum}",
    //拼团下单
    collageGroupAddOrder: {
        u: "/api/CollageGroup/Post_CollageGroupAddOrder",
        m: "post"
    },
    //拼团订单支付状态查询
    getCollageGroupOrderPayStatus: "/api/CollageGroup/Get_CollageGroupOrderPayStatus?orderId={orderId}",
    //
    getCollageGroupGoodsDetail: "/api/CollageGroup/Get_CollageGroupGoodsDetail?activityId={activityId}&userActivityId={userActivityId}&goodsId={goodsId}&colorId={colorId}&sizeId={sizeId}",
    //检测数量
    checkProductNumber: "/api/CollageGroup/CheckProductNumber?activityId={activityId}&goodsId={goodsId}&productId={productId}&productNum={productNum}",
    getCollageGroupGoodsList:"/api/CollageGroup/Get_CollageGroupGoodsList?pageSize={pageSize}&pageIndex={pageIndex}&activityIds={activityIds}"
}
export const MainApiList = {
  
}
//预售
export const PreSaleApiList = {
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
    presaleDepositAddOrder:{
        u:"/api/Presale/PresaleDepositAddOrder",
        m:"post"
    },
    presaleOrderTailUsePointCoupon:{
        u:"/api/Presale/PresaleOrderTailUsePointCoupon",
        m:"post"
    },
}
//积分商城
export const PointApiList = {
    getPointMkBonusListByMain: "/api/PointMk/GetPointMkBonusListByMain",
    getPointMkGoodsListMain: "/api/PointMk/GetPointMkGoodsListMain",
    getPointMkBonusList: "/api/PointMk/GetPointMkBonusList?pageIndex={pageIndex}&pageSize={pageSize}",
    getPointMkGoodsList: "/api/PointMk/GetPointMkGoodsList?pageIndex={pageIndex}&pageSize={pageSize}&activityIds={activityIds}",
    getPointMkBonusDetail: "/api/PointMk/GetPointMkBonusDetail?mkBonusId={mkBonusId}",
    getPointMkGoodsDetail: "/api/PointMk/GetPointMkGoodsDetail?mkGoodsId={mkGoodsId}&goodsId={goodsId}",
    checkBuyPointMkGoods: "/api/PointMk/CheckBuyPointMkGoods?mkGoodsId={mkGoodsId}",
    checkExchangeBonus: "/api/PointMk/CheckExchangeBonus?mkBonusId={mkBonusId}",
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
    GetMkOrderPayStatus: "/api/PointMk/GetMkOrderPayStatus?orderSn={orderSn}",
    GetExchangeLogList: "/api/PointMk/GetExchangeLogList?pageIndex={pageIndex}&pageSize={pageSize}",
    cancelPointMkGoodOrder: {
        u: "/api/PointMk/CancelPointMkGoodOrder",
        m: "post"
    },
    getPointMkGoodOrderDetail: "/api/PointMk/GetPointMkGoodOrderDetail?mkOrderId={mkOrderId}"

}
// 砍价
export const BargainApiList = {
    getHagglePriceActivityList: "/api/HagglePrice/Get_HagglePriceActivityList?pageIndex={pageIndex}&pageSize={pageSize}&activityIds={activityIds}",
    getUserHagglePriceActivityList: "/api/HagglePrice/Get_UserHagglePriceActivityList?status={status}&pageIndex={pageIndex}&pageSize={pageSize}",
    getHagglePriceActivityDetail: "/api/HagglePrice/Get_HagglePriceActivityDetail?activityId={activityId}",
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

export const LotteryApiList = {
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
    getLotteryAdSlot:"/api/Lottery/Get_LotteryAdSlot"
}
//form
export const FromApiList = {
    //提交formId
    uploadUserFormId: {
      u: `${visitApi}/api/Common/UploadUserFormId`,
      m: "post"
    }
}
//分销
export const DstbApiList = {

    //创建分销关系
    buildDstbRelation: {
        u: "/api/StaffDstb/Build_DstbRelation",
        m: "post"
    },
    //是否分销员
    checkIfStaffDstb: "/api/StaffDstb/CheckIfStaffDstb",
    getMyFanList: "/api/StaffDstb/GetMyFanList?pageIndex={pageIndex}&pageSize={pageSize}",
    //通过分销员code找店员id
    getStaffIdByStaffCode:"/api/StaffDstb/GetStaffIdByStaffCode?staffCode={staffCode}"
}
//分销中心
export const DistributionApiList = {
    //首页  里面有申请中余额 
    staffDstbInfo: "/api/StaffDstb/Get_StaffDstbInfo",
    //分销订单列表：
    staffCommOrderList: "/api/StaffDstb/GetStaffCommOrderList?beginDate={beginDate}&endDate={endDate}&sType={sType}&pageIndex={pageIndex}&pageSize={pageSize}",
    //分销订单详情
    orderInfo: "/api/StaffDstb/GetOrderInfoByStaffDstb?orderSn={orderSn}",

    //佣金明细列表
    staffDstbAccountFlow: "/api/StaffDstb/Get_StaffDstbAccountFlow?pageIndex={pageIndex}&pageSize={pageSize}",

    //现金提取
    cashOut: {
        u: "/api/StaffDstb/Apply_Staff_Dstb_Cashout",
        m: "post"
    },
    //提现申请记录列表 
    cashOutList: "/api/StaffDstb/Get_ApplyCashoutList?pageIndex={pageIndex}&pageSize={pageSize}",

    staffInfo: "/api/StaffDstb/Get_moto_staff_dstb_cfgInfo",
    getMyTeamInfo:"/api/StaffDstb/GetMyTeamInfo",
    getMyTeamList:"/api/StaffDstb/GetMyTeamList?type={type}&pageIndex={pageIndex}&pageSize={pageSize}&sortField={sortField}&sortBy={sortBy}",

    //提现明细
    cashOutDetail: "/api/StaffDstb/GetApplyCashoutDetail?applyId={applyId}",

    //累计客户3
    myFanList: "/api/StaffDstb/GetMyFanList?pageIndex={pageIndex}&pageSize={pageSize}",
    goodsList: '/api/StaffDstbShare/Get_StaffDstbShareActivityGoodsList?searchStr={searchStr}&pageIndex={pageIndex}&pageSize={pageSize}',

    activityPageList: '/api/StaffDstbShare/Get_StaffDstbShareActivityPageList?pageIndex={pageIndex}&pageSize={pageSize}',
    applyStaff: "/api/StaffDstb/Get_ApplyStaffDstb_Activity",

    apply_Staff:{
        u: "/api/StaffDstb/Apply_StaffDstbInfo",
        m: "post"
    },
    applyStaffDstbInfoNoPhone:{
      u:"/api/StaffDstb/Apply_StaffDstbInfoNoPhone",
      m:"post"
    },
    pay_Result:"/api/StaffDstb/Get_ApplyStaffDstb_Pay_Result?orderId={orderId}",
    getMyDevelopmentTeamInfo:"/api/StaffDstb/GetMyDevelopmentTeamInfo",
    getMyDevelopmentTeamList:"/api/StaffDstb/GetMyDevelopmentTeamList?type={type}&searchStr={searchStr}&pageIndex={pageIndex}&pageSize={pageSize}&beginDate={beginDate}&endDate={endDate}",
    getMyStaffDstbInfo: "/api/StaffDstb/GetMyStaffDstbInfo?staffCode={staffCode}",
    getStaffDstbDevelopUserList:"/api/StaffDstb/GetStaffDstbDevelopUserList?pageIndex={pageIndex}&pageSize={pageSize}",
    getStaffDstbRankReport:"/api/StaffDstb/GetStaffDstbRankReport?type={type}&pageIndex={pageIndex}&pageSize={pageSize}&isStore={isStore}",
    //分销派劵
    getStaffSendCouponList:"/api/StaffDstbSendCoupon/Get_StaffDstbSendCouponTaskList?pageIndex={pageIndex}&pageSize={pageSize}",
    shareStaffCoupon:{
      u:"/api/StaffDstbSendCoupon/Share_StaffDstbSendCouponTask",
      m:"post"
    },
    getStaffShareCouponList:"/api/StaffDstbSendCoupon/Get_StaffDstbSendCouponTaskShareList?pageIndex={pageIndex}&pageSize={pageSize}",
    getSendCouponDetail:"/api/StaffDstbSendCoupon/Get_StaffDstbSendCouponTaskShareDetail?shareId={shareId}",
    getStaffCouponTaskRecord:"/api/StaffDstbSendCoupon/Get_StaffDstbSendCouponTaskShareGetRecord?shareId={shareId}&pageIndex={pageIndex}&pageSize={pageSize}",
    receiveStaffCoupon:{
      u:"/api/StaffDstbSendCoupon/Receive_StaffDstbSendCoupon",
      m:"post"
    },
    getStaffCouponTpls:{
      u:"/api/StaffDstbSendCoupon/GetTpls",
      m:"post"
    },
    setStaffCouponSub: {
      u:"/api/StaffDstbSendCoupon/SetSubscribe",
      m:"post"
    },
    checkUserIdCard: {
      u:"/api/StaffDstb/CheckUserIdCard",
      m:"post"
    },
    getStaffDstbUserReport:"/api/StaffDstb/GetStaffDstbUserReport?isToday={isToday}&begin={begin}&end={end}",
    getStaffDstbShareActivityGoodsListByGroup:"/api/StaffDstbShare/Get_StaffDstbShareActivityGoodsListByGroup?searchStr={searchStr}&groupId={groupId}&pageIndex={pageIndex}&pageSize={pageSize}",
    getStaffDstbShareActivityPageListByGroup:"/api/StaffDstbShare/Get_StaffDstbShareActivityPageListByGroup?groupId={groupId}&pageIndex={pageIndex}&pageSize={pageSize}",
    getStaffDstbShareGroupList:"/api/StaffDstbShare/GetStaffDstbShareGroupList?activityType={activityType}"
}
export const VSlogApiList = {
    writePageLog: {
      u: `${visitApi}/api/Common/Write_Page_Log`,
      m: "post"
    },
    CreateLogSession: {
      u: `${visitApi}/api/Log/CreateLogSession`,
      m: "post"
    },
    CreateLogSessionExtend:{
      u: `${visitApi}/api/Log/CreateLogSessionExtend`,
      m:"post"
    },
    AddPageLog: {
      u: `${visitApi}/api/Log/UploadVisitLogList`,
      m: "post"
    },
    AddActionLog: {
      u: `${visitApi}/api/Log/UploadLogActionList`,
      m: "post"
    },
    createExtendChannelLog:{
      u:`${visitApi}/api/Log/CreateExtendChannelLog`,
      m:"post"
    },
    postUpdateClientSession: {
      u: `${visitApi}/api/Log/UpdateClientSession`,
      m: "post"
    },
    uploadLogActionList: {
      u: `${visitApi}/api/Log/UploadLogActionList`,
      m:"post"
    },
    postCustomPageVisitRecord:{
      u: `${visitApi}/api/log/Post_CustomPageVisitRecord`,
      m:"post"
    }
}
export const BarCodeApiList = {
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
export const BrandApiList = {
    getMenuList: "/api/Brand/Get_MenuList",
    //文章
    getArticle: "/api/Brand/Get_Article_info?article_id={article_id}&aKey={aKey}",
    getDefSystemConfig: "/api/Brand/Get_DefSystemConfig",
    getSystemConfig: "/api/Brand/GetSystemConfig?cfg_prop={cfg_prop}",
    //支付方式
    getPaymentList: "/api/Brand/GetPaymentList",
    //收货时间
    getRectimeList: "/api/Brand/GetRectimeList",
    getWxappShareConfigEntity: "/api/Brand/Get_WxappShareConfigEntity?cfgType={cfgType}",
    //tabbar配置
    getBottomMenuList:"/api/Brand/Get_Bottom_MenuList",
    //会员卡
    getWxMemberCard:"/api/Brand/Get_WxMemberCard",
    getStartPageConfigList:"/api/Brand/GetStartPageConfigList",
    getShippingList:"/api/Brand/GetShippingList",
}
export const MemberCardList={
    getOpenCardParams:{
      u: "/api/WxMemberCard/GetOpenCardParams",
      m:"post"
    },
    getOpenCardRequestInfo:{
      u: "/api/WxMemberCard/GetOpenCardRequestInfo",
      m:"post"
    },
    activeMemberCard:{
      u: "/api/WxMemberCard/ActiveMemberCard",
      m:"post"
    },
    getAddCardSignNature:"/api/WxMemberCard/GetAddCardSignNature?card_id={card_id}&timestamp={timestamp}",
    getWxMemebrCardInfo:{
      u:"/api/WxMemberCard/GetWxMemebrCardInfo",
      m:"post"
    },
    // reqActiveMemberCard:{

    // }
}
// 种草
export const GrassApiList = {
    //
    get_Grass_CategoryList:"/api/Grass/Get_Grass_CategoryList?pageIndex={pageIndex}&pageSize={pageSize}&strWhere={strWhere}",
    //标签
    get_Grass_LabelList:"/api/Grass/Get_Grass_LabelList?pageIndex={pageIndex}&pageSize={pageSize}&strWhere={strWhere}",
    //商品列表
    get_Goods_List:"/api/Grass/Get_Goods_List?pageIndex={pageIndex}&pageSize={pageSize}&strWhere={strWhere}",
    //
    getGrassHomepage: "/api/Grass/GetGrassHomepage?pageIndex={pageIndex}&pageSize={pageSize}&catId={catId}&strWhere={strWhere}&orderBy={orderBy}",

    getMyFansList:"/api/Grass/GetMyFansList?pageIndex={pageIndex}&pageSize={pageSize}&strWhere={strWhere}",
  getMyFansList: "/api/Grass/GetMyFansList?pageIndex={pageIndex}&pageSize={pageSize}&strWhere={strWhere}",
  getMyFocouseList: "/api/Grass/GetMyFocouseList?pageIndex={pageIndex}&pageSize={pageSize}&strWhere={strWhere}",
  opGrassRelation: {
    u: "/api/Grass/OpGrassRelation",
    m: "post"
  },
  getMyGrassCenter: "/api/Grass/Get_My_GrassCenter",
  getFriendsGrassCenter: "/api/Grass/Get_Friends_GrassCenter?related_UserId={related_UserId}",
  getMyCollectPubList: "/api/Grass/Get_My_Collect_PubList?pageIndex={pageIndex}&pageSize={pageSize}",
  getMySharePubList: "/api/Grass/Get_My_Share_PubList?pageIndex={pageIndex}&pageSize={pageSize}",
  getFriendsSharePubList: "/api/Grass/Get_Friends_Share_PubList?pageIndex={pageIndex}&pageSize={pageSize}&related_UserId={related_UserId}",
  addCollectSharePublish: {
    u: "/api/Grass/Add_Collect_Share_Publish",
    m: "post"
  },
  removeCollectSharePublish: {
    u: "/api/Grass/Remove_Collect_Share_Publish",
    m: "post"
  },
  grass_Publish: {
      u: "/api/Grass/Grass_Publish",
      m:'post'
  },
  postClickLog: {
      u: "/api/Grass/PostClickLog",
      m:'post'
  },
  get_Grass_Publish_Info: "/api/Grass/Get_Grass_Publish_Info?pubId={pubId}",
  get_Grass_Pub_Related_Goods: "/api/Grass/Get_Grass_Pub_Related_Goods?pubId={pubId}",
  get_Grass_Pub_ReCommend_Goods: "/api/Grass/Get_Grass_Pub_ReCommend_Goods?pubId={pubId}",
  opSharePublishLike:{
      u:"/api/Grass/Op_SharePublish_Like",
      m:"post"
  },
  op_SharePubCommnet_Like:{
      u:"/api/Grass/Op_SharePubCommnet_Like",
      m:"post"
  },
  publish_Commnet:{
      u:"/api/Grass/Publish_Commnet",
      m:"post"
  },
  get_Pub_Grass_ALLCommentList: "/api/Grass/Get_Pub_Grass_ALLCommentList?pubId={pubId}&pageIndex={pageIndex}&pageSize={pageSize}", 
  delPublish:{
      u:"/api/Grass/DelPubLish",
      m:"post"
  }


}
//活动api
export const ActApiList = {
  getBuyBonusActivitList: "/api/BuyBonus/Get_BuyBonusActivitList?pageSize={pageSize}&pageIndex={pageIndex}",
  getBuyBonusActivitDetail: "/api/BuyBonus/Get_BuyBonusActivitDetail?activityId={activityId}",
  getBuyBonusOrderList: "/api/BuyBonus/Get_BuyBonusOrderList?pageSize={pageSize}&pageIndex={pageIndex}",
  createBuyBonusOrder:{
    u:"/api/BuyBonus/Create_BuyBonusOrder",
    m:"post"
  },
  getBuyBonusOrderPayStatus: "/api/BuyBonus/Get_BuyBonusOrderPayStatus?orderId={orderId}",
  activeBonusList:"/api/BuyBonus/Get_ActiveBonusList?activityId={activityId}",
  active_Order_BonusList:"/api/BuyBonus/Get_Active_Order_BonusList?orderId={orderId}",
}
//店铺支付
export const SmktPayApiList = {
    getPayCode: "/api/SmktPay/Get_OfflinePayCode",
    getOrderStatus: "/api/smktpay/Get_OfflineOrderPayStatus?paymentId={paymentId}",
    getOfflineOrderInfo: "/api/SmktPay/Get_offlineOrderInfo?pay_barcode={pay_barcode}",
    getReqPayInfoEntity: "/api/SmktPay/Get_ReqPayInfoEntity?paymentId={paymentId}",
    getOfflineCouponusList: "/api/SmktPay/Get_offline_CouponusList?bonusIds={bonusIds}&pageIndex={pageIndex}&pageSize={pageSize}",
    postOfflineJieSuanList: {
        u: "/api/SmktPay/Post_offlineJieSuanList",
        m: "post"
    },
    getOfflineOrderInfo_Entity: "/api/SmktPay/Get_offlineOrderInfo_Entity?paymentId={paymentId}",
    //看能 获得啥奖励信息 
    getOfflineCardBenefitList: "/api/SmktPay/Get_offlineCardBenefitList?paymentId={paymentId}",
    //购买获得赠送奖励信息 领取
    postOfflineOrderRewardRelease: {
        u: "/api/SmktPay/Post_offline_order_reward_release?offlineSn={offlineSn}&storeId={storeId}",
        m: "post"
    },
    //历史纪录
    getOfflineOrderInfoRecordList: "/api/SmktPay/Get_offlineOrderInfoRecordList?pageIndex={pageIndex}&pageSize={pageSize}",
    updateOfflineOrderInfoByPayInfo: {
        u: "/api/SmktPay/update_offlineOrderInfoByPayInfo",
        m: "post"
    },
    get_offlineOrderCount:"/api/SmktPay/Get_offlineOrderCount",
    cancelOfflineOrder: {
      u: "/api/SmktPay/CancelOfflineOrder",
      m: "post"
    },
    joinWxCouponActivity:{
      u: "/api/SmktPay/JoinWxCouponActivity",
      m: "post"
    }
}
export const PageApiList = {
  getCustomPageDataList: "/api/Page/GetCustomPageDataList?pageId={pageId}",
  getALLGoodsList:"/api/Page/GetALLGoodsList?catType={catType}&cateId={cateId}&pageSize={pageSize}&pageIndex={pageIndex}",
  // getALLGoodsListByGoodsIds:"/api/Page/GetALLGoodsListByGoodsIds?goodIds={goodIds}"
}
export const VoteApiList = {
  get_VoteActivityOptionList: "/api/Vote/Get_VoteActivityOptionList?voteActivityId={voteActivityId}",
  get_VoteResultList: "/api/Vote/Get_VoteResultList?voteActivityId={voteActivityId}&cookieId={cookieId}",
  post_VoteResult: {
    u: "/api/Vote/Post_VoteResult",
    m: "post"
  },
}
export const SecKillApiList = {
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
export const VideoShopApiList = {
  getVideoShoppingList: "/api/VideoShopping/GetVideoShoppingList?pageIndex={pageIndex}&pageSize={pageSize}",
  getVideoShoppingGoodsList: "/api/VideoShopping/GetVideoShoppingGoodsList?activeId={activeId}",
  getVideoShoppingProductInfo: "/api/VideoShopping/GetVideoShoppingProductInfo?activeId={activeId}&goodsId={goodsId}&colorId={colorId}&issueId={issueId}",
  getNewVideoId:"/api/VideoShopping/GetNewVideoId",
  getVideoShippingById:"/api/VideoShopping/GetVideoShippingById?activeId={activeId}",
  likeOrUnLikeVideo: {
    u: "/api/VideoShopping/LikeOrUnLikeVideo",
    m: "post"
  },
  createVideoShoppingShared: {
    u: "/api/VideoShopping/CreateVideoShoppingSharedRecord",
    m: "post"
  },
  
}
export const ElectricApiList = {
  getDefaultElectricKpInfo:"/api/Electric/GetDefaultElectricKpInfo?type={type}",
  getElectricKpInfoList:"/api/Electric/GetElectricKpInfoList?pageIndex={pageIndex}&pageSize={pageSize}",
  getElectricKpInfo:"/api/Electric/GetElectricKpInfo/{id}",
  getElectricKpTask:"/api/Electric/GetElectricKpTask/{id}",
  getElectricKpTaskList:"/api/Electric/GetElectricKpTaskList?taskStatus={taskStatus}&pageIndex={pageIndex}&pageSize={pageSize}",
  ctreateOrEdit: {
    u: "/api/Electric/CtreateOrEdit",
    m: "post"
  },
  createElectricTask: {
    u: "/api/Electric/CreateElectricTask",
    m: "post"
  },
  deleteElectricKpInfo: {
    u: "/api/Electric/DeleteElectricKpInfo",
    m: "post"
  },
}
export const UserDockApiList = {
  getUserDockList:"/api/UserDock/Get_UserDockList",
  createUserDockPool: {
    u: "/api/UserDock/Create_UserDockPool",
    m: "post"
  }
}