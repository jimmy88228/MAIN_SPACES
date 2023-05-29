<template>
  <Select
  v-if="roleData.length"
  :style="cusotmStyle" 
  :value="selectValue" 
  :disabled="disabled" 
  filterable 
  @on-change="selectChange"
  :size="size" 
  :multiple="multiple" 
  :transfer="transfer" 
  :clearable="clearable" 
  @on-clear="selectClear"
  >
    <Option value="" v-if="isShowDefault">全部</Option>
    <Option v-for="(item, index) in roleData" :key="item[valueKey]" :value="item[valueKey]">{{item[nameKey]}}</Option>
  </Select>
</template>

<script>
export default {
  name: "roleSelect",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
        type: Number | String | Array,
        default: 0,
    },
    type: {
        type: String,
        default: "",
    },
    valueKey: {
        type: String,
        default: "id",
    },
    nameKey: {
        type: String,
        default: "name",
    },
    valueType: {
        type: String,
        default: "int"
    },
    multiple: {
        type: Boolean,
        default: false,
    },
    isHoldData: {
        type: Boolean,
        default: true
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
    isShowDefault: Boolean,
    initCallback: Function,
    prefix: Boolean,
    customData: Array,
    cusotmStyle:String,
    },
    computed: {
      roleData(){
        let _adminRoleData = JSON.parse(JSON.stringify(this._adminRoleData));
        let roleData = [];
        let _roleConf = (this._structureType == 'edu_class') ? this.roleConf[this._roleType] : this.roleConf[this._structureType];
        _adminRoleData.map((item)=>{
            let getRole = item.get_role || {};
            let type = (item.structure_type == 'edu_class' ? getRole.role_type : item.structure_type) || "";
            delete item.get_role;
            if(_roleConf && _roleConf.indexOf(type) != -1){
              roleData.push({
                  type: type,
                  ...item,
                  ...getRole
              })
            }
        })
        if(typeof(this.initCallback) == 'function'){
          this.initCallback(roleData);
        }
        if(roleData.length == 1 && !this.isShowDefault){
          this.selectChange(roleData[0][this.valueKey])
        }
        return roleData;
      }
    },
    data() {
        return {
            dataList: [],
            dataReq: {},
            selectValue: 0,
            roleConf: {//登录角色可筛选的角色配置
              edu_customer: ["edu_area", "edu_street"],
              edu_area: ["edu_street", "edu_school"],
              edu_street: ["edu_school"],
              edu_school: ["psyc_teacher", "class_teacher"],
              psyc_teacher: ["psyc_teacher", "class_teacher"]
            }
        };
    },
    methods: {
      selectChange(data) {
          if (data == undefined){ 
              return;
          };
          data = data || this.emptyValue || '';
          if(data == this.selectValue) return;
          this.$emit("change", data);
      },
      selectClear(){
          this.$emit("change", this.emptyValue || '');
      }
    },
    watch: {
      value: {
        handler(nV){
          this.selectValue = nV;
        },
        immediate: true
      }
    }
}
</script>

<style>

</style>