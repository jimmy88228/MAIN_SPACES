const TESTCONFIG = {
  "UseBrandBgColor": 1,
  "brand_name": "金王测试",
  "brand_name_en": "KINGCODE",
  "BRAND_CODE": "KINGCODE",
  "brand_id":"160",
  "is_onlyUserCenter": 0,
  "icon_url": "https://jwimgtest.innourl.com/wechat_applet_image/icon/KINGCODE/",
  "logo_path": "https://jwimgtest.innourl.com/wechat_applet_image/icon/KINGCODE/",
  "default_icon_url": "https://jwimgtest.innourl.com/wechat_applet_image/icon/default/",
  "uploadImgUrl": "https://jwimgtest.innourl.com/ImgManager/ImgUpload/UploadImage",
  "uploadMvUrl": "https://jwimgtest.innourl.com/ImgManager/MvUpLoad/UploadMv",
  "videoUrl": "https://jwimgtest.innourl.com/saas_image/",
  "webViewUrl": "https://jwweb01.innourl.com",
  "webMh5Url":"https://jwweb01.innourl.com/mh5/pages/home/jump",
  "webContactUrl":"http://jwweb01.innourl.com/mobile/customer_service.php",
  "webSatffContactUrl":"http://jwweb01.innourl.com/staff_wap/cs_service.php",
  "style": {
    "font_color": "rgba(205,113,143,1)",
    "bg_color": "rgba(205,113,143,1)",
    "nav_bg_color": "rgba(253,250,255,1)",
    "nav_border_color": "rgba(217, 203, 226, 1)",
    "comment_bg_color": "rgba(255,248,250,1)",
    "pro_color": "#CB7090",
    "bargain_color": {
      "theme_color": "rgba(225, 27, 27, 1)",
      "to_color": "#FF4F4B",
      "from_color": "#E11425"
    },
    "pre_color": {
      "to_color": "#CB7090",
      "from_color": "#EA86B2",
      "tag_color": "#fe3333"
    },
    "pt_color": {
      "to_color": "#CB7090",
      "from_color": "#EA86B2"
    },
    "p_color": {
      "to_color": "#CB7090",
      "from_color": "#EA86B2"
    },
    "sk_color": {
      "to_color": "#CB7090",
      "from_color": "#EA86B2"
    },
    "bc_color": {
      "font_color": "#DE0016"
    },
    "n_sk_color": {
      "theme_color":"rgba(248, 81, 9, 1)",
      "to_color": "#F85109",
      "from_color": "#EA3800"
    },
    "v_color": {
      "theme_color": "rgba(228, 10, 35, 1)",
    },
  },
  "tabbar_list":[
    {
        "pagePath": "pages/micro_mall/index/index",
        "text": "首页",
        "iconPath": "/images/micro_mall/tabBar/Homes.png",
        "selectedIconPath": "/images/micro_mall/tabBar/getHomes.png"
      },
      {
        "pagePath": "pages/micro_mall/classify/classify_page",
        "text": "商品分类",
        "iconPath": "/images/micro_mall/tabBar/Classify.png",
        "selectedIconPath": "/images/micro_mall/tabBar/getClassify.png"
      },  
      {
        "pagePath": "pages/micro_mall/grass_navigate/index_page/index_page",
        "text": "种草社区",
        "iconPath": "/images/micro_mall/tabBar/Grass.png",
        "selectedIconPath": "/images/micro_mall/tabBar/getGrass.png"
      },
      {
        "pagePath": "pages/micro_mall/shopping/shopping_cart",
        "text": "购物车",
        "iconPath": "/images/micro_mall/tabBar/Carts.png",
        "selectedIconPath": "/images/micro_mall/tabBar/getCarts.png"
      },
      {
        "pagePath": "pages/micro_mall/user/user",
        "text": "个人中心",
        "iconPath": "/images/micro_mall/tabBar/Users.png",
        "selectedIconPath": "/images/micro_mall/tabBar/getUsers.png"
      }
  ],
  "api_domain": {
    "VSLOGAPI": "https://test.izhongzhuang.com",
    "GOODSAPI": "https://test.izhongzhuang.com",
    "USERAPI": "https://test.izhongzhuang.com",
    "BUYAPI": "https://test.izhongzhuang.com",
    "REGAPI": "https://test.izhongzhuang.com",
    "POINTAPI": "https://jwimtest.innourl.com",
    "COLLAGEAPI": "https://jwpttest.innourl.com",
    "PAYAPI": "https://jwpaytest.innourl.com",
    "PRESALEAPI": "https://test.izhongzhuang.com",
    "STAFFAPI": "https://test.izhongzhuang.com",
    "MAINAPI": "",
    "MAPAPI": "https://restapi.amap.com",
    //店铺支付
    "SMKTPAYAPI": "https://test.izhongzhuang.com",
    "GRASSAPI":"https://test.izhongzhuang.com/GrassApi",
    "PAGEAPI":"https://test.izhongzhuang.com",
    "BARGAINAPI": "https://test.izhongzhuang.com/BargainApi",
    "MEMBERCARDAPI":"https://test.izhongzhuang.com",
    "ACTAPI":"https://test.izhongzhuang.com",
    "LOTTERYAPI":"https://test.izhongzhuang.com/LotteryApi",
    "SECKILLAPI":"https://test.izhongzhuang.com/SecKill",
    "VOTEAPI":"https://test.izhongzhuang.com/VoteApi",
    "VIDEOSHOPAPI":"https://test.izhongzhuang.com",
    "BARCODEAPI": "https://test.izhongzhuang.com",
    "LIVEAPI": "https://test.izhongzhuang.com"
  },
  
  //全部显示
  staffConf: {
    commission: {
      isOpen: 1,
      cashOutTip: 0
    },
    service: {
      isOpen: 1,
      fans: 1,
      hotGoods: 1,
      hotAct: 1,
      share: 1,
      newGuide: 1,
      guestFollows: 1,
      dataWeb:1,
      storesWeb:1,
      staffCoupon: 1
    },
    orderList: {
      commAmount: 1,
      allSale: 1,
      singleSale: 1
    },
    orderDetail: {
      commAmount: 1
    }
  },
}
//卡尔丹顿
const KEDD = {
  "UseBrandBgColor": 1,
  "brand_name": "卡尔体验",
  "brand_name_en": "KL",
  "BRAND_CODE": "KEDD",
  "icon_url": "https://KLIMG.innourl.cn/wechat_applet_image/icon/KLTY/",
  "logo_path": "https://jwimgtest.innourl.com/wechat_applet_image/icon/KLTY/",
  "default_icon_url": "https://KLIMG.innourl.cn/wechat_applet_image/icon/default/",
  "uploadImgUrl": "https://KLIMG.innourl.cn/ImgManager/ImgUpload/UploadImage",
  "uploadMvUrl": "https://KLVIDEO.innourl.cn/ImgManager/MvUpLoad/UploadMv",
  "videoUrl": "https://KLVIDEO.innourl.cn/",
  "webViewUrl": "",
  "style": {
    "font_color": "#222222",
    "bg_color": "#222222",
    "nav_bg_color": "#fff",
    "nav_border_color": "#222222",
    "comment_bg_color": "#fff",
    "pro_color": "#d61c2d",
    "bargain_color": {
      "theme_color": "rgba(225, 27, 27, 1)",
      "to_color": "#FF4F4B",
      "from_color": "#E11425"
    },
    "pre_color": {
      "to_color": "#d61c2d",
      "from_color": "#f03408",
      "tag_color": "#fe3333"
    },
    "pt_color": {
      "to_color": "#d61c2d",
      "from_color": "#f03408"
    },
    "p_color": {
      "to_color": "#d61c2d",
      "from_color": "#f03408"
    },
    "sk_color": {
      "to_color": "#d61c2d",
      "from_color": "#f03408"
    },
    "bc_color": {
      "font_color": "#DE0016"
    },
  },
  "api_domain": {
    "VSLOGAPI": "https://KLVSLOGAPI.innourl.cn",
    "GOODSAPI": "https://KLGOODSAPI.innourl.cn",
    "USERAPI": "https://KLUSERAPI.innourl.cn",
    "BUYAPI": "https://KLBUYAPI.innourl.cn",
    "REGAPI": "https://KLREGAPI.innourl.cn",
    "POINTAPI": "https://KLINTGAPI.innourl.cn",
    "COLLAGEAPI": "https://KLGBAPI.innourl.cn",
    "PAYAPI": "https://KLPAYAPI.innourl.cn",
    "PRESALEAPI": "https://KLPRSAPI.innourl.cn",
    "STAFFAPI": "https://KLUSERAPI.innourl.cn",
    "MAINAPI": "",
    "MAPAPI": "https://restapi.amap.com",
    //店铺支付
    "SMKTPAYAPI": "",
    "GRASSAPI": "https://KLACTAPI.innourl.cn",
    "PAGEAPI": "",
    "MEMBERCARDAPI": "https://KLACTAPI.innourl.cn",
    "LOTTERYAPI": "https://klactapi.innourl.cn/Lottery"
  },
  //全部显示
  staffConf: {
    commission: {
      isOpen: 1,
      cashOutTip: 0
    },
    service: {
      isOpen: 1,
      fans: 1,
      hotGoods: 1,
      hotAct: 1,
      share: 1,
      newGuide: 1,
      guestFollows: 1,
      dataWeb:1,
      storesWeb:1,
    },
    orderList: {
      commAmount: 1,
      allSale: 1,
      singleSale: 1
    },
    orderDetail: {
      commAmount: 1
    }
  },
}
const GOSO = {
  "UseBrandBgColor": 1,
  "brand_name": "香蜜闺秀",
  "brand_id": 2,
  "brand_name_en": "GOSO",
  "BRAND_CODE": "GOSO",
  "icon_url": "https://gosoimg.igoso.com.cn/wechat_applet_image/icon/GOSO/",
  "logo_path": "https://gosoimg.igoso.com.cn/wechat_applet_image/icon/GOSO/",
  "default_icon_url": "https://gosoimg.igoso.com.cn/wechat_applet_image/icon/default/",
  "uploadImgUrl": "https://gosoimg.igoso.com.cn/ImgManager/ImgUpload/UploadImage",
  "uploadMvUrl": "https://gosoimg.igoso.com.cn/ImgManager/MvUpLoad/UploadMv",
  "videoUrl": "https://gosovideo.igoso.com.cn/",
  "webViewUrl": "",
  "webContactUrl": "https://goso.innourl.cn/mobile/customer_service.php",
  "webMh5Url": "https://kfgd.igoso.com.cn/pages/home/jump",
  "style": {
    "font_color": "#F19234",
    "bg_color": "#F19234",
    "nav_bg_color": "#fff",
    "nav_border_color": "#222222",
    "comment_bg_color": "#fff",
    "pro_color": "#d61c2d",
    "bargain_color": {
      "theme_color": "rgba(225, 27, 27, 1)",
      "to_color": "#FF4F4B",
      "from_color": "#E11425"
    },
    "pre_color": {
      "to_color": "#d61c2d",
      "from_color": "#f03408",
      "tag_color": "#fe3333"
    },
    "pt_color": {
      "to_color": "#d61c2d",
      "from_color": "#f03408"
    },
    "p_color": {
      "to_color": "#d61c2d",
      "from_color": "#f03408"
    },
    "sk_color": {
      "to_color": "#d61c2d",
      "from_color": "#f03408"
    },
    "bc_color": {
      "font_color": "#DE0016"
    },
    "n_sk_color": {
      "theme_color": "rgba(248, 81, 9, 1)",
      "to_color": "#F85109",
      "from_color": "#EA3800"
    },
  },
  //全部显示
  staffConf: {
    commission: {
      isOpen: 1,
      cashOutTip: 0
    },
    service: {
      rank: 1,
      isOpen: 1,
      fans: 1,
      hotGoods: 1,
      hotAct: 1,
      share: 1,
      newGuide: 1,
      guestFollows: 1,
      dataWeb: 1,
      storesWeb: 1,
      staffCoupon: 1
    },
    orderList: {
      commAmount: 1,
      allSale: 1,
      singleSale: 1
    },
    orderDetail: {
      commAmount: 1
    }
  },
  "tabbar_list":[
    {
        "pagePath": "pages/micro_mall/index/index",
        "text": "首页",
        "iconPath": "/images/micro_mall/tabBar/Homes.png",
        "selectedIconPath": "/images/micro_mall/tabBar/getHomes.png"
      },
      {
        "pagePath": "pages/micro_mall/classify/classify_page",
        "text": "商品分类",
        "iconPath": "/images/micro_mall/tabBar/Classify.png",
        "selectedIconPath": "/images/micro_mall/tabBar/getClassify.png"
      },
    {
      "pagePath": "pages/micro_mall/live_custom/live_custom",
      "text": "直播",
      "iconPath": "/images/micro_mall/tabBar/liveCustom.png",
      "selectedIconPath": "/images/micro_mall/tabBar/getLiveCustom.png"
    },
      {
        "pagePath": "pages/micro_mall/shopping/shopping_cart",
        "text": "购物车",
        "iconPath": "/images/micro_mall/tabBar/Carts.png",
        "selectedIconPath": "/images/micro_mall/tabBar/getCarts.png"
      },
      {
        "pagePath": "pages/micro_mall/user/user",
        "text": "个人中心",
        "iconPath": "/images/micro_mall/tabBar/Users.png",
        "selectedIconPath": "/images/micro_mall/tabBar/getUsers.png"
      }
  ],
  "api_domain": {
    "VSLOGAPI": "https://gosovslogapi.igoso.com.cn",
    "GOODSAPI": "https://gosogoodsapi.igoso.com.cn",
    "USERAPI": "https://gosouserapi.igoso.com.cn",
    "BUYAPI": "https://gosobuyapi.igoso.com.cn",
    "REGAPI": "https://gosoregapi.igoso.com.cn",
    "POINTAPI": "https://gosomktapi.igoso.com.cn/PointMktApi",
    "COLLAGEAPI": "https://gosomktapi.igoso.com.cn/CollageGroupApi",
    "PAYAPI": "https://gosopayapi.igoso.com.cn",
    "PRESALEAPI": "https://gosomktapi.igoso.com.cn/PresaleApi",
    "STAFFAPI": "https://gosouserapi.igoso.com.cn",
    "MAINAPI": "",
    "MAPAPI": "https://restapi.amap.com",
    //店铺支付
    "SMKTPAYAPI": "",
    "GRASSAPI": "https://gosoactapi.igoso.com.cn",
    "PAGEAPI": "",
    "MEMBERCARDAPI": "https://gosouserapi.igoso.com.cn",
    "ACTAPI": "https://gosoactapi.igoso.com.cn/BuyBonus",
    "LOTTERYAPI": "https://gosoactapi.igoso.com.cn/Lottery",
    "SECKILLAPI": "https://gosomktapi.igoso.com.cn/SeckillApi",
    "LIVEAPI": "https://gosoactapi.igoso.com.cn/LiveApi"
  }
}
const TBH = {
  "UseBrandBgColor": 1,
  "brand_name": "香蜜闺秀",
  "brand_id": 2,
  "brand_name_en": "GOSO",
  "BRAND_CODE": "GOSO",
  "icon_url": "https://gosoimg.igoso.com.cn/wechat_applet_image/icon/GOSO/",
  "logo_path": "https://gosoimg.igoso.com.cn/wechat_applet_image/icon/GOSO/",
  "default_icon_url": "https://gosoimg.igoso.com.cn/wechat_applet_image/icon/default/",
  "uploadImgUrl": "https://gosoimg.igoso.com.cn/ImgManager/ImgUpload/UploadImage",
  "uploadMvUrl": "https://gosoimg.igoso.com.cn/ImgManager/MvUpLoad/UploadMv",
  "videoUrl": "https://gosovideo.igoso.com.cn/",
  "webViewUrl": "",
  "webContactUrl": "https://goso.innourl.cn/mobile/customer_service.php",
  "webMh5Url": "https://kfgd.igoso.com.cn/pages/home/jump",
  "style": {
    "font_color": "#F19234",
    "bg_color": "#F19234",
    "nav_bg_color": "#fff",
    "nav_border_color": "#222222",
    "comment_bg_color": "#fff",
    "pro_color": "#d61c2d",
    "bargain_color": {
      "theme_color": "rgba(225, 27, 27, 1)",
      "to_color": "#FF4F4B",
      "from_color": "#E11425"
    },
    "pre_color": {
      "to_color": "#d61c2d",
      "from_color": "#f03408",
      "tag_color": "#fe3333"
    },
    "pt_color": {
      "to_color": "#d61c2d",
      "from_color": "#f03408"
    },
    "p_color": {
      "to_color": "#d61c2d",
      "from_color": "#f03408"
    },
    "sk_color": {
      "to_color": "#d61c2d",
      "from_color": "#f03408"
    },
    "bc_color": {
      "font_color": "#DE0016"
    },
    "n_sk_color": {
      "theme_color": "rgba(248, 81, 9, 1)",
      "to_color": "#F85109",
      "from_color": "#EA3800"
    },
  },
  //全部显示
  staffConf: {
    commission: {
      isOpen: 1,
      cashOutTip: 0
    },
    service: {
      rank: 1,
      isOpen: 1,
      fans: 1,
      hotGoods: 1,
      hotAct: 1,
      share: 1,
      newGuide: 1,
      guestFollows: 1,
      dataWeb: 1,
      storesWeb: 1,
      staffCoupon: 1
    },
    orderList: {
      commAmount: 1,
      allSale: 1,
      singleSale: 1
    },
    orderDetail: {
      commAmount: 1
    }
  },
  "tabbar_list":[
    {
        "pagePath": "pages/micro_mall/index/index",
        "text": "首页",
        "iconPath": "/images/micro_mall/tabBar/Homes.png",
        "selectedIconPath": "/images/micro_mall/tabBar/getHomes.png"
      },
      {
        "pagePath": "pages/micro_mall/classify/classify_page",
        "text": "商品分类",
        "iconPath": "/images/micro_mall/tabBar/Classify.png",
        "selectedIconPath": "/images/micro_mall/tabBar/getClassify.png"
      },
      
      {
        "pagePath": "pages/micro_mall/grass_navigate/index_page/index_page",
        "text": "种草社区",
        "iconPath": "/images/micro_mall/tabBar/Grass.png",
        "selectedIconPath": "/images/micro_mall/tabBar/getGrass.png"
      },
      {
        "pagePath": "pages/micro_mall/shopping/shopping_cart",
        "text": "购物车",
        "iconPath": "/images/micro_mall/tabBar/Carts.png",
        "selectedIconPath": "/images/micro_mall/tabBar/getCarts.png"
      },
      {
        "pagePath": "pages/micro_mall/user/user",
        "text": "个人中心",
        "iconPath": "/images/micro_mall/tabBar/Users.png",
        "selectedIconPath": "/images/micro_mall/tabBar/getUsers.png"
      }
  ],
  "api_domain": {
    "VSLOGAPI": "https://provslogapi.innourl.com",
    "GOODSAPI": "https://progoodsapi.innourl.com",
    "USERAPI": "https://prouserapi.innourl.com",
    "BUYAPI": "https://probuyapi.innourl.com",
    "REGAPI": "https://proregapi.innourl.com",
    "POINTAPI": "https://promktapi.innourl.com/PointMktApi",
    "COLLAGEAPI": "https://promktapi.innourl.com/CollageGroupApi",
    "PRESALEAPI": "https://promktapi.innourl.com/PresaleApi",
    "PAYAPI": "https://propayapi.innourl.com",
    "STAFFAPI": "https://prouserapi.innourl.com",
    "MAINAPI": "",
    "MAPAPI": "https://restapi.amap.com",
    //店铺支付
    "SMKTPAYAPI": "",
    "GRASSAPI": "https://proactapi.innourl.com/GrassApi",
    "PAGEAPI": "",
    "BARGAINAPI": "https://promktapi.innourl.com/BargainApi",
    "MEMBERCARDAPI": "https://prouserapi.innourl.com",
    "ACTAPI": "https://proactapi.innourl.com/BuyBonusApi",
    "LIVEAPI": "https://proactapi.innourl.com/LiveApi"
  },
}
const FORMALCONFIG = {
  "UseBrandBgColor": 1,
  "brand_name": "管理小程序",
  "brand_name_en": "ZZYXCODE",
  "BRAND_CODE": "ZZYXCODE",
  "icon_url": "https://jwwximage.chinakingking.com/wechat_applet_image/icon/ZZ/",
  "logo_path": "https://jwwximage.chinakingking.com/wechat_applet_image/icon/ZZ/",
  "default_icon_url": "https://jwwximage.chinakingking.com/wechat_applet_image/icon/default/",
  "uploadImgUrl": "https://jwwximage.chinakingking.com/ImgManager/ImgUpload/UploadImage",
  "uploadMvUrl": "https://jwwximage.chinakingking.com/ImgManager/MvUpLoad/UploadMv",
  "videoUrl": "https://jwwxvideo.chinakingking.com/",
  "webViewUrl": "https://jwwxcs.chinakingking.com",
  "style": {
    "font_color": "#d50037",//"rgba(205,113,143,1)",
    "bg_color": "#d50037",//"rgba(205,113,143,1)",
    "nav_bg_color": "rgba(253,250,255,1)",
    "nav_border_color": "rgba(217, 203, 226, 1)",
    "comment_bg_color": "rgba(255,248,250,1)",
    "bargain_color": {
        "theme_color": "rgba(225, 27, 27, 1)",
        "to_color": "#FF4F4B",
        "from_color": "#E11425"
    },
    "bc_color": {
      "font_color": "#DE0016"
    },
  },
  "staffConf": {
    "service": {
      "isOpen": 1,
      "hotAct": 1,
      "hotGoods": 1
    }
  },
  "api_domain": {
    "VSLOGAPI": "https://provslogapi.innourl.com",
    "GOODSAPI": "https://progoodsapi.innourl.com",
    "USERAPI": "https://prouserapi.innourl.com",
    "BUYAPI": "https://probuyapi.innourl.com",
    "REGAPI": "https://proregapi.innourl.com",
    "POINTAPI": "https://promktapi.innourl.com/PointMktApi",
    "COLLAGEAPI": "https://promktapi.innourl.com/CollageGroupApi",
    "PRESALEAPI": "https://promktapi.innourl.com/PresaleApi",
    "PAYAPI": "https://propayapi.innourl.com",
    "STAFFAPI": "https://prouserapi.innourl.com",
    "MAINAPI": "",
    "MAPAPI": "https://restapi.amap.com",
    //店铺支付
    "SMKTPAYAPI": "",
    "GRASSAPI": "https://proactapi.innourl.com/GrassApi",
    "PAGEAPI": "",
    "BARGAINAPI": "https://promktapi.innourl.com/BargainApi",
    "MEMBERCARDAPI": "https://prouserapi.innourl.com",
    "ACTAPI": "https://proactapi.innourl.com/BuyBonusApi",
    "LIVEAPI": "https://proactapi.innourl.com/LiveApi"
  },
  "tabbar_list":[
    {
        "pagePath": "pages/micro_mall/index/index",
        "text": "首页",
        "iconPath": "/images/micro_mall/tabBar/Homes.png",
        "selectedIconPath": "/images/micro_mall/tabBar/getHomes.png"
      },
      {
        "pagePath": "pages/micro_mall/classify/classify_page",
        "text": "商品分类",
        "iconPath": "/images/micro_mall/tabBar/Classify.png",
        "selectedIconPath": "/images/micro_mall/tabBar/getClassify.png"
      },
    // {
    //   "pagePath": "pages/micro_mall/video_shopping/v_index/index",
    //   "text": "视频购物",
    //   "iconPath": "/images/micro_mall/tabBar/videoShop.png",
    //   "selectedIconPath": "/images/micro_mall/tabBar/getVideoShop.png"
    // },
    {
      "pagePath": "pages/micro_mall/live_custom/live_custom",
      "text": "直播",
      "iconPath": "/images/micro_mall/tabBar/liveCustom.png",
      "selectedIconPath": "/images/micro_mall/tabBar/getLiveCustom.png"
    },
      {
        "pagePath": "pages/micro_mall/shopping/shopping_cart",
        "text": "购物车",
        "iconPath": "/images/micro_mall/tabBar/Carts.png",
        "selectedIconPath": "/images/micro_mall/tabBar/getCarts.png"
      },
      {
        "pagePath": "pages/micro_mall/user/user",
        "text": "个人中心",
        "iconPath": "/images/micro_mall/tabBar/Users.png",
        "selectedIconPath": "/images/micro_mall/tabBar/getUsers.png"
      }
  ]
}
const SINGLE_DOG = {
  "UseBrandBgColor": 1,
  "brand_name": "香蜜闺秀",
  "brand_name_en": "KM",
  "BRAND_CODE": "KM",
  "icon_url": "https://innoimage.innourl.cn/wechat_applet_image/icon/KLTY/",
  "logo_path": "https://innoimage.innourl.cn/wechat_applet_image/icon/KLTY/",
  "default_icon_url": "https://KLIMG.innourl.cn/wechat_applet_image/icon/default/",
  "uploadImgUrl": "https://KLIMG.innourl.cn/ImgManager/ImgUpload/UploadImage",
  "uploadMvUrl": "https://KLVIDEO.innourl.cn/ImgManager/MvUpLoad/UploadMv",
  // "videoUrl": "https://innoimage.innourl.cn/",
  "videoUrl": "https://innovideo.innourl.cn/",
  "webViewUrl": "",
  "webContactUrl": "http://goso.innourl.cn/mobile/customer_service.php",
  "style": {
    "font_color": "#F19234",
    "bg_color": "#F19234",
    "nav_bg_color": "#fff",
    "nav_border_color": "#222222",
    "comment_bg_color": "#fff",
    "pro_color": "#d61c2d",
    "bargain_color": {
      "theme_color": "rgba(225, 27, 27, 1)",
      "to_color": "#FF4F4B",
      "from_color": "#E11425"
    },
    "pre_color": {
      "to_color": "#d61c2d",
      "from_color": "#f03408",
      "tag_color": "#fe3333"
    },
    "pt_color": {
      "to_color": "#d61c2d",
      "from_color": "#f03408"
    },
    "p_color": {
      "to_color": "#d61c2d",
      "from_color": "#f03408"
    },
    "sk_color": {
      "to_color": "#d61c2d",
      "from_color": "#f03408"
    },
    "n_sk_color": {
      "theme_color": "rgba(248, 81, 9, 1)",
      "to_color": "#F85109",
      "from_color": "#EA3800"
    },
    "bc_color": {
      "font_color": "#DE0016"
    },
  },
  //全部显示
  staffConf: {
    commission: {
      isOpen: 1,
      cashOutTip: 0
    },
    service: {
      isOpen: 1,
      fans: 1,
      hotGoods: 1,
      hotAct: 1,
      share: 1,
      newGuide: 1,
      guestFollows: 1,
      dataWeb:1,
      storesWeb:1,
      staffCoupon: 1
    },
    orderList: {
      commAmount: 1,
      allSale: 1,
      singleSale: 1
    },
    orderDetail: {
      commAmount: 1
    }
  },
  "api_domain": {
    "VSLOGAPI": "https://innovslogapi.innourl.cn",
    "GOODSAPI": "https://innogoodsapi.innourl.cn",
    "USERAPI": "https://innouserapi.innourl.cn",
    "BUYAPI": "https://innobuyapi.innourl.cn",
    "REGAPI": "https://innoregapi.innourl.cn",
    "POINTAPI": "https://innoprsapi.innourl.cn/PointMktApi",
    "COLLAGEAPI": "https://innoptapi.innourl.cn/CollageGroupApi",
    "PAYAPI": "https://innopayapi.innourl.cn",
    "PRESALEAPI": "https://innoprsapi.innourl.cn/PresaleApi",
    "STAFFAPI": "https://innouserapi.innourl.cn",
    "MAINAPI": "",
    "MAPAPI": "https://restapi.amap.com",
    //店铺支付
    "SMKTPAYAPI": "",
    "GRASSAPI": "https://innoactapi.innourl.cn",
    "PAGEAPI": "",
    "MEMBERCARDAPI": "https://innouserapi.innourl.cn",
    "LOTTERYAPI": "https://innoactapi.innourl.cn/LotteryApi",
    "BARGAINAPI": "https://innoptapi.innourl.cn/BargainApi",
    "LIVEAPI": "https://innoactapi.innourl.cn/LiveApi"
  },
  "tabbar_list": [
    {
      "pagePath": "pages/micro_mall/index/index",
      "text": "首页",
      "iconPath": "/images/micro_mall/tabBar/Homes.png",
      "selectedIconPath": "/images/micro_mall/tabBar/getHomes.png"
    },
    {
      "pagePath": "pages/micro_mall/classify/classify_page",
      "text": "商品分类",
      "iconPath": "/images/micro_mall/tabBar/Classify.png",
      "selectedIconPath": "/images/micro_mall/tabBar/getClassify.png"
    },
    // {
    //   "pagePath": "pages/micro_mall/video_shopping/v_index/index",
    //   "text": "视频购物",
    //   "iconPath": "/images/micro_mall/tabBar/videoShop.png",
    //   "selectedIconPath": "/images/micro_mall/tabBar/getVideoShop.png"
    // },
    {
      "pagePath": "pages/micro_mall/live_custom/live_custom",
      "text": "直播",
      "iconPath": "/images/micro_mall/tabBar/liveCustom.png",
      "selectedIconPath": "/images/micro_mall/tabBar/getLiveCustom.png"
    },
    {
      "pagePath": "pages/micro_mall/shopping/shopping_cart",
      "text": "购物车",
      "iconPath": "/images/micro_mall/tabBar/Carts.png",
      "selectedIconPath": "/images/micro_mall/tabBar/getCarts.png"
    },
    {
      "pagePath": "pages/micro_mall/user/user",
      "text": "个人中心",
      "iconPath": "/images/micro_mall/tabBar/Users.png",
      "selectedIconPath": "/images/micro_mall/tabBar/getUsers.png"
    }
  ],
}

