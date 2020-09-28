//测试api
//http://jwimtest.innourl.com/Help
//
import Conf from "../../conf.js"
const VISIT_APICONF = {
  "1": "/InnoLogApi",
  "2": "/VisitLogApi",
  "3": "",
  "4": "",
}
const BARCODE_APICONF = {
  "1": "",
  "2": "/BarCodeApi",
  "3": "",
  "4": ""
}
const visitApi = Conf.visitApiType ? VISIT_APICONF[Conf.visitApiType] : VISIT_APICONF[1];
const barCodeApi = Conf.barCodeApiType ? BARCODE_APICONF[Conf.barCodeApiType] : BARCODE_APICONF[1];
/**分域名**/
export const GoodsApiList = {
    canUseCouponByJieSuan:{
      u:"/api/Goods/Post_CanUseCouponByJieSuan",
      a:"post"
    },
    /**
     * 评论
     */
    //线上商品评论列表
    getGoodsCommentListOnline: "/api/GoodComment/Get_Goods_CommentList_Online?goodsId={goodsId}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    //线上商品评论明细
    getOnlineOrderCommentDetail: "/api/GoodComment/Get_Online_Order_Comment_Detail?orderId={orderId}&brandCode={brandCode}",
    //评论线上订单
    commentOnlineOrder: {
        u: "/api/GoodComment/CommentOnlineOrder",
        a: "post"
    },
    //评论线上商品明细
    commentOnlineOrderGoods: {
        u: "/api/GoodComment/CommentOnlineOrderGoods",
        a: "post"
    },
    //评论线下商品明细
    commentOfflineOrderGoods: {
        u: "/api/GoodComment/CommentOfflineOrderGoods",
        a: "post"
    },
    //结算页选择优惠券
    useBonusList: "/api/Coupon/Get_BonusList?userToken={userToken}&bonus_ids={bonus_ids}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    //
    getMyCommentList: "/api/GoodComment/Get_MyCommentList?userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    getMyCommentDetail: "/api/GoodComment/Get_MyCommentDetail?userToken={userToken}&orderId={orderId}&goodsId={goodsId}&isOnlineOrder={isOnlineOrder}&brandCode={brandCode}",
    getOfflineOrderCommentDetail: "/api/GoodComment/Get_Offline_Order_Comment_Detail?orderSn={orderSn}&brandCode={brandCode}",
    commentOfflineOrder: {
        u: "/api/GoodComment/CommentOfflineOrder",
        a: "post"
    },

    /**
     * 足迹
     */
    addGoodsVisitLog: {
        u: "/api/GoodExtend/Op_GoodsVisitLog",
        a: "post"
    },
    getGoodsVisitLogList: "/api/GoodExtend/Get_GoodsVisitLog_List?userToken={userToken}&brandCode={brandCode}&pageIndex={pageIndex}&pageSize={pageSize}",

    /**
     * 收藏
     */
    addFavGoodsLog: {
        u: "/api/GoodExtend/Add_Fav_Goods_Log",
        a: "post"
    },
    delFavGoodsLog: {
        u: "/api/GoodExtend/Del_Fav_Goods_Log",
        a: "post"
    },
    getFavLogList: "/api/GoodExtend/Get_Fav_LogList?userToken={userToken}&brandCode={brandCode}&pageIndex={pageIndex}&pageSize={pageSize}",

    /**
     * 商品
     */
    //自定义
    getCustomPagesList: "/api/Goods/Get_Custom_Pages_List?param={param}&pageType={pageType}&brandCode={brandCode}&userToken={userToken}",
    getPageDataById: "/api/Goods/GetHomePageDataList?pageId={pageId}&userToken={userToken}&brandCode={brandCode}",
    //自定义商品类目
    getCustomCategoryList: "/api/Goods/Get_CustomCategoryList?pageId={pageId}&userToken={userToken}&brandCode={brandCode}",

    //Goods
    getAppCatalogList: "/api/Goods/Get_AppCatalogList?brandCode={brandCode}",
    getSumaryALLGoodsList: "/api/Goods/Get_Sumary_ALLGoodsList?functype={functype}&cate_Id={cate_Id}&strWhere={strWhere}&pageSize={pageSize}&pageIndex={pageIndex}&sort_field={sort_field}&sort_by={sort_by}&goods_brand_ids={goods_brand_ids}&userToken={userToken}&brandCode={brandCode}",
    getSumaryGoodsDetailData: "/api/Goods/Get_Sumary_GoodsDetailData?goodsId={goodsId}&productId={productId}&colorId={colorId}&userToken={userToken}&issue_id={issue_id}&brandCode={brandCode}",
    getSumaryGoodsProductInfo: "/api/Goods/Get_Sumary_GoodsProductInfo?goodsId={goodsId}&colorId={colorId}&userToken={userToken}&brandCode={brandCode}&issueId={issueId}",
    getSumaryGoodsProductInfoByShippingStore:"/api/Goods/Get_Sumary_GoodsProductInfoByShippingStore?goodsId={goodsId}&storeId={storeId}&userToken={userToken}&brandCode={brandCode}",
    getGoodsDefaultImage: "/api/Goods/GetGoodsDefaultImage?goodsId={goodsId}&brandCode={brandCode}",
    getGoodsPropertyList: "/api/Goods/Get_GoodsPropertyList?functype={functype}&catId={catId}&strWhere={strWhere}&brandCode={brandCode}",
    searchGoodsList: "/api/Goods/Get_Sumary_SearchGoodsList?functype={functype}&catId={catId}&strAttrId={strAttrId}&strAttrValue={strAttrValue}&colorCatId={colorCatId}&startPrice={startPrice}&endPrice={endPrice}&strWhere={strWhere}&pageSize={pageSize}&pageIndex={pageIndex}&sortField={sortField}&sortBy={sortBy}&brandCode={brandCode}&userToken={userToken}&goods_brand_ids={goods_brand_ids}&storeId={storeId}",
    
    get_GoodsPackageList: "/api/GoodsPackage/Get_GoodsPackageList?goodsId={goodsId}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    get_GoodsPackageInfo:"/api/GoodsPackage/Get_GoodsPackageInfo?packageId={packageId}&brandCode={brandCode}",
    get_GoodsPackageProductInfo:"/api/GoodsPackage/Get_GoodsPackageProductInfo?packageId={packageId}&goodsId={goodsId}&brandCode={brandCode}",
    post_GoodsPackageAddBuyCar:{
        u: "/api/GoodsPackage/Post_GoodsPackageAddBuyCar",
        a: "post"
    },

    //购物车
    createBuyCarInsert: {
        u: "/api/Goods/Create_BuyCar_Insert",
        a: "post"
    },
    getBuyCarGoodList: "/api/Goods/GetBuyCarGood_List?userToken={userToken}&brandCode={brandCode}",
    getCartStoageCount: "/api/Goods/GetCartStoage_Count?userToken={userToken}&brandCode={brandCode}",
    addCartStroageNum: {
        u: "/api/Goods/Add_CartStroage_Num",
        a: "post"
    },
    subtractCartStroageNum: {
        u: "/api/Goods/Subtract_CartStroage_Num",
        a: "post"
    },
    delCartStroage: {
        u: "/api/Goods/Del_CartStroage",
        a: "post"
    },
    //促销信息
    getPromotionInfo: "/api/Goods/GetPromotionInfo?userToken={userToken}&recIds={recIds}&brandCode={brandCode}",
    getGoodsPromotionRuleList:"/api/Goods/GetGoodsPromotionRuleList?userToken={userToken}&brandCode={brandCode}&goodsId={goodsId}",
    //加价购
    getGroupSaleGoodsList: "/api/Goods/GetGroupSaleGoodsList?goodsId={goodsId}&recId={recId}&activityId={activityId}&userToken={userToken}&brandCode={brandCode}",
    //结算
    postJieSuanListByStore: {
        u: "/api/Goods/Post_JieSuanListByStore",
        a: "post"
    },
    genterBuyCarByMwin: {
      u: "/api/Goods/GenterBuyCarByMwin",
      a: "post"
    },
    //商品服务
    getGoodsServices: "/api/Goods/Get_GoodsServices?goodsId={goodsId}&brandCode={brandCode}",
    //商品搭配
    getMatchLinkGoodList: "/api/Goods/Get_MatchLinkGoodList?goodsId={goodsId}&userToken={userToken}&brandCode={brandCode}",

    /**
     * 秒杀
     */
    //秒杀 
    seckillGetGoodsList: "/api/SecKill/GetSecKillActive?issueId={issueId}&brandCode={brandCode}",
    //分销提成
    getGoodsCommissionAmount: "/api/goods/Get_GoodsCommissionAmount?goodsId={goodsId}&brandCode={brandCode}&userToken={userToken}",
    getGoodsCommissionAmountByType: "/api/goods/Get_GoodsCommissionAmountByType?goodsId={goodsId}&brandCode={brandCode}&userToken={userToken}&goodsType={goodsType}&relatedId={relatedId}", //goodsType = COLLAGEGROUP(拼团) , PRESALE(预售) , NORMAL(正常商品) , SKILL(秒杀),POINTMKT(积分商城)

    /**
     * 代客下单
    */
    orderForCustom:{
      u: "/api/GOODS/OrderForCustom",
      a:"post"
    },
    getGoodsPromotionInfo:"/api/Goods/GetGoodsPromotionInfo?userToken={userToken}&goodsId={goodsId}&brandCode={brandCode}",
    getPromotionGoodsList:"/api/Goods/GetPromotionGoodsList?userToken={userToken}&ruleId={ruleId}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    getSeckillGoodList:"/api/Goods/GetSeckillGoodList?issueId={issueId}&pageIndex={pageIndex}&pageSize={pageSize}&goodsIds={goodsIds}&brandCode={brandCode}&platformSrc={platformSrc}",
    getHomePageDataScriptList: "/api/Goods/GetHomePageDataScriptList?pageId={pageId}&userToken={userToken}&brandCode={brandCode}",
    getALLGoodsListByGoodsIds: "/api/Page/GetALLGoodsListByGoodsIds?userToken={userToken}&goodIds={goodIds}&brandCode={brandCode}",
    get_recommend_template_List:"/api/Goods/Get_recommend_template_List?goodsId={goodsId}&brandCode={brandCode}",
    //店铺 by goodsId
  	getShippingStoreList: "/api/Store/Get_Shipping_Store_List?goodsId={goodsId}&searchName={searchName}&pageIndex={pageIndex}&pageSize={pageSize}&lat={lat}&lon={lon}&brandCode={brandCode}&goodsNum={goodsNum}",
    getShippingStoreListByCartId: "/api/Store/Get_Shipping_Store_ListByCartId?recId={recId}&userToken={userToken}&searchName={searchName}&pageIndex={pageIndex}&pageSize={pageSize}&lat={lat}&lon={lon}&brandCode={brandCode}",
    // changeCartStorageShippingWay: {
    //   u:"/api/Goods/ChangeCartStorageShippingWay",
    //   a:"post"
    // },
    //领券模块
    getGoodsReceiveBonusActivity:"/api/GoodExtend/GetGoodsReceiveBonusActivity?goodsId={goodsId}&brandCode={brandCode}",
    getGoodsReceiveBonusActivityDetail:"/api/GoodExtend/GetGoodsReceiveBonusActivityDetail?userToken={userToken}&goodsId={goodsId}&activityId={activityId}&brandCode={brandCode}",
    receiveBonusFromGoods:{
      u:"/api/GoodExtend/ReceiveBonusFromGoods",
      a:"post"
    },
    checkJieSuanCartstorage:"/api/Goods/CheckJieSuanCartstorage?recIds={recIds}&brandCode={brandCode}",
    countPromotionInfoByJieSuan:{
      u:"/api/Goods/CountPromotionInfoByJieSuan",
      a:"post"
    },
    getGoodsActivityPrice: "/api/Goods/Get_GoodsActivityPrice?goodsId={goodsId}&userToken={userToken}&brandCode={brandCode}",
    goodsCategoryStyle: "/api/GoodsCategoryStyle/GetCategoryList?brandCode={brandCode}",
    getShoppingAds: "/api/Goods/Get_shopping_recommend_template_List?brandCode={brandCode}",
    limit_page_show_assembly: "/api/Page/Get_moto_limit_page_show_assembly?path={path}&assembly_type={assembly_type}&brandCode={brandCode}",
    goodsSearchStyle:"/api/GoodsSearchStyle/GetStyle?brandCode={brandCode}",
    get_Goods_Param_Attr_List:"/api/Goods/Get_Goods_Param_Attr_List?goodsId={goodsId}&brandCode={brandCode}",
    getGoodsDetailVideoShopinggList:"/api/VideoShopping/GetGoodsDetailVideoShopingList?goodsId={goodsId}&brandCode={brandCode}",
    getPopupAdvert: "/api/PopupAdvert/GetPopupAdvert?userToken={userToken}&pageId={pageId}&isIndex={isIndex}&brandCode={brandCode}",
    getGoodsIdByScan:"/api/Goods//GetGoodsIdByScan?sku={sku}&brandCode={brandCode}",
    getGoodsScanInfo:"/api/Goods//GetGoodsScanInfo?searchVal={searchVal}&brandCode={brandCode}",
}


