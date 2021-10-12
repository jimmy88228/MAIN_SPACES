<template>
  <Card class="user-benefits">
    <div class="btn_group">
      <Button type="primary" @click="confirm">保存</Button>
    </div>
    <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">
      <FormItem label="微信注册送积分" prop="user_register_point">
        <InputNumber :min="0" :precision="0" v-model="formItem.user_register_point"></InputNumber>
        <label>积分</label>
        <p class="strong_tips">通过微信注册的会员，赠送设置的积分，积分数须为整数</p>
      </FormItem>
      <FormItem label="微信注册送优惠券" prop="user_register_bonus">
        <coupon-select :data="formItem.user_register_bonus" type="checkbox" @del-tag="e => handleCoupon('user_register_bonus', e)">
          <Button type="dashed" @click="handleSelected('user_register_bonus')" class="basic_select">选择优惠券</Button>
        </coupon-select>
        <p class="strong_tips">通过微信注册的会员，赠送设置的优惠券</p>
      </FormItem>
      <FormItem label="绑定手机送积分" prop="bangMobile_point">
        <InputNumber :min="0" :precision="0" v-model="formItem.bangMobile_point"></InputNumber>
        <label>积分</label>
        <p class="strong_tips">微信会员绑定手机号，赠送设置的积分，积分数须为整数</p>
      </FormItem>
      <FormItem label="绑定手机送优惠券" prop="bangMobile_bonus">
        <coupon-select :data="formItem.bangMobile_bonus" type="checkbox" @del-tag="e => handleCoupon('user_register_bonus', e)">
          <Button type="dashed" @click="handleSelected('bangMobile_bonus')" class="basic_select">选择优惠券</Button>
        </coupon-select>
        <p class="strong_tips">微信会员绑定手机号，赠送设置的优惠券</p>
      </FormItem>
      <FormItem label="完善资料送积分" prop="member_info_point">
        <InputNumber :min="0" :precision="0" v-model="formItem.member_info_point"></InputNumber>
        <label>积分</label>
        <p class="strong_tips">微信会员完善个人资料，赠送设置的积分，积分数须为整数</p>
      </FormItem>
      <FormItem label="完善资料送优惠券" prop="member_info_bonus">
        <coupon-select :data="formItem.member_info_bonus" type="checkbox" @del-tag="e => handleCoupon('member_info_bonus', e)">
          <Button type="dashed" @click="handleSelected('member_info_bonus')" class="basic_select">选择优惠券</Button>
        </coupon-select>
        <p class="strong_tips">微信会员完善个人资料，赠送设置的优惠券</p>
      </FormItem>
      <FormItem label="ERP的用户是否启用绑手机的赠送流程" prop="is_allow_gived_bind_mobile_by_erp">
        <i-switch size="large" v-model="formItem.is_allow_gived_bind_mobile_by_erp" :true-value="1" :false-value="0">
          <span slot="open">启用</span>
          <span slot="close">关闭</span>
        </i-switch>
        <p class="strong_tips">用户绑定ERP过来的手机号是否走绑手机的赠送流程；默认是启用</p>
      </FormItem>
      <FormItem label="关注公众号送积分" prop="subscribe_point">
        <InputNumber :min="0" :precision="0" v-model="formItem.subscribe_point"></InputNumber>
        <label>积分</label>
        <p class="strong_tips">关注公众号，赠送设置的积分，积分数须为整数</p>
      </FormItem>
      <FormItem label="关注公众号送优惠券" prop="subscribe_bonus">
        <coupon-select :data="formItem.subscribe_bonus" type="checkbox" @del-tag="e => handleCoupon('subscribe_bonus', e)">
          <Button type="dashed" @click="handleSelected('subscribe_bonus')" class="basic_select">选择优惠券</Button>
        </coupon-select>
        <p class="strong_tips">关注公众号，赠送设置的优惠券</p>
      </FormItem>
    </Form>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </Card>
</template>

<script>
import CouponSelect from '@/views/my-components/list-component/index-edit';

export default {
  components: {
    CouponSelect
  },
  data () {
    return {
      formItem: {
        user_register_point: 0,
        user_register_bonus: [],
        bangMobile_point: 0,
        bangMobile_bonus: [],
        member_info_point: 0,
        member_info_bonus: [],
        is_allow_gived_bind_mobile_by_erp: 0,
        subscribe_point: 0,
        subscribe_bonus: []
      },
      ruleValidate: {},
      spinShow: false
    }
  },
  methods: {
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.RegisterRuleGiveInfo)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.formItem = res.data.items;
        }
        this.spinShow = false;
      });
    },
    handleSelected (key) {
      this.$selectContent({
        mode: 'coupon',
        type: 'checkbox',
        data: this.formItem[key],
        getList: (data) => {
          this.formItem[key] = data;
          this.$refs.formValidate.validateField(key);
        }
      });
    },
    handleCoupon (key, data) {
      this.formItem[key] = data;
      this.$refs.formValidate.validateField(key);
    },
    confirm () {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.spinShow = true;
          return this.$ajax.post(this.$api.RegisterRuleGiveSave, {
            user_register_point: this.formItem.user_register_point,
            user_register_bonus: this.formItem.user_register_bonus.map(item => item.id).join(),
            bangMobile_point: this.formItem.bangMobile_point,
            bangMobile_bonus: this.formItem.bangMobile_bonus.map(item => item.id).join(),
            member_info_point: this.formItem.member_info_point,
            member_info_bonus: this.formItem.member_info_bonus.map(item => item.id).join(),
            is_allow_gived_bind_mobile_by_erp: this.formItem.is_allow_gived_bind_mobile_by_erp,
            subscribe_point: this.formItem.subscribe_point,
            subscribe_bonus: this.formItem.subscribe_bonus.map(item => item.id).join()
          })
          .then(response => {
            const res = response.data;
            if (res.code) {
              this.$Message.success(res.message);
            }
            this.spinShow = false;
          });
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.user-benefits{
  .btn_group{
    text-align: right;
  }
}
</style>
