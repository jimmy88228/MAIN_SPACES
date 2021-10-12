export default {
  data () {
    return {
      ruleValidate: {
        ruleName: [{
          required: true,
          message: '活动名称不能为空',
          trigger: 'blur'
        }],
        limitWeekdays: [{
          validator: this.checkValidTime,
          trigger: 'change',
          type: 'array'
        }],
        limitDays: [{
          validator: this.checkValidTime,
          trigger: 'change',
          type: 'array'
        }],
        validTimeRange: [{
          required: true,
          trigger: 'change',
          type: 'array',
          validator: this.checkValidRange
        }],
        userRank: [{
          required: true,
          message: '会员等级不能为空',
          trigger: 'change',
          type: 'array',
          min: 1
        }],
        goodsSelect: [{
          required: true,
          trigger: 'change',
          type: 'array',
          validator: this.checkGoods
        }]
      }
    }
  },
  methods: {
    checkValidRange (rule, value, callback) {
      if (!value[0] && !value[1]) {
        callback(new Error('生效时段不能为空'));
      } else {
        callback();
      }
    },
    checkGoods (rule, value, callback) {
      if (this.formItem.isAllGoods === '0' && value.length === 0) {
        callback(new Error('指定商品不能为空'));
      } else {
        callback();
      }
    },
    checkValidTime (rule, value, callback) {
      const {
        field
      } = rule;
      if (field.includes('validWeek')) {
        if (this.formItem.validTimeType == 2 && value.length === 0) {
          callback(new Error('请选择有效期'));
        } else {
          callback();
        }
      } else if (field.includes('validDay')) {
        if (this.formItem.validTimeType == 3 && value.length === 0) {
          callback(new Error('请选择有效期'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    checkCondition(rule, value, callback) {
      const {
        field
      } = rule;
      const reg = /^rules.(?<index>\d+).condition$/;
      const matchObj = reg.exec(field);
      const index = matchObj.groups.index;
      if (index > 0) {
        const prevItem = this.formItem.rules[index - 1];
        if (prevItem.condition && (value < prevItem.condition || value == prevItem.condition)) {
          callback(new Error('优惠门槛需大于上一级优惠门槛'));
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    checkPointTimes(rule, value, callback) {
      const {
        field
      } = rule;
      const reg = /^rules.(?<index>\d+).pointTimes$/;
      const matchObj = reg.exec(field);
      const index = matchObj.groups.index;
      // 当前选中了积分项并且为倍积分类型
      if (this.formItem.rules[index].selectDiscount.includes('4') && this.formItem.rules[index].pointType == 1) {
        if (!value) {
          callback(new Error('倍积分不能为空'))
        } else if (value < 0) {
          callback(new Error('倍积分不能小于0'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    checkPoint(rule, value, callback) {
      const {
        field
      } = rule;
      const reg = /^rules.(?<index>\d+).point$/;
      const matchObj = reg.exec(field);
      const index = matchObj.groups.index;
      if (this.formItem.rules[index].selectDiscount.includes('4') && this.formItem.rules[index].pointType == 2) {
        if (!value) {
          callback(new Error('积分不能为空'))
        } else if (value < 0) {
          callback(new Error('积分不能小于0'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    checkPrice(rule, value, callback) {
      const {
        field
      } = rule;
      const reg = /^rules.(?<index>\d+).price$/;
      const matchObj = reg.exec(field);
      const index = matchObj.groups.index;
      // 当前选中了价格项并且为固定价格类型
      if (this.formItem.rules[index].selectDiscount.includes('5') && this.formItem.rules[index].discountType == 1) {
        if (!value) {
          callback(new Error('固定价格不能为空'))
        } else if (value < 0) {
          callback(new Error('固定价格不能小于0'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    checkPricing(rule, value, callback) {
      const {
        field
      } = rule;
      const reg = /^rules.(?<index>\d+).pricing$/;
      const matchObj = reg.exec(field);
      const index = matchObj.groups.index;
      // 当前选中了价格项并且为订单固定价
      if (this.formItem.rules[index].selectDiscount.includes('5') && this.formItem.rules[index].discountType == 4) {
        if (!value) {
          callback(new Error('固定价格不能为空'))
        } else if (value < 0) {
          callback(new Error('固定价格不能小于0'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    checkDiscount(rule, value, callback) {
      const {
        field
      } = rule;
      const reg = /^rules.(?<index>\d+).discount$/;
      const matchObj = reg.exec(field);
      const index = matchObj.groups.index;
      if (this.formItem.rules[index].selectDiscount.includes('5') && this.formItem.rules[index].discountType == 2) {
        if (!value) {
          callback(new Error('固定折扣不能为空'))
        } else if (value < 0) {
          callback(new Error('固定折扣不能小于0'))
        } else if (value > 10) {
          callback(new Error('固定折扣不能超过10'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    checkNumbers(rule, value, callback) {
      const {
        field
      } = rule;
      const reg = /^rules.(?<index>\d+).numbers$/;
      const matchObj = reg.exec(field);
      const index = matchObj.groups.index;
      if (this.formItem.rules[index].selectDiscount.includes('5') && this.formItem.rules[index].discountType == 3) {
        if (!value) {
          callback(new Error('件数不能为空'))
        } else if (value < 0) {
          callback(new Error('件数不能小于0'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    checkCoupons (rule, value, callback) {
      const {
        field
      } = rule;
      const reg = /^rules.(?<index>\d+).coupons$/;
      const matchObj = reg.exec(field);
      const index = matchObj.groups.index;
      if (this.formItem.rules[index].selectDiscount.includes('1') && !value.length) {
        callback(new Error('请选择优惠券'));
      } else {
        callback();
      }
    },
    checkGifts (rule, value, callback) {
      const {
        field
      } = rule;
      const reg = /^rules.(?<index>\d+).gifts$/;
      const matchObj = reg.exec(field);
      const index = matchObj.groups.index;
      if (this.formItem.rules[index].selectDiscount.includes('2') && !value.length) {
        callback(new Error('请选择赠品'));
      } else {
        callback();
      }
    }
  }
}
