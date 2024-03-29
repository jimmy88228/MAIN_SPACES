
export const LogMap = {

  ["pages/micro_mall/index/index"]: "INDEX",
  ["pages/micro_mall/custom_page/custom_page"]:"WYM",
  ["pages/micro_mall/category/category"]:"CATEGORY",
  ["pages/micro_mall/search/search_goods"]:"SEARCH_GOODS",
  ["pages/micro_mall/classify/classify_page"]:"CLASSIFY",
  ["pages/micro_mall/shopping/shopping_cart"]:"OCARTS",
  ["pages/micro_mall/special_shopping/shopping_cart"]:"ICARTS",
  ["pages/micro_mall/goods/goods_info"]:"SPXQ",
  ["pages/micro_mall/buy/buy"]:"BUY",
  ["pages/micro_mall/buy/buy_coupon"]:"BUY_COUPON",
  ["pages/micro_mall/buy/Mwin_buy/buy"]:"MWIN_BUY",
  ["pages/micro_mall/selfGet/self_get_set"]:"SELF_GET",
  ["pages/micro_mall/web/webForSF/SF"]:"WEB_VIEW",

  ["pages/micro_mall/agreet_page/agreet"]:"AGREET",
  ["pages/micro_mall/articles/agreet/agreet"]:"AGREET_ARTICLES",

  ["pages/micro_mall/send_goods/login_page"]:"LOGIN",
  
  ["pages/micro_mall/send_goods/store_list"]:"SEND_GOODS_STORE",
  ["pages/micro_mall/send_goods/send_goods_code"]:"SEND_GOODS_CODE",

  ["pages/micro_mall/goods_collocation/goods_collocation"]:"GOODS_COLLOCATION",
  ["pages/micro_mall/goods_collocation/collocation_list/collocation_list"]:"COLLOCATION_LIST",

  ["pages/micro_mall/goods/promote_list/promote_list"]:"PROMOTE_LIST",
  ["pages/micro_mall/goods/promote_activity/promote_activity"]:"PROMOTE_ACT",

  ["pages/micro_mall/user/user"]:"HYZY",
  ["pages/micro_mall/balance/my_balance"]:"MY_BALANCE",
  ["pages/micro_mall/integral/my_integral"]:"MY_POINT",
  ["pages/micro_mall/collection/my_collection"]: "MY_COLLECTION",
  ["pages/micro_mall/footmark/my_footmark"]: "MY_FOOTMARK",
  ["pages/micro_mall/store_mod/qr_code"]: "MY_CODE",
  ["pages/micro_mall/user_info/user_info"]: "USER_INFO",
  ["pages/micro_mall/membership_card/membership_card"]: "MEMBER_CARD",
  ["pages/micro_mall/address/address_list"]: "ADDRESS_LIST",
  ["pages/micro_mall/address/address_edit"]: "ADDRESS_EDIT",
  ["pages/micro_mall/sign/app/app_sign"]: "QDY",
  ["pages/micro_mall/stores/store_nav"]: "DPDH",
  ["pages/micro_mall/order/assist_guest"]: "ASSIST_ORDER",
  ["pages/micro_mall/coupon/my_coupon"]: "MY_COUPON",
  ["pages/micro_mall/coupon/coupon_give"]: "COUPON_GIVE",
  ["pages/micro_mall/coupon/get_coupon"]: "GET_COUPON",
  ["pages/micro_mall/coupon/check_coupon"]: "CHECK_COUPON",

  ["pages/micro_mall/prepaid/erp/prepaid_card_erp"]: "STORE_PREPAID",
  ["pages/micro_mall/prepaid/erp/prepaid_card_erp_recharge"]: "CZK1",
  ["pages/micro_mall/prepaid/erp/prepaid_card_erp_detail"]: "PREPAID_RECORD",

  ["pages/micro_mall/order/order_list"]: "ORDER_LIST",
  ["pages/micro_mall/order/order_info"]: "ORDER_INFO",
  ["pages/micro_mall/order/apply_return"]: "APPLY_RETURN",
  ["pages/micro_mall/order/order_exchange_info"]: "EXCHANGE_DETAIL",
  ["pages/micro_mall/comment/order_comment/order_comment_list"]: "ORDER_COMMEMT_LIST",
  ["pages/micro_mall/order/shipping_list/shipping_list"]: "SHIPPING_LIST",
  ["pages/micro_mall/shipping_info/shipping_info"]: "SHIPPING_INFO",
  ["pages/micro_mall/comment/mobile_order_comment/mobile_order_comment"]: "ORDER_COMMEMT_DETAIL",
  ["pages/micro_mall/comment/goods_comment_list/goods_comment_list"]: "GOODS_COMMEMT_LIST",
  ["pages/micro_mall/comment/comment_edit/comment_edit"]: "GOODS_COMMEMT_DETAIL",
  ["pages/micro_mall/comment/store_order_comment/store_order_comment"]: "STORE_ORDER_COMMENT",

  ["pages/micro_mall/distribution_center/distribution_center"]: "FX",
  ["pages/micro_mall/distribution_center/apply_for_staff/fill_information/fill_information"]: "APPLY_FX",
  ["pages/micro_mall/distribution_center/distribution_brokerage/brokerage_content/brokerage_content"]: "FX_COMMISSION",
  ["pages/micro_mall/distribution_center/distribution_brokerage/distribution_details/distribution_details"]: "COMMISSION_DETAIL",
  ["pages/micro_mall/distribution_center/distribution_brokerage/distribution_take_out/distribution_take_out"]: "COMMISSION_CASH_OUT",
  ["pages/micro_mall/distribution_center/distribution_orders_lists/distribution_orders_lists"]: [
    { 
      "record": "CASH_OUT_RECORD",
      "commission": "FX_ORDER_LIST"
    },//type
  ],
  ["pages/micro_mall/distribution_center/distribution_orders_detail/distribution_orders_detail"]: "FX_ORDER_DETAIL",
  ["pages/micro_mall/distribution_center/distribution_service/distribution_guest_detail/distribution_guest_detail"]: "MY_TEAM",
  ["pages/micro_mall/distribution_center/activity/activity"]: "FX_ACT_GOODS",
  ["pages/micro_mall/distribution_center/distribution_service/guest_follows/guest_follows"]: "MEMBER_SHIP",
  
  ["pages/micro_mall/collageGroup/my_collage"]: "MY_COLLAGE",
  ["pages/micro_mall/collageGroup/activity_list"]: "COLLAGE_ACT_LIST",
  ["pages/micro_mall/collageGroup/activity_goods_detail"]: "COLLAGE_ACT_DETAIL",
  ["pages/micro_mall/collageGroup/collage_buy_detail"]: "COLLAGE_BUY",
  ["pages/micro_mall/collageGroup/my_collage_detail"]: "COLLAGE_ORDER_DETAIL",
  ["pages/micro_mall/collageGroup/activity_rule"]: "COLLAGE_RULE",
  
  ["pages/micro_mall/plugins/presale/presale_order_list"]: "MY_PRESALE",
  ["pages/micro_mall/plugins/presale/presale_activity_list"]: "PRESALE_ACT_LIST",
  ["pages/micro_mall/plugins/presale/presale_activity_detail"]: "PRESALE_ACT_DETAIL",
  ["pages/micro_mall/plugins/presale/presale_buy_info"]: [{
    "params": ["order_id","isDetails"],
    "default":"PRESALE_BUY",//
    "1,0": "PRESALE_REST_BUY",//order_id,isDetails
    "1,1": "PRESALE_DETAIL"//order_id,isDetails
  }],

  ["pages/micro_mall/point/point_goods_list/point_goods_list"]: "JFDH",
  ["pages/micro_mall/point/point_coupon_detail/point_coupon_detail"]: "POINT_COUPON_DETAIL",
  ["pages/micro_mall/point/point_goods_detail/point_goods_detail"]: "POINT_GOODS_DETAIL",
  ["pages/micro_mall/point/point_settlement/integral_settlement"]: "POINT_GOODS_BUY",
  ["pages/micro_mall/point/point_order_detail/point_order_detail"]: "POINT_ORDER_INFO",
  ["pages/micro_mall/point/point_record/point_record"]: "POINT_EXCHANGE",

  ["pages/micro_mall/grass_navigate/index_page/index_page"]: "GRASS_INDEX",
  ["pages/micro_mall/seeding_grass/article_detail/article_detail"]: "GRASS_DETAIL",
  ["pages/micro_mall/seeding_grass/comments/comments"]: "GRASS_COMMENT",
  ["pages/micro_mall/seeding_grass/publish/publish_op/publish_next"]: "PUBLISH_PROCESS",
  ["pages/micro_mall/seeding_grass/publish/add_details/add_details"]: [
    { 
      "classify":"PUBLISH_CLASSIFY",
      "label": "PUBLISH_TAGS"
    },//type
  ],
  ["pages/micro_mall/seeding_grass/publish/add_products/add_products"]: [
    { 
      "relative": "PUBLISH_RELATED_GOODS",
      "recommend": "PUBLISH_RECOMMEND_GOODS"
    },//type
  ],
  ["pages/micro_mall/seeding_grass/my_publish/my_publish"]: "GRASS_PUBLISH",
  ["pages/micro_mall/seeding_grass/my_follow/my_follow"]: "GRASS_FOLLOW",
  ["pages/micro_mall/seeding_grass/my_fans/my_fans"]: "GRASS_FANS",
  ["pages/micro_mall/seeding_grass/my_collection/my_collection"]: "GRASS_COLLECTION",

  ["pages/micro_mall/bargain/index/my_bargain"]: "MY_BARGAIN",
  ["pages/micro_mall/bargain/index/bargain_index"]: "BARGAIN_ACT_LIST",
  ["pages/micro_mall/bargain/bargain/bargain_detail"]: "BARGAIN_ACT_DETAIL",
  ["pages/micro_mall/bargain/bargain/order_detail"]: "BARGAIN_BUY",
  ["pages/micro_mall/bargain/bargain/order_confirm"]: "BARGAIN_ORDER_DETAIL",
  ["pages/micro_mall/bargain/goods/goods_detail"]: "BARGAIN_GOODS_DETAIL",

  ["pages/micro_mall/lottery/lottery"]: "YXHD",
  ["pages/micro_mall/lottery/lottery_record/lottery_record"]: "LOTTERT_RECORD",

  ["pages/store_pay/pay_center/pay_center"]: "STORE_PAY",
  ["pages/store_pay/bouns/select_bouns"]: "STORE_PAY_BONUS",
  ["pages/store_pay/pay_result/pay_result"]: "STORE_PAY_RESULT",
  ["pages/store_pay/store_pay_history/history_list"]: "STORE_PAY_RECORD",
  ["pages/store_pay/store_pay_history/history_info"]: "STORE_PAY_RECORD_DETSIL",

  ["pages/micro_mall/activity/goods_seckill"]: "GOODS_SECKILL",

  ["pages/micro_mall/buyBonus/getBonusActivityList"]:"BUY_BONUS_ACT_LIST",
  ["pages/micro_mall/buyBonus/getBonusActivityDetail"]: "BUY_BONUS_ACT_DETAIL",
  ["pages/micro_mall/buyBonus/getBonusOrderList"]: "BUY_BONUS_ORDER_LIST",
  ["pages/micro_mall/buyBonus/getBonusOrderDetail"]: "BUY_BONUS_ORDER_DETAIL",
  ["pages/micro_mall/paypal/paypal"]: "PAYPAL",
  ["pages/micro_mall/tips_page/abnormal"]: "ABNORMAL_PAGE",
  ["pages/micro_mall/guide_point/guide_point"]:"GUIDE_PAGE",

  ["pages/micro_mall/sk/activity-sk/activity-sk"]:"SECKILL_ACT_PAGE",
  ["pages/micro_mall/sk/goods-info-sk/goods-info-sk"]:"SECKILL_GOODS_DETAIL", 
  ["pages/micro_mall/sk/orders-sk/order-confirm"]:"SECKILL_ORDER_CONFIRM",
  ["pages/micro_mall/sk/orders-sk/order-list"]:"SECKILL_ORDER_LIST",
  ["pages/micro_mall/sk/orders-sk/order-status"]:"SECKILL_ORDER_DETAIL",
  ["pages/micro_mall/sk/activity-sk/rule/rule"]:"SECKILL_ORDER_RULE",

  ["pages/micro_mall/video_shopping/v_page/index"]:"VIDEO_SHOP_PAGE",
  
  ["pages/micro_mall/stores/changeStore/changeStore"]:"CHANGE_STORE_PAGE"
};

