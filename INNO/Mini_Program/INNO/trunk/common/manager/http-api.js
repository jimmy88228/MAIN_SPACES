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
/**分域名**/
export const GoodsApiList = {
    canUseCouponByJieSuan:{
      u:"/api/Goods/Post_CanUseCouponByJieSuan",
      m:"post"
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
        m: "post"
    },
    //评论线上商品明细
    commentOnlineOrderGoods: {
        u: "/api/GoodComment/CommentOnlineOrderGoods",
        m: "post"
    },
    //评论线下商品明细
    commentOfflineOrderGoods: {
        u: "/api/GoodComment/CommentOfflineOrderGoods",
        m: "post"
    },
    //结算页选择优惠券
    useBonusList: "/api/Coupon/Get_BonusList?userToken={userToken}&bonus_ids={bonus_ids}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    //
    getMyCommentList: "/api/GoodComment/Get_MyCommentList?userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    getMyCommentDetail: "/api/GoodComment/Get_MyCommentDetail?userToken={userToken}&orderId={orderId}&goodsId={goodsId}&isOnlineOrder={isOnlineOrder}&brandCode={brandCode}",
    getOfflineOrderCommentDetail: "/api/GoodComment/Get_Offline_Order_Comment_Detail?orderSn={orderSn}&brandCode={brandCode}",
    commentOfflineOrder: {
        u: "/api/GoodComment/CommentOfflineOrder",
        m: "post"
    },

    /**
     * 足迹
     */
    addGoodsVisitLog: {
        u: "/api/GoodExtend/Op_GoodsVisitLog",
        m: "post"
    },
    getGoodsVisitLogList: "/api/GoodExtend/Get_GoodsVisitLog_List?userToken={userToken}&brandCode={brandCode}&pageIndex={pageIndex}&pageSize={pageSize}",

    /**
     * 收藏
     */
    addFavGoodsLog: {
        u: "/api/GoodExtend/Add_Fav_Goods_Log",
        m: "post"
    },
    delFavGoodsLog: {
        u: "/api/GoodExtend/Del_Fav_Goods_Log",
        m: "post"
    },
    getFavLogList: "/api/GoodExtend/Get_Fav_LogList?userToken={userToken}&brandCode={brandCode}&pageIndex={pageIndex}&pageSize={pageSize}",
    uploadSearchKeyword:{
      u:"/api/GoodExtend/UploadSearchKeyword",
      m:"post"
    },

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
    //searchGoodsList: "/api/Goods/Get_Sumary_SearchGoodsList?functype={functype}&catId={catId}&strAttrId={strAttrId}&strAttrValue={strAttrValue}&colorCatId={colorCatId}&startPrice={startPrice}&endPrice={endPrice}&strWhere={strWhere}&pageSize={pageSize}&pageIndex={pageIndex}&sortField={sortField}&sortBy={sortBy}&brandCode={brandCode}&userToken={userToken}&goods_brand_ids={goods_brand_ids}&storeId={storeId}&colorIds={colorIds}&sizeIds={sizeIds}",
    searchGoodsList: "/api/Goods/Get_Sumary_SearchGoodsList?functype={functype}&catId={catId}&strAttrId={strAttrId}&strAttrValue={strAttrValue}&colorCatId={colorCatId}&startPrice={startPrice}&endPrice={endPrice}&strWhere={strWhere}&pageSize={pageSize}&pageIndex={pageIndex}&sortField={sortField}&sortBy={sortBy}&brandCode={brandCode}&userToken={userToken}&goods_brand_ids={goods_brand_ids}&storeId={storeId}",
    getSearchGoodsListBySkip:"/api/Goods/GetSearchGoodsListBySkip?functype={functype}&catId={catId}&strAttrId={strAttrId}&strAttrValue={strAttrValue}&colorCatId={colorCatId}&startPrice={startPrice}&endPrice={endPrice}&strWhere={strWhere}&pageSize={pageSize}&skipCount={skipCount}&sortField={sortField}&sortBy={sortBy}&brandCode={brandCode}&userToken={userToken}&goods_brand_ids={goods_brand_ids}&storeId={storeId}",
    get_GoodsPackageList: "/api/GoodsPackage/Get_GoodsPackageList?goodsId={goodsId}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    get_GoodsPackageInfo:"/api/GoodsPackage/Get_GoodsPackageInfo?packageId={packageId}&brandCode={brandCode}",
    get_GoodsPackageProductInfo:"/api/GoodsPackage/Get_GoodsPackageProductInfo?packageId={packageId}&goodsId={goodsId}&brandCode={brandCode}&shippingStoreId={shippingStoreId}",
    post_GoodsPackageAddBuyCar:{
        u: "/api/GoodsPackage/Post_GoodsPackageAddBuyCar",
        m: "post"
    },
    getValidGoodsPackageList:"/api/GoodsPackage/Get_ValidGoodsPackageList?activityIds={activityIds}&searchStr={searchStr}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    //购物车
    createBuyCarInsert: {
        u: "/api/Goods/Create_BuyCar_Insert",
        m: "post"
    },
    getBuyCarGoodList: "/api/Goods/GetBuyCarGood_List?userToken={userToken}&brandCode={brandCode}",
    getCartStoageCount: "/api/Goods/GetCartStoage_Count?userToken={userToken}&brandCode={brandCode}",
    addCartStroageNum: {
        u: "/api/Goods/Add_CartStroage_Num",
        m: "post"
    },
    subtractCartStroageNum: {
        u: "/api/Goods/Subtract_CartStroage_Num",
        m: "post"
    },
    delCartStroage: {
        u: "/api/Goods/Del_CartStroage",
        m: "post"
    },
    //促销信息
    getPromotionInfo: "/api/Goods/GetPromotionInfo?userToken={userToken}&recIds={recIds}&brandCode={brandCode}",
    getGoodsPromotionRuleList:"/api/Goods/GetGoodsPromotionRuleList?userToken={userToken}&brandCode={brandCode}&goodsId={goodsId}",
    //加价购
    getGroupSaleGoodsList: "/api/Goods/GetGroupSaleGoodsList?goodsId={goodsId}&recId={recId}&activityId={activityId}&userToken={userToken}&brandCode={brandCode}",
    //结算
    postJieSuanListByStore: {
        u: "/api/Goods/Post_JieSuanListByStore",
        m: "post"
    },
    genterBuyCarByMwin: {
      u: "/api/Goods/GenterBuyCarByMwin",
      m: "post"
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
    getGoodsCommissionAmountByTypeAll: "/api/Goods/Get_GoodsCommissionAmountByType?goodsIds={goodsIds}&goodsType={goodsType}&relatedId={relatedId}&userToken={userToken}&brandCode={brandCode}", //goodsType = COLLAGEGROUP(拼团) , PRESALE(预售) , NORMAL(正常商品) , SKILL(秒杀),POINTMKT(积分商城)

    /**
     * 代客下单
    */
    orderForCustom:{
      u: "/api/GOODS/OrderForCustom",
      m:"post"
    },
    getGoodsPromotionInfo:"/api/Goods/GetGoodsPromotionInfo?userToken={userToken}&goodsId={goodsId}&brandCode={brandCode}",
    getPromotionGoodsList:"/api/Goods/GetPromotionGoodsList?userToken={userToken}&ruleId={ruleId}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    getSeckillGoodList:"/api/Goods/GetSeckillGoodList?issueId={issueId}&pageIndex={pageIndex}&pageSize={pageSize}&goodsIds={goodsIds}&brandCode={brandCode}&platformSrc={platformSrc}",
    getHomePageDataScriptList: "/api/Goods/GetHomePageDataScriptList?pageId={pageId}&userToken={userToken}&brandCode={brandCode}",
    getALLGoodsListByGoodsIds: "/api/Page/GetALLGoodsListByGoodsIds?userToken={userToken}&goodIds={goodIds}&brandCode={brandCode}",
    get_recommend_template_List:"/api/Goods/Get_recommend_template_List?goodsId={goodsId}&brandCode={brandCode}",
    //店铺 by goodsId
    getShippingStoreList: "/api/Store/Get_Shipping_Store_List?goodsId={goodsId}&searchName={searchName}&pageIndex={pageIndex}&pageSize={pageSize}&lat={lat}&lon={lon}&brandCode={brandCode}&goodsNum={goodsNum}",
    get_Shipping_Store_ListByPIDList:"/api/Store/Get_Shipping_Store_ListByPIDList?pIds={pIds}&goodsNums={goodsNums}&searchName={searchName}&pageIndex={pageIndex}&pageSize={pageSize}&lat={lat}&lon={lon}&brandCode={brandCode}&userToken={userToken}&type={type}",
    getShippingStoreListByCartId: "/api/Store/Get_Shipping_Store_ListByCartId?recId={recId}&userToken={userToken}&searchName={searchName}&pageIndex={pageIndex}&pageSize={pageSize}&lat={lat}&lon={lon}&brandCode={brandCode}",
    get_Shipping_Store_ListByPID:"/api/Store/Get_Shipping_Store_ListByPID?pId={pId}&searchName={searchName}&pageIndex={pageIndex}&pageSize={pageSize}&lat={lat}&lon={lon}&brandCode={brandCode}&goodsNum={goodsNum}&userToken={userToken}&type={type}",
    // changeCartStorageShippingWay: {
    //   u:"/api/Goods/ChangeCartStorageShippingWay",
    //   m:"post"
    // },
    //领券模块
    getGoodsReceiveBonusActivity:"/api/GoodExtend/GetGoodsReceiveBonusActivity?goodsId={goodsId}&brandCode={brandCode}",
    getGoodsReceiveBonusActivityDetail:"/api/GoodExtend/GetGoodsReceiveBonusActivityDetail?userToken={userToken}&goodsId={goodsId}&activityId={activityId}&brandCode={brandCode}",
    receiveBonusFromGoods:{
      u:"/api/GoodExtend/ReceiveBonusFromGoods",
      m:"post"
    },
    checkJieSuanCartstorage:"/api/Goods/CheckJieSuanCartstorage?recIds={recIds}&brandCode={brandCode}",
    countPromotionInfoByJieSuan:{
      u:"/api/Goods/CountPromotionInfoByJieSuan",
      m:"post"
    },
    getGoodsActivityPrice: "/api/Goods/Get_GoodsActivityPrice?goodsId={goodsId}&userToken={userToken}&brandCode={brandCode}",
    goodsCategoryStyle: "/api/GoodsCategoryStyle/GetCategoryList?brandCode={brandCode}",
    getShoppingAds: "/api/Goods/Get_shopping_recommend_template_List?brandCode={brandCode}",
    limit_page_show_assembly: "/api/Page/Get_moto_limit_page_show_assembly?path={path}&assembly_type={assembly_type}&brandCode={brandCode}",
    goodsSearchStyle:"/api/GoodsSearchStyle/GetStyle?brandCode={brandCode}",
    get_Goods_Param_Attr_List:"/api/Goods/Get_Goods_Param_Attr_List?goodsId={goodsId}&brandCode={brandCode}",
    getGoodsDetailVideoShopinggList:"/api/VideoShopping/GetGoodsDetailVideoShopingList?goodsId={goodsId}&brandCode={brandCode}",
    getGoodsIdByScan:"/api/Goods//GetGoodsIdByScan?sku={sku}&brandCode={brandCode}",
    getGoodsScanInfo:"/api/Goods//GetGoodsScanInfo?searchVal={searchVal}&brandCode={brandCode}",
    getParentPageDataScript:"/api/Goods/GetParentPageDataScript?brandCode={brandCode}",
    // 优惠购
    getActivityGoodsList:"/api/DiscountBuy/GetActivityGoodsList?activityId={activityId}&orderAmount={orderAmount}&userToken={userToken}&brandCode={brandCode}",
    getActivityGoodsProduct:"/api/DiscountBuy/GetActivityGoodsProduct?activityId={activityId}&goodsId={goodsId}&userToken={userToken}&brandCode={brandCode}&needGallery={needGallery}",
    getActivityGoodsDetail:"/api/DiscountBuy/GetActivityGoodsDetail?activityId={activityId}&goodsId={goodsId}&brandCode={brandCode}"
}


export const BuyApiList = {
    /**
     * Order
     */
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
    getAPPVariousTypeOrderList: "/api/Order/Get_APPVariousTypeOrderList?userToken={userToken}&orderType={orderType}&orderKind={orderKind}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}&searchStr={searchStr}",
    //第三方订单
    getExAPPVariousTypeOrderList: "/api/Order/Get_Ex_APPVariousTypeOrderList?userToken={userToken}&orderType={orderType}&orderKind={orderKind}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    getOrderRefundList:"/api/Order/Get_OrderRefundList?userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}&searchStr={searchStr}",
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
        m: "post"
    },
    // Get_WuLiuUrl: {
    //     u: "/api/order/Get_WuLiuUrl?invoiceNo={invoiceNo}"
    // },
    getOrderPayStatus: "/api/Order/GetOrderPayStatus?userToken={userToken}&orderId={orderId}&brandCode={brandCode}",
    //取消原因
    getOrderCancelReasonList: "/api/Order/Get_OrderCancelReasonList?brandCode={brandCode}",
    //申请取消订单
    cancelOrApplyCancelOrder: {
        u: "/api/Order/CancelOrApplyCancelOrder",
        m: "post"
    },
    //退换货
    getTuiHuanHuoDetailList: "/api/Order/Get_TuiHuanHuoDetailList?returnId={returnId}&userToken={userToken}&brandCode={brandCode}",
    getOrderRefundDetail:"/api/Order/Get_OrderRefundDetail?userToken={userToken}&refundId={refundId}&brandCode={brandCode}",
    createReshipOrder: {
        u: "/api/Order/Create_Reship_Order",
        m: "post"
    },
    createBatchReshipOrder: {
        u: "/api/Order/Create_BatchReship_Order",
        m: "post"
    },
    //退换货原因
    getOrderReturnReasonList: "/api/Brand/Get_Order_Return_ReasonList?brandCode={brandCode}",
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
    getOrderShippingInfo:"/api/Order/GetOrderShippingInfo?userToken={userToken}&orderId={orderId}&invoiceNo={invoiceNo}&isBackground={isBackground}&isForce={isForce}&brandCode={brandCode}",
    getInvoiceList:"/api/Order/GetInvoiceList?orderId={orderId}&brandCode={brandCode}",

    //商品操作接口
    //购物车
    createBuyCarInsert: {
        u: "/api/Goods/Create_BuyCar_Insert",
        m: "post"
    },
    getBuyCarGoodList: "/api/Goods/GetBuyCarGood_List?userToken={userToken}&brandCode={brandCode}",
    getCartStoageCount: "/api/Goods/GetCartStoage_Count?userToken={userToken}&brandCode={brandCode}",
    addCartStroageNum: {
        u: "/api/Goods/Add_CartStroage_Num",
        m: "post"
    },
    subtractCartStroageNum: {
        u: "/api/Goods/Subtract_CartStroage_Num",
        m: "post"
    },
    delCartStroage: {
        u: "/api/Goods/Del_CartStroage",
        m: "post"
    },
    //促销信息
    getPromotionInfo: "/api/Goods/GetPromotionInfo?userToken={userToken}&recIds={recIds}&brandCode={brandCode}",
    //加价购
    getGroupSaleGoodsList: "/api/Goods/GetGroupSaleGoodsList?goodsId={goodsId}&recId={recId}&activityId={activityId}&userToken={userToken}&brandCode={brandCode}",
    //结算
    postJieSuanListByStore: {
        u: "/api/Goods/Post_JieSuanListByStore",
        m: "post"
    },
    get_Valet_OrderList:"/api/Order/Get_Valet_OrderList?userToken={userToken}&orderType={orderType}&orderKind={orderKind}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}&searchStr={searchStr}",
    get_Valet_Ex_APPVariousTypeOrderList:"/api/Order/Get_Valet_Ex_APPVariousTypeOrderList?userToken={userToken}&orderType={orderType}&orderKind={orderKind}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
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
    getShoppingCartList:"/api/Goods/GetShoppingCartList?userToken={userToken}&brandCode={brandCode}",
    changeCartStorageShippingWay: {
      u:"/api/Goods/ChangeCartStorageShippingWay",
      m:"post"
    },
    //个人中心-查询订单
    getUserOrderCount:"/api/Order/Get_UserOrderCount?userToken={userToken}&brandCode={brandCode}",
    sceneCheck:{
      u: "/api/Wechat/SceneCheck",
      m: "post"
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
    m:"post"
  }
}

