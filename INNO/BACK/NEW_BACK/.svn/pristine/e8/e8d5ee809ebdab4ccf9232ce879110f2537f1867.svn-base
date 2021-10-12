<template>
  <div class="store-coupons-form">
    <PageTopBase isSave @save="confirm">
      <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="160" label-colon v-friendly-errors>
        <FormItem label="活动名称" prop="activityName">
          <Input v-model="formItem.activityName" placeholder="请输入活动名称" class="basic_input"/>
        </FormItem>
        <FormItem label="活动时间" prop="dateRange">
          <DatePicker type="datetimerange" v-model="formItem.dateRange" placeholder="请选择时间" style="width: 340px;" @on-change="handleDate"></DatePicker>
        </FormItem>
        <FormItem label="奖励次数" prop="userBenefitTimes">
          <label>单个会员奖励</label>
          <InputNumber :min="1" v-model="formItem.userBenefitTimes"></InputNumber>
          <label>次</label>
          <p class="strong_tips">0为不限制，奖励次数不区分档次</p>
        </FormItem>
        <FormItem label="是否启用">
          <i-switch size="large" v-model="formItem.isEnabled" true-value="1" false-value="0">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </FormItem>
        <FormItem label="排除优惠券抵扣的订单">
          <RadioGroup v-model="formItem.isExcludeUsedCoupon">
            <Radio label="1">排除</Radio>
            <Radio label="0">计算</Radio>
          </RadioGroup>
          <p class="strong_tips">已使用优惠劵抵扣的订单是否计算</p>
        </FormItem>
        <FormItem label="计算方式">
          <RadioGroup v-model="formItem.isPositivePrice">
            <Radio label="0">计算全部商品</Radio>
            <Radio label="1">只计算正价商品</Radio>
          </RadioGroup>
          <p class="strong_tips">按整单件数或实付金额计算,吊牌价=销售价的商品件数或销售金额计算</p>
        </FormItem>
        <FormItem label="活动类型">
          <RadioGroup v-model="formItem.givedType">
            <Radio label="1">满额赠送</Radio>
            <Radio label="2">满件赠送</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="指定商品货号" prop="limitGoodsSns">
          <Input v-model="formItem.limitGoodsSns" type="textarea" :rows="3" placeholder="请输入指定商品货号" class="basic_input"/>
          <p class="strong_tips">多商品货号用逗号分隔，不能有空格，不填写则表示不做限制；</p>
        </FormItem>
        <FormItem label="排除商品货号" prop="notLimitGoodsSns">
          <Input v-model="formItem.notLimitGoodsSns" type="textarea" :rows="3" placeholder="请输入指定排除商品货号" class="basic_input"/>
          <p class="strong_tips">多商品货号用逗号(英文)分隔</p>
        </FormItem>
        <FormItem label="活动店铺" prop="storeInfo">
          <store-select :data="formItem.storeInfo" type="checkbox" @del-tag="handleStoreClose">
            <Button type="dashed" @click="handleSelected" class="basic_select">选择活动店铺</Button>
          </store-select>
        </FormItem>

        <FormItem label="活动标识编码" prop="activity_code">
          <Input v-model="formItem.activity_code" placeholder="请输入活动标识编码" clearable class="basic_input"/>
        </FormItem>

        <FormItem label="优惠条件">
          <div v-for="(item, index) in formItem.rules" :key="item.id">
            <div class="rule_title">
              <span>{{index+1}}级优惠</span>
              <span @click="delRule(index)"><a>删除</a></span>
            </div>
            <div class="rule_content">
              <FormItem
                :label="formItem.givedType == 1 ? '最小金额' : '最小件数'"
                :label-width="90"
                class="form_item_24"
                :prop="'rules.'+index+'.limitMinValue'"
                :rules="[{required: true, message: '最小金额不能为空', trigger: 'blur', type: 'number'}, {validator: checkMinAmount, trigger: 'blur', type: 'number'}]">
                <InputNumber :min="0" v-model="item.limitMinValue"></InputNumber>
                <label>{{formItem.givedType == 1 ? '元' : '件'}}</label>
              </FormItem>
              <FormItem
                :label="formItem.givedType == 1 ? '最大金额' : '最大件数'"
                :label-width="90"
                class="form_item_24"
                :prop="'rules.'+index+'.limitMaxValue'"
                :rules="[{required: true, message: '最大金额不能为空', trigger: 'blur', type: 'number'}, {validator: checkMaxAmount, trigger: 'blur', type: 'number'}]">
                <InputNumber :min="0" v-model="item.limitMaxValue"></InputNumber>
                <label>{{formItem.givedType == 1 ? '元' : '件'}}</label>
              </FormItem>
              <FormItem 
                label="活动赠送" 
                :label-width="90"
                class="form_item_24"
                :prop="'rules.'+index+'.givedCoupons'"
                :rules="[{required: true, message: '优惠券不能为空', trigger: 'blur', type: 'array', min: 1}]">
                <coupon-select :data="item.givedCoupons" type="checkbox" @del-tag="data => handleCouponClose(data, index)">
                  <Button type="dashed" @click="(selected) => handleCouponSelected(selected, index)" class="basic_select">选择优惠券</Button>
                </coupon-select>
              </FormItem>
              <FormItem label="抽奖活动" :label-width="90" required>
								<!-- :rules="[{required: true, message: '抽奖活动不能为空', trigger: 'change', type: 'number'}]"> -->
                <FormItem 
                  class="inline"
                  :prop="'rules.'+index+'.givedActivityId'"
                  >
                  <Select v-model="item.givedActivityId" class="basic_select">
                    <Option value="0">全部</Option>
                    <Option v-for="item in lottery" :key="item.id" :value="item.id">{{item.activity_name}}</Option>
                  </Select>
                </FormItem>
                <FormItem class="inline">
                  <InputNumber :min="0" v-model="item.givedActivityNum"></InputNumber>
                  <label>次</label>
                </FormItem>
              </FormItem>
            </div>
          </div>
          <Divider class="divider"/>
          <Button type="primary" icon="md-add" @click="createRule">新增一级优惠</Button>
        </FormItem>
      </Form>
    </PageTopBase>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import StoreSelect from '@/views/my-components/list-component/index-edit';
