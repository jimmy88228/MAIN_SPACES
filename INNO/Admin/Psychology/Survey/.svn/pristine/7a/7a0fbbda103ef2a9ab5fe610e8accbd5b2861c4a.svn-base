<template>
    <div class="data-select-area">
        <Select ref='mySelect' :style="cusotmStyle" :value="selectValue" :disabled="disabled" filterable @on-change="selectChange" class="basic_select" :class="{ 'full-select': isFullW}" :size="size" :multiple="multiple" :transfer="transfer" :clearable="clearable" @on-clear="selectClear">
            <span class="w-nowrap" slot="prefix" >
               <slot name="prefix"></slot>
            </span>
            <slot name="default-option"></slot>
            <Option v-for="(item, index) in dataList" :key="item[valueKey]" :value="item[valueKey]">{{item[nameKey]}}</Option>
        </Select>
    </div>
</template>
<script>
import DataH from "./data-handle.js";
import LM from "@/helper/manager/login-manager";
export default {
    name: "dataSelect",
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
    data() {
        return {
            dataList: [],
            dataReq: {},
            selectValue: 0,
            isInited:false,
        };
    },
    computed:{
        emptyValue(){
            return this.multiple ? [] : this.valueType == 'int' ? 0 : ''
        }
    },
    methods: {
        getData() {
            if (this.type) {
                let req = "",
                    params = {},
                    isEmpty = false,
                    isCustom = false,
                    customData = this.customData;
                switch (this.type) {
                    case "inventory":
                        req = "inventoryComponentList";
                        params = {};
                        break;
                    case "adminArea":
                        req = "adminAreaData";
                        if (LM.mainId) {
                            params = { main_id: LM.mainId };
                        } else {
                            isEmpty = true;
                        }
                        break;
                    case "street":
                        req = "adminStreetData";
                        if (parseInt(this.params.area_id) > 0) {
                            params = this.params;
                        } else {
                            isEmpty = true;
                        }
                        break;
                    case "school":
                        req = "adminSchoolData";
                        if (parseInt(this.params.area_id) > 0 || parseInt(this.params.street_id) > 0) {
                            params = this.params || {};
                        }
                        break;
                    case "campus":
                        req = "adminCampusData";
                        if (parseInt(this.params.school_id) > 0) {
                            params = this.params;
                        } else {
                            isEmpty = true;
                        }
                        break;
                    case "grade":
                        req = "adminGradeData";
                        if (parseInt(this.params.campus_id) > 0) {
                            params = this.params;
                        } else {
                            isEmpty = true;
                        }
                        break;
                    case "warn-level":
                        req = "surveyLevel";
                        break;
                    case "meddle":
                        req = "surveyIntervention";
                        break;
                    case "psychologicalSourceList":
                        req = "psychologicalSourceList";
                        break;
                    case "supervisorSourceList":
                        req = "psychologicalSupervisorSourceList";
                        break;
                    case "dimension":
                        req = "getAssignModelRuleList";
                        if (parseInt(this.params.model_id) > 0) {
                            params = this.params;
                        } else {
                            isEmpty = true;
                        }
                        break;

                    case "reportModelList":
                        req = "getGroupReportModelList";
                        if (parseInt(this.params.school_id) > 0) {
                            params = this.params;
                        } else {
                            isEmpty = true;
                        }
                        break;
                    case "gauge":
                        params = this.params || {};
                        req = "getWarningModelList";
                        break;
                    case "range":
                        isCustom = true;
                        customData = (this.customData.find(item=>item.model_id == this.params.model_id)||{}).range_data||[];
                        break;
                    default:
                        break;
                }
                if(isCustom){
                    this.handleData(customData, "init");
                } else if (isEmpty) {
                    // 清空列表，同时清空数据
                    this.dataList = [];
                    this.isInited && this.selectChange(0);
                } else {
                    this.isInited = true;
                    this.getDataReq(req, params);
                }
            }
        },
        getDataReq(req, params) {
            DataH.getDataReq(this.type)
                .then((data) => {
                    let items = data.items || [];
                    this.handleData(items);
                })
                .catch(() => {
                    
                    this.getDataHold(req, params)
                        .then((res) => {
                            if (res.code) {
                                let items;
                                let data = res.data;
                                if (data instanceof Array) {
                                    items = data || [];
                                } else if (data.items) {
                                    items = data.items || [];
                                } else {
                                    items = data || [];
                                }
                                this.handleData(items, "init");
                                // 存在请求参数，不做缓存
                                !hasKey(params) &&
                                    DataH.saveData(this.type, this.dataList);
                                return Promise.resolve();
                            } else {
                                return Promise.reject();
                            }
                        })
                        .finally(() => {
                            delete DataH.dataReq[this.type + "List"];
                        });
                });
        },
        getCurData(){
            return this.dataList || [];
        },
        getDataHold(req, params) {
            // 防抖访问
            if (DataH.dataReq[this.type + "List"]) {
                return DataH.dataReq[this.type + "List"];
            } else {
                 DataH.dataReq[this.type + "List"] = typeof this.$MainApi[req] == "function"
                        ? this.$MainApi[req]({ data: params })
                        : Promise.reject();
                return DataH.dataReq[this.type + "List"];
            }
        },

        handleData(items, type) {
            let _items = [];
            if (type == "init") {
                if (!(items instanceof Array) && items instanceof Object) {
                    for (let i in items) {
                        let item = {};
                        item[this.valueKey] = i;
                        item.name = items[i].name || items[i] || "";
                        _items.push(item);
                    }
                } else {
                    _items = items;
                }
                //
                for (let i = 0; i < _items.length; i++) {
                    _items[i][this.valueKey] =
                        parseInt(_items[i][this.valueKey]) || 0;
                }
            } else {
                _items = items;
            }
            this.dataList = _items;
            this.$emit("getData", this.dataList);
            if (type == "init") {
                typeof this.initCallback == "function" &&
                    this.initCallback(JSON.parse(JSON.stringify(_items)));
            }
        },
        selectChange(data) {
            console.log('selectChange',data,this.selectValue,this.type)
            if (data == undefined){ 
                return;
            };
            data = data || this.emptyValue;
            if(data == this.selectValue) return;
            this.$emit("change", data);
            this.$emit("on-change", data);
            this.$emit("changeData", this.getSelectData(data));
        },
        getSelectData(selectId){
            let dataList = this.dataList || [];
            let selectData = this.multiple ? [] : {};
            if(!selectId || (this.multiple && selectId.length == 0)){
                return this.emptyValue;
            } else {
                if(this.multiple){
                    for(let i = 0; i < dataList.length; i++){
                        let id = dataList[i][this.valueKey];
                        if(id && selectId.indexOf(id) != -1){
                            selectData.push(dataList[i])
                        }
                    }
                } else {
                    for(let i = 0; i < dataList.length; i++){
                        let id = dataList[i][this.valueKey];
                        if(id && selectId == id){
                            selectData = dataList[i];
                            break;
                        }
                    }
                }
                return selectData;
            }
        },
        selectClear(){
            this.$emit("change", this.emptyValue);
            this.$emit("changeData", this.getSelectData());
        },
        toggleMenu(){
            this.$refs["mySelect"] && this.$refs["mySelect"].toggleMenu();
        },
        _getData(){
            return this.dataList || []
        }
    },
    mounted() {},
    watch: {
        value: {
            handler(nV, oV) { 
                try {
                    if (nV instanceof Array ) {
                        for (let i = 0; i < nV.length; i++) {
                            if(nV[i] || nV[i] == 0){
                               nV[i] = this.valueType == 'int' ? parseInt(nV[i]||0) : nV[i] + ''; 
                            }
                        }
                    } else if(nV || nV == 0){
                        nV = this.valueType == 'int' ? parseInt(nV)||0 : nV + '';
                    }
                } catch (e) {}
                this.selectValue = nV;

            },
            immediate: true,
        },
        type: {
            handler(nV) {
                this.$nextTick(() => {
                    if (this.isAuto) this.getData();
                });
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