<template>
  <div class="goods_page_table">
    <div class="search">
      <div class="fix">
        <Button type="primary" @click="showImportGoods=true">导入商品</Button>
        <Input v-model="search" class="basic_input" suffix="ios-search" placeholder="请输入商品名称" @on-change="handleSearch"/>
      </div>
    </div>
    <div class="content">
      <p v-show="showTip" style="color: red;font-size: 16px;">请填写商品信息</p>
      <Form ref="formDynamic" :model="formDynamic">
        <Table :columns="columns" :data="formDynamic.pageData" ref="myTable">
          <template slot-scope="{ row, index }" slot="name">
            <div class="img_list_wrap">
              <div class="img_fixed" style="width: 80px;height:80px;">
                <image-edit :img="row.goods_thumb2" @selectImg="openImagesModal('goods_thumb2', row.goods_thumb2, index)" @delImg="handleDelImg('goods_thumb2', index)"></image-edit>
              </div>
              <div class="sort_wrapper">
                <edit-name :name="row.goods_name" @get-name="val => handleSetData('goods_name', index, val)">
                  <p class="text">{{row.goods_name}}</p>
                </edit-name>
                <p>{{row.goods_sn}}</p>
              </div>
            </div>
          </template>
          <template slot-scope="{ row, index }" slot="limit_count">
            <FormItem
                :prop="'pageData.' + index + '.limit_count'"
                :rules="[{required: true, message: '限购数量不能为空', trigger: 'blur', type: 'number'}]">
              <InputNumber v-model="row.limit_count" :min="0" @on-change="val => handleSetData('limit_count', index, val)"/>
            </FormItem>
          </template>
          <template slot-scope="{ row }" slot="sale_number">
            <sum-text :value="row.sale_number" :row-data="row" type="sale_number"></sum-text>
          </template>
          <template slot-scope="{ row }" slot="market_price">
            <price-text :value="row.market_price" :row-data="row" type="market_price"></price-text>
          </template>
          <template slot-scope="{ row }" slot="price">
            <price-text :value="row.price" :row-data="row" type="price"></price-text>
          </template>
          <template slot-scope="{ row, index }" slot="fake_sales">
            <FormItem
                :prop="'pageData.' + index + '.fake_sales'"
                :rules="[{required: true, message: '预占销量不能为空', trigger: 'blur', type: 'number'}]">
              <InputNumber v-model="row.fake_sales" :min="0" @on-change="val => handleSetData('fake_sales', index, val)"/>
            </FormItem>
          </template>
          <template slot-scope="{ row, index }" slot="sort">
            <FormItem
                :prop="'pageData.' + index + '.sort'"
                :rules="[{required: true, message: '排序不能为空', trigger: 'blur', type: 'number'}]">
              <InputNumber v-model="row.sort" :min="0" @on-change="val => handleSetData('sort', index, val)"/>
            </FormItem>
          </template>
          <template slot-scope="{ row, index }" slot="enable">
            <enable-item :row="row" ref="enableItem" @get-val="val => handleSetData('enable', index, val)"></enable-item>
          </template>
          <template slot-scope="{ row, index }" slot="allow_direct_buy">
            <i-switch :true-value="1" :false-value="0" v-model="row.allow_direct_buy" @on-change="val => handleSetData('allow_direct_buy', index, val ? 1 : 0)">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </template>
          <template slot-scope="{ row, index }" slot="task_data">
            <div style="display:flex;align-items: flex-start;cursor: pointer;justify-content:center;" @click="handleTask(row)">
              <div style="text-align: center;" v-show="row.task_data.length">
                <p>日期</p>
                <div v-for="(task, cindex) in row.task_data" :key="'sign' + cindex">
                  <p>{{task.begin_time}} - {{task.end_time}}</p>
                </div>
              </div>
              <div style="text-align: center;" v-show="row.task_data.length">
                <p>预期预占数量</p>
                <div v-for="(task, cindex) in row.task_data" :key="'sign' + cindex">
                  <p>{{task.target_fake_sales}}</p>
                </div>
              </div>
              <p v-show="!row.task_data.length" style="text-align: center;" ><a>新增托管任务</a></p>
              <task-dialog ref="task" @get-task-data="data => handleTaskData(data, index)"></task-dialog>
            </div>
          </template>
          <template slot-scope="{ row, index }" slot="handle">
            <span><a @click="handleEdit(row, index)">{{idDisabled ? '查看' : '编辑'}}</a></span>
            <Divider type="vertical" v-if="!idDisabled"/>
            <span v-if="!idDisabled"><a @click="handleDel(index)">删除</a></span>
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
              <Button type="primary" @click.native="handleSetBatchType('limit_count')">设置限购数量</Button>
              <Button type="primary" @click.native="handleSetBatchType('fake_sales')">设置预占销量</Button>
              <Button type="primary" @click.native="handleSetBatchType('sort')">设置排序</Button>
              <Button type="primary" @click.native="handleSetBatchType('enable')">设置启用</Button>
              <Button type="primary" @click.native="handleSetBatchType('allow_direct_buy')">设置原价购买</Button>
							<Button type="primary" @click.native="handleSetBatchType('batchDelete')" :disabled="selectedLen == 0">批量删除商品</Button>
              <div slot="title">批量操作</div>
              <div slot="content">
                <InputNumber
                  v-model="batchValue"
                  placeholder="请输入值"
                  v-show="currentBatchType === 'limit_count' || currentBatchType === 'fake_sales' || currentBatchType === 'sort'"/>
                <i-switch
                  :true-value="1"
                  :false-value="0"
                  v-model="batchBoolValue"
                  v-show="currentBatchType === 'enable' || currentBatchType === 'allow_direct_buy'">
                  <span slot="open">是</span>
                  <span slot="close">否</span>
                </i-switch>
								<div style="padding:10px 0px;" v-if="currentBatchType == 'batchDelete'">
									<p >确定删除选中项？</p>
								</div>
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
    <Modal 
      v-model="showImportGoods"
      :mask-closable="true"
      :footer-hide="true"
    >
      <import-goods :importid="importid"></import-goods>
    </Modal>
  </div>