export const WithOutLogMap = {
  ["pages/micro_mall/sk/activity-sk/activity-sk"]: true
};

export const ActionRoute = {
  ["pages/micro_mall/index/index"]: {
    "position": "INDEX",
  },
  ["pages/micro_mall/custom_page/custom_page"]: {
    "position": "WYM",
  },
  ["pages/micro_mall/index/index?pageType=isStaffPage"]: {
    "position": "FX_PAGE",
  },
  ["pages/micro_mall/custom_page/custom_page?pageType=isStaffPage"]: {
    "position": "FX_PAGE",
  },
  ["pages/micro_mall/custom_page/custom_page?pageType=noviceGuide"]: {
    "position": "NOVICE_GUIDE",
  },
  ["pages/micro_mall/guide_point/guide_point"]:{
    "position": "GUIDE_PAGE"
  },
  ["pages/micro_mall/user/user"]:{
    "position": "HYZY"
  },
  ["pages/micro_mall/sign/app/app_sign"]:{
    "position": "QDY"
  },
  ["pages/micro_mall/goods/goods_info"]: {
    "position": "SPXQ"
  },
  ["pages/micro_mall/classify/classify_page"]: {
    "position": "CLASSIFY"
  },
  ["pages/micro_mall/distribution_center/activity/activity"]: {
    "position": "FX_ACT_GOODS"
  },
  ["pages/micro_mall/goods_collocation/goods_collocation"]:{
    "position": "GOODS_COLLOCATION"
  },
  // ["pages/micro_mall/activity/goods_seckill"]:{
  //   "position": ""
  // }
}