const JINGLANGTS = {
  "UseBrandBgColor": 1,
  "brand_name": "jinlang",
  "brand_name_en": "jinlang",
  "BRAND_CODE": "JINGLANGTS",
  "icon_url": "https://JLIMG.highwavesports.com/wechat_applet_image/icon/KLTY/",
  "logo_path": "https://JLIMG.highwavesports.com/wechat_applet_image/icon/KLTY/",
  "default_icon_url": "https://JLIMG.highwavesports.com/wechat_applet_image/icon/default/",
  "uploadImgUrl": "https://KLIMG.innourl.cn/ImgManager/ImgUpload/UploadImage",
  "uploadMvUrl": "https://KLVIDEO.innourl.cn/ImgManager/MvUpLoad/UploadMv",
  // "videoUrl": "https://innoimage.innourl.cn/",
  "videoUrl": "https://innovideo.innourl.cn/",
  "webViewUrl": "",
  "webContactUrl": "http://goso.innourl.cn/mobile/customer_service.php",
  "style": {
    "font_color": "#F19234",
    "bg_color": "#F19234",
    "nav_bg_color": "#fff",
    "nav_border_color": "#222222",
    "comment_bg_color": "#fff",
    "pro_color": "#d61c2d",
    "bargain_color": {
      "theme_color": "rgba(225, 27, 27, 1)",
      "to_color": "#FF4F4B",
      "from_color": "#E11425"
    },
    "pre_color": {
      "to_color": "#d61c2d",
      "from_color": "#f03408",
      "tag_color": "#fe3333"
    },
    "pt_color": {
      "to_color": "#d61c2d",
      "from_color": "#f03408"
    },
    "p_color": {
      "to_color": "#d61c2d",
      "from_color": "#f03408"
    },
    "sk_color": {
      "to_color": "#d61c2d",
      "from_color": "#f03408"
    },
    "bc_color": {
      "font_color": "#DE0016"
    },
  },

  "api_domain": {
    "VSLOGAPI": "https://JLVSLOGAPI.highwavesports.com",
    "GOODSAPI": "https://JLGOODSAPI.highwavesports.com",
    "USERAPI": "https://JLUSERAPI.highwavesports.com",
    "BUYAPI": "https://JLBUYAPI.highwavesports.com",
    "REGAPI": "https://JLUSERAPI.highwavesports.com",
    "POINTAPI": "https://JLINTGAPI.highwavesports.com",
    "COLLAGEAPI": "https://JLGBAPI.highwavesports.com",
    "PAYAPI": "https://JLPAYAPI.highwavesports.com",
    "PRESALEAPI": "https://JLPRSAPI.highwavesports.com",
    "STAFFAPI": "https://JLUSERAPI.highwavesports.com",
    "MAINAPI": "",
    "MAPAPI": "https://restapi.amap.com",
    //店铺支付
    "SMKTPAYAPI": "",
    "GRASSAPI": "https://jlactapi.highwavesports.com/Grass",
    "PAGEAPI": "",
    "MEMBERCARDAPI": "https://JLUSERAPI.highwavesports.com",
    "LOTTERYAPI": "https://jlactapi.highwavesports.com/LotteryApi",
    "BARGAINAPI": "https://jlactapi.highwavesports.com/BargainApi",
    "BARCODEAPI": "https://jlqrcodeapi.highwavesports.com",
    "VOTEAPI":"https://jlactapi.highwavesports.com/VoteApi"
  }
}


