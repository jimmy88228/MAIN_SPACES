<template>
  <Card class="distribution-apply-setting">
    <div class="btn">
      <Button type="primary" @click="handleSave">保存</Button>
    </div>
    <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">
      <FormItem label="是否启用" prop="is_enabled">
        <i-switch size="large" v-model="formItem.is_enabled" true-value="1" false-value="0">
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </i-switch>
      </FormItem>
      <FormItem label="付费金额" prop="order_amount">
        <InputNumber :min="0" v-model="formItem.order_amount"></InputNumber>
      </FormItem>
      <FormItem label="每日赠送" prop="free_num_day">
        <InputNumber :min="0" v-model="formItem.free_num_day"></InputNumber>
        <label>个名额</label>
      </FormItem>
      <FormItem label="赠送的积分" prop="gift_point">
        <InputNumber :min="0" v-model="formItem.gift_point"></InputNumber>
      </FormItem>
      <FormItem label="赠送名额奖励" prop="is_share_gift">
        <i-switch size="large" v-model="formItem.is_share_gift" true-value="1" false-value="0">
          <span slot="open">送</span>
          <span slot="close">不送</span>
        </i-switch>
         <p class="strong_tips">赠送名额是否送券和积分</p>
      </FormItem>
      <FormItem label="优惠券" prop="coupons">
        <coupon-select :data="formItem.coupons" type="checkbox" @del-tag="handleCouponClose">
          <Button type="dashed" @click="handleCouponSelected" class="basic_select">选择优惠券</Button>
        </coupon-select>
      </FormItem>
      <FormItem label="选择页面" prop="pageData">
        <page-select :data="formItem.pageData" type="radio" @del-tag="handlePageClose">
          <Button type="dashed" @click="handlePageSelected" class="basic_select">选择活动页</Button>
        </page-select>
        <p class="strong_tips"> 选择的页面不能为首页</p>
      </FormItem>
    </Form>
  </Card>
</template>

<script>
import CouponSelect from '@/views/my-components/list-component/index-edit';
import PageSelect from '@/views/my-components/list-component/index-edit';

export default {
  components: {
    CouponSelect,
    PageSelect
  },
  data () {
    return {
      formItem: {
        is_enabled: '0',
        order_amount: 0,
        free_num_day: 0,
        gift_point: 0,
        is_share_gift: '0',
        coupons: [],
        pageData: []
      },
      ruleValidate: {

      }
    }
  },
  methods: {
    loadData () {
      return this.$ajax.post(this.$api.distributionApplySettingInfo)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.formItem = {
            ...res.data.items,
            order_amount: +res.data.items.order_amount,
            free_num_day: +res.data.items.free_num_day,
            gift_point: +res.data.items.gift_point,
            coupons: res.data.items.bouns_data,
            pageData: [res.data.items.page_data]
          }
        }
      });
    },
    handlePageSelected  () {
      this.$selectContent({
        mode: 'pages',
        type: 'radio',
        data: this.formItem.pageData,
        getList: (data) => {
          this.formItem.pageData = data;
        }
      })
    },
    handlePageClose (data) {
      this.formItem.pageData = data;
    },
    handleCouponSelected () {
      this.$selectContent({
        mode: 'coupon',
        type: 'checkbox',
        data: this.formItem.coupons,
        getList: (data) => {
          this.formItem.coupons = data;
        }
      });
    },
    handleCouponClose (data) {
      this.formItem.coupons = data;
    },
    handleSave () {
      return this.$ajax.post(this.$api.distributionApplySettingSave, {
        ...this.formItem,
        gift_coupons: this.formItem.coupons.map(item => item.id).join(),
        page_id: this.formItem.pageData.map(item => item.id).join()
      })
      .then(_ => {
        this.$Message.success('保存成功');
      });
    }
  },
  created () {
    this.loadData()
  }
}
</script>

<style lang="less" scoped>
.distribution-apply-setting{
  .btn{
    text-align: right;
    margin-bottom: 24px;
  }
}
</style>
