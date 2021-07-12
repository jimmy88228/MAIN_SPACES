<template>
  <div class="row-table">
    <Table
        :columns="tableColumn"
        :data="rowMergeData"
        :span-method="handleSpan"
        height="200"
        ref="rowTable">
        <template slot-scope="{ row, index }" slot="color">
          <color-check
            :checked="row._colorChecked"
            :indeterminate="row._colorIndeterminate"
            :is-multi="isMulti"
            :data="rowMergeData"
            :cur-data="row"
            @color-check-change="e => handleColorChange(e, index, row.color_id)"
            @color-indeterminate="e => handleColorIndeterminate(e, index)"></color-check>
          <span>{{row.color_name}}</span>
        </template>
        <template slot-scope="{ row, index }" slot="size">
          <size-check :checked="row._sizeChecked" @size-check-change="e => handleSizeChange(e, index, row.color_id)"></size-check>
          <span>{{row.size_name}}</span>
        </template>
    </Table>
    <div class="footer">
      <div>
        <Checkbox v-model="checkAll" :indeterminate="indeterminate">全选</Checkbox>
        <span>已选规格({{selectedLen}})</span>
      </div>
      <div>
        <Button @click="cancel">取消</Button>
        <Button type="primary" @click="comfirm">确定</Button>
      </div>
    </div>
  </div>
</template>

<script>
import ColorCheck from './color-check';
import SizeCheck from './size-check';

export default {
  props: {
    rowData: {
      type: Array,
      default() {
        return [];
      }
    },
    isMulti: {
      type: Boolean
    },
    curIndex: {
      type: Number
    },
    isChecked: {
      type: Boolean
    }
  },
  components: {
    ColorCheck,
    SizeCheck
  },
  data () {
    return {
      indeterminate: false,
      rowMergeData: [], //rowSpan/colSpan合并
    }
  },
  inject: ['root'],
  computed: {
    selectedLen() {
      let len;
      if (!this.isMulti) {
        len = this.rowMergeData.filter(item => item._colorChecked).length;
      } else {
        len = this.rowMergeData.filter(item => item._sizeChecked).length;
      }
      return len;
    },
    tableColumn() {
      let columns = [
        {
          title: '颜色',
          key: 'color_name',
          slot: 'color'
        },
        {
          title: '库存',
          key: 'product_number'
        }
      ];
      const sizeObj = {
        title: '尺码',
        key: 'size_name',
        slot: 'size'
      };
      if (this.isMulti) {
        // 双规格
        columns.splice(1, 0, sizeObj);
      }
      return columns;
    },
    checkAll: {
      get () {
        // 规格判断
        let singleCheck = false;
        let multiCheck = false;
        if (!this.isMulti) {
          let selectedLen = this.rowMergeData.filter(item => item._colorChecked).length;
          let allLen = this.rowMergeData.length;
          let {checked, indeterminate} = this.root.handleCheckStatus(allLen, selectedLen);
          singleCheck = checked;
          this.indeterminate = indeterminate;
        } else {
          let selectedLen = this.rowMergeData.filter(item => item._sizeChecked).length;
          let allLen = this.rowMergeData.length;
          let {checked, indeterminate} = this.root.handleCheckStatus(allLen, selectedLen);
          multiCheck = checked;
          this.indeterminate = indeterminate;
        }
        return this.isChecked || singleCheck || multiCheck;
      },
      set (val) {
        // 规格判断
        if (!this.isMulti) {
          this.rowMergeData.forEach(item => {
            item._colorChecked = val;
          });
        } else {
          this.rowMergeData.forEach(item => {
            item._colorChecked = val;
            item._sizeChecked = val;
          });
        }
      }
    }
  },
  methods: {
    handleSpan ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return [this.rowMergeData[rowIndex].rowSpan, this.rowMergeData[rowIndex].colSpan];
      }
    },
    handleColorChange (val, index, colorId) {
      if (!this.isMulti) {
        this.rowMergeData[index]._colorChecked = val;
      } else {
        this.rowMergeData[index]._colorChecked = val;
        let curColor = this.rowMergeData.filter(item => item.color_id === colorId).map(item => item.color_id);
        this.rowMergeData.forEach(item => {
          if (curColor.includes(item.color_id)) {
            item._sizeChecked = val;
          }
        });
      }
    },
    handleColorIndeterminate (val, index) {
      this.rowMergeData[index]._colorIndeterminate = val;
    },
    handleSizeChange (val, index, colorId) {
      this.rowMergeData[index]._sizeChecked = val;
      // let curColor = this.rowMergeData.filter(item => item.color_id === colorId).map(item => item.color_id);
      // let isAllSizeCheck = this.rowMergeData.filter(item => item.color_id === colorId).every(item => item._sizeChecked);
      // this.rowMergeData.forEach(item => {
      //   if (curColor.includes(item.color_id)) {
      //     item._colorChecked = isAllSizeCheck;
      //   }
      // });
    },
    cancel () {
      this.root.normsCancel(this.curIndex);
    },
    comfirm() {
      let selected = this.rowMergeData.filter(item => {
        return (!this.isMulti && item._colorChecked) || (this.isMulti && item._sizeChecked)
      }).map(item => {
        return {
          color_id: item.color_id,
          size_id: item.size_id
        }
      });
      if (!selected.length) {
        this.$Message.error('请选择规格!');
        return false;
      }
      let formatData = {
        [this.rowMergeData[0].goods_id]: selected
      }
      let result = [];
      this.rowData.forEach(item => {
        selected.forEach(s => {
          if (item.color_id === s.color_id && item.size_id === s.size_id) {
            result.push(item);
          }
        })
      });
      result.forEach(item => {
        delete item._colorChecked;
        delete item._sizeChecked;
        delete item._colorIndeterminate;
        delete item.colSpan;
        delete item.rowSpan;
      });
      this.root.normsComfirm(this.curIndex, formatData, result);
    }
  },
  watch: {
    rowData(nV) {
      this.rowMergeData = [];
      let tempKey = {};
      nV.forEach(item => {
        if (!(item.color_id in tempKey)) {
          tempKey[item.color_id] = [];
          tempKey[item.color_id].push(item);
        } else {
          tempKey[item.color_id].push(item);
        }
      });
      for (let k in tempKey) {
        let curItemLen = tempKey[k].length;
        tempKey[k].forEach((item, index) => {
          item.rowSpan = index === 0 ? curItemLen : 0;
          item.colSpan = index === 0 ? 1 : 0;
          this.rowMergeData.push(item);
        });
      }
    },
    isChecked(nV) {
      this.checkAll = nV;
    }
  }
}
</script>

<style lang="less" scoped>
.row-table{
  .footer{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