function getSetConfig(config = {}){
  let brandConfig = config
  if (config.brandCode == "KEDDTY" || config.brandCode == "KEDD"){//卡尔
    brandConfig = {
      ...config,
      ...KEDD
    };
  } 
  else if (config.brandCode == "GOSO" || config.brandCode == "LM"){
    brandConfig = {
      ...config,
      ...GOSO
    };
  } 
  else if (config.brandCode == "SINGLE_DOG" || config.brandCode == "CA" || config.brandCode == "SLZL" || config.brandCode == "YNTY" || config.brandCode == "QD" || config.brandCode == "BYGD" || config.brandCode == "SA"|| config.brandCode == "XPH" ) {
    brandConfig = {
      ...config,
      ...SINGLE_DOG
    };
  } 
  else if (config.brandCode == "JINGLANGTS" || config.brandCode == "JL") {
    brandConfig = {
      ...config,
      ...JINGLANGTS
    };
  }else if(config.brandCode == 'TBH'){
    brandConfig = {
      ...config,
      ...TBH
    }
  } 
  else{//金王
    brandConfig = config.dev ? {
      ...config,
      ...TESTCONFIG
    } : {
      ...config,
      ...FORMALCONFIG
    }
  }
  brandConfig.LOG = config.debug || false;
  if (config.brandCode){
    brandConfig.brand_name_en = config.brandCode;
    brandConfig.BRAND_CODE = config.brandCode;
  }
  if (config.iconFileName){
    let icon_url = brandConfig.icon_url;
    let index1 = icon_url.lastIndexOf("/",icon_url.lastIndexOf("/") - 1);
    brandConfig.icon_url = icon_url.substring(0, index1 + 1) + config.iconFileName + "/";
    let logo_path = brandConfig.logo_path;
    let index2 = logo_path.lastIndexOf("/", logo_path.lastIndexOf("/") - 1);
    brandConfig.logo_path = logo_path.substring(0, index2 + 1) + config.iconFileName + "/";
  }
  return brandConfig;
}
export default getSetConfig;
