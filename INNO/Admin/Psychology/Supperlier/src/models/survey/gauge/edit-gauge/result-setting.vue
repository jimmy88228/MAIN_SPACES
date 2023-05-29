<template>
    <div class="result-setting bgc">
        <div class="title-box flex-b-c">
            <div>
                <div class="gauge-title-tip">量表名称</div>
                <div class="gauge-title">{{baseInfo.model_name}}</div>
            </div>
            <div class="total-box flex-c-c">
                <div class="total-item flex-c-c flex-col">
                    <div class="total">{{baseInfo.question_count}}</div>
                    <div>题目</div>
                </div>
            </div>
        </div>
        <div class="result-box" :class="{disabled:baseInfo.publish_state == 1}">
            <div class="result-title">设置评测结果</div>
            <div class="table-box">
                <div class="tabs flex-s-c">
                    <div class="tab-item pointer flex-c-c flex1" :class="{active:currentTab==item.type}" @click="tabClick(item.type)" v-for="(item,index) in tabs" :key="index">
                        {{item.name}}
                    </div>
                </div>
                <div class="tabs-extra flex-b-c">
                    <div class="flex-c-c">
                        <template v-if="currentTab == 'dimension'">
                            <div class="m-r-10">维度筛选</div>
                            <dimensionSelect type="gauge" :defaultEmpty="false" @change="dimensionChange" :id="pageQuery.id" :canEdit="false" v-model="curDimensions" style="width: 166px;" placeholder="选择维度"></dimensionSelect>
                        </template>
                    </div>
                    <div class="btn-add pointer flex-c-c" @click="edit()">+新增{{currentTab=='total'?'结果':'维度'}}</div>
                </div>
             </div>
             <div class="table-content"> 
                <template v-for="(item,index) in tabs">
                    <settingTable 
                    :statisticsType="statisticsType"
                    v-if="currentTab == item.type" 
                    :isLoading="isLoading" 
                    @edit="edit" 
                    :key="index" 
                    :list="getList(item.type)" 
                    :type="item.type" 
                    :disabled="baseInfo.publish_state == 1"></settingTable>
                </template>
             </div>
        </div> 
        <editResultSetting ref="editResultSettingRef" 
        :statisticsType="statisticsType" 
        :currentTab="currentTab" 
        :initDimensionList="initDimensionList"
        :viewData="getList(currentTab)"
        @confirm="confirmEditSetting"
        ></editResultSetting>
    </div>
</template>

<script>
import settingTable from "./setting-table/index.vue";
// import dimensionSelect from "./components/dimension-select/index.vue";
import dimensionSelect from "@/components/view-components/editable-select/index.vue";