export const ActionName = {
  "GOODS": "ADVERT_CLICK_GOODS",
  "GOODS_LIST": "ADVERT_CLICK_GOODS",
  "AD": "ADVERT_CLICK_IMAGE",
  "LOOP_AD": "ADVERT_CLICK_IMAGE",
  "SECKILL": "ADVERT_CLICK_SECKILL",
  "SECKILLHELP": "ADVERT_CLICK_SECKILL_HELP",
  "COLLAGE": "ADVERT_CLICK_COLLAGE",
  "PRESALE": "ADVERT_CLICK_PRE_SALE",
  "POINT": "ADVERT_CLICK_POINT",
  "SK_HELP":"ADVERT_CLICK_SK_HELP",
  "CONTACT_CLICK": "CONTACT_CLICK",
  "REGISTER": "REGISTER",
  "UPGRADE_SHARE": "UPGRADE_SHARE",

  // 新微页面
  "goodsList": "ADVERT_CLICK_GOODS",
  "imageAd": "ADVERT_CLICK_IMAGE",
  "map": "ADVERT_CLICK_HOTSPOT",
  "limitTimeSale": "ADVERT_CLICK_SECKILL",
  "secKill": "ADVERT_CLICK_SECKILL_HELP",
  "pinSale": "ADVERT_CLICK_COLLAGE",
  "preSale": "ADVERT_CLICK_PRE_SALE",
  "integralSale": "ADVERT_CLICK_POINT",
  "kanSale":"ADVERT_CLICK_BARGAIN",
  "packageSale": "ADVERT_CLICK_PACKAGE",

}

