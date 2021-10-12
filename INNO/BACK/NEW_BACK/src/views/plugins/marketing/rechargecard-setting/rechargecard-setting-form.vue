<template>
  <PageTopBase isSave @save="confirm">
    <div class="time-limit-form">
      <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">
        <FormItem label="名称" prop="rule_name">
          <Input v-model="formItem.rule_name" placeholder="请输入活动名称" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
        </FormItem>
        <FormItem label="活动时间" prop="validTimeRange">
          <DatePicker v-model="formItem.validTimeRange" type="datetimerange" placeholder="请选择活动时间" class="time_range" @on-change="handleDateChange"></DatePicker>
        </FormItem>
        <FormItem label="是否可用" prop="is_enabled">
          <i-switch size="large" v-model="formItem.is_enabled" true-value="1" false-value="0">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem prop="points" label="赠送积分">
          <InputNumber :min="0" v-model="formItem.points"></InputNumber>
        </FormItem>
        <FormItem label="充值金额区间" class="priceLabel">
          <FormItem prop="from_value">
            <InputNumber :min="0" v-model="formItem.from_value"></InputNumber>
          </FormItem>
          <span>~</span>
          <FormItem prop="to_value">
            <InputNumber :min="0" v-model="formItem.to_value"></InputNumber>
          </FormItem>
        </FormItem>
        <FormItem prop="couponData" label="选择优惠券">
          <tag-select :data="formItem.couponData" type="checkbox" @del-tag="handleTag">
            <Button type="dashed" @click="handleCouponSelected" class="basic_select">选择优惠券</Button>
          </tag-select>
        </FormItem>
        <FormItem prop="storeData" label="活动店铺">
          <store-select :data="formItem.storeData" type="checkbox" @del-tag="handleStoreTag">
            <Button type="dashed" @click="handleStoreSelected" class="basic_select">选择活动店铺</Button>
          </store-select>
          <p class="strong_tips">注：当店铺同时存在多个活动又满足条件时，将同时赠送;</p>
        </FormItem>
      </Form>
    </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </PageTopBase>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import Control from '@/libs/page-control';
import TagSelect from '@/views/my-components/list-component/index-edit';
import StoreSelect from '@/views/my-components/list-component/index-edit';

export default {
  props: ['id'],
  provide () {
    return {
      formInstance: this
    }
  },
  components: {
    PageTopBase,
    TagSelect,
    StoreSelect
  },
  mixins: [Control],
  data () {
    const checkValidRange = (rule, value, callback) => {
      if (!value[0] && !value[1]) {
        callback(new Error('活动时间不能为空'));
      } else {
        callback();
      }
    }
    return {
      formItem: {
        rule_name: '',
        validTimeRange: [],
        is_enabled: '0',
        points: 0,
        from_value: 0,
        to_value: 0,
        from_time: '',
        to_time: '',
        couponData: [],
        storeData: [],
        bonus_ids: '',
        store_ids: ''
      },
      ruleValidate: {
        rule_name: [{required: true, message: '活动名称不能为空', trigger: 'blur'}],
        validTimeRange: [{required: true, trigger: 'change', type: 'array', validator: checkValidRange}],
        points: [{required: true, message: '充值面额不能为空', trigger: 'blur', type: 'number'}]
      },
      cardData: [],
      spinShow: false
    }
  },
  methods: {
    handleDateChange ([from_time, to_time]) {
      this.formItem.from_time = from_time;
      this.formItem.to_time = to_time;
    },
    handleCouponSelected () {
      this.$selectContent({
        mode: 'coupon',
        type: 'checkbox',
        data: this.formItem.couponData,
        getList: (data) => {
          this.formItem.couponData = data;
          this.formItem.bonus_ids = data.map(item => item.id).join();
        }
      });
    },
    handleTag (data) {
      this.formItem.couponData = data;
      this.formItem.bonus_ids = data.map(item => item.id).join();
    },
    handleStoreSelected () {
      this.$selectContent({
        mode: 'store',
        type: 'checkbox',
        data: this.formItem.storeData,
        getList: (data) => {
          this.formItem.storeData = data;
          this.formItem.store_ids = data.map(item => item.id).join();
        }
      });
    },
    handleStoreTag (data) {
      this.formItem.storeData = data;
      this.formItem.store_ids = data.map(item => item.id).join();
    },
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.storeRechargecardCouponsInfo, {
        id: this.id
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          let data = res.data && res.data.items;
          if (data) {
            this.formItem = Object.assign({}, data, {
              validTimeRange: [data.from_time, data.to_time],
              couponData: data.bouns_data,
              storeData: data.store_data,
              from_value: +data.from_value,
              to_value: +data.to_value,
              points: +data.points,
            });
          }
        }
        this.spinShow = false;
      });
    },
    confirm () {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.spinShow = true;
          return this.$ajax.post(this.id ? this.$api.storeRechargecardCouponsEdit : this.$api.storeRechargecardCouponsAdd, this.formItem)
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
    if (this.id) this.loadData();
  }
}
</script>

<style lang="less">
.time-limit-form{
  .basic_input_fixed, .basic_textarea{
    max-width: 420px;
  }
  .time_range{
    width: 340px;
  }
  .priceLabel{
    .ivu-form-item-content{
      display: flex;
    }
  }
}
</style>
<style lang="less" scoped>
.group-activity-select-wrapper{
  text-align: center;
}
</style>
