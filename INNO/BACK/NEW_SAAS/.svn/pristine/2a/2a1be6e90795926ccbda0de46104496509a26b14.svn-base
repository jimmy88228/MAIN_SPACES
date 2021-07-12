<template>
  <div class="goods_page_table">
    <div class="search">
      <Input v-model="search" class="basic_input" suffix="ios-search" placeholder="请输入商品名称" @on-change="handleSearch"/>
    </div>
    <div class="content">
      <Form ref="formDynamic" :model="formDynamic">
        <Table :columns="columns" :data="formDynamic.pageData" ref="myTable">
          <template slot-scope="{ row }" slot="name">
            <div class="img_list_wrap">
              <div class="img_fixed">
                <img :src="row.goods_thumb2" v-if="row.goods_thumb2" :alt="row.goods_thumb2" v-viewer/>
                <img src="@rs/images/default-img.jpg" :alt="row.goods_name" v-viewer v-else></img>
              </div>
              <div class="sort_wrapper">
                <p>{{row.goods_name}}</p>
                <p>{{row.goods_sn}}</p>
              </div>
            </div>
          </template>
          <template slot-scope="{ row, index }" slot="limitNumber">
            <limit-number :value="row.limitNumber" :row-data="row" @set-limit-value="val => handleSetBatchData('limitNumber', index, val)"></limit-number>
          </template>
          <template slot-scope="{ row, index }" slot="discountPrice">
            <discount-price :value="row.discountPrice" :row-data="row" @set-discount-value="val => handleSetBatchData('discountPrice', index, val)"></discount-price>
          </template>
          <template slot-scope="{ row, index }" slot="perOrder">
            <FormItem
                :prop="'pageData.' + index + '.perOrder'"
                :rules="[{required: true, message: '每单限购不能为空', trigger: 'blur', type: 'number'}]">
              <InputNumber v-model="row.perOrder" :min="0" style="width: 100px;" @on-change="val => handleSetData('perOrder', index, val)"/>
            </FormItem>
          </template>
          <template slot-scope="{ row, index }" slot="perUser">
            <FormItem
                :prop="'pageData.' + index + '.perUser'"
                :rules="[{required: true, message: '每人限购不能为空', trigger: 'blur', type: 'number'}]">
              <InputNumber v-model="row.perUser" :min="0" style="width: 100px;" @on-change="val => handleSetData('perUser', index, val)"/>
            </FormItem>
          </template>
          <template slot-scope="{ row, index }" slot="sortOrder">
            <FormItem
                :prop="'pageData.' + index + '.sortOrder'"
                :rules="[{required: true, message: '排序不能为空', trigger: 'blur', type: 'number'}]">
              <InputNumber v-model="row.sortOrder" :min="0" style="width: 100px;" @on-change="val => handleSetData('sortOrder', index, val)"/>
            </FormItem>
          </template>
          <template slot-scope="{ row, index }" slot="handle">
            <span><a @click="handleEdit(row, index)">编辑</a></span>
            <Divider type="vertical"/>
            <span><a @click="handleDel(row.goods_id, index)">删除</a></span>
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
          <template>
            <span>批量操作</span>
            <Poptip v-model="showBatchInput" placement="bottom-end">
              <Button type="primary" data-key="order" @click.native="handleSetBatchType('perOrder')">设置每单可购</Button>
              <Button type="primary" data-key="user" @click.native="handleSetBatchType('perUser')">设置每人可购</Button>
              <Button type="primary" data-key="sort" @click.native="handleSetBatchType('sortOrder')">设置排序</Button>
              <Button type="primary" data-key="limit" @click.native="handleSetBatchType('limitNumber')">设置限售数量</Button>
              <Button type="primary" data-key="price" @click.native="handleSetBatchType('discountPrice')">设置活动价</Button>
              <div slot="title">批量操作</div>
              <div slot="content">
                <InputNumber v-model="batchValue" :min="0" placeholder="请输入值"/>
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
    </div>
    <norms-form
      ref="normsForm"
      :row-data="rowData"
      @edit-norms="handleEditNorms"></norms-form>
  </div>
</template>

<script>
import Mixin from './mixins.js';
import LimitNumber from './limit-number';
import DiscountPrice from './discount-price';
import NormsForm from './norms-form';

