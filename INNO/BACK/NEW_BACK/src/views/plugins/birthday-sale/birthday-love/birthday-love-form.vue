<template>
  <PageTopBase isSave @save="confirm">
    <div class="birthday-love-form">
      <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">
        <FormItem label="活动名称" prop="activity_name">
          <Input v-model="formItem.activity_name" placeholder="请输入活动名称" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
        </FormItem>
        <FormItem label="活动备注" prop="activity_desc">
          <Input
            type="textarea"
            class="basic_textarea"
            v-model="formItem.activity_desc"
            placeholder="请输入活动备注"
            :rows="3"
            :maxlength="150"
            show-word-limit/>
        </FormItem>
        <FormItem label="生效时段" prop="validTimeRange">
          <DatePicker v-model="formItem.validTimeRange" type="datetimerange" placeholder="请选择生效时段" class="time_range"  @on-change="handleTimeRange"></DatePicker>
        </FormItem>
        <FormItem label="享受优惠会员等级" prop="rankData">
          <Select v-model="formItem.rankData" multiple class="basic_select">
            <Option v-for="item in levelList" :value="item.rank_id" :key="item.rank_id">{{ item.rank_name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="赠送时间" prop="send_rule">
          <RadioGroup v-model="formItem.send_rule" vertical @on-change="handleChange">
            <Radio label="1" class="radio_item">当天</Radio>
            <Radio label="2" class="radio_item">生日前</Radio>
            <Radio label="3">每月的第</Radio>
          </RadioGroup>
          <div class="content">
            <FormItem prop="day" class="form_item" ref="day" :show-message="formItem.send_rule == 2">
              <InputNumber v-model="formItem.day" :min="1" :disabled="formItem.send_rule != 2"></InputNumber>
              <span>天</span>
            </FormItem>
            <FormItem prop="month" class="form_item" ref="month" :show-message="formItem.send_rule == 3">
              <InputNumber v-model="formItem.month" :min="1" :disabled="formItem.send_rule != 3"></InputNumber>
              <span>天</span>
            </FormItem>
          </div>
        </FormItem>
        <FormItem label="是否补发" prop="is_resend_gived">
          <i-switch v-model="formItem.is_resend_gived" true-value="1" false-value="0">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
          <p class="strong_tips">当月生日会员超过发放时间，隔天补发</p>
        </FormItem>
        <FormItem label="活动赠送">
          <FormItem label="积分" prop="integral" :label-width="60">
            <InputNumber v-model="formItem.integral" :min="0"></InputNumber>
            <p class="strong_tips">(如果输入0,则为不送)</p>
          </FormItem>
          <FormItem label="优惠券" prop="bounsData" :label-width="60">
            <coupon-select :data="formItem.bounsData" type="checkbox" @del-tag="handleCouponClose">
              <Button type="dashed" @click="handleCouponSelected" class="basic_select">选择优惠券</Button>
            </coupon-select>
          </FormItem>
        </FormItem>
      </Form>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
  </PageTopBase>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import CouponSelect from '@/views/my-components/list-component/index-edit';

export default {
  props: ['id'],
  components: {
    PageTopBase,
    CouponSelect
  },
  data () {
    const checkDay = (rule, value, callback) => {
      if (this.formItem.send_rule == 2) {
        if (!value) {
          callback(new Error('天数不能为空'))
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const checkMonth = (rule, value, callback) => {
      if (this.formItem.send_rule == 3) {
        if (!value) {
          callback(new Error('天数不能为空'))
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      formItem: {
        activity_name: '',
        activity_desc: '',
        validTimeRange: [],
        rankData: [],
        send_rule: '1',
        day: 1,
        month: 1,
        is_resend_gived: '0',
        integral: 0,
        bounsData: []
      },
      ruleValidate: {
        activity_name: [{required: true, message: '活动名称不能为空', trigger: 'blur'}],
        day: [{
          validator: checkDay, trigger: 'blur', type: 'number'
        }],
        month: [{
          validator: checkMonth, trigger: 'blur', type: 'number'
        }],
        rankData: [
          {required: true, message: '优惠会员等级不能为空', trigger: 'change', type: 'array', min: 1}
        ]
      },
      levelList: [],
      spinShow: false
    }
  },
  methods: {
    loadData (page, data) {
      this.spinShow = true;
      let params = Object.assign({}, data);
      return this.$ajax.post(this.$api.birthdayActivityInfo, {
        id: this.id || 0
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          let data = res.data;
          this.levelList = data.rank_data;
          let info = data.items;
          if (info) {
            Object.assign(this.formItem, info, {
              validTimeRange: [info.from_time, info.to_time],
              rankData: info.rank_data.map(item => item.rank_id),
              day: info.send_rule == 2 ? Number(info.send_value) : 1,
              month: info.send_rule == 3 ? Number(info.send_value) : 1,
              integral: Number(info.integral),
              bounsData: info.bouns_data
            })
          }
          this.spinShow = false;
        }
      });
    },
    handleTimeRange ([from_time, to_time]) {
      this.formItem.from_time = from_time;
      this.formItem.to_time = to_time;
    },
    handleChange () {
      this.$refs.day.validateState = '';
      this.$refs.month.validateState = '';
    },
    handleCouponSelected () {
      this.$selectContent({
        mode: 'coupon',
        type: 'checkbox',
        data: this.formItem.bounsData,
        getList: (data) => {
          this.formItem.bounsData = data;
          this.$refs.formValidate.validateField('bounsData');
        }
      });
    },
    handleCouponClose (data) {
      this.formItem.bounsData = data;
      this.$refs.formValidate.validateField('bounsData');
    },
    confirm() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.spinShow = true;
          this.$ajax.post(this.id ? this.$api.birthdayActivityEdit : this.$api.birthdayActivityAdd, {
            id: this.id,
            activity_name: this.formItem.activity_name,
            activity_desc: this.formItem.activity_desc,
            from_time: this.formItem.from_time,
            to_time: this.formItem.to_time,
            send_rule: this.formItem.send_rule,
            is_resend_gived: this.formItem.is_resend_gived,
            integral: this.formItem.integral,
            rank_id: this.formItem.rankData.join(),
            send_value: this.formItem.send_rule == 2 ? this.formItem.day : this.formItem.month,
            bouns_id: this.formItem.bounsData.map(item => item.id).join()
          })
          .then(response => {
            const res = response.data;
            if (res.code) {
              this.$Message.success(res.message);
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
.birthday-love-form{
  .basic_input_fixed, .basic_textarea{
    max-width: 420px;
  }
  .time_range{
    width: 340px;
  }
  .content{
    display: inline-block;
    vertical-align: bottom;
  }
  .radio_item{
    margin-bottom: 24px;
  }
  .form_item{
    margin-bottom: 20px;
    &:last-child{
      margin-bottom: 0;
    }
  }
}
</style>