import CouponSelect from '@/views/my-components/list-component/index-edit';
import Control from '@/libs/page-control';

export default {
  props: ['id'],
  components: {
    PageTopBase,
    StoreSelect,
    CouponSelect
  },
  mixins: [Control],
  data () {
    const checkDate = function (rule, val, callback) {
      if (val[0] && val[1]) {
        callback();
      } else {
        callback(new Error('请填写有效时间'));
      }
    }
    return {
      formItem: {
        activityName: '',
        dateRange: [],
        userBenefitTimes: 0,
        activity_code: '',
        isEnabled: '1',
        isExcludeUsedCoupon: '1',
        isPositivePrice: '1',
        givedType: '1',
        limitGoodsSns: '',
        notLimitGoodsSns: '',
        storeInfo: [],
        rules: [
          {
            id: 1,
            limitMinValue: 0,
            limitMaxValue: 0,
            givedCoupons: [],
            givedActivityId: '0',
            givedActivityNum: 0
          }
        ]
      },
      ruleValidate: {
        activityName: [{ required: true, message: '活动名称不能为空', trigger: 'blur' }],
        dateRange: [{required: true, validator: checkDate, trigger: 'blur' }],
        // storeInfo: [{required: true, message: '活动店铺不能为空', trigger: 'blur', type: 'array', min: 1}]
      },
      lottery: [],
      hasChange: false,
      spinShow: false
    }
  },
  methods: {
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.CouponsMarketInfo, {
        id: this.id
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          if (this.id) {
            const {
              activity_name,
              activity_code,
              from_time,
              to_time,
              selected_store_id,
              is_enabled,
              is_positive_price,
              is_exclude_used_coupon,
              gived_type,
              limit_goods_sns,
              user_benefit_times,
              not_limit_goods_sns,
              getstore,
              type_names_list,
              get_store_order_benefit_activity_rule
            } = res.data.items;
            this.formItem = {
              activityName: activity_name,
              activity_code: activity_code,
              dateRange: [from_time, to_time],
              userBenefitTimes: Number(user_benefit_times),
              isEnabled: is_enabled,
              isExcludeUsedCoupon: is_exclude_used_coupon,
              isPositivePrice: is_positive_price,
              givedType: gived_type,
              limitGoodsSns: limit_goods_sns,
              notLimitGoodsSns: not_limit_goods_sns,
              storeInfo: getstore,
              rules: get_store_order_benefit_activity_rule.map(item => {
                return Object.assign({}, {
                  id: item.id,
                  limitMinValue: Number(item.limit_min_value),
                  limitMaxValue: Number(item.limit_max_value),
                  givedCoupons: item.gived_coupons_list, 
                  givedActivityId: Number(item.gived_activity_id),
                  givedActivityNum: Number(item.gived_activity_num)
                })
              })
            };
          }
          Object.defineProperty(this, 'originRule', {
            value: JSON.parse(JSON.stringify(this.formItem.rules))
          });
          this.lottery = res.data && res.data.lottery;
        }
        this.spinShow = false;
      });
    },
    handleSelected (selected) {
      this.$selectContent({
        mode: 'store',
        type: 'checkbox',
        data: this.formItem.storeInfo,
        getList: (data) => {
          this.formItem.storeInfo = data;
          this.$refs.formValidate.validateField('storeInfo');
        }
      });
    },
    handleStoreClose (data) {
      this.formItem.storeInfo = data;
    },
    handleCouponSelected (selected, index) {
      this.$selectContent({
        mode: 'coupon',
        type: 'checkbox',
        data: this.formItem.rules[index].givedCoupons,
        getList: (data) => {
          this.formItem.rules[index].givedCoupons = data;
          this.$refs.formValidate.validateField(`rules.${index}.givedCoupons`);
        }
      });
    },
    handleCouponClose (data, index) {
      this.formItem.rules[index].givedCoupons = data;
      this.$refs.formValidate.validateField(`rules.${index}.givedCoupons`);
    },
    handleDate ([fromDate, toDate]) {
      this.formItem.dateRange = [fromDate, toDate];
    },
    createRule () {
      let newId = this.formItem.rules[this.formItem.rules.length - 1].id;
      this.formItem.rules.push({
        id: ++newId,
        limitMinValue: 0,
        limitMaxValue: 0,
        givedCoupons: [],
        givedActivityId: '0',
        givedActivityNum: 0
      });
    },
    delRule (index) {
      this.formItem.rules.splice(index, 1);
    },
    checkMinAmount (rule, value, callback) {
      const {field} = rule;
      const reg = /^rules.(?<index>\d+).limitMinValue$/;
      const matchObj = reg.exec(field);
      const index = matchObj.groups.index;
      if (value > this.formItem.rules[index].limitMaxValue) {
        callback(new Error('同级的优惠条件的最小件数须小于同级优惠条件的最大件数'));
      } else {
        this.$refs.formValidate.validateField(`rules.${index}.limitMaxValue`);
      }
      if (index > 0) {
        const prevItem = this.formItem.rules[index - 1];
        if (value < prevItem.limitMaxValue) {
          callback(new Error('最小金额需要大于上一级最大金额'));
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    checkMaxAmount (rule, value, callback) {
      const {field} = rule;
      const reg = /^rules.(?<index>\d+).limitMaxValue$/;
      const matchObj = reg.exec(field);
      const index = matchObj.groups.index;
      if (value < this.formItem.rules[index].limitMinValue) {
        callback(new Error('同级的优惠条件的最小件数须小于同级优惠条件的最大件数'));
      } else {
        this.$refs.formValidate.validateField(`rules.${index}.limitMinValue`);
      }
      if (index > 0) {
        const prevItem = this.formItem.rules[index - 1];
        if (value < prevItem.limitMaxValue) {
          callback(new Error('最大金额需要大于上一级最大金额'));
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    checkIsChange () {
      if (this.originRule.length != this.formItem.rules.length) {
        this.hasChange = true;
        return false;
      }
      for (let i = 0, len = this.originRule.length; i < len; i++) {
        if (
          this.originRule[i].limitMinValue != this.formItem.rules[i].limitMinValue ||
          this.originRule[i].limitMaxValue != this.formItem.rules[i].limitMaxValue || 
          this.originRule[i].givedActivityId != this.formItem.rules[i].givedActivityId || 
          this.originRule[i].givedActivityNum != this.formItem.rules[i].givedActivityNum ||
          this.originRule[i].givedCoupons.length != this.formItem.rules[i].givedCoupons.length
        ) {
          this.hasChange = true;
          break;
        } else if (this.originRule[i].givedCoupons.length === this.formItem.rules[i].givedCoupons.length) {
          let origin = this.originRule[i].givedCoupons.map(item => item.id);
          this.formItem.rules[i].givedCoupons.forEach(item => {
            if (origin.includes(item.id)) origin.splice(origin.indexOf(item.id), 1);
          });
          if (origin.length) {
            this.hasChange = true;
            break;
          }
        }
      }
    },
    confirm () {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          // 判断规则是否有改变??? 感觉完全不需要benefit_state,以后可以优化
          if (this.id) {
            this.checkIsChange();
          }
          const params = this.id ? {
            id: this.id,
            benefit_state: this.hasChange ? 2 : 1, //新增一级优惠卷 benefit字段是否有改动  1没改  2改了, 这里需要遍历规则，如果不一致就要传2
          } : {};
          this.spinShow = true;
          this.$ajax.post(this.id ? this.$api.CouponsMarketEdit : this.$api.CouponsMarketAdd, {
            ...params,
            activity_name: this.formItem.activityName,
            activity_code: this.formItem.activity_code,
            from_time: this.formItem.dateRange[0],
            to_time: this.formItem.dateRange[1],
            selected_store_id: this.formItem.storeInfo.map(item => item.id).join(),
            is_enabled: this.formItem.isEnabled,
            is_positive_price: this.formItem.isPositivePrice,
            is_exclude_used_coupon: this.formItem.isExcludeUsedCoupon,
            gived_type: this.formItem.givedType,
            limit_goods_sns: this.formItem.limitGoodsSns,
            user_benefit_times: this.formItem.userBenefitTimes,
            not_limit_goods_sns: this.formItem.notLimitGoodsSns,
            benefit: this.formItem.rules.map(item => {
              return Object.assign({}, {
                limit_min_value: item.limitMinValue,
                limit_max_value: item.limitMaxValue,
                gived_coupons: item.givedCoupons.map(item => item.id).join(), 
                gived_activity_id: item.givedActivityId,
                gived_activity_num: item.givedActivityNum
              })
            })
          })
          .then(response => {
            const res = response.data;
            if (res.code) {
              this.$Message.success(res.message);
              this.isGlobalLeaveTip = false;
              this.$router.go(-1);
            }
            this.spinShow = false;
          });
        }
      })
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.store-coupons-form{
  .rule_title{
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 560px;
    height: 30px;
    line-height: 30px;
    background: #f7f8fa;
    padding: 0 5px;
  }
  .amount_item{
    display: inline-block;
  }
  .form_item_24{
    margin-bottom: 24px;
  }
  .inline{
    display: inline-block;
    width: 200px;
  }
}
</style>
