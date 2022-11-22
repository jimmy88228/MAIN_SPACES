<template>
    <div class="data-select-area">
        <Select :disabled="disabled" :loading="isLoading" ref='mySelect' :value="selectValue" filterable @on-change="selectChange" class="basic_select" :class="{ 'full-select': isFullW}" :size="size" :multiple="multiple" :transfer="transfer">
            <slot name="default-option" v-if="isShowDefault">
                <Option :value="0">全部</Option>
            </slot>
            <template v-if="isGroup">
                <OptionGroup :label="gItem[groupLabelKey]" v-for="(gItem, gIndex) in dataList" :key="gItem[groupLabelKey]">
                    <template v-if="gItem[groupListKey]">
                        <Option v-for="(item, index) in gItem[groupListKey]" :key="item[valueKey]" :value="item[valueKey]">{{item[nameKey]}}</Option>
                    </template>
                </OptionGroup>
            </template>
            <template v-else>
                <Option v-for="(item, index) in dataList" :key="item[valueKey]" :value="item[valueKey]">{{item[nameKey]}}</Option>
            </template>
        </Select>
        <div class="close-area" v-if="clearable" @click="selectClear">
            <Icon type="ios-close-circle" />
        </div>
        <div @click="clickSelect">
            <slot name="expand" ></slot>
        </div>
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
        value: {
            type: Number | String | Array,
            default: 0,
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
        disabled: {
            type: Boolean,
            default: false,
        },
        params: {
            type: Object,
            default: () => {},
        },
        isShowDefault: {
            type: Boolean,
            default: true
        },
        initCallback: Function,
        isGroup: Boolean,
        groupLabelKey: String,
        groupListKey: String,
        defaultValue: {
            type: Number | String,
            default: ""
        }
    },
    data() {
        return {
            dataList: [],
            dataReq: {},
            selectValue: 0,
            isLoading: false
        };
    },
    methods: {
        getData() {
            if (this.type) {
                let req = "",
                    params = {},
                    isEmpty = false;
                switch (this.type) {
                    case "adminArea":
                        req = "adminAreaData";
                        if (LM.mainId) {
                            params = { main_id: LM.mainId };
                        } else {
                            isEmpty = true;
                        }
                        break;
                    case "video-group":
                        req = "getVideoGroupList";
                        params = {is_all: 1};
                        break;
                    case "audio-group":
                        req = "getAudioGroupList";
                        params = {is_all: 1};
                        break;
                    case "article-group":
                        req = "getArticleGroupList";
                        params = {is_all: 1};
                        break;
                    case "course-group":
                        req = "courseManagementGroupList";
                        params = {is_all: 1};
                        break;
                    case "customer":
                        req = "getCustomerGroupType";
                        break;
                    case "psychiatrist":
                        req = "counselorMember";
                        break;
                    case "consult":
                        req = "counselorService";
                        break;
                    case "EAP-warn-level":
                        req = "getBackstageApi";
                        params = {
                            url: "custom/surveyLevel",
                            data: {},
                            ...this.params,
                        }
                        break;
                    case "EAP-meddle":
                        req = "getBackstageApi";
                        params = {
                            url: "custom/surveyIntervention",
                            data: {},
                            ...this.params,
                        }
                        break;
                    case "role":
                        req = "getRoleData"
                        break;
                    case "tasteType":
                        req = "tasteTestTypeList"
                        params = {
                            page: 1,
                            pageSize: 100,
                            isAll: 1,
                            ...this.params,
                        }
                        break;
                }
                if (isEmpty) {
                    // 清空列表，同时清空数据
                    this.dataList = [];
                    this.selectChange("");
                } else {
                    this.isLoading = true;
                    this.getDataReq(req, params);
                }
            }
        },
        getDataReq(req, params) {
            DataH.getDataReq(this.type)
                .then((data) => {
                    let items = data.items || [];
                    this.isLoading = false;
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
                            this.isLoading = false;
                            delete DataH.dataReq[this.type + "List"];
                        });
                });
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
            if (type == "init") {
                if(items instanceof Array){
                    for (let i = 0; i < items.length; i++) {
                        items[i][this.valueKey] =
                            parseInt(items[i][this.valueKey]) || 0;
                    }
                }
            }
            console.log("items", "this.type", this.type, items)
            this.dataList = items;
            if (type == "init") {
                typeof this.initCallback == "function" &&
                    this.initCallback(JSON.parse(JSON.stringify(items)));
            }
        },
        selectChange(data) {
            if (data == undefined){ 
                return;
            };
            this.$emit("change", data);
        },
        selectClear(){
            this.$emit("change", this.defaultValue);
        },
        toggleMenu(){
            this.$refs["mySelect"] && this.$refs["mySelect"].toggleMenu();
        },
        clickSelect(){
            this.toggleMenu();
        },
        _getData(){
            return this.dataList || []
        }
    },
    mounted() {},
    watch: {
        value: {
            handler(nV) {
                try {
                    // 转换为int类型
                    if (nV instanceof Array && typeof nV[0] == "string") {
                        for (let i = 0; i < nV.length; i++) {
                            nV[i] = parseInt(nV[i]);
                        }
                    } else if (typeof nV == "string") {
                        nV = parseInt(nV);
                    }
                } catch (e) {}
                this.$nextTick(() => {
                    this.selectValue = nV;
                });
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
        },
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
<style lang="less" scoped>
.data-select-area {
    position:relative;
    .full-select {
        width: 100%;
        max-width: unset;
    }
    .close-area{
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 10px;
        opacity: 0;
        transition: all .35s;
        cursor: pointer;
        color:#999;
    }
    .loading{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
}
.data-select-area:hover{
    .close-area{
        opacity: 1;
    }
}
</style>