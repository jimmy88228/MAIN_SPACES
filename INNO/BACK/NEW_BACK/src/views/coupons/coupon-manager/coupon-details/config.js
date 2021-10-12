export default {
  // ERP券+折扣优惠券
  erpAndDiscount: {
    // 是否可以叠加使用
    canOverlying: {
      // 唯一的
      isUnique: true
    },
    // 是否折上折
    isMultipleDiscount: true,
    // 折扣券商品数量限制
    maxUseGoods: true,
    // 标识为折扣优惠券
    isDiscount: true,
    // 启用自核销
    isWriteoffSelf: true,
    // 预生成优惠券数量
    createNum: true,

    // 是否参加常规促销
    canJoinPromote: {
        // 唯一的
        isUnique: true,
        defaultValue: 0
    },
    // 优惠券绑定会员
    isBindingErpUser: true,
    // 库存提醒
    lowStockNotice: true,
    // 绑定店铺
    storeSelect: true,
    // 绑定折扣券类型
    discountType: true,
    // 是否记入收入
    isLogIncome: true,
    limitTypeList: [{
        name: '不限制',
        value: '0'
      },
      {
        name: '自定义分类',
        value: '2'
      },
      {
        name: '商品品牌',
        value: '3'
      },
      {
        name: '绑定商品',
        value: '4'
      }
    ]
  },

  // ERP券+满减券
  erpAndFulldiscount: {
    // 是否可以叠加使用
    canOverlying: {
      // 唯一的
      isUnique: false
    },
    // 启用自核销
    isWriteoffSelf: true,
    // 预生成优惠券数量
    createNum: true,
    // 优惠券绑定会员
    isBindingErpUser: true,
    // 库存提醒
    lowStockNotice: true,

    // 是否参加常规促销
    canJoinPromote: {
        // 唯一的
        isUnique: false,
        defaultValue: 0
    },
    // 绑定店铺
    storeSelect: true,
    // 绑定付款方式
    payment: true,
    // 是否记入收入
    isLogIncome: true,
    limitTypeList: [{
        name: '不限制',
        value: '0'
      },
      {
        name: '自定义分类',
        value: '2'
      },
      {
        name: '商品品牌',
        value: '3'
      },
      {
        name: '绑定商品',
        value: '4'
      }
    ]
  },

  // ERP券+实物券
  erpAndPhysical: {
    // 是否可以叠加使用
    canOverlying: {
      // 唯一的
      isUnique: false
    },
    // 是否参加常规促销
    canJoinPromote: {
        // 唯一的
        isUnique: false,
        defaultValue: 0
    },
    // 启用自核销
    isWriteoffSelf: true,
    // 预生成优惠券数量
    createNum: true,
    // 优惠券绑定会员
    isBindingErpUser: true,
    // 库存提醒
    lowStockNotice: true,
    // 绑定店铺
    storeSelect: true,
    // 是否记入收入
    isLogIncome: true,
    limitTypeList: [
      {
        name: '绑定商品',
        value: '4'
      }
    ]
  },

  // 微商城优惠券+满减券
  shopAndFulldiscount: {
    // 是否可以自叠加使用
    canOverlying: {
      // 唯一的
      isUnique: false,
      // 自叠加次数
      showNumber: true
    },
    // 是否与其它券叠加
    isMutex: true,

    //是否特定券
    noOverlyingBonus: true,
    // 是否参加常规促销
    canJoinPromote: {
      // 唯一的
      isUnique: false,
      defaultValue: 0
    },
    // 是否还原商品原价
    restoreMarketPrice: true,
    // 是否计算运费
    inShippingfee: true,
    //是否计算分销提成
    isCalcComm: true,
    limitTypeList: [
      {
        name: '不限制',
        value: '0'
      },
      {
        name: '标准分类',
        value: '1'
      },
      {
        name: '自定义分类',
        value: '2'
      },
      {
        name: '商品品牌',
        value: '3'
      },
      {
        name: '绑定商品',
        value: '4'
      }
    ]
  },

  // 通用券+满减券
  generalAndFulldiscount: {
    // 是否可以叠加使用
    canOverlying: {
      // 唯一的
      isUnique: false,
      // 自叠加次数
      showNumber: true
    },
    // 是否与其它券叠加
    isMutex: true,
    //是否特定券
    noOverlyingBonus: true,
    // 是否参加常规促销
    canJoinPromote: {
      // 唯一的
      isUnique: false,
      defaultValue: 0
    },
    // 是否还原商品原价
    restoreMarketPrice: true,
    // 是否计算运费
    inShippingfee: true,
    //是否计算分销提成
    isCalcComm: true,
    // 启用自核销
    isWriteoffSelf: true,
    // 预生成优惠券数量
    createNum: true,
    // 优惠券绑定会员
    isBindingErpUser: true,
    // 库存提醒
    lowStockNotice: true,
    // 绑定店铺
    storeSelect: true,
    // 绑定付款方式
    payment: true,
    // 是否记入收入
    isLogIncome: true,
    limitTypeList: [{
        name: '不限制',
        value: '0'
      },
      {
        name: '自定义分类',
        value: '2'
      },
      {
        name: '商品品牌',
        value: '3'
      },
      {
        name: '绑定商品',
        value: '4'
      }
    ]
  },

  // 微商城优惠券+折扣优惠券
  shopAndDiscount: {
    // 是否可以叠加使用
    canOverlying: {
      // 唯一的
      isUnique: true
    },
    // 是否与其它券叠加
    isMutex: true,
    //是否特定券
    noOverlyingBonus: true,
    // 是否参加常规促销
    canJoinPromote: {
      // 唯一的
      isUnique: true,
      defaultValue: 0
    },
    // 是否折上折
    isMultipleDiscount: true,
    // 是否计算运费
    inShippingfee: true,
    //是否计算分销提成
    isCalcComm: true,
    // 折扣券商品数量限制
    maxUseGoods: true,
    // 标识为折扣优惠券
    isDiscount: true,
    limitTypeList: [{
        name: '不限制',
        value: '0'
      },
      {
        name: '标准分类',
        value: '1'
      },
      {
        name: '自定义分类',
        value: '2'
      },
      {
        name: '商品品牌',
        value: '3'
      },
      {
        name: '绑定商品',
        value: '4'
      }
    ]
  },

  // 通用券+折扣优惠券
  generalAndDiscount: {
    // 是否可以叠加使用
    canOverlying: {
      // 唯一的
      isUnique: true
    },
    // 是否与其它券叠加
    isMutex: true,
    //是否特定券
    noOverlyingBonus: true,
    // 是否参加常规促销
    canJoinPromote: {
      // 唯一的
      isUnique: true,
      defaultValue: 0
    },
    // 是否折上折
    isMultipleDiscount: true,
    // 是否计算运费
    inShippingfee: true,
    //是否计算分销提成
    isCalcComm: true,
    // 折扣券商品数量限制
    maxUseGoods: true,
    // 标识为折扣优惠券
    isDiscount: true,
    // 启用自核销
    isWriteoffSelf: true,
    // 预生成优惠券数量
    createNum: true,
    // 优惠券绑定会员
    isBindingErpUser: true,
    // 库存提醒
    lowStockNotice: true,
    // 绑定店铺
    storeSelect: true,
    // 绑定付款方式
    payment: true,
    // 是否记入收入
    isLogIncome: true,
    limitTypeList: [{
        name: '不限制',
        value: '0'
      },
      {
        name: '自定义分类',
        value: '2'
      },
      {
        name: '商品品牌',
        value: '3'
      },
      {
        name: '绑定商品',
        value: '4'
      }
    ]
  },

  // 扫码支付优惠券+满减券
  scanAndFulldiscount: {
    // 是否参加常规促销
    canJoinPromote: {
      // 唯一的
      isUnique: false,
      defaultValue: 0
    },
    // 是否计算运费
    inShippingfee: true,
    isCalcComm: true
  }
}
