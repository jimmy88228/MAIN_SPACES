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
          <template slot-scope="{ row }" slot="price">
            <price-text :value="row.price" :row-data="row" type="market_price">
				<span slot="before">￥</span>
			</price-text>
          </template>
          <template slot-scope="{ row }" slot="packagePrice">
            <price-text :value="row.packagePrice" :row-data="row" type="packagePrice"></price-text>
          </template>
          <template slot-scope="{ row, index }" slot="packageNum">
            <FormItem
                :prop="'pageData.' + index + '.packageNum'"
                :rules="[{required: true, message: '搭配数量不能为空', trigger: 'blur', type: 'number'}]">
              <InputNumber v-model="row.packageNum" :min="0" @on-change="val => handleSetData('packageNum', index, val)" :disabled="idDisabled"/>
            </FormItem>
          </template>
          <template slot-scope="{ row, index }" slot="main">
            <i-switch :true-value="1" :false-value="0" v-model="row.main" @on-change="val => handleSetData('main', index, val ? 1 : 0)" :disabled="idDisabled">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </template>
          <template slot-scope="{ row, index }" slot="request">
            <i-switch :true-value="1" :false-value="0" v-model="row.request" @on-change="val => handleSetData('request', index, val ? 1 : 0)" :disabled="idDisabled">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
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
              <Button type="primary" @click.native="handleSetBatchType('packageNum')">设置搭配数量</Button>
              <!-- <Button type="primary" @click.native="handleSetBatchType('request')">设置必选</Button> -->
              <div slot="title">批量操作</div>
              <div slot="content">
                <InputNumber v-model="batchValue" placeholder="请输入值" v-show="currentBatchType === 'packageNum'"/>
                <i-switch :true-value="1" :false-value="0" v-model="batchBoolValue" v-show="currentBatchType !== 'packageNum'">
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
    </div>
    <norms-form
      ref="normsForm"
      :row-data="rowData"
      @edit-norms="handleEditNorms"></norms-form>
  </div>
</template>

<script>
import Mixin from './mixins.js';
import NormsForm from './norms-form';
import PriceText from './price-text';
import ExpandRow from './table-row.vue';

export default {
  name: 'goodsPageTable',
  mixins: [Mixin],
  components: {
    NormsForm,
    PriceText,
	ExpandRow
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
  mounted(){
	this.initColumns();
  },
  methods: {
	initColumns(){
		let columns = this.columns || [];
		columns.splice(1,0,{
			title:'',
			type: 'expand',
			width:30,
			render: (h, params) => {
			    console.log(params.row.get_products)
			    var self = this;
			    return h(ExpandRow, {
			        props: {
			            products: params.row.get_products
			        },
			    })
			}
		});
		this.columns = columns;
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
      if (key === 'main') {
		if(value == 1){
			// 确保主商品唯一
			this.formDynamic.pageData.forEach(item => item.main = 0);
			this.formDynamic.pageData[index]["request"] = value;
		}
      } else if(key === 'request'){
		  if(value == 0){
			 this.formDynamic.pageData[index]["main"] = value; 
		  }
	  }
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
      } else if (this.currentBatchType === 'packageNum' && !this.batchValue) {
        this.$Message.error('请输入值!');
      } else {
        let ids = this.selectData.map(item => item.goods_id);
        this.allData.forEach(item => {
          item.forEach(c => {
            if (ids.includes(c.goods_id)) {
              if (this.currentBatchType === 'packageNum') {
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
			console.log("item", JSON.parse(JSON.stringify(item)))
          item._checked = false;
          item.price = 0;
          item.packagePrice = 0;
          item.packageNum = Number(item.packageNum) || 0;
          item.main = Number(item.main) || 0;
          item.request = Number(item.request) || 0;
          item.get_products.forEach(c => {
            c.price = c.price || 0;
            c.packagePrice = c.packagePrice || 0;
            c.sortOrder = c.sortOrder || 0;
            c.enable = c.enable || 0;
          });
		  console.log("调整后item", item)
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
