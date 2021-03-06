<template>
  <div>
    <Modal
      class="norms-form"
      v-model="modalShow"
      :title="modalTitle"
      width="1000"
      :loading="modalLoading"
      :mask-closable="maskClose"
      @on-ok="confirm">
        <p>商品名称: <span class="name">{{rowData.goods_name}}</span></p>
        <Form ref="formDynamic" :model="formDynamic">
          <Table :columns="columns" :data="formDynamic.pageData" ref="myTable">
            <template slot-scope="{ row, index }" slot="packagePrice">
              <FormItem
                :prop="'pageData.' + index + '.packagePrice'"
                :rules="[{required: true, message: '售卖价不能为空', trigger: 'blur', type: 'number'}]">
                <InputNumber v-model="row.packagePrice" :min="0" @on-change="e => handleSetData('packagePrice', index, e)" :disabled="idDisabled"/>
              </FormItem>
            </template>
            <template slot-scope="{ row, index }" slot="sortOrder">
              <FormItem
                :prop="'pageData.' + index + '.sortOrder'"
                :rules="[{required: true, message: '排序不能为空', trigger: 'blur', type: 'number'}]">
                <InputNumber v-model="row.sortOrder" :min="0" @on-change="e => handleSetData('sortOrder', index, e)" :disabled="idDisabled"/>
              </FormItem>
            </template>
            <template slot-scope="{ row, index }" slot="enable">
              <i-switch :true-value="1" :false-value="0" v-model="row.enable" @on-change="val => handleSetData('enable', index, val ? 1 : 0)" :disabled="idDisabled">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </template>
            <template slot-scope="{ row, index }" slot="handle">
              <template v-if="idDisabled">--</template>
              <template v-else>
                <span><a @click="handleDel(row.product_id, index)">删除</a></span>
              </template>
            </template>
          </Table>
        </Form>
        <div class="footer">
          <div class="action">
            <Checkbox v-model="checkAll" :indeterminate="checkIndeter"></Checkbox>
            <Select v-model="checkType" class="basic_select">
              <Option :value="1">当前页全选</Option>
              <Option :value="2">全部页全选</Option>
            </Select>
            <span>已选{{selectedLen}}项</span>
            <template v-if="!idDisabled">
              <span>批量操作</span>
              <Poptip v-model="showBatchInput" placement="bottom-end">
                <Button type="primary" @click.native="handleSetBatchType('packagePrice')">设置售卖价</Button>
                <Button type="primary" @click.native="handleSetBatchType('sortOrder')">设置排序</Button>
                <Button type="primary" @click.native="handleSetBatchType('enable')">设置开启</Button>
                <div slot="title">批量操作</div>
                <div slot="content">
                  <InputNumber v-model="batchValue" placeholder="请输入值" v-show="currentBatchType !== 'enable'"/>
                  <i-switch :true-value="1" :false-value="0" v-model="batchBoolValue" v-show="currentBatchType === 'enable'">
                    <span slot="open">是</span>
                    <span slot="close">否</span>
                  </i-switch>
                  <div style="margin-top: 10px;text-align: right;">
                    <Button @click="() => showBatchInput = false">取消</Button>
                    <Button type="primary" @click="handleBatchConfirm">确定</Button>
                  </div>
                </div>
              </Poptip>
            </template>
          </div>
          <div class="list_page">
            <Page
              :total="pageTotal"
              :page-size="pageSize"
              :current="currentPage"
              @on-change="changePage"
              show-total></Page>
          </div>
        </div>
    </Modal>
  </div>
</template>
<script>
import Dialog from '@/libs/dialog';
import Mixin from './norms-mixin';