export const BuyApiList = {
    /**
     * Order
     */
    canUseCouponByJieSuan:{
      u:"/api/Goods/Post_CanUseCouponByJieSuan",
      a:"post"
    },
    //下单
    addNewOrderInfo: {
        u: "/api/Order/Add_New_OrderInfo",
        a: "post"
    },
    //订单
    //普通订单列表
    getAPPVariousTypeOrderList: "/api/Order/Get_APPVariousTypeOrderList?userToken={userToken}&orderType={orderType}&orderKind={orderKind}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}&searchStr={searchStr}",
    //第三方订单
    getExAPPVariousTypeOrderList: "/api/Order/Get_Ex_APPVariousTypeOrderList?userToken={userToken}&orderType={orderType}&orderKind={orderKind}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    //店铺订单
    getStoreOrderList: "/api/Order/Get_StoreOrderList?userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    getStoreOnlineOrderList: "/api/Order/Get_StoreOnlineOrderList?userId={userId}&pageIndex={pageIndex}&pageSize={pageSize}&brandId={brandId}",
    //店铺订单详情
    getStoreOrderDetail: "/api/Order/Get_StoreOrderDetail?orderSn={orderSn}&brandCode={brandCode}",
    //订单明细
    getALLOrderEntity: "/api/Order/Get_ALLOrderEntity?orderId={orderId}&brandCode={brandCode}&userToken={userToken}",
    //订单原因
    getOrderCancelReasonList: "/api/Order/Get_OrderCancelReasonList",
    //确认订单
    confirmGetGoods: {
        u: "/api/Order/ConfirmGetGoods",
        a: "post"
    },
    Get_WuLiuUrl: {
        u: "/api/order/Get_WuLiuUrl?invoiceNo={invoiceNo}"
    },
    getOrderPayStatus: "/api/Order/GetOrderPayStatus?userToken={userToken}&orderId={orderId}&brandCode={brandCode}",
    //取消原因
    getOrderCancelReasonList: "/api/Order/Get_OrderCancelReasonList?brandCode={brandCode}",
    //申请取消订单
    cancelOrApplyCancelOrder: {
        u: "/api/Order/CancelOrApplyCancelOrder",
        a: "post"
    },
    //退换货
    getTuiHuanHuoDetailList: "/api/Order/Get_TuiHuanHuoDetailList?returnId={returnId}&userToken={userToken}&brandCode={brandCode}",
    createReshipOrder: {
        u: "/api/Order/Create_Reship_Order",
        a: "post"
    },
    createBatchReshipOrder: {
        u: "/api/Order/Create_BatchReship_Order",
        a: "post"
    },
    //退换货原因
    getOrderReturnReasonList: "/api/Brand/Get_Order_Return_ReasonList?brandCode={brandCode}",
    updateReturnOrderShippingNo: {
        u: "/api/order/Update_ReturnOrderShippingNo",
        a: "post"
    },
    //换货接口
    createExchangeReshipOrder:{
      u:"/api/Order/Create_ExchangeReship_Order",
      a:"post"
    },
    //查看物流
    getWuLiuInfo: "/api/Order/GetWuLiuInfo?invoiceNo={invoiceNo}",
    getOrderShippingInfo:"/api/Order/GetOrderShippingInfo?userToken={userToken}&orderId={orderId}&invoiceNo={invoiceNo}&isBackground={isBackground}&isForce={isForce}&brandCode={brandCode}",
    getInvoiceList:"/api/Order/GetInvoiceList?orderId={orderId}&brandCode={brandCode}",

    //商品操作接口
    //购物车
    createBuyCarInsert: {
        u: "/api/Goods/Create_BuyCar_Insert",
        a: "post"
    },
    getBuyCarGoodList: "/api/Goods/GetBuyCarGood_List?userToken={userToken}&brandCode={brandCode}",
    getCartStoageCount: "/api/Goods/GetCartStoage_Count?userToken={userToken}&brandCode={brandCode}",
    addCartStroageNum: {
        u: "/api/Goods/Add_CartStroage_Num",
        a: "post"
    },
    subtractCartStroageNum: {
        u: "/api/Goods/Subtract_CartStroage_Num",
        a: "post"
    },
    delCartStroage: {
        u: "/api/Goods/Del_CartStroage",
        a: "post"
    },
    //促销信息
    getPromotionInfo: "/api/Goods/GetPromotionInfo?userToken={userToken}&recIds={recIds}&brandCode={brandCode}",
    //加价购
    getGroupSaleGoodsList: "/api/Goods/GetGroupSaleGoodsList?goodsId={goodsId}&recId={recId}&activityId={activityId}&userToken={userToken}&brandCode={brandCode}",
    //结算
    postJieSuanListByStore: {
        u: "/api/Goods/Post_JieSuanListByStore",
        a: "post"
    },
    get_Valet_OrderList:"/api/Order/Get_Valet_OrderList?userToken={userToken}&orderType={orderType}&orderKind={orderKind}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}&searchStr={searchStr}",
    get_Valet_Ex_APPVariousTypeOrderList:"/api/Order/Get_Valet_Ex_APPVariousTypeOrderList?userToken={userToken}&orderType={orderType}&orderKind={orderKind}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    cancelOneGood:{
      u:"/api/Order/CancelOrApplyCancelOrderByOneGood",
      a:"post"
    },
    update_OrderAddress:{
      u:"/api/Order/Update_OrderAddress",
      a:"post"
    },
    oneMoreOrder:{
      u:"/api/Order/OneMoreOrder",
      a:"post"
    },
    /*延迟收货*/
    extendOrderReceiptTime:{
      u:"/api/Order/ExtendOrderReceiptTime",
      a:"post"
    },
    getShoppingCartList:"/api/Goods/GetShoppingCartList?userToken={userToken}&brandCode={brandCode}",
    changeCartStorageShippingWay: {
      u:"/api/Goods/ChangeCartStorageShippingWay",
      a:"post"
    }
}

