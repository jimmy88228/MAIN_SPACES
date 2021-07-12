<template>
  <div>
    <Modal
      class="dynamic-rules"
      v-model="modalShow"
      width="640"
      :title="modalTitle"
      :loading="modalLoading"
      :mask-closable="maskClose"
      @on-ok="confirm">
        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80" label-colon>
          <FormItem label="原价" prop="salePrice">
            <InputNumber :min="0" v-model="formItem.salePrice"></InputNumber>
          </FormItem>
          <FormItem label="定金" prop="depositPrice">
            <InputNumber :min="0" :max="formItem.salePrice" v-model="formItem.depositPrice" @on-change="handleChange"></InputNumber>
          </FormItem>
          <FormItem v-for="(item, index) in formItem.rules" :key="item.sign" :label="'规则'+(index+1)">
            <FormItem
              class="inline"
              :prop="'rules.'+index+'.rule_rate'"
              :rules="[
                {required: true, message: '人数不能为空', trigger: 'blur', type: 'number'},
                {validator: checkPeople, trigger: 'blur', type: 'number'}
              ]">
              <span>满</span>
              <InputNumber :min="1" v-model="item.rule_rate"></InputNumber>
              <span>人时</span>
            </FormItem>
            <FormItem
              class="inline"
              :prop="'rules.'+index+'.tail_price'"
              :rules="[
                {required: true, message: '尾款不能为空', trigger: 'blur', type: 'number'},
                {validator: checkTail, trigger: 'blur', type: 'number'}
              ]">
              <span>,支付尾款</span>
              <InputNumber :min="0" :max="formItem.salePrice - formItem.depositPrice" v-model="item.tail_price"></InputNumber>
              <span>元</span>
              <span>,优惠金额{{calcDiscount(formItem.salePrice, formItem.depositPrice, item.tail_price, index)}}元</span>
            </FormItem>
            <Button class="del" type="error" @click="handleDel(index)" v-if="index > 0">删除规则</Button>
          </FormItem>
          <div style="text-align: right;">
            <Button type="primary" @click="handleAddRule" v-show="formItem.rules.length < 3">新增规则</Button>
          </div>
        </Form>
    </Modal>
  </div>
</template>
<script>
import Dialog from '@/libs/dialog';
import Utils from '@/libs/vue-utils.js';

export default {
  mixins: [Dialog],
  data () {
    return {
      formItem: {
        rules: [
          {
            id: 0, //接口要求的，新增为0
            sign: 0, //v-for key必须不一致
            rule_type: 1, //未知字段，写死
            rule_rate: 1,
            deposit_price: 0,
            tail_price: 0,
            discount_price: 0
          }
        ],
        salePrice: 0,
        depositPrice: 0
      },
      sign: 0,
      ruleValidate: {},
      modalTitle: '设置动态规则',
      currentIndex: 0
    }
  },
  methods: {
    checkPeople (rule, value, callback) {
      const {
        field
      } = rule;
      const reg = /^rules.(?<index>\d+).rule_rate$/;
      const matchObj = reg.exec(field);
      const index = matchObj.groups.index;
      if (index > 0) {
        if (value < this.formItem.rules[index-1].rule_rate) {
          callback(new Error('人数不能小于上一级'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    checkTail (rule, value, callback) {
      const {
        field
      } = rule;
      const reg = /^rules.(?<index>\d+).tail_price$/;
      const matchObj = reg.exec(field);
      const index = matchObj.groups.index;
      if (index > 0) {
        if (value > this.formItem.rules[index-1].tail_price) {
          callback(new Error('尾款不能大于上一级'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    calcDiscount (salePrice, depositPrice, tail, index) {
      const diff = Utils.reduceCalc(salePrice, depositPrice);
      const result = Utils.reduceCalc(diff, tail);
      this.formItem.rules[index].discount_price = result;
      return result;
    },
    handleAddRule () {
      this.sign++;
      let lastPeople = this.formItem.rules[this.formItem.rules.length - 1].rule_rate;
      this.formItem.rules.push({
        id: 0,
        sign: this.sign,
        rule_type: 1,
        rule_rate: ++lastPeople,
        deposit_price: 0,
        tail_price: 0,
        discount_price: 0
      });
    },
    handleDel (index) {
      this.formItem.rules.splice(index, 1);
    },
    handleChange (val) {
      // 原价与定金相等，清空尾款
      if (this.formItem.salePrice === val) {
        this.formItem.rules.forEach(item => {
          item.tail_price = 0;
        });
      }
      // 定金 更新数据
      this.formItem.rules.forEach(item => {
        item.deposit_price = val;
      });
    },
    confirm () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          this.modalShow = false;
          this.$emit('on-success', this.formItem.rules, this.currentIndex);
        } else {
          this.showLoading();
        }
      });
    },
    // 打开模态框
    setData (row, index) {
      console.log(row)
      this.currentIndex = index;
      this.formItem.rules = row.goods_rule;
      this.formItem.salePrice = row.sale_price;
      this.formItem.depositPrice = row.deposit_price;
      return this;
    }
  }
}
</script>
<style lang="less">
.dynamic-rules{
  .inline{
    display: inline-block;
  }
  .del{
    margin-left: 10px;
  }
}
</style>