import editResultSetting from "./edit-result-setting/index.vue";
const ERROR_MSG = "与现有的区间重叠，请调整范围";
export default {
    data() {
        return {
            statisticsType: { // 统计规则（总分求和=total；维度求和=dimension；总分求均=average；维度求均=dimension_average；T分数=t_score）
                total: {
                    name: "求和",
                    txt: "总分求和"
                },
                dimension: {
                    name: "求和",
                    txt: "维度求和"
                },
                average: {
                    name: "求均",
                    txt: "总分求均"
                },
                dimension_average: {
                    name: "求均",
                    txt: "总分求均"
                },
                t_score: {
                    name: "T分数",
                    txt: "T分数"
                },
            },
            isLoading:false,
            curSel:{},
            inited:false,
            currentTab:"total",
            tabs:[{type:"total",name:"按总分设置"},{type:"dimension",name:"按维度设置"}],
            points_rule_info:null,
            dimension_rule_list:null,
            totalList:[],
            dimensionList:[],
            initDimensionList:[],
            curDimensions:0,
            showErrorDistrict:ERROR_MSG,
            minInited:false,
            maxInited:false,
        }
    },
    props: {
        baseInfo: {
            type: Object,
            default: ()=>({})
        },
    },
    components: {
        settingTable,
        dimensionSelect,
        editResultSetting
    },
    methods: {
        edit(item={},type="edit"){
            if(!this.inited)return
            if(this.baseInfo.publish_state == 1){
                this.$Message.info("已发布状态不能编辑");
                return
            }
            switch(type){
                case "delete":
                   this.delStatRuleRange(item);
                    break;
                case "edit":
                    this.$refs["editResultSettingRef"] && this.$refs["editResultSettingRef"].showModal(item);
                    break;
                case "isRed":
                    this.confirmEditSetting(item);
                    break
                case "isWarn":
                    this.confirmEditSetting(item, true);
                    break;
                case "isShow":
                    this.setStatRule(item).then(()=>{
                        this.init();
                        this._reqMessage({
                            message: "编辑成功"
                        });
                    })
                    break;
            }
        },
        initFormData(){
            this.formData.min_value = 0;
            this.formData.max_value = 0;
            this.formData.short_desc = "";
            this.formData.range_name = "";
            this.formData.description = "";
            this.formData.is_warn = 0;
            this.formData.addDimension = 0;
            this.minInited=false;
            this.maxInited=false;
        },
        save() {
            return Promise.resolve()
        },
        init(){
            let id = parseInt(this.pageQuery.id||0);
            if(!id){
                return;
            } 
            this.getInfoApi('getStatRuleRangeList',id).then(res=>{
                if(res.code){
                    this.inited = true;
                    let data = res.data||{};
                    let pointsRuleList = data.points_rule_info;
                    let dimensionRuleList = data.dimension_rule_list || [];
                    let dimensionList = [], totalList = [];
                    for(let i = 0; i < dimensionRuleList.length; i++){
                        let range_list = dimensionRuleList[i].range_list || [];
                        if(range_list.length){
                            dimensionList.push(dimensionRuleList[i])
                        }
                    }
                    for(let i = 0; i < pointsRuleList.length; i++){
                        let range_list = pointsRuleList[i].range_list || [];
                        if(range_list.length){
                            totalList.push(pointsRuleList[i])
                        }
                    }

                    this.totalList = totalList;
                    this.initDimensionList = JSON.parse(JSON.stringify(dimensionList));
                    if(this.curDimensions){
                        this.dimensionChange(this.curDimensions)
                    }else{
                        this.dimensionList = dimensionList;
                    }
                    console.log('totalList',this.totalList)
                    console.log('dimensionList',this.dimensionList)
                }
            });
        },
        getList(type){
            if(type == 'total'){
                return this.totalList||[]
            }else if(type == 'dimension'){
                return this.dimensionList||[]
            }
        },
        getInfoApi(url,id){
            return this.$MainApi[url]({
                data: {
                    model_id:id
                },
                other: {
                    isErrorMsg: true
                }
            })
            .then((res) => {
                if (res.code) {
                    return res
                }else{
                    return Promise.reject(res);
                }
            })
        },
        tabClick(type){
            this.currentTab = type;
        },
        // saveRule(type){
        //     console.log("formData", this.formData)
        //     return this.setStatRule({
        //         rule_name: this.curSel.rule_name || "",
        //         description: this.formData.description || '',
        //         dimension_id: this.formData.addDimension || 0,
        //         is_warn: this.formData.warningArea,
        //         rule_id: this.formData.rule_id || 0
        //     }).then(rule_id=>{
        //         return this.setStatRuleRange(rule_id,type).then(res=>{
        //             if(res.code){
        //                 return res;
        //             }
        //             return Promise.reject(res)
        //         });
        //     })
        // },
        // 编辑rule项
        setStatRule(reqData = {}, operate = {}){
            let tab = this.currentTab;
            let list = this.getList(this.currentTab) || [];
            let is_warn = 0;
            operate = operate || {};
            let range_list = [];
            if(reqData.rule_id){
                for(let i = 0; i < list.length; i++){
                    let rule_info = list[i].rule_info;
                    if(rule_info.id == reqData.rule_id){
                        range_list = list[i].range_list
                    }
                }
                if(operate.isDel && (!range_list.length || (range_list.length == 1 && range_list[0].id == reqData.id))){
                    // 删除时，判断为该rule最后一个元素时，不执行规则更新
                    return Promise.resolve(0);
                }
            } else {
                // 新增时判断
                for(let i = 0; i < list.length; i++){
                    let rule_info = list[i].rule_info;
                    // 按总分时判断rule_type 按维度时判断rule_type + dimension_id
                    if((tab == 'total' && reqData.rule_type == rule_info.rule_type) || (tab != 'total' && (reqData.rule_type == rule_info.rule_type) && (reqData.addDimension == rule_info.dimension_id))){
                        range_list = list[i].range_list;
                        reqData.is_show = rule_info.is_show;
                        break;
                    }
                }
            }
            // 
            for(let i = 0; i < range_list.length; i++){
                let item = range_list[i] || {};
                // 取回编辑的range做对比
                if((reqData.id == item.id && reqData.is_warn) || (reqData.id != item.id && range_list[i].is_warn)){
                    is_warn = 1;
                    break;
                }
            }
            return this.$MainApi.setStatRule({
                data: {
                    rule_type: reqData.rule_type,
                    rule_name: tab == 'total' ? (reqData.rule_name || "总分") : (reqData.rule_name || ""),
                    description: reqData.ruleDescription || '',
                    model_id: this.pageQuery.id || 0,
                    dimension_id: tab == 'total' ? 0 : (reqData.addDimension || 0),
                    is_main: tab == 'total' ? 1 : 0,
                    is_warn: is_warn || 0,
                    is_show: reqData.is_show || 0,
                    id: reqData.rule_id || 0
                },
                other: {
                    isErrorMsg: true
                }
                
            }).then(res=>{
                if(res.code){
                    let data = res.data||0;
                    return data
                }
                return Promise.reject(res);
            })
        },
        // 编辑range项
        setStatRuleRange(reqData){
            return this.$MainApi.setStatRuleRange({
                data: {
                    id: reqData.id || 0,
                    rule_id: reqData.rule_id || 0, 
                    range_name: reqData.range_name || "",
                    short_desc: reqData.short_desc || "",
                    description: reqData.description || "", 
                    min_value: reqData.min_value || 0,
                    max_value: reqData.max_value || 0,
                    is_red: reqData.is_red || 0,
                    is_warn: reqData.is_warn || 0,
                },
                other: {
                    isErrorMsg: true
                }
            })
        },
        delStatRuleRange(item){
            item = JSON.parse(JSON.stringify(item || {}));
            this.modalTipPop({content:"是否要删除该条数据？"}).then(()=>{
                this.delStatRuleRangeReq(item).then((res)=>{
                    if(res.code){
                        item.is_warn = 0;
                        this.setStatRule(item, {isDel: true}).then(()=>{
                            this.init();
                        })
                    }
                })
            })
        },
        delStatRuleRangeReq(item){
            this.setLoading();
            return this.$MainApi.delStatRuleRange({
                data: {
                    rule_range_id:item.id || 0
                }
            }).then(res=>{
                this._reqMessage(res);
                return res;
            }).finally(()=>{
                this.setLoading(false);
            })
        },
        // confirm(type){
        //     return this.validate().then(()=>{
        //         this.setLoading();
        //         return this.saveRule(type).then(res=>{
        //             this.init();
        //             this._reqMessage(res);
        //             this.$refs.modalId.dismiss();
        //             this.setLoading(false);
        //             return res;
        //         }).catch(e=>{
        //             return Promise.reject(e);
        //         }) 
        //     }).catch(e=>{
        //         this.setLoading(false);
        //         this.$Message.error(e && e.message || "数据异常,保存失败");
        //         type == 'isRed' && this.$refs.modalId.show();
        //         return Promise.reject(e);
        //     })
        // },
        confirmEditSetting(formData, isAdd){
            console.log("formData", formData);
            if(formData.id && !isAdd){ // 编辑
                this.setStatRuleRange(formData).then((res)=>{
                    if(res.code){
                        this.init();
                        this._reqMessage(res);
                        this.$refs["editResultSettingRef"] && this.$refs["editResultSettingRef"].cancel()
                    } 
                })
            } else { // 新增
                return this.setStatRule(formData).then((rule_id)=>{
                    formData.rule_id = rule_id;
                    this.setStatRuleRange(formData).then((res)=>{
                        if(res.code){
                            this.init();
                            this._reqMessage(res);
                            this.$refs["editResultSettingRef"] && this.$refs["editResultSettingRef"].cancel();
                        }
                    })
                })
            }
        },
        setLoading(bool=true){
            if(!bool){
                setTimeout(() => {
                    this.isLoading = bool;
                }, 500);
            }else{
                this.isLoading = bool;
            }
        },
        
        
        dimensionChange(e){
            this.dimensionList = e==0 ? this.initDimensionList : this.initDimensionList.filter(item=>item.rule_info && item.rule_info.dimension_id == this.curDimensions)
        },
    },
};
</script>