export const LiveApiList = {
  getLiveRoomList: "/api/LiveShow/GetLiveRoomList?brandCode={brandCode}&pageIndex={pageIndex}&pageSize={pageSize}",
  getLiveShareAct: "/api/LiveShow/GetLiveRoomShareActivityDetaill?activityId={activityId}&userToken={userToken}&brandCode={brandCode}",
  getLiveActVisitRecord:"/api/LiveShow/GetLiveRoomShareActivityVisitRecord?activityId={activityId}&userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
  GetNextLiveRoom:"/api/LiveShow/GetNextLiveRoom?brandCode={brandCode}",
  GetLiveRoomDetail:"/api/LiveShow/GetLiveRoomDetail?id={id}&brandCode={brandCode}",
  postLiveActVisitRecord:{
    u:"/api/LiveShow/PostLiveShowShareActivityVisitRecord",
    a:"post"
  }
}

export const PayApiList = {
    getAppletPrepayId: "/api/pay/weixin3.36/getAppletPrepayId_kingking.php?order_id={order_id}&pay_type={pay_type}",
}
//-----拼团
export const CollageApiList = {
    //**
    //*拼团 
    //**
    //活动列表
    getCollageGroupActivityList: '/api/CollageGroup/Get_CollageGroupActivityList?pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}',
    //活动详情
    getCollageGroupActivityDetail: '/api/CollageGroup/Get_CollageGroupActivityDetail?activityId={activityId}&brandCode={brandCode}',
    //参与活动记录
    getCollageGroupJoinList: '/api/CollageGroup/Get_ALLowJoinGroupGoodActivityList?activityId={activityId}&userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}',
    //获取参与活动订单列表
    getUserCollageGroupOrderList: "/api/CollageGroup/Get_UserCollageGroupOrderList?userToken={userToken}&status={status}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    //
    getUserJoingGroupGoodActivityList: "/api/CollageGroup/Get_UserJoingGroupGoodActivityList?userActivityId={userActivityId}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    //拼团详情
    getUserCollageDetail: "/api/CollageGroup/Get_UserCollageDetail?userId={userId}&userToken={userToken}&activityId={activityId}&userActivityId={userActivityId}&brandCode={brandCode}",
    //拼团结算详情
    getCollageGroupSettlementList: "/api/CollageGroup/Get_CollageGroupSettlementList?userToken={userToken}&activityId={activityId}&userActivityId={userActivityId}&addressId={addressId}&goodsId={goodsId}&productId={productId}&productNum={productNum}&brandCode={brandCode}",
    //拼团下单
    collageGroupAddOrder: {
        u: "/api/CollageGroup/Post_CollageGroupAddOrder",
        a: "post"
    },
    //拼团订单支付状态查询
    getCollageGroupOrderPayStatus: "/api/CollageGroup/Get_CollageGroupOrderPayStatus?userToken={userToken}&orderId={orderId}&brandCode={brandCode}",
    //
    getCollageGroupGoodsDetail: "/api/CollageGroup/Get_CollageGroupGoodsDetail?userToken={userToken}&activityId={activityId}&userActivityId={userActivityId}&goodsId={goodsId}&colorId={colorId}&sizeId={sizeId}&brandCode={brandCode}",
    //检测数量
    checkProductNumber: "/api/CollageGroup/CheckProductNumber?activityId={activityId}&goodsId={goodsId}&productId={productId}&productNum={productNum}&brandCode={brandCode}",
    getCollageGroupGoodsList:"/api/CollageGroup/Get_CollageGroupGoodsList?pageSize={pageSize}&pageIndex={pageIndex}&activityIds={activityIds}&brandCode={brandCode}"
}

