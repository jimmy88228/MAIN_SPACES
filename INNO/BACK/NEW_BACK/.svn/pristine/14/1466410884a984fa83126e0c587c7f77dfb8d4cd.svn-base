<template>
  <div>
    <Modal
      class="norms-form"
      v-model="modalShow"
      :title="modalTitle"
      width="850"
      :loading="modalLoading"
      :mask-closable="maskClose"
      @on-ok="confirm">
        <p>商品货号: <span class="name">{{rowData.goods_sn}}</span></p>
        <Form ref="formDynamic" :model="formDynamic">
          <Table :columns="columns" :data="formDynamic.pageData" :loading="tableLoading" ref="myTable">
            <template slot-scope="{ row, index }" slot="inventory_number">
              <FormItem
                :prop="'pageData.' + index + '.inventory_number'"
                :rules="[{required: true, message: '店铺最大可售库存不能为空', trigger: 'blur', type: 'number'}]">
                <InputNumber v-model="row.inventory_number" :min="0" @on-change="e => handleSetData('inventory_number', index, e)"/>
              </FormItem>
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
                <Button type="primary" @click.native="handleSetBatchType('activeNum')">批量设置库存</Button>
                <!-- <Button type="primary" @click.native="handleSetBatchType('sortOrder')">设置排序</Button>
                <Button type="primary" @click.native="handleSetBatchType('enable')">设置开启</Button> -->
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
import Mixin from './norms-stock-mixin';

export default {
  props: ['rowData'],
  mixins: [Dialog, Mixin],
  data () {
    return {
      modalTitle: '设置店铺库存',
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
      currentBatchType: 'order',
      tableLoading: false
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
          let ids = this.formDynamic.pageData.map(item => item.id);
          let selectedIds = this.selectData.map(item => item.id);
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
          this.formDynamic.pageData.forEach((item,index) => {
            item._checked = val;
            console.log("index", index, this.formDynamic.pageData);
            this.$set(this.formDynamic.pageData[index], '_checked', val);
          });
        } else {
          this.formDynamic.pageData.forEach(item => {
            item._checked = val;
              this.$set(item, '_checked', val);
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
            console.log('可可可可：',this.formDynamic.pageData,'可可可可：');
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
        console.log(this.rowData, '打印：', this.rowData,)
          this.tableLoading = true;
          return this.$ajax.post(this.$api.cloudSeckillActivityStoreGoodsInfo, {
              activity_goods_id: this.rowData.id || 0,
              activity_id: this.$route.params.id,
              goods_id: this.rowData.goods_id
          })
              .then(response => {
                  const res = response.data;
                  if (res.code) {
                      let data = res.data && res.data.items;
                      for(let i = 0; i < data.length; i++){
                          data[i]._checked = false;
                      }
                      this.formDynamic.pageData = data;
                      this.pageTotal = data.length;
                  }
                  this.spinShow = false;
              }).finally(()=>{
                  this.tableLoading = false;
              })
      })
      return this;
    },
    pushItem(obj) {
      let ids = this.selectData.map(item => item.id);
      if (!ids.includes(obj.id)) this.selectData.push(obj);
    },
    delItem(obj) {
      let index = this.selectData.findIndex(item => item.id === obj.id);
      if (index > -1) this.selectData.splice(index, 1);
    },
    setCheck(obj) {
      let index = this.selectData.findIndex(item => item.id === obj.id);
      if (index > -1) obj._checked = true;
    },
    handleSetBatchType(type) {
      this.currentBatchType = type;
      this.batchValue = 0;
      this.batchBoolValue = 0;
    },
    handleBatchConfirm () {
      if (this.currentBatchType !== 'enable' && !this.batchValue) {
        this.$Message.error('请输入值!');
      } else {
        let ids = this.selectData.map(item => item.id);
        //this.formDynamic.pageData
        console.log('ids: ',ids , '打333印：',this.formDynamic.pageData);
        let pageDatas = this.formDynamic.pageData;
        for (let i = 0; i < pageDatas.length; i++) {
            if (ids.includes(pageDatas[i]['id'])) {
                pageDatas[i]['inventory_number'] = this.batchValue;
            }
        }

        /*this.allData.forEach(item => {
          item.forEach(c => {
            if (ids.includes(c.id)) {
              if (this.currentBatchType !== 'enable') {
                c[this.currentBatchType] = this.batchValue;
              } else {
                c[this.currentBatchType] = this.batchBoolValue;
              }
            }
          });
        });*/
        this.showBatchInput = false;
        this.batchValue = 0;
        this.batchBoolValue = 0;
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
