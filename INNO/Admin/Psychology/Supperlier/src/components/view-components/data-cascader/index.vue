<template>
  <div class="my-cascader">
    <Cascader :value="selectValue" @on-change="selectChange" @on-visible-change="visibleChange" :data="dataList" filterable :size="size" :change-on-select="changeOnSelect" :transfer="transfer" :clearable="false" :placeholder="placeholder" ref="myCascader">
    </Cascader>
    <Icon type="ios-close-circle" v-show="selectValue.length > 0" class="close-icon" @click="onClear" />
  </div>
</template>
<script>
import OrganizeH from "@/helper/handler/organize-handler.js";
export default {
  name: "dataCascader",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    type: {
      type: String,
      default() {
        return "";
      },
    },
    valueKey: {
      type: String,
      default() {
        return "id";
      },
    },
    labelKey: {
      type: String,
      default() {
        return "name";
      },
    },
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    transfer: {
      type: Boolean,
      default() {
        return false;
      },
    },
    size: {
      type: String,
      default() {
        return "default";
      },
    },
    changeOnSelect: {
      type: Boolean,
      default: true,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: "",
    },
    // 省市区选项可选择到的范围
    selectRange: {
      type: String,
      default: "", //选择范围到 prov表示直到省， city表示能选到市，默认情况下选到区
    },
    isAuto: {
      type: Boolean,
      default: true,
    },
    reqData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    isLimitMain: { // 限制选择主体
      type: Boolean | String,
      default: "",
    },
    limitIds: { // 限制不可选ID集合
      type: Array,
      default: ()=>{
        return []
      }
    }
  },
  data() {
    return {
      dataList: [],
      reqName: "",
      selectValue: [],
      _valueKey: "id",
      _labelKey: "name",
    };
  },
	computed: {
		limitMain(){ // 判断是否限制主体选择
			let _isSuperIds = this._isSuperIds == 1;// 1：指定组织 0：全部组织
			let isLimitMain = this.isLimitMain;
      let limitIds = this.limitIds || [];
			if(typeof(isLimitMain) == 'boolean'){ // 布尔值直接决定 手动限制
				return isLimitMain
			} else if(limitIds.indexOf("0") != -1 || limitIds.indexOf(0) != -1 ){
        return true;
      } else {
				return _isSuperIds && this.type == 'organize'
			}
		}
	},
  methods: {
    getData() {
      if (this.type) {
        this._valueKey = this.valueKey;
        this._labelKey = this.labelKey;
        switch (this.type) {
          // case "address":
          // 	addressHandle.getAddressData(this.selectRange).then((data) => {
          // 		this.dataList = data;
          // 	})
          // 	break;
          case "organize":
            this.reqName = "adminOrganizationData";
            this.loadData(this.type);
            break;
        }
      }
    },
    loadData(type) {
      let reqData = this.reqData || {};
      if (type == "organize") {
        return OrganizeH.loadData(reqData.type).then((res) => {
          if (res.code) {
            let data = res.data || {};
            let items = data.items || [];
            //
            if (this.limitMain && Number(items[0].id) + "" == 0) {
              // 不是全部权限
              items = items[0].children || [];
            }
            this.dataList = this.dataHandle(items);
          }
        });
      }
      return this.$MainApi[this.reqName]({
        data: reqData,
      }).then((res) => {
        if (res.code) {
          let data = res.data || {};
          let items = data.items || [];
          this.dataList = this.dataHandle(items);
        }
      });
    },
    dataHandle(data) {
      if (data instanceof Array) {
        let isNeedLoop = false;
        for (let i = 0; i < data.length; i++) {
          if (!data[i].value) {
            data[i].value = data[i][this._valueKey];
            isNeedLoop = true;
          }
          if (!data[i].label) {
            data[i].label = data[i][this._labelKey];
            isNeedLoop = true;
          }
          if(this.limitIds && (this.limitIds.indexOf(data[i].value) != -1 || this.limitIds.indexOf(Number(data[i].value)) != -1)){
            data[i].disabled = true;
          } else if(data[i].disabled){
            data[i].disabled = false;
          }

          if (isNeedLoop && data[i].children && data[i].children.length > 0) {
            data[i].children = this.dataHandle(data[i].children);
          }
        }
        return data;
      }
    },
    selectChange(data) {
      if (data == undefined) {
        return;
      }
      this.$emit("change", data);
    },
    onClear() {
      this.$emit("change", []);
      this.$emit("dismiss", false);
    },
    visibleChange(bool) {
      if (!bool) {
        this.$emit("dismiss", false);
      }
    },
  },
  watch: {
    type: {
      handler(nV) {
        this.$nextTick(() => {
          this.isAuto && this.getData();
        });
      },
      immediate: true,
    },
    value: {
      handler(nV) {
        try {
          if (nV instanceof Array && typeof nV[0] == "string") {
            for (let i = 0; i < nV.length; i++) {
              nV[i] = parseInt(nV[i]);
            }
            if (this.limitMain && Number(nV[0]) + "" == 0) {
              nV.splice(0, 1);
            }
          } else if (typeof nV == "string") {
            nV = parseInt(nV) || 0;
          }
        } catch (e) {}
        this.$nextTick(() => {
          this.selectValue = nV;
        });
      },
      immediate: true,
    },
  },
};
</script>
<style lang="less" scoped>
.my-cascader {
  position: relative;
  display: inline-block;
  .close-icon {
    display: none;
    position: absolute;
    top: 50%;
    right: 8px;
    transform: translateY(-50%);
    color: #929292;
    cursor: pointer;
  }
}
.my-cascader:hover {
  .close-icon {
    display: block;
  }
}
</style>