export const MainApiList = {
  
}
//预售
export const PreSaleApiList = {
    getPresaleGoodsList: "/api/Presale/GetPresaleGoodsList?pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}&activityIds={activityIds}",
    getPresaleGoodsDetail: "/api/Presale/GetPresaleGoodsDetail?activityId={activityId}&brandCode={brandCode}",
    getPresaleGoodsProductList: "/api/Presale/GetPresaleGoodsProductList?activityId={activityId}&brandCode={brandCode}",
    getPreOrderInfoList: "/api/Presale/Get_PreOrderInfoList?userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    getPresaleDepositSettlementPage:"/api/Presale/GetPresaleDepositSettlementPage?userToken={userToken}&activityId={activityId}&activityGoodsId={activityGoodsId}&goodsNumber={goodsNumber}&bonusId={bonusId}&isUsedPoint={isUsedPoint}&brandCode={brandCode}",
    postAddPresaleOrder: {
        u: "/api/Presale/PostAddPresaleOrder",
        a: "post"
    },
    getPresaleOrderDetail: "/api/Presale/GetPresaleOrderDetail?userToken={userToken}&preOrderId={preOrderId}&bonusId={bonusId}&isUsedPoint={isUsedPoint}&brandCode={brandCode}",
    cancelPresaleOrder: {
        u: "/api/Presale/CancelPresaleOrder",
        a: "post"
    },
    presaleOrderDetailUsePointCoupon: {
        u: "/api/Presale/PresaleOrderDetailUsePointCoupon",
        a:"post"
    },
    lockPreOrderByPay: {
        u: "/api/Presale/LockPreOrderByPay",
        a:"post"
    },
    logThePresaleDetail:{
        u:"/api/Presale/LogThePresaleDetail",
        a:"post"
    },
    getPreSalePayStatus:"/api/Presale/GetPreSalePayStatus?preOrderId={preOrderId}&payKind={payKind}&brandCode={brandCode}"
}
//----积分商城
export const PointApiList = {
    getPointMkBonusListByMain: "/api/PointMk/GetPointMkBonusListByMain?userToken={userToken}&brandCode={brandCode}",
    getPointMkGoodsListMain: "/api/PointMk/GetPointMkGoodsListMain?userToken={userToken}&brandCode={brandCode}",
    getPointMkBonusList: "/api/PointMk/GetPointMkBonusList?pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    getPointMkGoodsList: "/api/PointMk/GetPointMkGoodsList?pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}&activityIds={activityIds}",
    getPointMkBonusDetail: "/api/PointMk/GetPointMkBonusDetail?mkBonusId={mkBonusId}&userToken={userToken}&brandCode={brandCode}",
    getPointMkGoodsDetail: "/api/PointMk/GetPointMkGoodsDetail?mkGoodsId={mkGoodsId}&goodsId={goodsId}&userToken={userToken}&brandCode={brandCode}",
    checkBuyPointMkGoods: "/api/PointMk/CheckBuyPointMkGoods?mkGoodsId={mkGoodsId}&userToken={userToken}&brandCode={brandCode}",
    checkExchangeBonus: "/api/PointMk/CheckExchangeBonus?mkBonusId={mkBonusId}&userToken={userToken}&brandCode={brandCode}",
    exchangeBonus: {
        u: "/api/PointMk/ExchangeBonus",
        a: "post"
    },
    pointMkGoodsCheckout: {
        u: "/api/PointMk/PointMkGoodsCheckout",
        a: "post"
    },
    PointMkGoodAddOrder: {
        u: "/api/PointMk/PointMkGoodAddOrder",
        a: "post"
    },
    GetMkOrderPayStatus: "/api/PointMk/GetMkOrderPayStatus?orderSn={orderSn}&brandCode={brandCode}",
    GetExchangeLogList: "/api/PointMk/GetExchangeLogList?userToken={userToken}&brandCode={brandCode}&pageIndex={pageIndex}&pageSize={pageSize}",
    cancelPointMkGoodOrder: {
        u: "/api/PointMk/CancelPointMkGoodOrder",
        a: "post"
    },
    getPointMkGoodOrderDetail: "/api/PointMk/GetPointMkGoodOrderDetail?mkOrderId={mkOrderId}&brandCode={brandCode}"

}

// 砍价
export const BargainApiList = {
    getHagglePriceActivityList: "/api/HagglePrice/Get_HagglePriceActivityList?userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}&activityIds={activityIds}",
    getUserHagglePriceActivityList: "/api/HagglePrice/Get_UserHagglePriceActivityList?userToken={userToken}&status={status}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    getHagglePriceActivityDetail: "/api/HagglePrice/Get_HagglePriceActivityDetail?userToken={userToken}&activityId={activityId}&brandCode={brandCode}",
    getHagglePriceActivityGoodsDetail: "/api/HagglePrice/Get_HagglePriceActivityGoodsDetail?activityId={activityId}&brandCode={brandCode}",
    createUserHagglePriceActivity: {
        u: "/api/HagglePrice/Create_UserHagglePriceActivity",
        a: "post"
    },
    getUserHagglePriceActivityDetail: "/api/HagglePrice/Get_UserHagglePriceActivityDetail?userToken={userToken}&userActivityId={userActivityId}&brandCode={brandCode}",
    postUserHagglePrice: {
        u: "/api/HagglePrice/Post_UserHagglePrice",
        a: "post"
    },
getUserHagglePriceActivityDetailRecord:"/api/HagglePrice/Get_UserHagglePriceActivityDetailRecord?userActivityId={userActivityId}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    getUserHagglePriceSettlementPage: "/api/HagglePrice/Get_UserHagglePriceSettlementPage?userToken={userToken}&userActivityId={userActivityId}&addressId={addressId}&brandCode={brandCode}",
    postHagglePriceAddOrder: {
        u: "/api/HagglePrice/Post_HagglePriceAddOrder",
        a: "post"
    },
    getUserHagglePriceOrderDetail: "/api/HagglePrice/Get_UserHagglePriceOrderDetail?userToken={userToken}&userActivityId={userActivityId}&brandCode={brandCode}",
    getTpls:{
      u:"/api/WxMsg/GetTpls",
      a:"post"
    },
    setSubscribe:{
      u:"/api/WxMsg/SetSubscribe",
      a:"post"
    },
    get_HagglePricePayStatus:"/api/HagglePrice/Get_HagglePricePayStatus?orderId={orderId}&brandCode={brandCode}"
}