export const PayApiList = {
    // getAppletPrepayId: "/api/pay/weixin3.36/getAppletPrepayId_kingking.php?order_id={order_id}&pay_type={pay_type}",
    getAppletPrepayId: "/api/pay/weixin3.36/pay_v1.0.php?order_id={order_id}&pay_type={pay_type}",
    // payUnifiedorder: "/InnoPayApi/api/Pay/Unifiedorder?userToken={userToken}&payType={payType}&payMethod={payMethod}&orderSn={orderSn}&brandCode={brandCode}",
    // UnifiedorderByOrderId: "/InnoPayApi/api/Pay/UnifiedorderByOrderId?userToken={userToken}&payType={payType}&payMethod={payMethod}&orderId={orderId}&brandCode={brandCode}",
}
export const NewPayApiList = {
    payUnifiedorder: "/api/Pay/Unifiedorder?userToken={userToken}&payType={payType}&payMethod={payMethod}&orderSn={orderSn}&brandCode={brandCode}",
    UnifiedorderByOrderId: "/api/Pay/UnifiedorderByOrderId?userToken={userToken}&payType={payType}&payMethod={payMethod}&orderId={orderId}&brandCode={brandCode}",

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
        m: "post"
    },
    //拼团订单支付状态查询
    getCollageGroupOrderPayStatus: "/api/CollageGroup/Get_CollageGroupOrderPayStatus?userToken={userToken}&orderId={orderId}&brandCode={brandCode}",
    //
    getCollageGroupGoodsDetail: "/api/CollageGroup/Get_CollageGroupGoodsDetail?userToken={userToken}&activityId={activityId}&userActivityId={userActivityId}&goodsId={goodsId}&colorId={colorId}&sizeId={sizeId}&brandCode={brandCode}",
    //检测数量
    checkProductNumber: "/api/CollageGroup/CheckProductNumber?activityId={activityId}&goodsId={goodsId}&productId={productId}&productNum={productNum}&brandCode={brandCode}",
    getCollageGroupGoodsList:"/api/CollageGroup/Get_CollageGroupGoodsList?pageSize={pageSize}&pageIndex={pageIndex}&activityIds={activityIds}&brandCode={brandCode}",
    setSubscribe: {
      u: "/api/CollageGroup/SetSubscribe",
      m: "post"
  },
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
        m: "post"
    },
    getPresaleOrderDetail: "/api/Presale/GetPresaleOrderDetail?userToken={userToken}&preOrderId={preOrderId}&bonusId={bonusId}&isUsedPoint={isUsedPoint}&brandCode={brandCode}",
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
    getPreSalePayStatus:"/api/Presale/GetPreSalePayStatus?preOrderId={preOrderId}&payKind={payKind}&brandCode={brandCode}",
    
    getPresaleUsableBonusList:"/api/Presale/GetPresaleUsableBonusList?userToken={userToken}&preOrderId={preOrderId}&activityId={activityId}&activityGoodsId={activityGoodsId}&goodsNumber={goodsNumber}&bonusIds={bonusIds}&brandCode={brandCode}",
    getPresaleDepositSettlement:"/api/Presale/GetPresaleDepositSettlement?userToken={userToken}&activityId={activityId}&activityGoodsId={activityGoodsId}&goodsNumber={goodsNumber}&bonusIds={bonusIds}&isUsedPoint={isUsedPoint}&brandCode={brandCode}",
    getPresaleOrderData:"/api/Presale/GetPresaleOrderData?userToken={userToken}&preOrderId={preOrderId}&bonusIds={bonusIds}&isUsedPoint={isUsedPoint}&brandCode={brandCode}",
    presaleDepositAddOrder:{
        u:"/api/Presale/PresaleDepositAddOrder",
        m:"post"
    },
    presaleOrderTailUsePointCoupon:{
        u:"/api/Presale/PresaleOrderTailUsePointCoupon",
        m:"post"
    },
}
//----积分商城
export const PointApiList = {
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
        m: "post"
    },
    getUserHagglePriceActivityDetail: "/api/HagglePrice/Get_UserHagglePriceActivityDetail?userToken={userToken}&userActivityId={userActivityId}&brandCode={brandCode}",
    postUserHagglePrice: {
        u: "/api/HagglePrice/Post_UserHagglePrice",
        m: "post"
    },