export const SceneChannel = {
  1008:{
    channel:"GROUP_SHARE"
  },
  1007: {
    channel: "USER_SHARE"
  },
  1014:{ // 订阅消息
    channel: "SUBMSG"
  },
  1179: { // 带#话题,包括短链接 
    channel: "SHORT_LINK"
  },
  1044: {
    channel: "GROUP_SHARE"
  },
  1065: { // url scheme 从链接进入
    channel: "LINK"
  },
  1035: {
    channel: "OFFIACCOUNT_MENU"
  },
  1043: {
    channel: "OFFIACCOUNT_MSG"
  },
  1074: {
    channel: "OFFIACCOUNT_MSG"
  },
  1082: {
    channel: "OFFIACCOUNT_MSG"
  },
  1058: {
    channel: "OFFIACCOUNT_ARTICLE"
  },
  1091: {
    channel: "OFFIACCOUNT_ARTICLE"
  },
  1037: {
    channel: "MINIPRO"
  },
  1011: {
    channel: "CUSTOM"
  },
  1012: {
    channel: "CUSTOM"
  },
  1013: {
    channel: "CUSTOM"
  },
  1047: {
    channel: "CUSTOM"
  },
  1048: {
    channel: "CUSTOM"
  },
  1049: {
    channel: "CUSTOM"
  },
  1025: {
    channel: "CUSTOM"
  },
  1031: {
    channel: "CUSTOM"
  },
  1032: {
    channel: "CUSTOM"
  },
  //视频号渠道
  1175: { // 视频号主页商店入口
    channel: "VIDEOLIVE"
  },
  1176: { // 视频号直播间主播打开小程序
    channel: "VIDEOLIVE"
  },
  1177: { // 视频号直播商品
    channel: "VIDEOLIVE"
  },
  1191: { // 视频号活动
    channel: "VIDEOLIVE"
  },
  1195: { // 视频号主页商品tab
    channel: "VIDEOLIVE"
  },
  1197: { // 视频号主播从直播间返回小游戏
    channel: "VIDEOLIVE"
  },
  1198: { // 视频号开播界面打开小游戏
    channel: "VIDEOLIVE"
  },
  
  1045: {
    channel: 'FRIENDS_CIRCLE'
  },
  1046: {
    channel: 'FRIENDS_CIRCLE'
  },
  1084: {
    channel: 'FRIENDS_CIRCLE'
  },
  // 1154: {
  //   channel: 'FRIENDS_CIRCLE'
  // },
}