export const UserApiList = {

    /**
     * 优惠券
     */
    postUserReceiveBonus: {
        u: "/api/Coupon/Post_UserReceiveBonus",
        a: "post"
    },
    getBalanceCheckCoupon: "/api/Coupon/Get_BalanceCheck_Coupon?couponCode={couponCode}&brandCode={brandCode}",
    receiveSharedCoupon: {
        u: "/api/Coupon/Receive_SharedCoupon",
        a: "post"
    },
    BeginSharingCoupon: {
        u: "/api/Coupon/BeginSharingCoupon",
        a: "post"
    },
    getSharingCoupon: "/api/Coupon/Get_SharingCoupon?bonusId={bonusId}&fromUserToken={fromUserToken}&brandCode={brandCode}",
    getBalanceCheckCoupon: "/api/Coupon/Get_BalanceCheck_Coupon?couponCode={couponCode}&brandCode={brandCode}",

    /**
     * SMS
     */
    //发送验证码
    sendMsg: {
        u: "/api/SMS/Send_SMSWithUserId",
        a: "post"
    },
    /**/
    changeModifyPwd: {
        u: "/api/User/ModifyPwd",
        a: "post"
    },
    sendSmsForValetOrder:{
      u:"/api/SMS/SendSmsForValetOrder",
      a:"post"
    },
    checkValetOrderSms:{
      u:"/api/SMS/CheckValetOrderSms",
      a:"post"
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
        a: "post"
    },
    updateAddress: {
        u: "/api/UserAddress/UpdateUserAddress",
        a: "post"
    },
    deleteAddress: {
        u: "/api/UserAddress/DeleteUserAddress",
        a: "post"
    },
    setAddressDefault: {
        u: "/api/UserAddress/UpdateUserAddressDefault",
        a: "post"
    },
    bindWxAddress: {
        u: "/api/UserAddress/BindWxAddress",
        a: "post"
    },
    /**
     * User
     */
    updatePortraitPath:{
      u: "/api/user/Update_PortraitPath",
      a: "post"
    } ,
    getUserInfoWap: "/api/User/GetUserInfo_Wap?userToken={userToken}&brandCode={brandCode}",
    //积分
    getUserPointAmount:"/api/User/GetUserPointAmount?userToken={userToken}&brandCode={brandCode}",
    //积分列表
    pointList: "/api/User/Get_PointList?userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    //用户积分
    userBalacePoint: "/api/User/Get_User_Balance_Point?userToken={userToken}&brandCode={brandCode}",
    //优惠券
    getBonusList: "/api/User/Get_MemberInfo_BonusList?userToken={userToken}&type={type}&page_num={page_num}&sort={sort}&brandCode={brandCode}",
    writeOffCoupon: { 
        u: "/api/Coupon/WriteOffCoupon",
        a:"post"
    },
    //储值卡
    getUserStoredValueAmount:"/api/User/GetUserStoredValueAmount?userToken={userToken}&brandCode={brandCode}",
    getPrePaidCardList: "/api/User/Get_UserPrepaidCardList?userToken={userToken}&storeId={storeId}&prepaidCards={prepaidCards}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    //个人资料
    getUserBaseInfo: "/api/User/GetUserBaseInfo?userToken={userToken}&brandCode={brandCode}",
    //个人资料带自定义字段
    getUserExtendInfo: "/api/User/Get_UserExtendInfo?userToken={userToken}&brandCode={brandCode}",
    //保存个人资料
    completeUserInfo: {
        u: "/api/User/CompleteUserInfo",
        a: "post"
    },
    //更改手机
    changeMobile: {
        u: "/api/User/ChangeMobile",
        a: "post"
    },
    //绑定手机
    bindMobile: {
        u: "/api/User/SystemWeiXin_BindMobile",
        a: "post"
    },
    changeWxPhone:{
      u:"/api/user/ChangeWxPhone",
      a: "post"
    },
    //合并资料
    sysTransferUserInfo: {
        u: "/api/User/SysTransferUserInfo",
        a: "post"
    },
    //三级地区
    getAllRegionList: "/api/UserAddress/Get_AllRegionList",
    //检测绑定手机
    checkUserBindPhone: "/api/User/CheckUserBindPhone?userToken={userToken}&brandCode={brandCode}",
    //检测是否绑定公众号
    checkUserSubscribeWechat: "/api/User/CheckUserSubscribeWechat?userToken={userToken}&brandCode={brandCode}",
    //派样机
    getPickupCode: "/api/SampleMachine/GetPickupCode?userToken={userToken}&brandCode={brandCode}",
    refreshPickupCode: "/api/SampleMachine/RefreshPickupCode?userToken={userToken}&brandCode={brandCode}",
    getBindStoreList: "/api/SampleMachine/GetBindStoreList?userToken={userToken}&brandCode={brandCode}&pageIndex={pageIndex}&pageSize={pageSize}&searchStr={searchStr}",
    //会员卡信息
    getUserCardInfo: "/api/User/Get_UserCardInfo?userToken={userToken}&brandCode={brandCode}",
    getUserSimpleInfo: "/api/User/Get_UserSimpleInfo?userToken={userToken}&brandCode={brandCode}",
    getCrossOrderUserInfo:"/api/Order/Get_Cross_Order_UserInfo?userToken={userToken}&brandCode={brandCode}",
    //签到
    getAppSign: "/api/SignIn/Get_AppSign?userToken={userToken}&brandCode={brandCode}",
    createAppSign: {
      u: "/api/SignIn/Create_AppSign",
      a: "post"
    },
    getSignRecord: "/api/signin/Get_UserSignRecord?userToken={userToken}&brandCode={brandCode}&beginDate={beginDate}&endDate={endDate}",
    
    getUserStoredValueInfo: "/api/StoredValue/Get_UserStoredValueInfo?userToken={userToken}&brandCode={brandCode}",
    getUserStoredValueCaptcha: "/api/StoredValue/Get_UserStoredValueCaptcha?userToken={userToken}&brandCode={brandCode}",
    getStoredValueActivity: "/api/StoredValue/Get_StoredValueActivity?userToken={userToken}&activityId={activityId}&brandCode={brandCode}",
    createStoredValueCardOrder: {
        u: "/api/StoredValue/CreateStoredValueCardOrder",
        a: "post"
    },
    getUserStoredValueFlowList: "/api/StoredValue/Get_UserStoredValueFlowList?userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    //判断该用户是否为店员导购
    getStoreStaffInfo: "/api/StoreStaff/GetStoreStaffInfo?userToken={userToken}&brandCode={brandCode}",
    getWxCodeForWap:{
      u: "/api/WXBarCode/GetWxCodeForWap",
      a:"post"
    },
    //获取导购配置的背景
    getStoreStaffBar: "/api/StoreStaff/GetStoreStaffBarcodeBackground?brandCode={brandCode}",
    //获取会员所属店铺
    getMemeberBelongStore:"/api/Store/getMemeberBelongStore?lat={lat}&lon={lon}&isUseLocation={isUseLocation}&userToken={userToken}&brandCode={brandCode}",
    //选择店铺导购
    getCustomerServiceInfo:"/api/StoreStaff/GetCustomerServiceInfo?storeId={storeId}&staffId={staffId}&lat={lat}&lon={lon}&brandCode={brandCode}&isStore={isStore}",
	  /**
     * 协议
    */
    getUserAgreementArticle: "/api/User/Get_User_Agreement_Article?articleId={articleId}&brandCode={brandCode}",
    getUserAgreement: "/api/User/Get_User_Agreement?brandCode={brandCode}&agreementType={agreementType}",
    checkIsUserAgreement: "/api/User/CheckIsUserAgreement?brandCode={brandCode}&agreementType={agreementType}",
    checkUserIsCompleteInfo:"/api/User/CheckUserIsCompleteInfo?brandCode={brandCode}&userToken={userToken}",
    /**
     * 
    */
    searchUserInfo:"/api/User/SearchUserInfo?mobilePhone={mobilePhone}&brandCode={brandCode}",
    get_UserExpirePoint:"/api/UserPoint/Get_UserExpirePoint?userToken={userToken}&brandCode={brandCode}",
    getAccountChangeList:"/api/User/Get_AccountChangeList?userToken={userToken}&brandCode={brandCode}&pageIndex={pageIndex}&pageSize={pageSize}",
    storedValueCard:{
      u: "/api/StoredValue/ExchangeStoredValueCard",
      a:"post"
    },
    /***/
    getCustomPageShareActivity: "/api/Page/Get_CustomPageShareActivity?pageId={pageId}&userToken={userToken}&brandCode={brandCode}",
    getPayCode: "/api/User/GetPayCode?userToken={userToken}&brandCode={brandCode}",
    refreshPayCode: "/api/User/RefreshPayCode?userToken={userToken}&brandCode={brandCode}",
    //绑定导购
    bindFromStaffId:{
      u:"/api/StoreStaff/BindFromStaffId",
      a:"post"
    },
    getUserBarcodeBackground:"/api/User/GetUserBarcodeBackground?brandCode={brandCode}",
    /*更改所属店铺*/
    bindFromStore:{
      u:"/api/store/BindFromStore",
      a:"post"
    },
    getUserRedpackList:"/api/Redpack/GetUserRedpackList?userToken={userToken}&type={type}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    getUserDockList:"/api/UserDock/Get_UserDockList?userToken={userToken}&brandCode={brandCode}",
    createUserDockPool: {
      u: "/api/UserDock/Create_UserDockPool",
      a: "post"
    }
}
export const LotteryApiList = {
    lotteryActivitDetail: "/api/Lottery/Get_LotteryActivitDetail?userToken={userToken}&activityId={activityId}&brandCode={brandCode}",
    lotteryWinningRecord: "/api/Lottery/Get_LotteryActivityWinningRecord?activityId={activityId}&brandCode={brandCode}",
    userLotteryWinningRecord: "/api/Lottery/Get_UserLotteryActivityWinningRecord?userToken={userToken}&activityId={activityId}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    getLotteryResult: {
      u: "/api/Lottery/Post_GetLotteryResult",
      a: "post"
    },
    receivePrize: {
      u: "/api/Lottery/Post_ReceivePrize",
      a: "post"
    },
    lotteryWinningRecordDetail: "/api/Lottery/Get_LotteryWinningRecordDetail?userToken={userToken}&activityId={activityId}&winningRecordId={winningRecordId}&brandCode={brandCode}",
    getLotteryShippingInfo: "/api/Lottery/Get_LotteryShippingInfo?userToken={userToken}&winningRecordId={winningRecordId}&invoiceNo={invoiceNo}&isBackground={isBackground}&isForce={isForce}&brandCode={brandCode}",
    getLotteryAdSlot:"/api/Lottery/Get_LotteryAdSlot?brandCode={brandCode}"
}
/**
 * form
 */