getUserHagglePriceActivityDetailRecord:"/api/HagglePrice/Get_UserHagglePriceActivityDetailRecord?userActivityId={userActivityId}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    getUserHagglePriceSettlementPage: "/api/HagglePrice/Get_UserHagglePriceSettlementPage?userToken={userToken}&userActivityId={userActivityId}&addressId={addressId}&brandCode={brandCode}",
    postHagglePriceAddOrder: {
        u: "/api/HagglePrice/Post_HagglePriceAddOrder",
        m: "post"
    },
    getUserHagglePriceOrderDetail: "/api/HagglePrice/Get_UserHagglePriceOrderDetail?userToken={userToken}&userActivityId={userActivityId}&brandCode={brandCode}",
    getTpls:{
      u:"/api/WxMsg/GetTpls",
      m:"post"
    },
    setSubscribe:{
      u:"/api/WxMsg/SetSubscribe",
      m:"post"
    },
    get_HagglePricePayStatus:"/api/HagglePrice/Get_HagglePricePayStatus?orderId={orderId}&brandCode={brandCode}",
    cancelUserHagglePriceActivity:{
      u:"/api/HagglePrice/Cancel_UserHagglePriceActivity",
      m:"post"
    },
    
}


export const UserApiList = {

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
    updatePortraitPath:{
      u: "/api/user/Update_PortraitPath",
      m: "post"
    } ,
    getUserInfoWap: "/api/User/GetUserInfo_Wap?userToken={userToken}&brandCode={brandCode}",
    getUserInfoNew: "/api/User/GetUserCenter?userToken={userToken}&brandCode={brandCode}",
    getUsefulCouponCount: "/api/Coupon/Get_UsefulCouponCount?userToken={userToken}&brandCode={brandCode}",
    getUserRedpackAmount:"/api/Redpack/GetUserRedpackAmount?userToken={userToken}&brandCode={brandCode}",
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
        m:"post"
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
    get_SignOrderActivityInfo: "/api/SignIn/Get_SignOrderActivityInfo?userToken={userToken}&brandCode={brandCode}",
    get_UserSignOrderActivityReward:"/api/SignIn/Get_UserSignOrderActivityReward?userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}&receiveType={receiveType}&brandCode={brandCode}",
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
    getWxCodeForWap:{
      u: "/api/WXBarCode/GetWxCodeForWap",
      m:"post"
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
    get_UserPointCaptcha:"/api/UserPoint/Get_UserPointCaptcha?userToken={userToken}&brandCode={brandCode}",

    getAccountChangeList:"/api/User/Get_AccountChangeList?userToken={userToken}&brandCode={brandCode}&pageIndex={pageIndex}&pageSize={pageSize}",
    storedValueCard:{
      u: "/api/StoredValue/ExchangeStoredValueCard",
      m:"post"
    },
    /***/
    getCustomPageShareActivity: "/api/Page/Get_CustomPageShareActivity?pageId={pageId}&userToken={userToken}&brandCode={brandCode}",
    getPayCode: "/api/User/GetPayCode?userToken={userToken}&brandCode={brandCode}",
    refreshPayCode: "/api/User/RefreshPayCode?userToken={userToken}&brandCode={brandCode}",
    //绑定导购
    bindFromStaffId:{
      u:"/api/StoreStaff/BindFromStaffId",
      m:"post"
    },
    getUserBarcodeBackground:"/api/User/GetUserBarcodeBackground?brandCode={brandCode}",
    getPopupAdvert: "/api/PopupAdvert/GetPopupAdvert?userToken={userToken}&pageId={pageId}&isIndex={isIndex}&brandCode={brandCode}",
    /*更改所属店铺*/
    bindFromStore:{
      u:"/api/store/BindFromStore",
      m:"post"
    },
    getUserRedpackList:"/api/Redpack/GetUserRedpackList?userToken={userToken}&type={type}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    getUserDockList:"/api/UserDock/Get_UserDockList?userToken={userToken}&brandCode={brandCode}",
    createUserDockPool: {
      u: "/api/UserDock/Create_UserDockPool",
      m: "post"
    },
    getInviteUserActivity:"/api/InviteUser/GetInviteUserActivity?brandCode={brandCode}",
    getInviteUserRecord:"/api/InviteUser/GetInviteUserRecord?userToken={userToken}&activityId={activityId}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    getInviteUserLogList:"/api/InviteUser/GetInviteUserLogList?activityId={activityId}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    // N单有礼
    getOrderGiftActivity:"/api/OrderGift/GetOrderGiftActivity?userToken={userToken}&brandCode={brandCode}",
    getOrderGiftActivityDetail:"/api/OrderGift/GetOrderGiftActivityDetail?activityId={activityId}&userToken={userToken}&brandCode={brandCode}",
    exchangeOrderGift: {
      u: "/api/OrderGift/ExchangeOrderGift",
      m: "post"
    },
    getExchangeList: "/api/OrderGift/GetExchangeList?userToken={userToken}&brandCode={brandCode}&pageIndex={pageIndex}&pageSize={pageSize}",
    getExchangeDetail: "/api/OrderGift/GetExchangeDetail?exchangeId={exchangeId}&userToken={userToken}&brandCode={brandCode}",
    //付费会员
    createUserUpgradeOrder:{
      u: "/api/UserUpgrade/CreateUserUpgradeOrder",
      m: "post"
    },
    get_UserUpgradeInfo:'/api/UserUpgrade/Get_UserUpgradeInfo?userToken={userToken}&brandCode={brandCode}',
    get_UserUpgradeActivityInfo:'/api/UserUpgrade/Get_UserUpgradeActivityInfo?activityId={activityId}&userToken={userToken}&brandCode={brandCode}',
    getUserUpgradeShareBenefit:'/api/UserUpgrade/GetUserUpgradeShareBenefit?userToken={userToken}&brandCode={brandCode}&timeType={timeType}&pageIndex={pageIndex}&pageSize={pageSize}',
    checkUserUpgradeOrderPay:'/api/UserUpgrade/CheckUserUpgradeOrderPay?orderId={orderId}',
    getUserErpCoupon: '/api/Coupon/Get_UserErpCoupon?userToken={userToken}&brandCode={brandCode}',
    getThirdPpartyChannelActivity:"/api/User/GetThirdPpartyChannelActivity?channelKey={channelKey}&brandCode={brandCode}",
    postThirdPpartyChannelActivityLog:{
      u: "/api/user/PostThirdPpartyChannelActivityLog",
      m: "post"
    },

  }
export const LotteryApiList = {
    lotteryActivitDetail: "/api/Lottery/Get_LotteryActivitDetail?userToken={userToken}&activityId={activityId}&brandCode={brandCode}",
    lotteryWinningRecord: "/api/Lottery/Get_LotteryActivityWinningRecord?activityId={activityId}&brandCode={brandCode}",
    userLotteryWinningRecord: "/api/Lottery/Get_UserLotteryActivityWinningRecord?userToken={userToken}&activityId={activityId}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    getLotteryResult: {
      u: "/api/Lottery/Post_GetLotteryResult",
      m: "post"
    },
    receivePrize: {
      u: "/api/Lottery/Post_ReceivePrize",
      m: "post"
    },
    lotteryWinningRecordDetail: "/api/Lottery/Get_LotteryWinningRecordDetail?userToken={userToken}&activityId={activityId}&winningRecordId={winningRecordId}&brandCode={brandCode}",
    getLotteryShippingInfo: "/api/Lottery/Get_LotteryShippingInfo?userToken={userToken}&winningRecordId={winningRecordId}&invoiceNo={invoiceNo}&isBackground={isBackground}&isForce={isForce}&brandCode={brandCode}",
    getLotteryAdSlot:"/api/Lottery/Get_LotteryAdSlot?brandCode={brandCode}&activityId={activityId}"
}
/**
 * form
 */