</template>

<script>
import Mixin from './mixins.js';
import NormsForm from './norms-form';
import PriceText from './price-text';
import ImageEdit from '@/views/my-components/image-edit/image-edit';
import EditName from './edit-name';
import EnableItem from './enable-item';
import TaskDialog from './task-dialog';
import SumText from './sum-text';
import ImportGoods from './import-goods';

export default {
  name: 'goodsPageTable',
  mixins: [Mixin],
  components: {
    NormsForm,
    PriceText,
    ImageEdit,
    EditName,
    EnableItem,
    TaskDialog,
    SumText,
    ImportGoods
  },
  props: {
    goodsData: {
      type: Array,
      required: true
    },
    idDisabled: {
      type: Boolean
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
      batchBoolValue: 0,
      currentBatchType: 'order',
      showTip: false,
      showImportGoods:false,
      importid:0
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
    handleTaskData (data, index) {
      this.handleSetData('task_data', index, data);
    },
    handleTask (row) {
      this.$refs.task.setData(row.task_data).show();
    },
    openImagesModal (name, url, index) {
      this.$selectMaterial({
        type: 'image',
        selectedData: url,
        getList: (item) => {
          this.handleSetData('goods_thumb2', index, item.src)
        }
      });
    },
    handleDelImg (name, index) {
      this.handleSetData('goods_thumb2', index, '');
    },
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
    handleFlatten (data) {
      return data.reduce((acc, item) => {
        return acc.concat(item);
      }, []);
    },
    handleEdit (row, index) {
      this.rowData = row;
      this.$refs.normsForm.setData(index).show();
    },
    handleDel (index) {
      this.formDynamic.pageData.splice(index, 1);
      this.$emit('get-data', this.handleFlatten(this.allData));
    },
    handleNormsDel (goodsId, proId) {
      this.formDynamic.pageData.forEach(item => {
        if (item.goods_id === goodsId) {
          let index = item.get_products.findIndex(item => item.product_id === proId);
          if (index > -1) item.get_products.splice(index, 1);
        }
      });
      this.$emit('get-data', this.handleFlatten(this.allData));
    },
    handleEditNorms (data, index) {
      this.formDynamic.pageData[index].get_products = data;
      this.$emit('get-data', this.handleFlatten(this.allData));
    },
    handleSetData (key, index, value) {
      if (key === 'enable') {
        this.formDynamic.pageData[index].get_products.forEach(item => {
          console.log(value)
          item.enable = +value;
        });
      }
      console.log(this.formDynamic.pageData[index].get_products)
      this.formDynamic.pageData[index][key] = value;
      this.$emit('get-edit-data', key, index, value); //这里由于数据校验只修改指定数据,不会触发goodsData更新
    },
    handleSetBatchType(type) {
      this.currentBatchType = type;
      this.batchValue = 0;
      this.batchBoolValue = 0;
    },
    handleBatchConfirm () {
      if (!this.selectData.length) {
        this.$Message.error('请选择商品!');
      } else if (/^(limit_count|fake_sales|sort)$/.test(this.currentBatchType) && !this.batchValue) {
        this.$Message.error('请输入值!');
      } else {
        let ids = this.selectData.map(item => item.goods_id);
				let newAllData = [];
        this.allData.forEach(item => {
          item.forEach(c => {
            if (ids.includes(c.goods_id)) {
              if (/^(limit_count|fake_sales|sort)$/.test(this.currentBatchType)) {
                c[this.currentBatchType] = this.batchValue;
              } else {
                if (this.currentBatchType === 'enable') {
                  c.get_products.forEach(g => g.enable = this.batchBoolValue);
                }
                c[this.currentBatchType] = this.batchBoolValue;
              }
            } else {
							if(this.currentBatchType == "batchDelete"){
								newAllData.push(item);
							}
						}
          });
        });
				if(this.currentBatchType == "batchDelete"){
					this.allData = newAllData;
					this.selectData = [];
				}
        this.showBatchInput = false;
        this.batchValue = 0;
        this.batchBoolValue = 0;
      }
    },
    handleSearch (e) {
      let reg = new RegExp(this.search, 'g');
      this.cloneGoodsData = this.goodsData.filter(item => reg.test(item.goods_name));
    },
    checkValidate (fn) {
      this.showTip = false;
      this.$refs.formDynamic.validate(valid => {
        if (this.formDynamic.pageData.length === 0) {
          valid = false;
          this.showTip = true;
        }
        fn(valid);
      })
    }
  },
  watch: {
    "$route.params.id":{//深度监听，可监听到对象、数组的变化
          handler(nV) {
           this.importid=Number(nV);
          },
          immediate: true  
     },
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
          item.price = item.price || 0;
          item.sale_number = item.sale_number || 0;
          item.goodsInventory = item.goodsInventory || 0;
          item.limit_count = +item.limit_count || 0;
          item.fake_sales = +item.fake_sales || 0;
          item.sort = +item.sort || 0;
          item.enable = +item.enable || 0;
          item.allow_direct_buy = +(item.allow_direct_buy) || 0;
          item.task_data = item.task_data && item.task_data.length ? item.task_data : [];
          item.get_products.forEach(c => {
            c.sale_number = c.sale_number || 0;
            c.product_number = c.product_number || 0;
            c.market_price = +c.market_price || 0;
            c.price = +c.price || 0;
            c.inventory = +c.inventory || 0;
            c.enable = +c.enable || 0;
            c.is_sellout = +c.is_sellout || 0;
          });
          return item;
        });
        console.log(formatData)
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
				console.log("result", result);
        // 添加字段
        this.allData = result;
      },
      immediate: true
    },
    'formDynamic.pageData': {
      handler(nV) {
				if(nV instanceof Array || nV instanceof Object){
					nV.forEach(item => {
					  if (item._checked) {
					    this.pushItem(item);
					  } else {
					    this.delItem(item);
					  }
					})
				}
      },
      deep: true
    },
    allData: {
      handler (nV) {
        this.formDynamic.pageData = nV[this.currentPage - 1] || [];
      },
      deep: true
    },
    currentPage: {
      handler(page) {
        this.formDynamic.pageData = this.allData[page - 1] || [];
        this.formDynamic.pageData.forEach(item => this.setCheck(item));
      },
      immediate: true //为了在第一页就触发选中状态
    }
  }
}
</script>

<style lang="less">
.goods_page_table{
  .text{
    display: inline-block;
  }
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