export const FromApiList = {
    //提交formId
    uploadUserFormId: {
      u: `${visitApi}/api/Common/UploadUserFormId`,
      a: "post"
    }
}
/**
 * 分销
 */
export const DstbApiList = {

    //创建分销关系
    buildDstbRelation: {
        u: "/api/StaffDstb/Build_DstbRelation",
        a: "post"
    },
    //是否分销员
    checkIfStaffDstb: "/api/StaffDstb/CheckIfStaffDstb?userToken={userToken}&brandCode={brandCode}",
    getMyFanList: "/api/StaffDstb/GetMyFanList?userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    //通过分销员code找店员id
    getStaffIdByStaffCode:"/api/StaffDstb/GetStaffIdByStaffCode?staffCode={staffCode}&brandCode={brandCode}"
}

//分销中心
export const DistributionApiList = {
    //首页  里面有申请中余额 
    staffDstbInfo: "/api/StaffDstb/Get_StaffDstbInfo?userToken={userToken}&brandCode={brandCode}",
    //分销订单列表：
    staffCommOrderList: "/api/StaffDstb/GetStaffCommOrderList?beginDate={beginDate}&endDate={endDate}&sType={sType}&userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    //分销订单详情
    orderInfo: "/api/StaffDstb/GetOrderInfoByStaffDstb?orderSn={orderSn}&brandCode={brandCode}&userToken={userToken}",

    //佣金明细列表
    staffDstbAccountFlow: "/api/StaffDstb/Get_StaffDstbAccountFlow?userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",

    //现金提取
    cashOut: {
        u: "/api/StaffDstb/Apply_Staff_Dstb_Cashout",
        a: "post"
    },
    //提现申请记录列表 
    cashOutList: "/api/StaffDstb/Get_ApplyCashoutList?userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",

    staffInfo: "/api/StaffDstb/Get_moto_staff_dstb_cfgInfo?brandCode={brandCode}",
    getMyTeamInfo:"/api/StaffDstb/GetMyTeamInfo?userToken={userToken}&brandCode={brandCode}",
    getMyTeamList:"/api/StaffDstb/GetMyTeamList?userToken={userToken}&type={type}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}&sortField={sortField}&sortBy={sortBy}",

    //提现明细
    cashOutDetail: "/api/StaffDstb/GetApplyCashoutDetail?applyId={applyId}&userToken={userToken}&brandCode={brandCode}",

    //累计客户3
    myFanList: "/api/StaffDstb/GetMyFanList?userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    goodsList: '/api/StaffDstbShare/Get_StaffDstbShareActivityGoodsList?userToken={userToken}&searchStr={searchStr}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}',

    activityPageList: '/api/StaffDstbShare/Get_StaffDstbShareActivityPageList?userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}',
    applyStaff: "/api/StaffDstb/Get_ApplyStaffDstb_Activity?brandCode={brandCode}",

    apply_Staff:{
        u: "/api/StaffDstb/Apply_StaffDstbInfo",
        a: "post"
    },
    applyStaffDstbInfoNoPhone:{
      u:"/api/StaffDstb/Apply_StaffDstbInfoNoPhone",
      a:"post"
    },
    pay_Result:"/api/StaffDstb/Get_ApplyStaffDstb_Pay_Result?orderId={orderId}&brandCode={brandCode}",
    getMyDevelopmentTeamInfo:"/api/StaffDstb/GetMyDevelopmentTeamInfo?userToken={userToken}&brandCode={brandCode}",
    getMyDevelopmentTeamList:"/api/StaffDstb/GetMyDevelopmentTeamList?userToken={userToken}&type={type}&searchStr={searchStr}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}&beginDate={beginDate}&endDate={endDate}",
    getMyStaffDstbInfo: "/api/StaffDstb/GetMyStaffDstbInfo?staffCode={staffCode}&brandCode={brandCode}",
    getStaffDstbDevelopUserList:"/api/StaffDstb/GetStaffDstbDevelopUserList?userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    getStaffDstbRankReport:"/api/StaffDstb/GetStaffDstbRankReport?userToken={userToken}&type={type}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}&isStore={isStore}",
    //分销派劵
    getStaffSendCouponList:"/api/StaffDstbSendCoupon/Get_StaffDstbSendCouponTaskList?userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    shareStaffCoupon:{
      u:"/api/StaffDstbSendCoupon/Share_StaffDstbSendCouponTask",
      a:"post"
    },
    getStaffShareCouponList:"/api/StaffDstbSendCoupon/Get_StaffDstbSendCouponTaskShareList?userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    getSendCouponDetail:"/api/StaffDstbSendCoupon/Get_StaffDstbSendCouponTaskShareDetail?userToken={userToken}&shareId={shareId}&brandCode={brandCode}",
    getStaffCouponTaskRecord:"/api/StaffDstbSendCoupon/Get_StaffDstbSendCouponTaskShareGetRecord?shareId={shareId}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    receiveStaffCoupon:{
      u:"/api/StaffDstbSendCoupon/Receive_StaffDstbSendCoupon",
      a:"post"
    },
    getStaffCouponTpls:{
      u:"/api/StaffDstbSendCoupon/GetTpls",
      a:"post"
    },
    setStaffCouponSub: {
      u:"/api/StaffDstbSendCoupon/SetSubscribe",
      a:"post"
    }
}
export const VSlogApiList = {
    writePageLog: {
      u: `${visitApi}/api/Common/Write_Page_Log`,
      a: "post"
    },
    CreateLogSession: {
      u: `${visitApi}/api/Log/CreateLogSession`,
      a: "post"
    },
    CreateLogSessionExtend:{
      u: `${visitApi}/api/Log/CreateLogSessionExtend`,
      a:"post"
    },
    AddPageLog: {
      u: `${visitApi}/api/Log/UploadVisitLogList`,
      a: "post"
    },
    AddActionLog: {
      u: `${visitApi}/api/Log/UploadLogActionList`,
      a: "post"
    },
    createExtendChannelLog:{
      u:`${visitApi}/api/Log/CreateExtendChannelLog`,
      a:"post"
    },
    postUpdateClientSession: {
      u: `${visitApi}/api/Log/UpdateClientSession`,
      a: "post"
    },
    uploadLogActionList: {
      u: `${visitApi}/api/Log/UploadLogActionList`,
      a:"post"
    },
    postCustomPageVisitRecord:{
      u: `${visitApi}/api/log/Post_CustomPageVisitRecord`,
      a:"post"
    }
}
export const BarCodeApiList = {
  //获取二维码
  getWxCode: {
    u: `${barCodeApi}/api/WXBarCode/GetWxCode`,
    a: "post"
  },
  //分销员ScanWXCodeLog
  scanWXCodeLog: {
    u: `${barCodeApi}/api/WXBarCode/ScanWXCodeLog`,
    a: "post"
  }
}


export const BrandApiList = {
    getMenuList: "/api/Brand/Get_MenuList?brandCode={brandCode}",
    //文章
    getArticle: "/api/Brand/Get_Article_info?article_id={article_id}&aKey={aKey}&brandCode={brandCode}",
    getDefSystemConfig: "/api/Brand/Get_DefSystemConfig?brandCode={brandCode}",
    getSystemConfig: "/api/Brand/GetSystemConfig?cfg_prop={cfg_prop}&brandCode={brandCode}",
    //支付方式
    getPaymentList: "/api/Brand/GetPaymentList?brandCode={brandCode}",
    //收货时间
    getRectimeList: "/api/Brand/GetRectimeList?brandCode={brandCode}",
    getWxappShareConfigEntity: "/api/Brand/Get_WxappShareConfigEntity?cfgType={cfgType}&brandCode={brandCode}",
    //tabbar配置
    getBottomMenuList:"/api/Brand/Get_Bottom_MenuList?brandCode={brandCode}",
    //会员卡
    getWxMemberCard:"/api/Brand/Get_WxMemberCard?brandCode={brandCode}",
    getStartPageConfigList:"/api/Brand/GetStartPageConfigList?brandCode={brandCode}"
}

