<template>
  <PageTopBase isSave @save="confirm">
    <div class="birthday-love-form">
      <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">
        <FormItem label="活动名称" prop="activity_name">
          <Input v-model="formItem.activity_name" placeholder="请输入活动名称" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
        </FormItem>
        <FormItem label="活动备注" prop="remark">
          <Input
            type="textarea"
            class="basic_textarea"
            v-model="formItem.remark"
            placeholder="请输入活动备注"
            :rows="3"
            :maxlength="150"
            show-word-limit/>
        </FormItem>
        <FormItem label="生效时段" prop="validTimeRange" style="width:300px">
          <DatePicker v-model="formItem.validTimeRange" style="width:420px" type="datetimerange" placeholder="请选择生效时段" class="time_range"  @on-change="handleTimeRange"></DatePicker>
        </FormItem>
        <FormItem label="享受优惠会员等级" prop="rank_id">
          <Select v-model="formItem.rank_id" multiple class="basic_select">
            <Option v-for="item in levelList" :value="item.rank_id" :key="item.rank_id">{{ item.rank_name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="赠送时间" prop="birthday_way">
          <RadioGroup v-model="formItem.birthday_way">
            <Radio label="day" class="radio_item">当天</Radio>
            <Radio label="month" class="radio_item">当月</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="是否开启" prop="is_enabled">
          <i-switch v-model="formItem.is_enabled" true-value="1" false-value="0">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
          <p class="strong_tips">当月生日会员超过发放时间，隔天补发</p>
        </FormItem>
        <FormItem label="活动赠送">
          <FormItem label="积分" prop="point_times" :label-width="60">
					<div class="flex f-align-center">
						<InputNumber v-model="formItem.point_times" :min="0"></InputNumber>倍&nbsp;
						<Poptip trigger="hover" placement="right">
							<Icon type="ios-help-circle-outline" size="25"/>
							<div slot="content">赠送{{formItem.point_times}}倍积分（在原获得积分的基础上额外赠送）</div>
						</Poptip>
					</div>
					<p class="strong_tips">(如果输入0,则为不送)</p>
			
          </FormItem>
          <FormItem label="优惠券" prop="coupons" :label-width="60">
            <coupon-select :data="formItem.coupons" type="checkbox" @del-tag="handleCouponClose">
              <Button type="dashed" @click="handleCouponSelected" class="basic_select">选择优惠券</Button>
            </coupon-select>
          </FormItem>
        </FormItem>
      </Form>
    </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
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
      if (this.formItem.birthday_way == 1) {
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
      if (this.formItem.birthday_way == 2) {
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
        remark: '',
        validTimeRange: [],
        from_time: '',
        to_time: '',
        rank_id: [],
        birthday_way: '0',
        day: 1,
        month: 1,
        is_enabled: '0',
        point_times: 0,
        coupons: []
      },
      ruleValidate: {
        activity_name: [{required: true, message: '活动名称不能为空', trigger: 'blur'}],
        day: [{
          validator: checkDay, trigger: 'blur', type: 'number'
        }],
        month: [{
          validator: checkMonth, trigger: 'blur', type: 'number'
        }],
        rank_id: [
          {required: true, message: '优惠会员等级不能为空', trigger: 'change', type: 'array', min: 1}
        ]
      },
      levelList: [],
      spinShow: false
    }
  },
  methods: {
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.birthdayItemInfo, {
        id: this.id || 0
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.levelList = res.data && res.data.rank_data;
          let data = res.data && res.data.items;
          if (data) {
            this.formItem = Object.assign({}, data, {
              point_times: +data.point_times,
              rank_id: data.rank_data.map(item => item.rank_id),
              validTimeRange: [data.from_time, data.to_time],
              coupons: data.bouns_data
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
    handleCouponSelected () {
      this.$selectContent({
        mode: 'coupon',
        type: 'checkbox',
        data: this.formItem.coupons,
        getList: (data) => {
          this.formItem.coupons = data;
          this.$refs.formValidate.validateField('coupons');
        }
      });
    },
    handleCouponClose (data) {
      this.formItem.coupons = data;
      this.$refs.formValidate.validateField('coupons');
    },
    confirm() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.spinShow = true;
          this.$ajax.post(this.id ? this.$api.birthdayItemEdit : this.$api.birthdayItemAdd, {
            ...this.formItem,
            id: this.id,
            rank_id: this.formItem.rank_id.join(),
            coupons: this.formItem.coupons.map(item => item.id).join()
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
  .content{
    display: inline-block;
    vertical-align: bottom;
  }
  
}
</style>