export default {
  props: ['rowData'],
  mixins: [Dialog, Mixin],
  data () {
    return {
      modalTitle: '设置规格折扣',
      originData: [],
      allData: [],
      formDynamic: {
        pageData: []
      },
      selectData: [],
      pageTotal: 0,
      currentPage: 1,
      pageSize: 15,
      checkType: 1,
      checkIndeter: false,
      curIndex: 0, //当前商品index
      showBatchInput: false,
      batchValue: 0,
      batchBoolValue: 0,
      currentBatchType: 'order'
    }
  },
  computed: {
    idDisabled () {
      return this.$parent.idDisabled;
    },
    selectedLen () {
      return this.selectData.length;
    },
    checkAll: {
      get () {
        let isCheckAll = false;
        if (this.checkType === 1) {
          let ids = this.formDynamic.pageData.map(item => item.product_id);
          let selectedIds = this.selectData.map(item => item.product_id);
          let noHasId = false;
          ids.forEach(item => {
            if (!selectedIds.includes(item)) noHasId = true;
          });
          if (this.formDynamic.pageData.length) isCheckAll = !noHasId;
          let isAllNot = ids.every(item => !selectedIds.includes(item));
          if (isAllNot) {
            this.checkIndeter = false;
          } else {
            this.checkIndeter = !isCheckAll;
          }
        } else {
          isCheckAll = this.selectData.length === this.originData.length;
          if (this.selectData.length === 0) {
            this.checkIndeter = false;
          } else {
            this.checkIndeter = !isCheckAll;
          }
        }
        return isCheckAll;
      },
      set (val) {
        if (this.checkType === 1) {
          this.formDynamic.pageData.forEach(item => {
            item._checked = val;
          });
        } else {
          this.formDynamic.pageData.forEach(item => {
            item._checked = val;
          });
          for (let i = 0; i < this.allData.length; i++) {
            if (this.currentPage === i + 1) continue;
            this.allData[i].forEach(item => {
              if (val) {
                this.pushItem(item);
              } else {
                this.delItem(item);
              }
            });
          }
        }
      }
    }
  },
  methods: {
    resetStatus () {
      this.selectData = [];
      this.currentPage = 1;
      this.checkType = 1;
      this.checkIndeter = false;
      this.showBatchInput = false;
      this.currentBatchType = 'order';
    },
    changePage (e) {
      this.currentPage = e;
    },
    handleSetData (key, index, value) {
      this.formDynamic.pageData[index][key] = value;
    },
    confirm () {
      this.$refs.formDynamic.validate(valid => {
        if (valid) {
          let flatten = this.allData.reduce((acc, item) => {
            return acc.concat(item);
          }, []);
          this.$emit('edit-norms', flatten, this.curIndex);
          this.hide();
        } else {
          this.showLoading();
        }
      });
    },
    // 打开模态框
    setData (index) {
      this.resetStatus(); //需重置，此时打开都是同个modal
      this.curIndex = index;
      this.$nextTick(() => {
        this.originData = this.rowData.get_products;
        let formatData = JSON.parse(JSON.stringify(this.originData)).filter(item => {
          item._checked = item._checked || false;
          return item;
        });
        this.pageTotal = formatData.length;
        let result = [];
        let temp = [];
        // 分页处理
        let hasData = formatData.length - formatData.length % this.pageSize;
        if (formatData.length < this.pageSize) {
          result.push(formatData);
        } else {
          result = formatData.reduce((acc, item, index) => {
            temp.push(item);
            if ((index + 1) % this.pageSize === 0) {
              acc.push(temp);
              temp = [];
            }
            if (hasData && (index + 1 === formatData.length) && temp.length) acc.push(temp);
            return acc;
          }, []);
        }
        // 添加字段
        this.allData = result;
      })
      return this;
    },
    pushItem(obj) {
      let ids = this.selectData.map(item => item.product_id);
      if (!ids.includes(obj.product_id)) this.selectData.push(obj);
    },
    delItem(obj) {
      let index = this.selectData.findIndex(item => item.product_id === obj.product_id);
      if (index > -1) this.selectData.splice(index, 1);
    },
    setCheck(obj) {
      let index = this.selectData.findIndex(item => item.product_id === obj.product_id);
      if (index > -1) obj._checked = true;
    },
    handleSetBatchType(type) {
      this.currentBatchType = type;
      this.batchValue = 0;
      this.batchBoolValue = 0;
    },
    handleBatchConfirm () {
      if (!this.selectData.length) {
        this.$Message.error('请选择规格!');
      } else if (this.currentBatchType !== 'enable' && !this.batchValue) {
        this.$Message.error('请输入值!');
      } else {
        let ids = this.selectData.map(item => item.product_id);
        this.allData.forEach(item => {
          item.forEach(c => {
            if (ids.includes(c.product_id)) {
              if (this.currentBatchType !== 'enable') {
                c[this.currentBatchType] = this.batchValue;
              } else {
                c[this.currentBatchType] = this.batchBoolValue;
              }
            }
          });
        });
        this.showBatchInput = false;
        this.batchValue = 0;
        this.batchBoolValue = 0;
      }
    },
    handleDel (productId, index) {
      if (this.formDynamic.pageData.length > 1) {
        this.$parent.handleNormsDel(this.rowData.goods_id, productId);
        this.formDynamic.pageData.splice(index, 1);
      } else {
        this.$Message.error('不能删除所有规格!');
      }
    }
  },
  watch: {
    'formDynamic.pageData': {
      handler(nV) {
        nV.forEach(item => {
          if (item._checked) {
            this.pushItem(item);
          } else {
            this.delItem(item);
          }
        })
      },
      deep: true
    },
    allData: {
      handler (nV) {
        this.formDynamic.pageData = nV[this.currentPage - 1];
      },
      deep: true
    },
    currentPage: {
      handler(page) {
        if (!this.originData.length) return false;
        this.formDynamic.pageData = this.allData[page - 1];
        this.formDynamic.pageData.forEach(item => this.setCheck(item));
      },
      immediate: true //为了在第一页就触发选中状态
    }
  }
}
</script>
<style lang="less">
.norms-form{
  .name{
    color: red;
  }
  .ivu-table-body .padd .ivu-table-cell{
    padding-top: 20px;
  }
  .footer{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    .action{
      flex-basis: 74%;
    }
  }
}
</style>
