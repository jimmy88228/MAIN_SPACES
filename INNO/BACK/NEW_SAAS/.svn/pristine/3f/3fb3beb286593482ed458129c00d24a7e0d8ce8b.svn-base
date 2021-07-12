<template>
  <Card class="pickup">
    <div class="btn-wrapper">
      <Button type="primary" @click="confirm">保存</Button>
    </div>
    <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">
      <FormItem label="活动名称" prop="activityName">
        <Input v-model="formItem.activityName" placeholder="请输入活动名称" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
      </FormItem>
      <FormItem label="活动状态" prop="isEnabled">
        <i-switch size="large" v-model="formItem.isEnabled" true-value="1" false-value="0">
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </i-switch>
      </FormItem>
      <FormItem label="活动时间" prop="validTimeRange">
        <DatePicker v-model="formItem.validTimeRange" type="datetimerange" placeholder="请选择活动时间" class="time_range" @on-change="handleTime"></DatePicker>
      </FormItem>
      <FormItem label="赠送积分" prop="point">
        <InputNumber :min="0" v-model="formItem.point"></InputNumber>
      </FormItem>
      <FormItem label="优惠券" prop="couponData">
        <coupon-select :data="formItem.couponData" type="checkbox" @del-tag="handleClose">
          <Button type="dashed" @click="handleSelected" class="basic_select">选择优惠券</Button>
        </coupon-select>
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
    const checkValidRange = (rule, value, callback) => {
      if (!value[0] && !value[1]) {
        callback(new Error('活动时间不能为空'));
      } else {
        callback();
      }
    }
    const checkPoint = (rule, value, callback) => {
      if (this.formItem.couponData.length === 0 && !value) {
        callback(new Error('请填写积分或优惠券'));
      } else {
        this.$refs.formValidate.validateField('couponData');
        callback();
      }
    }
    const checkCouponData = (rule, value, callback) => {
      if (value.length === 0 && !this.formItem.point) {
        callback(new Error('请填写积分或优惠券'));
      } else {
        this.$refs.formValidate.validateField('point');
        callback();
      }
    }
    return {
      formItem: {
        activityName: '',
        isEnabled: '0',
        validTimeRange: [],
        point: 0,
        couponData: []
      },
      ruleValidate: {
        activityName: [{required: true, message: '活动名称不能为空', trigger: 'blur'}],
        validTimeRange: [{required: true, trigger: 'change', type: 'array', validator: checkValidRange}],
        point: [{trigger: 'blur', type: 'number', validator: checkPoint}],
        couponData: [{trigger: 'change', type: 'array', validator: checkCouponData}]
      },
      spinShow: false
    }
  },
  methods: {
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.pickupActivityInfo)
        .then(response => {
          const res = response.data;
          if (res.code) {
            let data;
            if (data = res.data && res.data.items) {
              this.formItem = {
                activityName: data.benfit_name,
                isEnabled: data.is_enabled,
                validTimeRange: [data.from_time, data.to_time],
                point: Number(data.benfit_points),
                couponData: data.coupons_list || []
              }
            }
          }
          this.spinShow = false;
        });
    },
    handleSelected (selected) {
      this.$selectContent({
        mode: 'coupon',
        type: 'checkbox',
        data: this.formItem.couponData,
        getList: (data) => {
          this.formItem.couponData = data;
          this.$refs.formValidate.validateField('couponData');
        }
      });
    },
    handleClose (data) {
      this.formItem.couponData = data;
      this.$refs.formValidate.validateField('couponData');
    },
    handleTime (date) {
      this.formItem.validTimeRange = date;
    },
    confirm () {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.spinShow = true;
          return this.$ajax.post(this.$api.pickupActivitySave, {
            benfit_name: this.formItem.activityName,
            is_enable: this.formItem.isEnabled,
            from_time: this.formItem.validTimeRange[0],
            to_time: this.formItem.validTimeRange[1],
            points: this.formItem.point,
            selected_bonus_id: this.formItem.couponData.map(item => item.id).join()
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
  },
  created () {
    this.loadData();
  }
}
</script>

<style lang="less">
.pickup{
  .btn-wrapper{
    text-align: right;
    margin-bottom: 24px;
  }
  .time_range{
    width: 340px;
  }
}
</style>
