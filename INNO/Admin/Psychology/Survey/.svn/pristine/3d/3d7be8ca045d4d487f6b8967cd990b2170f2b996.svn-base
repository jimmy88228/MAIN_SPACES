<template>
  <div class="data-select-area">
    <Select ref='mySelect' :style="cusotmStyle" :value="selectValue" :disabled="disabled" filterable
      @on-change="selectChange" class="basic_select" :class="{ 'full-select': isFullW}" :size="size"
      :multiple="multiple" :transfer="transfer" :clearable="clearable" @on-clear="selectClear">
      <span class="w-nowrap" slot="prefix">
        <slot name="prefix"></slot>
      </span>
      <slot name="default-option"></slot>
      <Option v-for="(item, index) in dataList" :key="item[valueKey]" :value="item[valueKey]">{{item.grade}}（{{item.school_year}}）</Option>
    </Select>
  </div>
</template>
<script>
  export default {
    name: "dataGradeSelect",
    model: {
      prop: "value",
      event: "change",
    },
    props: {
      value: {
        type: Number | String | Array,
        default: 0,
      },
      valueKey: {
        type: String,
        default: "id",
      },
      valueType: {
        type: String,
        default: "int"
      },
      multiple: {
        type: Boolean,
        default: false,
      },
      transfer: {
        type: Boolean,
        default: false,
      },
      size: {
        type: String,
        default: "default",
      },
      isFullW: {
        type: Boolean,
        default: false,
      },
      clearable: {
        type: Boolean,
        default: true,
      },
      isAuto: {
        type: Boolean,
        default: true,
      },
      params: {
        type: Object,
        default: () => {},
      },
      disabled: Boolean,
      initCallback: Function,
      prefix: Boolean,
      cusotmStyle: String,
    },
    data() {
      return {
        dataList: [],
        dataReq: {},
        selectValue: 0,
        isInited: false,
      };
    },
    computed: {
      emptyValue() {
        return this.multiple ? [] : this.valueType == 'int' ? 0 : ''
      }
    },
    methods: {
      getData() {
        let req = "adminGradeData",
          params = {},
          isEmpty = false
        if (parseInt(this.params.campus_id) > 0) {
          params = this.params;
        } else {
          isEmpty = true;
        }

        if (isEmpty) {
          // 清空列表，同时清空数据
          this.dataList = [];
          this.isInited && this.selectChange(0);
        } else {
          this.isInited = true;
          this.getDataReq(req, params);
        }
      },
      getDataReq(req, params) {
        this.$MainApi[req]({
          data: params
        }).then((res) => {
          if (res.code) {
            let items;
            let data = res.data;
            if (data instanceof Array) {
              items = data || [];
            } else if (data.grade_data) {
              items = data.grade_data || [];
            } else {
              items = data || [];
            }
            this.handleData(items);
            return Promise.resolve();
          } else {
            return Promise.reject();
          }
        })
      },
      getCurData() {
        return this.dataList || [];
      },

      handleData(items) {
        console.log(items, "items")
        let _items = items || [];
        
        for (let i = 0; i < _items.length; i++) {
          _items[i][this.valueKey] =
            parseInt(_items[i][this.valueKey]) || 0;
        }

        this.dataList = _items;
        this.$emit("getData", this.dataList);
        typeof this.initCallback == "function" &&
          this.initCallback(JSON.parse(JSON.stringify(_items)));
      },
      selectChange(data) {
        console.log('selectChange', data, this.selectValue, this.type)
        if (data == undefined) {
          return;
        };
        let dataList = this.dataList;
        data = data || this.emptyValue;
        if (data == this.selectValue) return;
        let selectedData = dataList.filter(item=>{return item[this.valueKey] == data})[0] || {}
        this.$emit("change", selectedData);
        this.$emit("on-change", selectedData);
        this.$emit("changeData", this.getSelectData(data));
      },
      getSelectData(selectId) {
        let dataList = this.dataList || [];
        let selectData = this.multiple ? [] : {};
        if (!selectId || (this.multiple && selectId.length == 0)) {
          return this.emptyValue;
        } else {
          if (this.multiple) {
            for (let i = 0; i < dataList.length; i++) {
              let id = dataList[i][this.valueKey];
              if (id && selectId.indexOf(id) != -1) {
                selectData.push(dataList[i])
              }
            }
          } else {
            for (let i = 0; i < dataList.length; i++) {
              let id = dataList[i][this.valueKey];
              if (id && selectId == id) {
                selectData = dataList[i];
                break;
              }
            }
          }
          return selectData;
        }
      },
      selectClear() {
        this.$emit("change", this.emptyValue);
        this.$emit("changeData", this.getSelectData());
      },
      toggleMenu() {
        this.$refs["mySelect"] && this.$refs["mySelect"].toggleMenu();
      },
      _getData() {
        return this.dataList || []
      }
    },
    mounted() {},
    watch: {
      value: {
        handler(nV, oV) {
          try {
            if (nV instanceof Array) {
              for (let i = 0; i < nV.length; i++) {
                if (nV[i] || nV[i] == 0) {
                  nV[i] = this.valueType == 'int' ? parseInt(nV[i] || 0) : nV[i] + '';
                }
              }
            } else if (nV || nV == 0) {
              nV = this.valueType == 'int' ? parseInt(nV) || 0 : nV + '';
            }
          } catch (e) {}
          this.selectValue = nV;

        },
        immediate: true,
      }
    },
  };
  // 判断是否存在key
  function hasKey(json) {
    let isHasKey = false;
    for (let i in json) {
      if (i) {
        isHasKey = true;
        break;
      }
    }
    return isHasKey;
  }
</script>
<style lang="less">
  .data-select-area {
    .full-select {
      width: 100%;
      max-width: unset;
    }
  }
</style>