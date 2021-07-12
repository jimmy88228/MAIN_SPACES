<template>
  <PageTopBase class="live-broadcast" isSave @save="confirm">
    <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">
      <FormItem label="选择模板" prop="templateId">
        <Select v-model="formItem.templateId" class="basic_select">
          <Option value="1">你好</Option>
        </Select>
      </FormItem>
      <FormItem label="通知名称" prop="activity_name">
        <Input v-model="formItem.activity_name" placeholder="请输入通知名称" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
      </FormItem>
      <FormItem label="推送对象">
        <RadioGroup v-model="formItem.doubleElephant" class="radio_group">
          <Radio label="0" class="radio_24">全部分销员</Radio>
          <Radio label="1">选择分销员</Radio>
          <coupon-select :data="formItem.staffs" type="checkbox" @del-tag="handleCouponClose" v-show="formItem.doubleElephant == 1">
            <Button type="dashed" @click="handleCouponSelected" class="basic_select">{{formItem.staffs.length === 0 ? '选择分销员' : `已选${formItem.staffs.length}分销员`}}</Button>
          </coupon-select>
        </RadioGroup>
      </FormItem>
      <FormItem label="执行方式">
        <RadioGroup v-model="formItem.execWay" class="radio_group">
          <Radio label="0" class="radio_24">手动执行</Radio>
          <Radio label="1">自动执行</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="推送频次" v-show="formItem.execWay == 1">
        <RadioGroup v-model="formItem.pushTimes" class="radio_group">
          <Radio label="0" class="radio_24">单次推送</Radio>
          <Radio label="1">循环推送</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="推送时间" prop="pushDate" v-show="formItem.execWay == 1 && formItem.pushTimes === '0'">
        <DatePicker v-model="formItem.pushDate" type="datetime" placeholder="请选择活动时间"></DatePicker>
      </FormItem>
      <FormItem label="推送有效期" prop="validTimeRange" v-show="formItem.execWay == 1 && formItem.pushTimes == 1">
        <DatePicker v-model="formItem.validTimeRange" type="daterange" placeholder="请选择推送有效期" class="time_range" @on-change="handleDateChange"></DatePicker>
        <TimePicker v-model="formItem.validTime" type="time" placeholder="请选择推送时间" style="width: 168px"></TimePicker>
      </FormItem>
      微信模板
    </Form>
  </PageTopBase>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import CouponSelect from '@/views/my-components/list-component/index-edit';

export default {
  components: {
    PageTopBase,
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
    return {
      formItem: {
        templateId: -1,
        activity_name: '',
        doubleElephant: '0',
        execWay: '0',
        pushTimes: '0',
        pushDate: '',
        validTimeRange: [],
        validTime: '',
        staffs: []
      },
      ruleValidate: {
        templateId: [{required: true, message: '模板不能为空', trigger: 'change'}],
        activity_name: [{required: true, message: '通知名称不能为空', trigger: 'blur'}],
        validTimeRange: [{required: true, trigger: 'change', type: 'array', validator: checkValidRange}]
      },
      currentStep: 0,
      showBaisc: true,
      spinShow: false,
      sortVaild: false
    }
  },
  methods: {
    handleCouponSelected () {
      this.$selectContent({
        mode: 'staff',
        type: 'checkbox',
        data: this.formItem.staffs,
        getList: (data) => {
          this.formItem.staffs = data;
        }
      })
    },
    handleCouponClose (data) {
      this.formItem.staffs = data;
    },
    handleDateChange ([from_time, to_time]) {
      this.formItem.from_time = from_time;
      this.formItem.to_time = to_time;
    },
    confirm () {
      this.$refs.formValidate.validate(valid => {
        console.log(valid)
      })
    }
  }
}
</script>
<style lang="less">
.live-broadcast{
  .basic_input_fixed, .basic_textarea{
    max-width: 420px;
  }
  .time_range{
    width: 340px;
  }
}
</style>
<style lang="less" scoped>
.bargin-activity-select-wrapper{
  text-align: center;
}
.steps{
  position: absolute;
  width: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
