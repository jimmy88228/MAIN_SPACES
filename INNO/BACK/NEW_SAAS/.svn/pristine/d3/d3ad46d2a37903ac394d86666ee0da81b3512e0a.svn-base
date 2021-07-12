<template>
  <div class="spec_table">
    <Table :columns="filed" :data="tableData" border :span-method="handleSpan" :show-header="showHeader" ref="myTable">
      <template slot="header">
        <div ref="myHeader" class="wrapper">
          <table border="0" cellspacing="0" cellpadding="0" ref="myTHeader">
            <colgroup>
              <col v-for="(column, index) in columns" :width="setWidth(index)" :key="column.key">
            </colgroup>
            <thead>
              <tr>
                <th v-for="(column, index) in columns" :key="column.key" class="header" :class="calcClass(index)">
                  <div class="title">{{column.title}}</div>
                </th>
              </tr>
            </thead>
          </table>
        </div>
      </template>
    </Table>
    <div class="setting">
      <span class="setting_title">批量设置：</span>
      <ul class="type" v-show="showType">
        <Button class="item" type="primary" @click="handleSet('markerPrice')" v-show="saleType == 1">售价</Button>
        <Button class="item" type="primary" @click="handleSet('markerPrice2')" v-show="saleType != 1">市场价</Button>
        <Button class="item" type="primary" @click="handleSet('salePrice')" v-show="saleType != 1">促销价</Button>
        <Button class="item" type="primary" @click="handleSet('goodsWeight')">重量</Button>
        <span style="color:red">注意：当商品有成本价时，提成比例计算公式为：（销售价-成本价）X 分销比例</span>
      </ul>
      <div v-show="!showType">
        <Input type="number" style="width: 100px;" v-model="settingDatas"/>
        <a @click="handleSave">保存</a>
        <a @click="handleCancel">取消</a>
      </div>
    </div>
  </div>
</template>

<script>
import Mixin from './mixin';
import { on } from '@/libs/untils/dom.js';