export const PageType = {
  ["pages/micro_mall/distribution_center/distribution_center"]: {
    "page_type": "FX",
  },
  ["pages/micro_mall/distribution_center/distribution_orders_lists/distribution_orders_lists"]: {
    "page_type": "FX",
    "params":"dateType"
  },
  ["pages/micro_mall/distribution_center/distribution_brokerage/brokerage_content/brokerage_content"]: {
    "page_type": "FX",
  },
  ["pages/micro_mall/distribution_center/distribution_brokerage/distribution_details/distribution_details"]: {
    "page_type": "FX",
  },
  ["pages/micro_mall/distribution_center/distribution_brokerage/distribution_take_out/distribution_take_out"]: {
    "page_type": "FX",
    "params":"balance"
  },
  ["pages/micro_mall/distribution_center/distribution_service/distribution_guest_detail/distribution_guest_detail"]: {
    "page_type": "FX"
  },
  ["pages/micro_mall/distribution_center/distribution_orders_detail/distribution_orders_detail"]: {
    "page_type": "FX",
    "params": "sn"
  },
  ["pages/micro_mall/distribution_center/activity/activity"]: {
    "page_type": "FX",
  },
  ["pages/micro_mall/distribution_center/apply_for_staff/fill_information/fill_information"]: {
    "page_type": "FX",
    "params":"phone"
  },
  ["pages/micro_mall/distribution_center/apply_for_staff/staff_tip/dure"]: {
    "page_type": "FX",
  },
  ["pages/micro_mall/index/index"]: {
    "page_type": "index",
    "params":"page_id",
  }, 
  ["pages/micro_mall/custom_page/custom_page"]: {
    "page_type": "WYM",
    "params": "page_id",
  },
  ["pages/micro_mall/category/category"]:{
    "page_type":{
      ["CA"]: "BZFL",
      ["VC"]: "XNFL"
    },
    "params": "related_id"//（分类ID）
  },
  ["pages/micro_mall/goods/goods_info"]:{
    "page_type":"SPXQ",
    "params":"goods_id"
  },
  ["pages/micro_mall/user/user"]:{
    "page_type":"HYZY",
    "params":""
  },
  ["pages/micro_mall/point/point_goods_detail/point_goods_detail"]: {
    "page_type":"JFDH",
    "params":"",
  },
  ["pages/micro_mall/point/point_coupon_detail/point_coupon_detail"] :{
    "page_type": "JFDH",
    "params":""
  },
  ["pages/micro_mall/sign/sign"]:{
    "page_type":"QDY",
    "params":""
  },
  ["pages/micro_mall/sign/shop_sign"] :{
    "page_type": "QDY",
    "params": ""
  },
  ["pages/micro_mall/sign/app_sign"] :{
    "page_type": "QDY",
    "params": ""
  },
  ["pages/micro_mall/stores/store_nav"]: {
    "page_type": "DPDH",
    "params":"select_store_id"
  },
  ["pages/micro_mall/prepaid/erp/prepaid_card_erp_recharge"]:{
    "page_type": "CZK1",
    "params":"activityId"
  },
  [""]: "CZK2",//充值卡充值页面
  ["pages/micro_mall/lottery/lottery"]:{
    "page_type": "LOTTERY",
    "params": "activityId"//活动ID
  },
  ["pages/micro_mall/activity/goods_seckill"]:{
    "page_type":"SECKILL",
    "params":"issue_id"
  },
  //拼团
  ["pages/micro_mall/collageGroup/activity_list"]:{
    "page_type":"COLLAGEGROUP",
  },
  ["pages/micro_mall/collageGroup/my_collage_detail"]: {
    "page_type": "COLLAGEGROUP",
    "params":"activity_id"
  },
  ["pages/micro_mall/collageGroup/activity_goods_detail"]: {
    "page_type": "COLLAGEGROUP",
    "params":"activity_id"
  },
  ["pages/micro_mall/collageGroup/my_collage"]: {
    "page_type": "COLLAGEGROUP",
  },
  ["pages/micro_mall/collageGroup/collage_buy_detail"]: {
    "page_type": "COLLAGEGROUP",
    "params":"activityId"
  },
  ["pages/micro_mall/collageGroup/activity_rule"]: {
    "page_type": "COLLAGEGROUP",
    "params":"activity_id"
  },
  //预售
  ["pages/micro_mall/plugins/presale/presale_order_list"]:{
    "page_type":"PRESALE"
  },
  ["pages/micro_mall/plugins/presale/presale_activity_detail"]:{
    "page_type":"PRESALE",
    "params":"activity_id"
  },
  ["pages/micro_mall/plugins/presale/presale_activity_list"]:{
    "page_type":"PRESALE"
  },
  // ["pages/micro_mall/plugins/presale/presale_buy_info"]:{
  //   "page_type":"PRESALE",
  //   "params":"activityGoodsId&activityId"
  // },
  ["pages/micro_mall/plugins/presale/presale_address_list"]:{
    "page_type":"PRESALE"
  },
  ["pages/micro_mall/plugins/presale/presale_address_info"]:{
    "page_type":"PRESALE"
  },
  ["pages/micro_mall/sk/activity-sk/activity-sk"]:{
    "page_type":"SECKILL_ACT_PAGE",
    "params":"activityId"
  },
} 

export const OpKind = {
  ["NORMAL"]: "POSTER_SHARE",
  ["CUSTOM_INDEX"]: "CUSTOM_INDEX",    //首页
  ["CUSTOM_PAGE"]: "CUSTOM_PAGE",      //自定义页
  ["SECKILL_HELP"]: "SECKILL_HELP",    //秒杀活动页
  ["SECKILL_GOODS"]: "SECKILL_GOODS",  //秒杀商品页
  ["NORMAL_GOODS"]:"NORMAL_GOODS",     //普通商品
  ["PRE_SALE_GOODS"]:"PRE_SALE_GOODS", //预售商品
  ["POINT_GOODS"]:"POINT_GOODS",       //积分商品
  ["POINT_COUPON"]: "POINT_COUPON",       //积分优惠券
  ["COLLOCATE_GOODS"]: "COLLOCATE_GOODS", //搭配商品
  ["STAFF_ACTIVITY"]:"STAFF_ACTIVITY", //分销活动
  ["STAFF_GOODS"]:"STAFF_GOODS",       //分销商品
  ["STORE_STAFF_ACTIVITY"]:"STORE_STAFF_ACTIVITY", // 店铺分销活动
  ["STORE_STAFF_GOODS"]:"STORE_STAFF_GOODS", // 店铺分销商品
  ["COLLAGE_GROUP"]: "COLLAGE_GROUP",  //拼团邀请
  ["COLLAGE_GOODS"]: "COLLAGE_GOODS",  //拼团商品
  ["BARGAIN_SHARE"]: "BARGAIN_SHARE",  //砍价邀请
  ["BARGAIN_GOODS"]: "BARGAIN_GOODS",  //砍价商品
  ["VIDEO_SHOP"]: "VIDEO_SHOP",        //视频购物
  ["STAFF_INVITE"]:"STAFF_INVITE",     //分销中心邀请好友分享
  ["USER_MY_CODE"]:"USER_MY_CODE",     //个人中心我的码
  ["GUIDE_MY_CODE"]:"GUIDE_MY_CODE",   //导购中心导购码
  ["NEW_USER_SHARE"]:"NEW_USER_SHARE",    //个人中心公众号码
  ["INVITE_AWARD"]:"INVITE_AWARD",    //邀请有奖分享
  ["STORE_STAFF"]:"STORE_STAFF",  //导购公众号码
  ["STAFF_COUPON"]:"STAFF_COUPON", //分销派券
  ["FRIEND_INVITE"]:"FRIEND_INVITE", //分销派券
  ["BONUS_ACTIVITY"]:"BONUS_ACTIVITY", //付费购券
  ["STAFF_WECHAT"]:"STAFF_WECHAT"
}