export const MemberCardList={
    getOpenCardParams:{
      u: "/api/WxMemberCard/GetOpenCardParams",
      a:"post"
    },
    getOpenCardRequestInfo:{
      u: "/api/WxMemberCard/GetOpenCardRequestInfo",
      a:"post"
    },
    activeMemberCard:{
      u: "/api/WxMemberCard/ActiveMemberCard",
      a:"post"
    },
    getAddCardSignNature:"/api/WxMemberCard/GetAddCardSignNature?card_id={card_id}&timestamp={timestamp}",
    getWxMemebrCardInfo:{
      u:"/api/WxMemberCard/GetWxMemebrCardInfo",
      a:"post"
    },
    // reqActiveMemberCard:{

    // }
}

// 种草
export const GrassApiList = {
    //
    get_Grass_CategoryList:"/api/Grass/Get_Grass_CategoryList?pageIndex={pageIndex}&pageSize={pageSize}&strWhere={strWhere}&brandCode={brandCode}",
    //标签
    get_Grass_LabelList:"/api/Grass/Get_Grass_LabelList?pageIndex={pageIndex}&pageSize={pageSize}&strWhere={strWhere}&brandCode={brandCode}",
    //商品列表
    get_Goods_List:"/api/Grass/Get_Goods_List?pageIndex={pageIndex}&pageSize={pageSize}&strWhere={strWhere}&brandCode={brandCode}",
    //
    getGrassHomepage: "/api/Grass/GetGrassHomepage?pageIndex={pageIndex}&pageSize={pageSize}&catId={catId}&strWhere={strWhere}&orderBy={orderBy}&brandCode={brandCode}&userToken={userToken}",

    getMyFansList:"/api/Grass/GetMyFansList?pageIndex={pageIndex}&pageSize={pageSize}&strWhere={strWhere}&userToken={userToken}&brandCode={brandCode}",
  getMyFansList: "/api/Grass/GetMyFansList?pageIndex={pageIndex}&pageSize={pageSize}&strWhere={strWhere}&userToken={userToken}&brandCode={brandCode}",
  getMyFocouseList: "/api/Grass/GetMyFocouseList?pageIndex={pageIndex}&pageSize={pageSize}&strWhere={strWhere}&userToken={userToken}&brandCode={brandCode}",
  opGrassRelation: {
    u: "/api/Grass/OpGrassRelation",
    a: "post"
  },
  getMyGrassCenter: "/api/Grass/Get_My_GrassCenter?userToken={userToken}&brandCode={brandCode}",
  getFriendsGrassCenter: "/api/Grass/Get_Friends_GrassCenter?userToken={userToken}&related_UserId={related_UserId}&brandCode={brandCode}",
  getMyCollectPubList: "/api/Grass/Get_My_Collect_PubList?pageIndex={pageIndex}&pageSize={pageSize}&userToken={userToken}&brandCode={brandCode}",
  getMySharePubList: "/api/Grass/Get_My_Share_PubList?pageIndex={pageIndex}&pageSize={pageSize}&userToken={userToken}&brandCode={brandCode}",
  getFriendsSharePubList: "/api/Grass/Get_Friends_Share_PubList?pageIndex={pageIndex}&pageSize={pageSize}&related_UserId={related_UserId}&brandCode={brandCode}",
  addCollectSharePublish: {
    u: "/api/Grass/Add_Collect_Share_Publish",
    a: "post"
  },
  removeCollectSharePublish: {
    u: "/api/Grass/Remove_Collect_Share_Publish",
    a: "post"
  },
  grass_Publish: {
      u: "/api/Grass/Grass_Publish",
      a:'post'
  },
  postClickLog: {
      u: "/api/Grass/PostClickLog",
      a:'post'
  },
  get_Grass_Publish_Info: "/api/Grass/Get_Grass_Publish_Info?pubId={pubId}&userToken={userToken}&brandCode={brandCode}",
  get_Grass_Pub_Related_Goods: "/api/Grass/Get_Grass_Pub_Related_Goods?pubId={pubId}&brandCode={brandCode}",
  get_Grass_Pub_ReCommend_Goods: "/api/Grass/Get_Grass_Pub_ReCommend_Goods?pubId={pubId}&brandCode={brandCode}",
  opSharePublishLike:{
      u:"/api/Grass/Op_SharePublish_Like",
      a:"post"
  },
  op_SharePubCommnet_Like:{
      u:"/api/Grass/Op_SharePubCommnet_Like",
      a:"post"
  },
  publish_Commnet:{
      u:"/api/Grass/Publish_Commnet",
      a:"post"
  },
  get_Pub_Grass_ALLCommentList: "/api/Grass/Get_Pub_Grass_ALLCommentList?pubId={pubId}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}&userToken={userToken}", 
  delPublish:{
      u:"/api/Grass/DelPubLish",
      a:"post"
  }


}

//活动api
export const ActApiList = {
  getBuyBonusActivitList: "/api/BuyBonus/Get_BuyBonusActivitList?userToken={userToken}&pageSize={pageSize}&pageIndex={pageIndex}&brandCode={brandCode}",
  getBuyBonusActivitDetail: "/api/BuyBonus/Get_BuyBonusActivitDetail?activityId={activityId}&userToken={userToken}&brandCode={brandCode}",
  getBuyBonusOrderList: "/api/BuyBonus/Get_BuyBonusOrderList?userToken={userToken}&pageSize={pageSize}&pageIndex={pageIndex}&brandCode={brandCode}",
  createBuyBonusOrder:{
    u:"/api/BuyBonus/Create_BuyBonusOrder",
    a:"post"
  },
  getBuyBonusOrderPayStatus: "/api/BuyBonus/Get_BuyBonusOrderPayStatus?orderId={orderId}&brandCode={brandCode}",
  activeBonusList:"/api/BuyBonus/Get_ActiveBonusList?activityId={activityId}&brandCode={brandCode}",
  active_Order_BonusList:"/api/BuyBonus/Get_Active_Order_BonusList?orderId={orderId}&brandCode={brandCode}",
}


//注册/登录
export const RegApiList = {
    userLogin: {
        u: "/api/Wechat/Login",
        a: "post"
    },
    userRegister: {
        u: "/api/Wechat/RegisterInfo",
        a: "post"
    },
    createSession: {
        u: "/api/Wechat/createSession",
        a: "post"
    },
    checkSession: "/api/Wechat/checkSession",
    bindWxPhone: {
        u: "/api/Wechat/BindWxPhone",
        a: "post"
    },
    getGroupUserInfo:{
      u: "/api/Wechat/GetGroupUserInfo",
      a: "post"
    }
}