export default {
  name: 'goodsPageTable',
  mixins: [Mixin],
  components: {
    LimitNumber,
    DiscountPrice,
    NormsForm
  },
  props: {
    goodsData: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      search: '',
      cloneGoodsData: [], //用来搜索使用的
      allData: [],
      formDynamic: {
        pageData: []
      },
      selectData: [],
      pageTotal: 0,
      currentPage: 1,
      pageSize: 10,
      checkType: 1,
      checkIndeter: false,
      rowData: {},
      showBatchInput: false,
      batchValue: 0,
      currentBatchType: 'order'
    }
  },
  computed: {
    selectedLen () {
      return this.selectData.length;
    },
    checkAll: {
      get() {
        let isCheckAll = false;
        if (this.checkType === 1) {
          let ids = this.formDynamic.pageData.map(item => item.goods_id);
          let selectedIds = this.selectData.map(item => item.goods_id);
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
          isCheckAll = this.selectData.length === this.cloneGoodsData.length;
          if (this.selectData.length === 0) {
            this.checkIndeter = false;
          } else {
            this.checkIndeter = !isCheckAll;
          }
        }
        return isCheckAll;
      },
      set(val) {
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
    changePage (e) {
      this.currentPage = e;
    },
    pushItem(obj) {
      let ids = this.selectData.map(item => item.goods_id);
      if (!ids.includes(obj.goods_id)) this.selectData.push(obj);
    },
    delItem(obj) {
      let index = this.selectData.findIndex(item => item.goods_id === obj.goods_id);
      if (index > -1) this.selectData.splice(index, 1);
    },
    setCheck(obj) {
      let index = this.selectData.findIndex(item => item.goods_id === obj.goods_id);
      if (index > -1) obj._checked = true;
    },
    handleSetBatchData (key, index, val) {
      this.formDynamic.pageData[index][key] = val;
      this.formDynamic.pageData[index].get_products.forEach(item => {
        item[key] = val;
      });
    },
    handleEdit (row, index) {
      this.rowData = row;
      this.$refs.normsForm.setData(index).show();
    },
    handleDel (id, index) {
      this.$emit('del-good-item', id);
      this.formDynamic.pageData.splice(index, 1);
    },
    handleNormsDel (goodsId, proId) {
      this.$emit('del-norm-item', goodsId, proId);
    },
    handleEditNorms (data, index) {
      this.formDynamic.pageData[index].get_products = data;
    },
    handleSetData (key, index, value) {
      this.formDynamic.pageData[index][key] = value;
    },
    handleSetBatchType(type) {
      this.currentBatchType = type;
      this.batchValue = 0;
    },
    handleBatchConfirm () {
      if (!this.selectData.length) {
        this.$Message.error('请选择商品!');
      } else if (!this.batchValue) {
        this.$Message.error('请输入值!');
      } else {
        let curType = 1;
        switch (this.currentBatchType) {
          case 'limitNumber':
          case 'discountPrice':
            curType = 1;
            break;
          case 'perOrder':
          case 'perUser':
          case 'sortOrder':
            curType = 2;
            break;
          default:
            break;
        }
        let ids = this.selectData.map(item => item.goods_id);
        this.allData.forEach(item => {
          item.forEach(c => {
            if (ids.includes(c.goods_id)) {
              if (curType === 1) {
                // 这里是因为需要规格内的值来决定商品的值
                c.get_products.forEach(n => {
                  n[this.currentBatchType] = this.batchValue;
                })
              } else {
                c[this.currentBatchType] = this.batchValue;
              }
            }
          });
        });
        this.showBatchInput = false;
        this.batchValue = 0;
      }
    },
    handleSearch (e) {
      let reg = new RegExp(this.search, 'g');
      this.cloneGoodsData = this.goodsData.filter(item => reg.test(item.goods_name));
    },
    checkValidate (fn) {
      this.$refs.formDynamic.validate(valid => {
        fn(valid);
      })
    }
  },
  watch: {
    goodsData: {
      handler(nV) {
        this.cloneGoodsData = JSON.parse(JSON.stringify(nV));
      },
      immediate: true
    },
    cloneGoodsData: {
      handler(nV) {
        // 添加字段
        let formatData = JSON.parse(JSON.stringify(nV)).filter(item => {
          item._checked = false;
          item.limitNumber = 0;
          item.discountPrice = 0;
          item.perOrder = Number(item.perOrder) || 0;
          item.perUser = Number(item.perUser) || 0;
          item.sortOrder = Number(item.sortOrder) || 0;
          item.get_products.forEach(c => {
            c.limitNumber = c.limitNumber || 0;
            c.discountPrice = c.discountPrice || 0;
          });
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
      },
      immediate: true
    },
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
        this.$emit('get-data', nV);
      },
      deep: true
    },
    currentPage: {
      handler(page) {
        this.formDynamic.pageData = this.allData[page - 1];
        this.formDynamic.pageData.forEach(item => this.setCheck(item));
      },
      immediate: true //为了在第一页就触发选中状态
    }
  }
}
</script>

<style lang="less">
.goods_page_table{
  .search{
    text-align: right;
    margin-bottom: 24px;
  }
  .ivu-table-body .padd .ivu-table-cell{
    padding-top: 20px;
  }
  .footer{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 24px;
    .action{
      flex-basis: 80%;
      text-align: left;
    }
  }
}
</style>
