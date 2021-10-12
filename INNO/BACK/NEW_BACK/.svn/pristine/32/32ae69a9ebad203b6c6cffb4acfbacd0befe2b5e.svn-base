<template>
  <PageTopBase isSave @save="confirm">
    <div class="time-limit-form">
      <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">
        <FormItem label="名称" prop="activity_name">
          <Input v-model="formItem.activity_name" placeholder="请输入活动名称" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
        </FormItem>
        <FormItem label="标识码" prop="activity_code">
          <Input v-model="formItem.activity_code" placeholder="请输入标识码" class="basic_input"/>
          <p class="strong_tips">备注：标识码只能由数字和字母组成的（6~16位数）的自由编码</p>
        </FormItem>
        <FormItem prop="gift_points" label="充值面额">
          <InputNumber :min="0" v-model="formItem.gift_points"></InputNumber>
        </FormItem>
        <FormItem prop="free_points" label="赠送面额">
          <InputNumber :min="0" v-model="formItem.free_points"></InputNumber>
        </FormItem>
        <FormItem label="是否可用" prop="is_enabled">
          <i-switch size="large" v-model="formItem.is_enabled" true-value="1" false-value="0">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="有效期类型">
          <RadioGroup v-model="formItem.validType" class="radio_group">
            <Radio label="0" class="radio_24">固定时间段</Radio>
            <Radio label="1">自购买后一段时间</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="有效期" prop="validTime" v-if="formItem.validType == 0">
          <InputNumber :min="0" v-model="formItem.validTime"></InputNumber>
          <span>单位: 月</span>
        </FormItem>
        <FormItem label="有效期" prop="validTimeRange" v-if="formItem.validType == 1">
          <DatePicker v-model="formItem.validTimeRange" type="datetimerange" placeholder="请选择活动时间" class="time_range" @on-change="handleDateChange"></DatePicker>
        </FormItem>
        <FormItem prop="tag_id" label="选择优惠券">
          <Coupon-select :data="formItem.couponData" type="checkbox" @del-tag="handleTag">
            <Button type="dashed" @click="handleSelected" class="basic_select">选择优惠券</Button>
          </Coupon-select>
        </FormItem>
      </Form>
    </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </PageTopBase>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import ImageEdit from '@/views/my-components/image-edit/image-edit';
import Control from '@/libs/page-control';
import CouponSelect from '@/views/my-components/list-component/index-edit';

export default {
  props: ['id'],
  provide () {
    return {
      formInstance: this
    }
  },
  components: {
    PageTopBase,
    ImageEdit,
    CouponSelect
  },
  mixins: [Control],
  data () {
    return {
      formItem: {
        activity_name: '',
        activity_code: '',
        validTimeRange: [],
        validTime: 0,
        from_time: '',
        to_time: '',
        gift_points: 0,
        free_points: 0,
        is_enabled: '0',
        validType: '0',
        couponData: []
      },
      ruleValidate: {
        activity_name: [{required: true, message: '活动名称不能为空', trigger: 'blur'}],
        activity_code: [
          {required: true, message: '标识码不能为空', trigger: 'blur'},
          {min: 6, message: '标识码至少6位数', trigger: 'blur'},
          {pattern: /^(\d|\w)*$/, message: '标识码只能由数字和字母组成', trigger: 'blur'},
        ],
        gift_points: [{required: true, message: '充值面额不能为空', trigger: 'blur', type: 'number'}]
      },
      spinShow: false
    }
  },
  methods: {
    handleTime ([from_time, to_time]) {
      this.formItem.from_time = from_time;
      this.formItem.to_time = to_time;
    },
    handleTag (data) {
      this.formItem.couponData = data;
    },
    handleSelected (key) {
      this.$selectContent({
        mode: 'coupon',
        type: 'checkbox',
        data: this.formItem.couponData,
        getList: (data) => {
          this.formItem.couponData = data;
          this.$refs.formValidate.validateField(key);
        }
      });
    },
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.registerActivityInfo, {
        id: this.id
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          let data = res.data && res.data.items;
          if (data) {
            this.formItem = Object.assign({}, data, {
              validTimeRange: [data.from_time, data.to_time],
              gift_points: +data.gift_points,
              gift_activity_num: +data.gift_activity_num,
              gift_bonus: data.gift_bonus_data,
              tag_id: data.tag_arr
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
          return this.$ajax.post(this.id ? this.$api.registerActivityEdit : this.$api.registerActivityAdd, {
            id: this.id,
            activity_name: this.formItem.activity_name,
            receive_type: 1, //没啥卵用
            from_time: this.formItem.from_time,
            to_time: this.formItem.to_time,
            gift_points: this.formItem.gift_points,
            gift_bonus: this.formItem.gift_bonus.map(item => item.id).join(),
            gift_activity_id: 0,
            gift_activity_num: this.formItem.gift_activity_num,
            background_image: this.formItem.background_image,
            dialog_box: this.formItem.dialog_box,
            activity_image: this.formItem.activity_image,
            share_image: this.formItem.share_image,
            share_desc: this.formItem.share_desc,
            share_title: this.formItem.share_title,
            activity_desc: this.formItem.activity_desc,
            tag_id: this.formItem.tag_id.map(item => item.id).join()
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
}
</style>
<style lang="less" scoped>
.group-activity-select-wrapper{
  text-align: center;
}
</style>