//店铺支付
export const SmktPayApiList = {
    getPayCode: "/api/SmktPay/Get_OfflinePayCode?userToken={userToken}&brandCode={brandCode}",
    getOrderStatus: "/api/smktpay/Get_OfflineOrderPayStatus?paymentId={paymentId}&brandCode={brandCode}",
    getOfflineOrderInfo: "/api/SmktPay/Get_offlineOrderInfo?userToken={userToken}&pay_barcode={pay_barcode}&brandCode={brandCode}",
    getReqPayInfoEntity: "/api/SmktPay/Get_ReqPayInfoEntity?paymentId={paymentId}&userToken={userToken}&brandCode={brandCode}",
    getOfflineCouponusList: "/api/SmktPay/Get_offline_CouponusList?userToken={userToken}&bonusIds={bonusIds}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    postOfflineJieSuanList: {
        u: "/api/SmktPay/Post_offlineJieSuanList",
        a: "post"
    },
    getOfflineOrderInfo_Entity: "/api/SmktPay/Get_offlineOrderInfo_Entity?paymentId={paymentId}&brandCode={brandCode}",
    //看能 获得啥奖励信息 
    getOfflineCardBenefitList: "/api/SmktPay/Get_offlineCardBenefitList?paymentId={paymentId}&brandCode={brandCode}",
    //购买获得赠送奖励信息 领取
    postOfflineOrderRewardRelease: {
        u: "/api/SmktPay/Post_offline_order_reward_release?offlineSn={offlineSn}&storeId={storeId}&brandCode={brandCode}",
        a: "post"
    },
    //历史纪录
    getOfflineOrderInfoRecordList: "/api/SmktPay/Get_offlineOrderInfoRecordList?userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    updateOfflineOrderInfoByPayInfo: {
        u: "/api/SmktPay/update_offlineOrderInfoByPayInfo",
        a: "post"
    },
    get_offlineOrderCount:"/api/SmktPay/Get_offlineOrderCount",
    cancelOfflineOrder: {
      u: "/api/SmktPay/CancelOfflineOrder",
      a: "post"
    },
}

export const PageApiList = {
  getCustomPageDataList: "/api/Page/GetCustomPageDataList?pageId={pageId}&userToken={userToken}&brandCode={brandCode}",
  getALLGoodsList:"/api/Page/GetALLGoodsList?catType={catType}&cateId={cateId}&pageSize={pageSize}&pageIndex={pageIndex}&userToken={userToken}&brandCode={ brandCode}",
  // getALLGoodsListByGoodsIds:"/api/Page/GetALLGoodsListByGoodsIds?userToken={userToken}&goodIds={goodIds}&brandCode={brandCode}"
}

export const VoteApiList = {
  get_VoteActivityOptionList: "/api/Vote/Get_VoteActivityOptionList?voteActivityId={voteActivityId}&userToken={userToken}&brandCode={brandCode}",
  get_VoteResultList: "/api/Vote/Get_VoteResultList?voteActivityId={voteActivityId}&userToken={userToken}&cookieId={cookieId}&brandCode={brandCode}",
  post_VoteResult: {
    u: "/api/Vote/Post_VoteResult",
    a: "post"
  },
}

export const SecKillApiList = {
  getActivityGroup: "/Activity/GetActivityGroup?groupId={groupId}&brandCode={brandCode}",
  getActivity: "/Activity/GetActivity?activityId={activityId}&brandCode={brandCode}",
  getProgress: "/Activity/GetProgress?activityId={activityId}&userToken={userToken}",
  checkCondition: "/Activity/CheckCondition?activityId={activityId}&userToken={userToken}",
  getFriends: "/Activity/GetFriends?activityId={activityId}&userToken={userToken}",
  getGoodsList:"/Goods/GetGoodsList?activityId={activityId}&pageIndex={pageIndex}&pageSize={pageSize}",
  getGoodsDetail:"/Goods/GetGoodsDetail?activityId={activityId}&goodsId={goodsId}",
  getProducts:"/Goods/GetProducts?activityId={activityId}&goodsId={goodsId}",
  getTargetProgress:"/Activity/GetTargetProgress?activityId={activityId}&target={target}&own={own}",
  addActivityLaunch:{
    u: "/Activity/AddActivityLaunch",
    a:"post"
  },
  helpTarget:{
    u: "/Activity/HelpTarget",
    a:"post"
  },
  addOrder:{
    u: "/Order/AddOrder",
    a:"post"
  },
  getOrderInfos:"/Order/GetOrderInfos?userToken={userToken}&orderId={orderId}&brandCode={brandCode}",
  getPayInfos:"/Order/GetPayInfos?userToken={userToken}&akId={akId}&userAddressId={userAddressId}&brandCode={brandCode}",
  getPayStatus:"/Order/GetPayStatus?userToken={userToken}&orderId={orderId}&brandCode={brandCode}",
  checkPay:"/Order/CheckPay?userToken={userToken}&akId={akId}",
  getOrderList:"/Order/GetOrderList?userToken={userToken}&type={type}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
  unifiedorder:{
    u: "/Wx/Unifiedorder?userToken={userToken}&orderId={orderId}&brandCode={brandCode}",
    a:"post"
  },
  cancelOrder:{
    u: "/Order/CancelOrder?userToken={userToken}&orderId={orderId}&brandCode={brandCode}",
    a:"post"
  },
  checkUserRank: "/Activity/CheckUserRank?activityId={activityId}&userToken={userToken}",
  checkLimit: "/Order/CheckLimit?userToken={userToken}&activityId={activityId}&goodsId={goodsId}",
  getTpls:{
    u:"/WxMsg/GetTpls",
    a:"post"
  },
  setSubscribe:{
    u:"/WxMsg/SetSubscribe",
    a:"post"
  },
  getActivitySubscribeStatus: "/WxMsg/GetActivitySubscribeStatus?activityId={activityId}&userToken={userToken}&brandCode={brandCode}",
  getActivityGoodsUsableBonusList:"/Order/GetActivityGoodsUsableBonusList?userToken={userToken}&akId={akId}&brandCode={brandCode}&userAddressId={userAddressId}&shippingType={shippingType}&storeId={storeId}",
  getGuideFollowWechatInfo:"/Guide/GetGuideFollowWechatInfo?cookieId={cookieId}&brandCode={brandCode}",
  pushGuideFollowWechat:{
    u:"/Guide/PushGuideFollowWechat",
    a:"post"
  }
} 

export const VideoShopApiList = {
  getVideoShoppingList: "/api/VideoShopping/GetVideoShoppingList?userToken={userToken}&brandCode={brandCode}&pageIndex={pageIndex}&pageSize={pageSize}",
  getVideoShoppingGoodsList: "/api/VideoShopping/GetVideoShoppingGoodsList?activeId={activeId}&brandCode={brandCode}",
  getVideoShoppingProductInfo: "/api/VideoShopping/GetVideoShoppingProductInfo?activeId={activeId}&goodsId={goodsId}&colorId={colorId}&issueId={issueId}&userToken={userToken}&brandCode={brandCode}",
  getNewVideoId:"/api/VideoShopping/GetNewVideoId?brandCode={brandCode}",
  getVideoShippingById:"/api/VideoShopping/GetVideoShippingById?userToken={userToken}&activeId={activeId}&brandCode={brandCode}",
  likeOrUnLikeVideo: {
    u: "/api/VideoShopping/LikeOrUnLikeVideo",
    a: "post"
  },
  createVideoShoppingShared: {
    u: "/api/VideoShopping/CreateVideoShoppingSharedRecord",
    a: "post"
  },
  
}

export const ElectricApiList = {
  getDefaultElectricKpInfo:"/api/Electric/GetDefaultElectricKpInfo?type={type}&userToken={userToken}&brandCode={brandCode}",
  getElectricKpInfoList:"/api/Electric/GetElectricKpInfoList?userToken={userToken}&brandCode={brandCode}&pageIndex={pageIndex}&pageSize={pageSize}",
  getElectricKpInfo:"/api/Electric/GetElectricKpInfo/{id}",
  getElectricKpTask:"/api/Electric/GetElectricKpTask/{id}",
  getElectricKpTaskList:"/api/Electric/GetElectricKpTaskList?taskStatus={taskStatus}&userToken={userToken}&brandCode={brandCode}&pageIndex={pageIndex}&pageSize={pageSize}",
  ctreateOrEdit: {
    u: "/api/Electric/CtreateOrEdit",
    a: "post"
  },
  createElectricTask: {
    u: "/api/Electric/CreateElectricTask",
    a: "post"
  },
  deleteElectricKpInfo: {
    u: "/api/Electric/DeleteElectricKpInfo",
    a: "post"
  },
}

export const UserDockApiList = {
  getUserDockList:"/api/UserDock/Get_UserDockList?userToken={userToken}&brandCode={brandCode}",
  createUserDockPool: {
    u: "/api/UserDock/Create_UserDockPool",
    a: "post"
  }
}