export const FromApiList = {
    //提交formId
    uploadUserFormId: {
      u: `${visitApi}/api/Common/UploadUserFormId`,
      m: "post"
    }
}
/**
 * 分销
 */
export const DstbApiList = {

    //创建分销关系
    buildDstbRelation: {
        u: "/api/StaffDstb/Build_DstbRelation",
        m: "post"
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
        m: "post"
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
        m: "post"
    },
    applyStaffDstbInfoNoPhone:{
      u:"/api/StaffDstb/Apply_StaffDstbInfoNoPhone",
      m:"post"
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
      m:"post"
    },
    getStaffShareCouponList:"/api/StaffDstbSendCoupon/Get_StaffDstbSendCouponTaskShareList?userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    getSendCouponDetail:"/api/StaffDstbSendCoupon/Get_StaffDstbSendCouponTaskShareDetail?userToken={userToken}&shareId={shareId}&brandCode={brandCode}",
    getStaffCouponTaskRecord:"/api/StaffDstbSendCoupon/Get_StaffDstbSendCouponTaskShareGetRecord?shareId={shareId}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
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
    getStaffDstbUserReport:"/api/StaffDstb/GetStaffDstbUserReport?userToken={userToken}&brandCode={brandCode}&isToday={isToday}&begin={begin}&end={end}",
    getStaffDstbShareActivityGoodsListByGroup:"/api/StaffDstbShare/Get_StaffDstbShareActivityGoodsListByGroup?userToken={userToken}&searchStr={searchStr}&groupId={groupId}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    getStaffDstbShareActivityPageListByGroup:"/api/StaffDstbShare/Get_StaffDstbShareActivityPageListByGroup?userToken={userToken}&groupId={groupId}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    getStaffDstbShareGroupList:"/api/StaffDstbShare/GetStaffDstbShareGroupList?activityType={activityType}&brandCode={brandCode}", 
    uploadStaffDstbShareActivityShareLog: {
      u: `/api/staffdstbshare/UploadStaffDstbShareActivityShareLog`,
      m: "post"
    },
    getStaffDstbList:"/api/StaffDstb/GetStaffDstbList?searchText={searchText}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
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
export const PDAApiList = {
  pdaCheckout: {
    u: "/api/Pda/Checkout",
    m: "post"
  },
  pdaAddOrder: {
    u: "/api/Pda/AddOrder",
    m: "post"
  }

}

export const BrandApiList = {
    getMenuList: "/api/Brand/Get_MenuList?brandCode={brandCode}",
    //文章
    getArticle: "/api/Brand/Get_Article_info?article_id={article_id}&aKey={aKey}&brandCode={brandCode}",
    getDefSystemConfig: "/api/Brand/Get_DefSystemConfig?brandCode={brandCode}",
    
    getSystemConfig: "/api/Brand/GetSystemConfig?cfg_prop={cfg_prop}&brandCode={brandCode}",
    getSystemConfigList: "/api/Brand/Get_SystemConfigList?brandCode={brandCode}&cfgProps={cfgProps}",
    // getSystemConfigList: "/api/Brand/Get_SystemConfigList?cfgPropList={cfgPropList}&brandCode={brandCode}",
    //支付方式
    getPaymentList: "/api/Brand/GetPaymentList?brandCode={brandCode}",
    //收货时间
    getRectimeList: "/api/Brand/GetRectimeList?brandCode={brandCode}",
    getWxappShareConfigEntity: "/api/Brand/Get_WxappShareConfigEntity?cfgType={cfgType}&brandCode={brandCode}",
    //tabbar配置
    getBottomMenuList:"/api/Brand/Get_Bottom_MenuList?brandCode={brandCode}",
    //会员卡
    getWxMemberCard:"/api/Brand/Get_WxMemberCard?brandCode={brandCode}",
    getStartPageConfigList:"/api/Brand/GetStartPageConfigList?brandCode={brandCode}",
    getShippingList:"/api/Brand/GetShippingList?brandCode={brandCode}",
    getTpls: {
      u: "/api/Brand/GetTpls",
      m: "post"
    },
    setSubscribe: {
      u: "/api/Brand/SetSubscribe",
      m: "post"
    },
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
    m: "post"
  },
  getMyGrassCenter: "/api/Grass/Get_My_GrassCenter?userToken={userToken}&brandCode={brandCode}",
  getFriendsGrassCenter: "/api/Grass/Get_Friends_GrassCenter?userToken={userToken}&related_UserId={related_UserId}&brandCode={brandCode}",
  getMyCollectPubList: "/api/Grass/Get_My_Collect_PubList?pageIndex={pageIndex}&pageSize={pageSize}&userToken={userToken}&brandCode={brandCode}",
  getMySharePubList: "/api/Grass/Get_My_Share_PubList?pageIndex={pageIndex}&pageSize={pageSize}&userToken={userToken}&brandCode={brandCode}",
  getFriendsSharePubList: "/api/Grass/Get_Friends_Share_PubList?pageIndex={pageIndex}&pageSize={pageSize}&related_UserId={related_UserId}&brandCode={brandCode}",
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
  get_Grass_Publish_Info: "/api/Grass/Get_Grass_Publish_Info?pubId={pubId}&userToken={userToken}&brandCode={brandCode}",
  get_Grass_Pub_Related_Goods: "/api/Grass/Get_Grass_Pub_Related_Goods?pubId={pubId}&brandCode={brandCode}",
  get_Grass_Pub_ReCommend_Goods: "/api/Grass/Get_Grass_Pub_ReCommend_Goods?pubId={pubId}&brandCode={brandCode}",
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
  get_Pub_Grass_ALLCommentList: "/api/Grass/Get_Pub_Grass_ALLCommentList?pubId={pubId}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}&userToken={userToken}", 
  delPublish:{
      u:"/api/Grass/DelPubLish",
      m:"post"
  }


}