export const ShareType = {
  ...OpKind,
  ["NORMAL"]: "PAGE_SHARE",
}

export const ShareConf = {
  ["pages/micro_mall/goods/goods_info"]:"goods",
  ["pages/micro_mall/plugins/presale/presale_activity_detail"]: "goods",
  ["pages/micro_mall/collageGroup/activity_goods_detail"]: "goods",
  ["pages/micro_mall/collageGroup/my_collage_detail"]:"goods",
  ["pages/micro_mall/user/user"]:"user_center",
  ["pages/micro_mall/index/index"]:"custom_page",
  ["pages/micro_mall/custom_page/custom_page"]: "custom_page",
  ["pages/micro_mall/guide_point/guide_point"]:"custom_page",
  ["pages/micro_mall/point/point_goods_list/point_goods_list"]:"point_mall",
  ["pages/store_pay/pay_center/pay_center"]:"smart_pay",
}

export const PageLogin = {
  ["pages/micro_mall/send_goods/send_goods_code"]:"need",
  ["pages/micro_mall/buy/Mwin_buy/buy"]: "need",
  ["pages/store_pay/pay_center/pay_center"]:"need",
  ["pages/micro_mall/send_goods/login_page"]: "isLogin",
  ["pages/micro_mall/user_info/user_info"]: "isLogin",
  ["pages/micro_mall/user/user"]:"isLogin",
  ["pages/micro_mall/agreet_page/agreet"]: "noNeed",
  ["pages/micro_mall/articles/agreet/agreet"]: "noNeed",
  ["pages/micro_mall/customer_service/contact_page"]: "need"
}


export const SceneType= {
  1007: { type: "card" },//"单人聊天小程序卡片",
  1008: { type: "card" },//"群聊会话小程序卡片",
  1011: { type: "qrcode" },//"扫描二维码",
  1012: { type: "qrcode" },//"长按图片识别二维码",
  1013: { type: "qrcode" },//"扫描手机相册中选取的二维码",
  1025: { type: "qrcode" },//"扫描一维码",
  1031: { type: "qrcode" },//"长按识别一维码",
  1032: { type: "qrcode" },//"扫描手机相册中选取的一维码",
  1036: { type: "card" },//"App 分享消息卡片",
  1044: { type: "card" },//"带 shareTicket 的小程序消息卡片",
  1047: { type: "qrcode" },//"扫描小程序码",
  1048: { type: "qrcode" },//"长按图片识别小程序码",
  1049: { type: "qrcode" },//"扫描手机相册中选取的小程序码",
  1072: { type: "qrcode" },//"二维码收款页面",
  1073: { type: "card" },//"客服消息列表下发的小程序消息卡片",
  1074: { type: "card" },//"公众号会话下发的小程序消息卡片",
  1096: { type: "chat" },//"聊天记录",
}
export const CardType={ 
  1007: true,//"单人聊天小程序卡片",
  1008: true,//"群聊会话小程序卡片", 
  1036: true,//"App 分享消息卡片",
  1044: true,//"带 shareTicket 的小程序消息卡片", 
  1073: true,//"客服消息列表下发的小程序消息卡片",
  1074: true,//"公众号会话下发的小程序消息卡片",
  1096: true,//"聊天记录",
  1179: true,//"#话题页打开小程序, 包括短链接"
}

export const JumpInType={
  1014: true,//小程序订阅消息
  1107: true,//订阅消息，打开小程序
  1035: true,//公众号自定义菜单
  1037: true,//小程序打开小程序,
  1038: true,//从另一个小程序返回,
  1045: true,//朋友圈广告,
  1046: true,//朋友圈广告详情页,
  1058: true,//"公众号文章",
}

