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
    ACTAPI: "https://gosoactapi.igoso.com.cn/BuyBonus",
    BARCODEAPI: "",
    BARGAINAPI: "https://gosomktapi.igoso.com.cn/BargainApi",
    BUYAPI: "https://gosobuyapi.igoso.com.cn",
    CL_NEWPAYAPI: "https://gosopayapi.igoso.com.cn/InnoPayApi/",
    CL_BARCODEAPI: "https://cloudmainapi.igoso.com.cn",
    CL_BARGAINAPI: "https://cloudskapi.igoso.com.cn/CsBargainApi",
    CL_BUYAPI: "https://cloudmainapi.igoso.com.cn",
    CL_COLLAGEAPI: "https://cloudptapi.igoso.com.cn/CsCollageGroupApi",
    CL_GOODSAPI: "https://cloudmainapi.igoso.com.cn",
    CL_PAYAPI: "https://cloudmainapi.igoso.com.cn",
    CL_POINTAPI: "https://cloudlotapi.igoso.com.cn/CsIntegralMallApi",
    CL_PRESALEAPI: "https://cloudptapi.igoso.com.cn/CsPresaleApi",
    CL_SECKILLAPI: "https://cloudskapi.igoso.com.cn/CsSeckillApi",
    CL_SMKTPAYAPI: "https://cloudmainapi.igoso.com.cn",
    CL_STAFFAPI: "https://cloudmainapi.igoso.com.cn",
    CL_USERAPI: "https://cloudmainapi.igoso.com.cn",
    CL_VSLOGAPI: "https://cloudvslogapi.igoso.com.cn",
    CL_LOTTERYAPI: "https://cloudlotapi.igoso.com.cn/CsLotteryApi",
    COLLAGEAPI: "https://gosomktapi.igoso.com.cn/CollageGroupApi",
    CL_REGAPI: "https://cloudmainapi.igoso.com.cn",
    ELECTRICAPI: "https://gosobuyapi.igoso.com.cn",
    GOODSAPI: "https://gosogoodsapi.igoso.com.cn",
    GRASSAPI: "https://gosoactapi.igoso.com.cn/Grass",
    LIVEAPI: "https://gosoactapi.igoso.com.cn/LiveApi",
    LOTTERYAPI: "https://gosoactapi.igoso.com.cn/Lottery",
    MAINAPI: "",
    MAPAPI: "https://restapi.amap.com",
    MEMBERCARDAPI: "https://gosouserapi.igoso.com.cn",
    NEWPAYAPI: "",
    PAYAPI: "https://gosopayapi.igoso.com.cn",
    PDAAPI: "",
    POINTAPI: "https://gosomktapi.igoso.com.cn/PointMktApi",
    PRESALEAPI: "https://gosomktapi.igoso.com.cn/PresaleApi",
    REGAPI: "https://gosoregapi.igoso.com.cn",
    SECKILLAPI: "https://gosomktapi.igoso.com.cn/SeckillApi",
    SMKTPAYAPI: "https://gosomktapi.igoso.com.cn/SmktPayApi",
    STAFFAPI: "https://gosouserapi.igoso.com.cn",
    USERAPI: "https://gosouserapi.igoso.com.cn",
    VIDEOSHOPAPI: "https://gosogoodsapi.igoso.com.cn",
    VOTEAPI: "",
    VSLOGAPI: "https://gosovslogapi.igoso.com.cn",
  }
}