export default {
  props: {
    specData: {
      type: Array,
      required: true
    },
    isSingle: {
      type: Boolean
    },
    // 规格输入框修改名称
    changeData: {
      type: Object,
      required: true
    },
    attrType: {
      type: String
    },
    colorList: {
      type: Array
    },
    sizeList: {
      type: Array
    },
    saleType: {
      // 4：促销商品; 99: 赠品 1: 正常商品
      type: [Number, String],
      default: 0
    },
    apiSaleStatus: {
      type: [Number, String]
    },
    // 颜色名称
    colorUnit: {
      type: String,
      required: true
    },
    // 尺码名称
    sizeUnit: {
      type: String,
      required: true
    }
  },
  mixins: [Mixin],
  data () {
    return {
      tableData: [],
      filed: [],
      moduleData: {
        product_id: 0,
        goods_id: 0,
        product_sn: '',
        product_number: 0,
        size_id: 0,
        color_id: 0,
        size_name: 0,
        color_name: 0,
        hold_number: 0,
        alias_goods_sn: 0,
        market_price: 0,
        sale_price: 0,
        goods_weight: 0,
        is_onsale: '0',
        goods_cost: 0,
        // 合并行
        rowSpan: 0,
        colSpan: 0
      },
      saleStatus: '0',
      showType: true,
      settingDatas: '',
      markerPrice: 0,
      markerPrice2: 0,
      salePrice: 0,
      goodsWeight: 0,
      currentType: 'markerPrice',
      showHeader: false,
      myTable: {},
      customHeaderWidth: {}
    }
  },
  methods: {
    handleSpan ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 && !this.isSingle) {
        return [this.tableData[rowIndex].rowSpan, this.tableData[rowIndex].colSpan];
      }
    },
    getSaleStatus (status) {
      this.saleStatus = status;
      this.tableData.forEach(item => {
        item['is_onsale'] = String(status);
      })
    },
    reRenderData (changeObj) {
      this.tableData.forEach(item => {
        if (this.attrType === 'color') {
          if (item.color_id == changeObj.id) {
            item['color_name'] = changeObj.spec_name;
          }
        } else {
          if (item.size_id == changeObj.id) {
            item['size_name'] = changeObj.spec_name;
          }
        }
      })
    },
    createEmptyData () {
      // 创建出所有的默认tableData并且替换
      if (this.isSingle) {
        let mergeData = [];
        this.colorList.forEach(colorItem => {
          if (colorItem.cat_id) {
            mergeData.push(Object.assign({}, this.moduleData, {
              color_id: colorItem.id,
              color_name: colorItem.spec_name
            }));
            mergeData.forEach((mergeItem, index) => {
              this.tableData.forEach(tableItem => {
                if (mergeItem.color_id == tableItem.color_id) {
                  mergeData[index] = tableItem;
                }
              });
            });
          }
        });
        this.tableData = mergeData;
      } else {
        const m = new Map();
        let mergeData = [];
        this.colorList.forEach(colorItem => {
          let arr = [];
          this.sizeList.forEach(sizeItem => {
            if (sizeItem.cat_id) {
              arr.push({
                size_id: sizeItem.id,
                size_name: sizeItem.spec_name
              });
            }
          });
          if (colorItem.cat_id) {
            m.set({
              color_id: colorItem.id,
              color_name: colorItem.spec_name
            }, arr);
          }
        });
        m.forEach((value, key) => {
          value.forEach(sizeItem => {
            mergeData.push(Object.assign({}, this.moduleData, {
              color_id: key.color_id,
              color_name: key.color_name,
              size_id: sizeItem.size_id,
              size_name: sizeItem.size_name
            }));
          });
        });
        mergeData.forEach((mergeItem, index) => {
          this.tableData.forEach(tableItem => {
            if (mergeItem.color_id == tableItem.color_id && mergeItem.size_id == tableItem.size_id) {
              mergeData[index] = tableItem;
            }
          });
        });
        let temp = {};
        mergeData.forEach((item, index) => {
          if (!temp[item.color_id]) {
            temp[item.color_id] = true;
            item['rowSpan'] = this.sizeList.length;
            item['colSpan'] = 1;
          } else {
            item['rowSpan'] = 0;
            item['colSpan'] = 0;
          }
        });
        this.tableData = mergeData;
      }
    },
    handleSet (type) {
      this.showType = false;
      this.currentType = type;
    },
    handleSave () {
      if (this.settingDatas === '') {
        this.$Message.error('内容不能为空');
        return false;
      }
      if (Number(this.settingDatas) <= 0) {
        this.$Message.error('请输入合法值');
        return false;
      }
      this.showType = true;
      this[this.currentType] = this.settingDatas;
      this.settingDatas = '';
    },
    handleCancel () {
      this.showType = true;
    },
    setWidth (index) {
      if (Object.keys(this.customHeaderWidth).length > 0) {
        return (this.customHeaderWidth[index] && this.customHeaderWidth[index].width) || 0;
      }
    },
    calcClass (index) {
      if (this.isSingle) {
        if (this.saleType == 1) {
          if (index === 1 || index === 2) return 'fix_header';
        } else {
          if (index === 1 || index === 2 || index === 3) return 'fix_header';
        }
      } else {
        if (this.saleType == 1) {
          if (index === 2 || index === 3) return 'fix_header';
        } else {
          if (index === 2 || index === 3 || index === 4) return 'fix_header';
        }
      }
    },
    handleScroll (e) {
      this.$refs.myHeader.scrollLeft = e.target.scrollLeft;
    },
  },
  mounted () {
    this.$nextTick(() => {
      this.myTable = this.$refs.myTable;
      const tableDom = document.querySelector('.ivu-table-body');
      on(tableDom, 'scroll', e => {
        this.handleScroll(e);
      });
    })
  },
  watch: {
    // 这个地方使用了iview内置属性(columnsWidth,tableWidth)，如果出bug,检测源码是否更新改动到了
    'myTable.columnsWidth': {
      handler (nV) {
        this.customHeaderWidth = {...nV};
        this.$nextTick(() => {
          this.$refs.myTHeader.width = this.$refs.myTable.tableWidth + 'px';
        })
      },
      immediate: true,
      deep: true
    },
    colorUnit (nV) {
      this.columns.forEach(item => {
        if (item.key === 'color_name') {
          item['title'] = this.colorUnit;
        }
      });
    },
    sizeUnit () {
      this.columns.forEach(item => {
        if (item.key === 'size_name') {
          item['title'] = this.sizeUnit;
        }
      })
    },
    specData: {
      handler(newVal) {
        if (newVal.length > 0) {
          this.tableData = newVal;
        }
      },
      immediate: true
    },
    changeData: {
      handler (data) {
        this.reRenderData(data);
      },
      deep: true
    },
    colorList: {
      handler (newVal) {
        this.createEmptyData();
      },
      deep: true,
      immediate: true
    },
    sizeList: {
      handler (newVal) {
        this.filed = this.calcFiled();
        this.createEmptyData();
      },
      deep: true,
      immediate: true
    },
    tableData: {
      handler (newVal) {
        this.$emit('edit-table', newVal);
      },
      immediate: true,
      deep: true
    },
    isSingle: {
      handler (nV) {
        if (!nV && this.colorList.length > 0 && this.sizeList.length === 0) {
          // 当双规格，用户进行尺码规格添加时，清空之前的数据，防止用户操作数据
          this.tableData = [];
          return false;
        }
        this.filed = this.calcFiled();
      },
      immediate: true
    },
    saleType: {
      handler () {
        this.filed = this.calcFiled();
      },
      immediate: true
    },
    apiSaleStatus: {
      handler (value) {
        if (value) this.saleStatus = value;
      },
      immediate: true
    },
    markerPrice (value) {
      this.tableData.forEach(item => item.market_price = value);
    },
    markerPrice2 (value) {
      this.tableData.forEach(item => item.market_price = value);
    },
    salePrice (value) {
      this.tableData.forEach(item => item.sale_price = value);
    },
    goodsWeight (value) {
      this.tableData.forEach(item => item.goods_weight = value);
    }
  }
}
</script>

<style lang="less">
.spec_table{
  .setting{
    display: flex;
    align-items: center;
    margin-top: 10px;
    .setting_title{
      display: inline-block;
      margin-right: 10px;
    }
    .type{
      display: flex;
      align-items: center;
      .item{
        list-style: none;
        cursor: pointer;
        margin-right: 10px;
      }
    }
  }
  .ivu-table-fixed{
    box-shadow:0 0 0 #fff;
  }
  .reset_padding{
    padding: 5px 0 !important;
  }
  .wrapper{
    overflow-x: scroll;
    .header{
      text-align: center;
      &.fix_header{
        .title::before{
          content: '*';
          color: red;
          display: inline-block;
          height: 14px;
          line-height: 14px;
          vertical-align: middle;
        }
      }
    }
  }
}
</style>