export const TabKeys = {
  ["pages/micro_mall/index/index"]:"home",
  ["pages/micro_mall/classify/classify_page"]: "classify",
  ["pages/micro_mall/grass_navigate/index_page/index_page"]: "grass",
  ["pages/micro_mall/shopping/shopping_cart"]: "shoppingCart",
  ["pages/micro_mall/user/user"]: "userCenter",
  ["pages/micro_mall/video_shopping/v_index/index"]: "videoShopping",
  ["pages/micro_mall/live_custom/live_custom"]: "liveCustom",
} 
export const LimitAddLog = {
  ["pages/micro_mall/plugins/presale/presale_activity_detail"] : true,
  ["pages/micro_mall/collageGroup/activity_goods_detail"]: true,
  ["pages/micro_mall/bargain/goods/goods_detail"]: true,
  ["pages/micro_mall/sk/activity-sk/activity-sk"]: 'limitAll',
  // ["pages/micro_mall/index/index"]: "isHome"
}

export const PayType = {
        /// 储值卡支付
        prepaid_card: {
          type: "prepaid_card",
          id: 0,
        },
        /// 充值卡支付
        recharge_card:{
          type: "recharge_card",
          id: 1
        },
        /// 拼团
        pin: {
          type: "pin",
          id:2
        },
        /// 店铺支付
        sp: {
          type: "sp",
          id:3
        },
        /// 预售定金
        presale:{
          type: "presale",
          id:4
        } ,
        /// 预售尾款
        presale2:{
          type: "presale2",
          id:5
        } ,
        /// 付费会员支付
        upgrade: {
          type: "upgrade",
          id:6
        },
        /// 付费购券支付
        buyb: {
          type: "buyb",
          id:7
        },
        /// 积分商城支付
        bp: {
          type: "bp",
          id:8
        },
        /// 砍价支付
        bargain: {
          type: "bargain",
          id:9
        },
        /// 申请分销员
        staff: {
          type: "staff",
          id:10
        },
        /// 助力秒杀
        seckill: {
          type: "seckill",
          id:11
        },
        /// 普通商城订单
        order: {
          type: "order",
          id: 12
        }
}