<style lang="less" scoped>
.result-setting{
    &.bgc{
        background: #F4F4F4;
    }
    .btn-save{
        height: 40px; 
        border-radius: 3px;
        margin-bottom: 10px;
        padding:0;
        width: 87px;
    }
    .title-box{
        margin: 10px 0; 
        background: #FFFFFF;
        border-radius: 4px;
        padding: 15px 25px; 
    }
    .gauge-title-tip{
        font-size: 13px; 
        color: #7F7F7F;
        line-height: 18px;
        margin-bottom: 4px;
    }
    .gauge-title{
        font-size: 16px; 
        color: #333333;
        line-height: 22px;
        font-weight: 500;
    }
    .total{
        font-size: 18px;
        font-weight: 500;
        color: #333333;
    }
    .total-box{
        position: relative;
        width: 200px;
        height: 66px;
        background:rgba(216,216,216,0.1);
        flex-wrap: nowrap;
    }
    .total-item {
        width: 50%;
        height: 100%;
    }
    .line{
        width: 1px;
        height: 26px;
        opacity: 0.1;
        background-color: #979797;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        position: absolute;
    }
    .result-box{
        background: #fff;
        padding: 25px;
        
    }
    .result-title{
        font-size: 14px;
        color: #333333;
        margin-bottom: 18px;
    }
    .tab-item{
        width: 400px;
        height: 52px;
        background: #FFFFFF;
        border-radius: 4px 0px 0px 4px;
        border: 1px solid #DDDDDD;
        color: #333;
        transition: all 0.32s;
        &:last-child{
            border-radius: 0px 4px 4px 0;
            border-left: none;
        }
        &.active{    
            background: #ECF8FE; 
            color: #0083CE;
        }
    }
    .tabs-extra{
        margin:13px 0;
    }
    .btn-add{
        width: 120px;
        height: 38px;
        background: #ECF8FE;
        border-radius: 3px;
        color:#008ACB;
    }
    .disabled .btn-add{
        background: #dfdfdf;
        color: #7f7f7f;
        opacity: 0.7;
    }
}


</style>