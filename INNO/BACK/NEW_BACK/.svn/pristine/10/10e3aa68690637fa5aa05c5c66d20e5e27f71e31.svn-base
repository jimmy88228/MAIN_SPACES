<template>
  <div>
    <Modal
      class="register-form"
      v-model="modalShow"
      :title="modalTitle"
      :loading="modalLoading"
      :mask-closable="maskClose"
      @on-ok="confirm">
        <Form ref="formValidate" :model="formItem"  :rules="ruleValidate" :label-width="120">
          <FormItem label="名称" prop="offer_name">
            <Input v-model="formItem.offer_name" placeholder="请输入名称"></Input>
          </FormItem>
          <FormItem label="类别" prop="offer_type">
            <RadioGroup v-model="formItem.offer_type" @on-change="handleChange">
              <Radio label="point">积分</Radio>
              <!-- <Radio :label="1">余额</Radio> -->
              <Radio label="coupon">优惠券</Radio>
            </RadioGroup>
            <div>
              <FormItem
                v-if="formItem.offer_type === 'point'"
                ref="points"
                prop="points"
                :rules="[{required: true, message: '积分不能为空', trigger: 'blur', type: 'number'}]"
                :show-message="formItem.offer_type === 'point'">
                <InputNumber
                  :min="0"
                  :precision="0"
                  v-model="formItem.points"></InputNumber>
              </FormItem>
              <!-- <FormItem
                v-if="formItem.offer_type === 1"
                ref="money"
                prop="money"
                :rules="[{required: true, message: '余额不能为空', trigger: 'blur', type: 'number'}]"
                :show-message="formItem.offer_type === 1">
                <InputNumber
                  :min="0"
                  v-model="formItem.money"></InputNumber>
              </FormItem> -->
              <FormItem
                v-if="formItem.offer_type === 'coupon'"
                ref="coupon"
                prop="coupon"
                :rules="[{required: true, message: '优惠券不能为空', trigger: 'blur', type: 'array', min: 1}]"
                :show-message="formItem.offer_type === 'coupon'">
                <coupon-select :data="formItem.coupon" type="checkbox" @del-tag="e => handleCoupon('coupon', e)">
                  <Button type="dashed" @click="handleSelected('coupon')" class="basic_select">选择优惠券</Button>
                </coupon-select>
              </FormItem>
            </div>
          </FormItem>
          <FormItem label="生效时段" prop="validTimeRange">
            <DatePicker v-model="formItem.validTimeRange" type="datetimerange" placeholder="请选择生效时段" class="time_range"  @on-change="handleTimeRange" style="width:340px;"></DatePicker>
          </FormItem>
          <FormItem label="启用" prop="is_enabled">
            <i-switch v-model="formItem.is_enabled" size="large" :true-value="1" :false-value="0">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
          </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import Dialog from '@/libs/dialog';
import CouponSelect from '@/views/my-components/list-component/index-edit';

export default {
  mixins: [Dialog],
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
    return {
      formItem: {
        offer_name: '',
        offer_type: 'point',
        points: 0,
        money: 0,
        coupon: [],
        validTimeRange: [],
        start_time: '',
        end_time: '',
        is_enabled: 0,
        id: 0
      },
      // 表单数据规则
      ruleValidate: {
        offer_name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        validTimeRange: [{required: true, trigger: 'change', type: 'array', validator: checkValidRange}],
      }
    }
  },
  methods: {
    handleChange () {
      this.$refs.points && (this.$refs.points.validateState ='');
      this.$refs.money && (this.$refs.money.validateState ='');
      this.$refs.coupon && (this.$refs.coupon.validateState ='');
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
    handleTimeRange ([start_time, end_time]) {
      this.formItem.start_time = start_time;
      this.formItem.end_time = end_time;
    },
    confirm () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          let val;
          if (this.formItem.offer_type === 'point') {
            val = this.formItem.points;
          } else {
            val = this.formItem.coupon.map(item => item.type_code).join();
          }
          this.$ajax.post((this.formItem.id === 0 ? this.$api.registerRebateAdd : this.$api.registerRebateEdit), {
            id: this.formItem.id,
            offer_name: this.formItem.offer_name,
            offer_type: this.formItem.offer_type,
            offer_num: val,
            start_time: this.formItem.start_time,
            end_time: this.formItem.end_time,
            is_enabled: this.formItem.is_enabled
	        })
		    		.then((response) => {
		    			var res = response.data;

		    			if (res.code) {
		    				// 保存成功
                this.$Message.success(res.message);
                this.modalShow = false;

                // 把数据返回给父级
                this.$emit('on-success');
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

      // 初始化表单数据
      this.formItem.id = typeof (row.id) !== 'undefined' ? Number(row.id) : 0;
      if (this.formItem.id === 0) {
        this.modalTitle = '添加注册返利';
      } else {
        this.modalTitle = '编辑注册返利';
        this.formItem.offer_name = row.offer_name;
        this.formItem.offer_type = row.offer_type;
        if (this.formItem.offer_type === 'point') {
          this.formItem.points = +row.offer_num;
        } else {
          this.formItem.coupon = row.offer_num_data;
        }
        this.formItem.validTimeRange = [row.start_time, row.end_time];
        this.formItem.start_time =row.start_time;
        this.formItem.end_time =row.end_time;
        this.formItem.is_enabled = row.is_enabled;
      }
      return this;
    }
  }
}
</script>
