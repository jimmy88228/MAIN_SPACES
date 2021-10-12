<template>
  <div>
    <Modal
      class="red-envelopes-form"
      v-model="modalShow"
      :title="modalTitle"
      :loading="modalLoading"
      :mask-closable="maskClose"
      @on-ok="confirm">
        <Form ref="formValidate" :model="formItem"  :rules="ruleValidate" :label-width="120">
          <FormItem label="红包名称" prop="act_name">
            <Input v-model="formItem.act_name" placeholder="请输入红包名称"></Input>
          </FormItem>
          <FormItem label="金额" prop="amount">
            <InputNumber v-model="formItem.amount" :min="1"></InputNumber>
          </FormItem>
          <!--<FormItem label="红包数量" prop="create_number">
				<InputNumber   :min=0 v-model="formValidate.create_number"  style="width: 100px" />
		  </FormItem>-->
          <FormItem label="已发放数量" prop="send_number">
            <InputNumber v-model="formItem.send_number" disabled :min="0"></InputNumber>
          </FormItem>
          <FormItem label="有效期类型" prop="limited_type">
            <RadioGroup v-model="formItem.limited_type" @on-change="handleTypeChange">
              <Radio label="0">规定时间</Radio>
              <Radio label="1">领取后N月</Radio>
              <Radio label="2">领取后N天</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="有效期">
            <FormItem
              ref="dateRange"
              v-if="formItem.limited_type == 0"
              prop="dateRange"
              :rules="[{required: true, message: '有效期不能为空', trigger: 'change', type: 'array'}]"
              :show-message="formItem.limited_type == 0">
              <DatePicker type="datetimerange" placeholder="请选择有效期" style="width: 340px;" v-model="formItem.dateRange" @on-change="handleChange"></DatePicker>
            </FormItem>
            <FormItem
              ref="validity_value_month"
              v-if="formItem.limited_type == 1"
              prop="validity_value_month"
              :rules="[{required: true, message: '月份不能为空', trigger: 'blur', type: 'number'},
              {message: '请输入有效的月份', trigger: 'blur', type: 'number', min: 1}]"
              :show-message="formItem.limited_type == 1">
              <span>领取后</span>
              <InputNumber v-model="formItem.validity_value_month" :min="1"></InputNumber>
              <span>月</span>
            </FormItem>
            <FormItem
              ref="validity_value_day"
              v-if="formItem.limited_type == 2"
              prop="validity_value_day"
              :rules="[{required: true, message: '天数不能为空', trigger: 'blur', type: 'number'},
              {message: '请输入有效的天数', trigger: 'blur', type: 'number', min: 1}]"
              :show-message="formItem.limited_type == 2">
              <span>领取后</span>
              <InputNumber v-model="formItem.validity_value_day" :min="1"></InputNumber>
              <span>天</span>
            </FormItem>
          </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import Dialog from '@/libs/dialog';

export default {
  mixins: [Dialog],
  data () {
    return {
      formItem: {
        act_name: '',
        amount: 1,
        send_number: 0,
        create_number:0,
        limited_type: '0',
        dateRange: [],
        validity_value_month: 1,
        validity_value_day: 1,
        id: 0
      },
      // 表单数据规则
      ruleValidate: {
        act_name: [{ required: true, message: '红包名称不能为空', trigger: 'blur' }],
        amount: [{ required: true, message: '金额不能为空', trigger: 'blur', type: 'number' }],
        //create_number: [{ required: true, message: '红包数量不能为空', trigger: 'blur', type: 'number' }],
      }
    }
  },
  methods: {
    handleTypeChange () {
      this.$refs.dateRange && (this.$refs.dateRange.validateState = '');
      this.$refs.validity_value_month && (this.$refs.validity_value_month.validateState = '');
      this.$refs.validity_value_day && (this.$refs.validity_value_day.validateState = '');
    },
    handleChange (val) {
      this.formItem.dateRange = val;
    },
    confirm () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          this.$ajax.post((this.formItem.id === 0 ? this.$api.redPacketAdd : this.$api.redPacketEdit), {
            id: this.formItem.id,
            act_name: this.formItem.act_name,
            amount: this.formItem.amount,
            create_number: this.formItem.create_number,
            send_number: this.formItem.send_number,
            limited_type:	this.formItem.limited_type,
            validity_value: this.formItem.limited_type != 0 ? (this.formItem.limited_type == 1 ? this.formItem.validity_value_month : this.formItem.validity_value_day) : '',
            start_time:	this.formItem.limited_type == 0 ? this.formItem.dateRange[0] : '',
            end_time:	this.formItem.limited_type == 0 ? this.formItem.dateRange[1] : ''
	        })
		    		.then((response) => {
		    			var res = response.data;

		    			if (res.code) {
		    				// 保存成功
                this.$Message.success(res.message);
                this.modalShow = false;
                this.$emit('on-success', {
                  type: this.formItem.id === 0 ? 'add' : 'edit',
                  data: res.data
                });
	              } else {
		    				this.showLoading();
		    			}
		    		});
        } else {
          // 验证失败，不关闭模态框
          this.showLoading();
        }
      });
    },
    // 打开模态框
    setData (row) {
      // 重置表单
      this.$refs.formValidate.resetFields();
      // 这里是因为v-if进行控制,Form渲染时候并没有把这些字段添加到组件内的已选数组，导致resetFields不起作用，只能手动进行初始化
      this.formItem.dateRange = [];
      this.formItem.validity_value_month = 1;
      this.formItem.validity_value_day = 1;

      // 初始化表单数据
      this.formItem.id = typeof (row.id) !== 'undefined' ? Number(row.id) : 0;
      if (this.formItem.id === 0) {
        this.modalTitle = '添加红包';
      } else {
        this.modalTitle = '编辑红包';
        this.formItem.act_name = row.act_name;
        this.formItem.amount = Number(row.amount);
        this.formItem.create_number = Number(row.create_number);
        this.formItem.limited_type = row.limited_type;
        this.formItem.dateRange = row.limited_type == 0 ? [row.from_date, row.to_date] : [];
        this.formItem.validity_value_month = row.limited_type == 1 ? Number(row.validity_value) : 0;
        this.formItem.validity_value_day = row.limited_type == 2 ? Number(row.validity_value) : 0;
      }
      return this;
    }
  }
}
</script>
