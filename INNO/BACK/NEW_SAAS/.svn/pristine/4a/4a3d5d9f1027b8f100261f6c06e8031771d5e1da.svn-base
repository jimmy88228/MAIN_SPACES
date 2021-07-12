<template>
  <div>
    <Modal
      class="money-form"
      v-model="modalShow"
      :title="modalTitle"
      :loading="modalLoading"
      :mask-closable="maskClose"
      @on-ok="confirm">
        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="100" class="money-coupon-form">
          <FormItem label="现金券编码" prop="code">
            <Input v-model="formItem.code" placeholder="请输入现金券编码"></Input>
          </FormItem>
          <FormItem label="现金券金额" prop="amount">
            <Input v-model="formItem.amount" placeholder="请输入现金券金额" type="number" number></Input>
          </FormItem>
          <FormItem label="有效期" prop="validTimeRange">
            <DateSelect ref="dateSelect" :customDate="formItem.validTimeRange" class="time_range" @sT="handleStart" @eT="handleEnd"/>
						
						<!-- <DatePicker :value="formItem.validTimeRange" type="datetimerange" placeholder="请选择有效期" class="time_range"></DatePicker> -->
          </FormItem>
          <FormItem label="是否按售卖价">
            <RadioGroup v-model="formItem.is_saled">
              <Radio label="1">售卖价</Radio>
              <Radio label="0">市场价</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="是否允许使用积分，优惠劵">
            <i-switch v-model="formItem.isUse" true-value="1" false-value="0">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import Dialog from '@/libs/dialog';
import DateSelect from '@/views/my-components/date-select/index.vue';
export default {
	components:{ DateSelect },
  mixins: [Dialog],
  data () {
    const checkValidRange = (rule, value, callback) => {
      if (!value[0] && !value[1]) {
        callback(new Error('有效期不能为空'));
      } else {
        callback();
      }
    }
    return {
      formItem: {
        amount: '',
        code: '',
        is_saled: '1',
        isUse: '1',
        validTimeRange: [],
        id: 0
      },
      ruleValidate: {
        code: [{ required: true, message: '现金券编码不能为空', trigger: 'blur' }],
        amount: [
          { required: true, message: '现金券金额不能为空', trigger: 'blur', type: 'number'},
          { message: '请填写正确现金券金额', trigger: 'blur', type: 'number', min: 0}
        ],
        validTimeRange: [{required: true, trigger: 'change', type: 'array', validator: checkValidRange}]
      }
    }
  },
  methods: {
    confirm () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          this.$ajax.post((this.formItem.id === 0 ? this.$api.moneyBonusAdd : this.$api.moneyBonusEdit), {
            coupon_id: this.formItem.id,
            coupon_code: this.formItem.code,
            coupon_money: this.formItem.amount,
            from_date: this.formItem.validTimeRange[0],
            to_date: this.formItem.validTimeRange[1],
            is_sale_price: this.formItem.is_saled,
            is_allow_use_benfit: this.formItem.isUse
	          })
		    		.then((response) => {
		    			var res = response.data;

		    			if (res.code) {
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
          this.showLoading();
        }
      });
    },
		handleStart(date){
			if(!this.formItem.validTimeRange) this.formItem.validTimeRange = []
			this.formItem.validTimeRange[0] = date;
		},
		handleEnd(date){
			if(!this.formItem.validTimeRange) this.formItem.validTimeRange = []
			this.formItem.validTimeRange[1] = date;
		},
    setData (row) {
      this.$refs.formValidate.resetFields();

      this.formItem.id = typeof (row.coupon_id) !== 'undefined' ? Number(row.coupon_id) : 0;
      if (this.formItem.id === 0) {
        this.modalTitle = '添加现金券';
				this.formItem.validTimeRange = [];
      } else {
        this.modalTitle = '编辑现金券';
        this.formItem.amount = Number(row.coupon_money);
        this.formItem.code = row.coupon_code;
        this.formItem.is_saled = row.is_sale_price;
        this.formItem.isUse = row.is_allow_use_benfit;
        this.formItem.validTimeRange = [row.from_date, row.to_date];
      }
      return this;
    }
  }
}
</script>
<style lang="less">
.money-form{
  .time_range{
    width: 340px;
  }
}
</style>