const SA = {
  "UseBrandBgColor": 1,
  "brand_name": "英朗测试",
  "brand_name_en": "SA",
  "BRAND_CODE": "SA",
  "is_onlyUserCenter": 0,
  "default_icon_url": "https://innoimage.innourl.cn/wechat_applet_image/icon/default/",
  "icon_url": "https://innoimage.innourl.cn/wechat_applet_image/icon//",
  'logo_path': "https://innoimage.innourl.cn/wechat_applet_image/icon//",
  "uploadMvUrl": "https://devimgtest.innourl.com/ImgManager/MvUpLoad/UploadMv",
  'uploadImgUrl': "https://innoimage.innourl.cn/ImgManager/ImgUpload/UploadImage",
  'videoUrl': "https://innovideo.innourl.cn/",
  'webViewUrl': "https://innoadmin.innourl.cn",
  "webMh5Url":"https://devweb01.innourl.com/mh5/pages/home/jump",
  "webContactUrl":"http://devweb01.innourl.com/mobile/customer_service.php",
  "webSatffContactUrl":"http://devweb01.innourl.com/staff_wap/cs_service.php",
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
    ACTAPI: "https://innoactapi.innourl.cn/BuyBonus",
    BARCODEAPI: "https://innovslogapi.innourl.cn",
    BARGAINAPI: "https://innoptapi.innourl.cn/BargainApi",
    BUYAPI: "https://innobuyapi.innourl.cn",
    CL_ACTAPI: "",
    CL_BARCODEAPI: "https://cloudbarcode.innourl.cn",
    CL_BARGAINAPI: "https://innocloudseckill.innourl.cn/CsBargainApi",
    CL_BUYAPI: "https://cloudbuyapi.innourl.cn",
    CL_COLLAGEAPI: "https://innocloudseckill.innourl.cn/CsCollageGroupApi",
    CL_ELECTRICAPI: "https://clouduserapi.innourl.cn",
    CL_GOODSAPI: "https://cloudgoodsapi.innourl.cn",
    CL_GRASSAPI: "",
    CL_LIVEAPI: "https://clouduserapi.innourl.cn",
    CL_LOTTERYAPI: "https://innocloudact.innourl.cn/CsLotteryApi",
    CL_MAPAPI: "https://clouduserapi.innourl.cn",
    CL_MEMBERCARDAPI: "https://clouduserapi.innourl.cn",
    CL_NEWPAYAPI: "https://innopayapi.innourl.cn/InnoPayApi",
    CL_PAYAPI: "https://innopayapi.innourl.cn",
    CL_PDAAPI: "https://clouduserapi.innourl.cn",
    CL_POINTAPI: "https://innocloudprs.innourl.cn/CsIntegralMallApi",
    CL_PRESALEAPI: "https://innocloudprs.innourl.cn/CsPresaleApi",
    CL_REGAPI: "https://cloudregapi.innourl.cn",
    CL_SECKILLAPI: "https://innocloudseckill.innourl.cn/CsSeckillApi",
    CL_SMKTPAYAPI: "https://clouduserapi.innourl.cn",
    CL_STAFFAPI: "https://clouduserapi.innourl.cn",
    CL_USERAPI: "https://clouduserapi.innourl.cn",
    CL_VIDEOSHOPAPI: "https://clouduserapi.innourl.cn",
    CL_VOTEAPI: "https://clouduserapi.innourl.cn",
    CL_VSLOGAPI: "https://cloudvisitlog.innourl.cn/VisitLogApi",
    COLLAGEAPI: "https://innoptapi.innourl.cn/CollageGroupApi",
    ELECTRICAPI: "",
    GOODSAPI: "https://innogoodsapi.innourl.cn",
    GRASSAPI: "https://innoactapi.innourl.cn/GrassApi",
    LIVEAPI: "",
    LOTTERYAPI: "https://innoactapi.innourl.cn/LotteryApi",
    MAINAPI: "",
    MAPAPI: "https://restapi.amap.com",
    MEMBERCARDAPI: "https://innouserapi.innourl.cn",
    NEWPAYAPI: "https://innopayapi.innourl.cn/InnoPayApi",
    PAYAPI: "https://innopayapi.innourl.cn",
    PDAAPI: "https://innobuyapi.innourl.cn",
    POINTAPI: "https://innoprsapi.innourl.cn/PointMktApi",
    PRESALEAPI: "https://innoprsapi.innourl.cn/PresaleApi",
    REGAPI: "https://innoregapi.innourl.cn",
    SECKILLAPI: "https://innoskapi.innourl.cn/SeckillApi",
    SMKTPAYAPI: "https://innosmktpay.innourl.cn/SmktPayApi",
    STAFFAPI: "https://innouserapi.innourl.cn",
    USERAPI: "https://innouserapi.innourl.cn",
    VIDEOSHOPAPI: "https://INNOGOODSAPI.innourl.cn",
    VOTEAPI: "",
    VSLOGAPI: "https://innovslogapi.innourl.cn",
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

const YUNDIAN = {
  "UseBrandBgColor": 1,
  "brand_name": "英弩云店",
  "brand_name_en": "YUNDIAN",
  "BRAND_CODE": "YUNDIAN",
  "icon_url": "https://innoimage.innourl.cn/wechat_applet_image/icon/KLTY/",
  "logo_path": "https://innoimage.innourl.cn/wechat_applet_image/icon/KLTY/",
  "default_icon_url": "https://innoimage.innourl.cn/wechat_applet_image/icon/default/",
  "uploadImgUrl": "https://innoimage.innourl.cn/ImgManager/ImgUpload/UploadImage",
  "uploadMvUrl": "https://innovideo.innourl.cn/ImgManager/MvUpLoad/UploadMv",
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
    "LIVEAPI": "https://innoactapi.innourl.cn/LiveApi",

    "CL_VSLOGAPI": "https://cloudvisitlog.innourl.cn/VisitLogApi",
    "CL_GOODSAPI": "https://cloudgoodsapi.innourl.cn",
    "CL_USERAPI": "https://clouduserapi.innourl.cn",
    "CL_BUYAPI": "https://cloudbuyapi.innourl.cn",
    "Cl_REGAPI": "https://cloudregapi.innourl.cn",
    "CL_BARCODEAPI": "https://cloudbarcode.innourl.cn",
    "CL_PAYAPI": "https://innopayapi.innourl.cn",
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

const TESTCONFIG = {
  "UseBrandBgColor": 1,
  "brand_name": "英朗测试",
  "brand_name_en": "INNOVATION",
  "BRAND_CODE": "INNOVATION",
  "is_onlyUserCenter": 0,
  "icon_url": "https://devimgtest.innourl.com/wechat_applet_image/icon/KINGCODE/",
  "logo_path": "https://devimgtest.innourl.com/wechat_applet_image/icon/KINGCODE/",
  "default_icon_url": "https://devimgtest.innourl.com/wechat_applet_image/icon/default/",
  "uploadImgUrl": "https://devimgtest.innourl.com/ImgManager/ImgUpload/UploadImage",
  "uploadMvUrl": "https://devimgtest.innourl.com/ImgManager/MvUpLoad/UploadMv",
  "videoUrl": "https://devimgtest.innourl.com/saas_image/",
  "webViewUrl": "https://devweb01.innourl.com",
  "webMh5Url":"https://devweb01.innourl.com/mh5/pages/home/jump",
  "webContactUrl":"http://devweb01.innourl.com/mobile/customer_service.php",
  "webSatffContactUrl":"http://devweb01.innourl.com/staff_wap/cs_service.php",
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
    "CL_VSLOGAPI": "https://developtest.innourl.com/QdqmLogApi",
    "CL_GOODSAPI": "https://developtest.innourl.com/QdqmMainApi",
    "CL_USERAPI": "https://developtest.innourl.com/QdqmMainApi",
    "CL_BUYAPI": "https://developtest.innourl.com/QdqmMainApi",
    "CL_REGAPI": "https://developtest.innourl.com/QdqmMainApi",
    "CL_PAYAPI": "https://developtest.innourl.com",
    "CL_NEWPAYAPI": "https://developtest.innourl.com/InnoPayApi",
    "CL_BARCODEAPI": "https://developtest.innourl.com",
    "CL_SECKILLAPI":"https://developtest.innourl.com/CsSeckillApi",
    "CL_ACTAPI":"https://developtest.innourl.com",
    "CL_BARGAINAPI":"https://developtest.innourl.com/CsBargainApi",
    "CL_PRESALEAPI": "https://developtest.innourl.com/CsPresaleApi",
    "CL_STAFFAPI": "https://developtest.innourl.com/QdqmMainApi",
    'CL_POINTAPI': "https://developtest.innourl.com/CsIntegralMallApi",
    'CL_COLLAGEAPI': "https://developtest.innourl.com/CsCollageGroupApi",
    'CL_LOTTERYAPI': "https://developtest.innourl.com/CsLotteryApi",

    "VSLOGAPI": "https://developtest.innourl.com",
    "GOODSAPI": "https://developtest.innourl.com",
    "USERAPI": "https://developtest.innourl.com",
    "BUYAPI": "https://developtest.innourl.com",
    "REGAPI": "https://developtest.innourl.com",
    "POINTAPI": "https://devimtest.innourl.com",
    "COLLAGEAPI": "https://devpttest.innourl.com",
    "NEWPAYAPI": "https://developtest.innourl.com/InnoPayApi",
    "PAYAPI": "http://devpaytest.innourl.com",
    "PRESALEAPI": "https://developtest.innourl.com",
    "STAFFAPI": "https://developtest.innourl.com",
    "MAINAPI": "",
    "MAPAPI": "https://restapi.amap.com",
    //店铺支付
    "SMKTPAYAPI": "https://developtest.innourl.com",
    "GRASSAPI":"https://developtest.innourl.com/GrassApi",
    "PAGEAPI":"https://developtest.innourl.com",
    "BARGAINAPI": "https://developtest.innourl.com/BargainApi",
    "MEMBERCARDAPI":"https://developtest.innourl.com",
    "ACTAPI":"https://developtest.innourl.com",
    "LOTTERYAPI":"https://developtest.innourl.com/LotteryApi",
    "SECKILLAPI":"https://developtest.innourl.com/SecKill",
    "VOTEAPI":"https://developtest.innourl.com/VoteApi",
    "VIDEOSHOPAPI":"https://developtest.innourl.com",
    "BARCODEAPI": "https://developtest.innourl.com",
    "LIVEAPI": "https://developtest.innourl.com",
    "PDAAPI": "https://developtest.innourl.com"
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

function getSetConfig(config = {}){
  let brandConfig = config  
  if (config.brandCode == "INNOVATION") {
    brandConfig = {
      ...config,
      ...TESTCONFIG
    };
  }  
  else if (config.brandCode == "GOSO") {
    brandConfig = {
      ...config,
      ...GOSO
    };
  }  
  else if (config.brandCode == "SA") {
    brandConfig = {
      ...config,
      ...SA
    };
  }  
  else if (config.brandCode == "YUNDIAN") {
    brandConfig = {
      ...config,
      ...YUNDIAN
    };
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