export const KeyParamName = {
  ["pages/micro_mall/index/index"]:["page_id","index_page_id"],
  ["pages/micro_mall/custom_page/custom_page"]: ["page_id"],
  ["pages/micro_mall/category/category"]: ["func_type", "search_input","related_id"],
  ["pages/micro_mall/goods/goods_info"]: ["issued_id", "goods_id","color_id"],
  ["pages/micro_mall/buy/buy"]: ["rec_str"],
  ["pages/micro_mall/buy/buy_coupon"]: ["couponOption"],
  ["pages/micro_mall/buy/Mwin_buy/buy"]: ["rec_str"],
  ["pages/micro_mall/web/webForSF/SF"]: ["link_url"],
  ["pages/micro_mall/articles/agreet/agreet"]: ["articleId"],
  ["pages/micro_mall/goods_collocation/goods_collocation"]: ["package_id"],
  ["pages/micro_mall/goods_collocation/collocation_list/collocation_list"]: ["goodsId"],
  ["pages/micro_mall/goods/promote_activity/promote_activity"]:["ruleId"],
  ["pages/micro_mall/customer_service/contact_page"]:["goods_id"],
  ["pages/micro_mall/address/address_edit"]: ["address_id"],
  ["pages/micro_mall/coupon/get_coupon"]: ["bonus_id","bonusUserToken"],
  ["pages/micro_mall/prepaid/erp/prepaid_card_erp_recharge"]: ["activityId"],
  ["pages/micro_mall/order/order_list"]: ['orderType', 'order_type'],
  ["pages/micro_mall/order/order_info"]: ["order_id","order_sn"],
  ["pages/micro_mall/order/apply_return"]: ["order_id", "product_id", "goods_id"],
  ["pages/micro_mall/order/order_exchange_info"]: ["order_sn","return_id"],
  // ["pages/micro_mall/order/shipping_list/shipping_list"]:[],
  ["pages/micro_mall/shipping_info/shipping_info"]:["orderId"],
  ["pages/micro_mall/comment/mobile_order_comment/mobile_order_comment"]:["order_id"],
  ["pages/micro_mall/comment/goods_comment_list/goods_comment_list"]:["goods_id"],
  ["pages/micro_mall/comment/comment_edit/comment_edit"]: ["order_id","goods_id"],
  ["pages/micro_mall/comment/store_order_comment/store_order_comment"]: ["order_id","order_sn"],
  ["pages/micro_mall/comment/goods_comment_detail/goods_comment_detail"]: ["goods_id", "order_id"],
  ["pages/micro_mall/comment/order_comment/order_comment_detail"]: ["order_id", "goods_id"],

  ["pages/micro_mall/distribution_center/distribution_orders_lists/distribution_orders_lists"]: ["type"],
  ["pages/micro_mall/distribution_center/distribution_brokerage/distribution_take_out/distribution_take_out"]: ["balance"],
  ["pages/micro_mall/distribution_center/apply_for_staff/fill_information/fill_information"]: ["phone"],

  ["pages/micro_mall/collageGroup/activity_goods_detail"]: ["activity_id","goods_id"],
  ["pages/micro_mall/collageGroup/collage_buy_detail"]: ["activityId","userActivityId"],
  ["pages/micro_mall/collageGroup/my_collage_detail"]: ["activity_id","user_activity_id","captain_id"],
  ["pages/micro_mall/collageGroup/activity_rule"]: ["activity_id"],

  ["pages/micro_mall/plugins/presale/presale_activity_detail"]: ["activity_id","goods_id"],
  ["pages/micro_mall/plugins/presale/presale_buy_info"]: ["activityId","order_id","isDetails"],

  ["pages/micro_mall/point/point_coupon_detail/point_coupon_detail"]: ["mkBonusId"],
  ["pages/micro_mall/point/point_goods_detail/point_goods_detail"]: ["mkGoodsId","goodsId"],
  ["pages/micro_mall/point/point_settlement/integral_settlement"]: ["mkGoodsId","goodsId","productId"],
  ["pages/micro_mall/point/point_order_detail/point_order_detail"]: ["order_id"],

  ["pages/micro_mall/seeding_grass/article_detail/article_detail"]: ["id"],
  ["pages/micro_mall/seeding_grass/publish/add_details/add_details"]: ["type"],
  ["pages/micro_mall/seeding_grass/publish/add_products/add_products"]: ["type"],

  ["pages/micro_mall/bargain/goods/goods_detail"]: ["activityId","goods_id"],
  ["pages/micro_mall/bargain/bargain/bargain_detail"]: ["userActivityId"],
  ["pages/micro_mall/bargain/bargain/order_detail"]: ["userActivityId"],
  ["pages/micro_mall/bargain/bargain/order_confirm"]: ["userActivityId","isFromOrder"],

  ["pages/micro_mall/lottery/lottery"]: ["activityId"],
  ["pages/store_pay/pay_result/pay_result"]: ["payment_id"],
  ["pages/store_pay/store_pay_history/history_info"]: ["payment_id"],

  ["pages/micro_mall/activity/goods_seckill"]: ["issue_id"],

  ["pages/micro_mall/buyBonus/getBonusActivityDetail"]: ["activityId"],
  ["pages/micro_mall/buyBonus/getBonusOrderDetail"]: ["orderId"],

  ["pages/micro_mall/prepaid/prepaid_card_detail"]: ["card_id"],

  ["pages/micro_mall/order/erp_order_info"]: ["order_id"],

  ["pages/micro_mall/stores/store_nav"]: ["select_store_id","type","key_word"],

  ["pages/micro_mall/sk/activity-sk/activity-sk"]: ["activityId", "target","groupId"],
  ["pages/micro_mall/sk/goods-info-sk/goods-info-sk"]: ["goodsId", "activityId","groupId"],
  ["pages/micro_mall/sk/orders-sk/order-confirm"]: ["goodsId","activityId","akId"],
  ["pages/micro_mall/sk/activity-sk/rule/rule"]: ["activityId"],
  ["pages/micro_mall/sk/orders-sk/order-status"]: ["order_id","type","first"],

  ["pages/micro_mall/video_shopping/v_page/index"]: ["id"],

  ["pages/micro_mall/stores/changeStore/changeStore"]: ["cityName","lat","lon"],

};

export const ExtendKeyParamName = {
  ["STORE_CODE"]: ["store_id"],
  ["STAFF_CODE"]: ["staff_id", "store_id", "staff_code"],
  ["store_code"]: ["store_id"],
  ["staff_code"]: ["staff_id", "store_id", "staff_code"],
  ["USER_MY_CODE"]: ["store_id","staff_code"],
  ["GUIDE_MY_CODE"]: ["staff_id", "store_id", "staff_code"],
}

export const StoresForA = {
    ["pages/micro_mall/buy/buy"]: {check:true,reset:true},
    ["pages/micro_mall/index/index"]: {check:true,reset:false}, 
}

export const CheckLastRoute = {
  ["pages/micro_mall/video_shopping/v_index/index"]: {
    lastRoute:'pages/micro_mall/video_shopping/v_page/index',
    nextRoute:'pages/micro_mall/index/index'
  },
}

export const AllStaffApplyRoute = {
  ["pages/micro_mall/goods/goods_info"]: true,
  ["pages/micro_mall/point/point_goods_detail/point_goods_detail"]: true,
  ["pages/micro_mall/collageGroup/activity_goods_detail"]: true,
  ["pages/micro_mall/plugins/presale/presale_activity_detail"]: true,
  ["pages/micro_mall/goods_collocation/goods_collocation"]: true,
  ["pages/micro_mall/sk/goods-info-sk/goods-info-sk"]: true,
  ["pages/micro_mall/bargain/goods/goods_detail"]: true
}

export const videoAccountType = {
  1175: { type: "videoAccountIndexGoods" },
  1177: { type: "videoAccountLiveGoods" },
}