//活动api
export const ActApiList = {
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


//注册/登录
export const RegApiList = {
    userLogin: {
        u: "/api/Wechat/Login",
        m: "post"
    },
    userRegister: {
        u: "/api/Wechat/RegisterInfo",
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
    },
    saveWxUserInfo:{
      u: "/api/Wechat/SaveWxUserInfo",
      m: "post"
    },
    registerByUserProfile:{
      u: "/api/Wechat/RegisterByUserProfile",
      m: "post"
    },
    
    updateUserPortrait:{
      u: "/api/Wechat/UpdateUserPortrait",
      m: "post"
    }
}

//店铺支付
export const SmktPayApiList = {
    getPayCode: "/api/SmktPay/Get_OfflinePayCode?userToken={userToken}&brandCode={brandCode}",
    getOrderStatus: "/api/smktpay/Get_OfflineOrderPayStatus?paymentId={paymentId}&brandCode={brandCode}",
    getOfflineOrderInfo: "/api/SmktPay/Get_offlineOrderInfo?userToken={userToken}&pay_barcode={pay_barcode}&brandCode={brandCode}",
    getReqPayInfoEntity: "/api/SmktPay/Get_ReqPayInfoEntity?paymentId={paymentId}&userToken={userToken}&brandCode={brandCode}",
    getOfflineCouponusList: "/api/SmktPay/Get_offline_CouponusList?userToken={userToken}&bonusIds={bonusIds}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
    getOfflineBonusList: "/api/SmktPay/GetOfflineBonusList?userToken={userToken}&paymentId={paymentId}&brandCode={brandCode}",
    postOfflineJieSuanList: {
        u: "/api/SmktPay/Post_offlineJieSuanList",
        m: "post"
    },
    getOfflineOrderInfo_Entity: "/api/SmktPay/Get_offlineOrderInfo_Entity?paymentId={paymentId}&brandCode={brandCode}",
    //看能 获得啥奖励信息 
    getOfflineCardBenefitList: "/api/SmktPay/Get_offlineCardBenefitList?paymentId={paymentId}&brandCode={brandCode}",
    //购买获得赠送奖励信息 领取
    postOfflineOrderRewardRelease: {
        u: "/api/SmktPay/Post_offline_order_reward_release?offlineSn={offlineSn}&storeId={storeId}&brandCode={brandCode}",
        m: "post"
    },
    //历史纪录
    getOfflineOrderInfoRecordList: "/api/SmktPay/Get_offlineOrderInfoRecordList?userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
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
  getCustomPageDataList: "/api/Page/GetCustomPageDataList?pageId={pageId}&userToken={userToken}&brandCode={brandCode}",
  getALLGoodsList:"/api/Page/GetALLGoodsList?catType={catType}&cateId={cateId}&pageSize={pageSize}&pageIndex={pageIndex}&userToken={userToken}&brandCode={ brandCode}",
  // getALLGoodsListByGoodsIds:"/api/Page/GetALLGoodsListByGoodsIds?userToken={userToken}&goodIds={goodIds}&brandCode={brandCode}"
}

export const VoteApiList = {
  get_VoteActivityOptionList: "/api/Vote/Get_VoteActivityOptionList?voteActivityId={voteActivityId}&userToken={userToken}&brandCode={brandCode}",
  get_VoteResultList: "/api/Vote/Get_VoteResultList?voteActivityId={voteActivityId}&userToken={userToken}&cookieId={cookieId}&brandCode={brandCode}",
  post_VoteResult: {
    u: "/api/Vote/Post_VoteResult",
    m: "post"
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
  getOrderInfos:"/Order/GetOrderInfos?userToken={userToken}&orderId={orderId}&brandCode={brandCode}",
  getPayInfos:"/Order/GetPayInfos?userToken={userToken}&akId={akId}&userAddressId={userAddressId}&brandCode={brandCode}",
  getPayStatus:"/Order/GetPayStatus?userToken={userToken}&orderId={orderId}&brandCode={brandCode}",
  checkPay:"/Order/CheckPay?userToken={userToken}&akId={akId}",
  getOrderList:"/Order/GetOrderList?userToken={userToken}&type={type}&pageIndex={pageIndex}&pageSize={pageSize}&brandCode={brandCode}",
  unifiedorder:{
    u: "/Wx/Unifiedorder?userToken={userToken}&orderId={orderId}&brandCode={brandCode}",
    m:"post"
  },
  cancelOrder:{
    u: "/Order/CancelOrder?userToken={userToken}&orderId={orderId}&brandCode={brandCode}",
    m:"post"
  },
  checkUserRank: "/Activity/CheckUserRank?activityId={activityId}&userToken={userToken}",
  checkLimit: "/Order/CheckLimit?userToken={userToken}&activityId={activityId}&goodsId={goodsId}",
  getTpls:{
    u:"/WxMsg/GetTpls",
    m:"post"
  },
  setSubscribe:{
    u:"/WxMsg/SetSubscribe",
    m:"post"
  },
  getActivitySubscribeStatus: "/WxMsg/GetActivitySubscribeStatus?activityId={activityId}&userToken={userToken}&brandCode={brandCode}",
  getActivityGoodsUsableBonusList:"/Order/GetActivityGoodsUsableBonusList?userToken={userToken}&akId={akId}&brandCode={brandCode}&userAddressId={userAddressId}&shippingType={shippingType}&storeId={storeId}",
  getGuideFollowWechatInfo:"/Guide/GetGuideFollowWechatInfo?cookieId={cookieId}&brandCode={brandCode}",
  pushGuideFollowWechat:{
    u:"/Guide/PushGuideFollowWechat",
    m:"post"
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
    m: "post"
  },
  createVideoShoppingShared: {
    u: "/api/VideoShopping/CreateVideoShoppingSharedRecord",
    m: "post"
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
  getUserDockList:"/api/UserDock/Get_UserDockList?userToken={userToken}&brandCode={brandCode}",
  createUserDockPool: {
    u: "/api/UserDock/Create_UserDockPool",
    m: "post"
  }
}