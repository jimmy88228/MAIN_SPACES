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
                            <dimensionSelect :defaultEmpty="false" @change="dimensionChange" :modelId="pageQuery.id" :canEdit="false" v-model="curDimensions" style="width: 166px;" placeholder="选择维度"></dimensionSelect>
                        </template>
                    </div>
                    <div class="btn-add pointer flex-c-c" @click="edit()">+新增{{currentTab=='total'?'结果':'维度'}}</div>
                </div>
             </div>
             <div class="table-content"> 
                <template v-for="(item,index) in tabs">
                    <settingTable v-if="currentTab == item.type" :isLoading="isLoading" @edit="edit" :key="index" :list="getList(item.type)" :type="item.type" :disabled="baseInfo.publish_state == 1"></settingTable>
                </template>
             </div>
        </div> 

        <custom-modal footerHide :width="560" ref="modalId" :title="(curSel.id ? '编辑':'新增')+(currentTab=='total'?'结果':'维度')">
            <div class="form-view-box">
                <Form
                    class="box"
                    :label-width="80"
                    ref="formId"
                    :model="formData"
                    :rules="ruleValidate"
                >
                    <div class="modalTitle">{{currentTab=='total'?'总分结果': ((curSel.id ? '编辑':'新增') + '结果')}}</div> 
                    <FormItem label="维度" prop="addDimension" v-if="currentTab=='dimension'">
                        <dimensionSelect @change="dimensionAdd" :defaultEmpty="false" :modelId="pageQuery.id" :canEdit="false" v-model="formData.addDimension" style="width: 166px;" placeholder="选择维度"></dimensionSelect>
                    </FormItem> 
                    <!-- <FormItem label="分值" prop="total">
                        <div class="flex-s-c">
                            <custom-input
                                style="width: 66px"
                                v-model="formData.min_value"
                                type="number"
                                placeholder="" 
                            ></custom-input>
                            <div class="m-l-10 m-r-10">至</div>
                            <custom-input
                                style="width: 66px"
                                v-model="formData.max_value"
                                type="number"
                                placeholder="" 
                            ></custom-input>
                        </div>
                    </FormItem>  -->
                    <FormItem label="分值">
                        <div class="flex-s-c">
                            <FormItem :label-width="0" prop="min_value">
                                <div class="flex-s-c">
                                    <custom-input
                                        style="width: 66px"
                                        v-model="formData.min_value"
                                        type="number"
                                        placeholder="" 
                                    ></custom-input>
                                </div>
                            </FormItem> 
                            <div class="font-18 p-l-5">
                                ≤
                            </div>
                            <div class="p-l-5 p-r-5">
                                得分
                            </div>
                            <div class="font-18 p-r-5">
                                &lt;
                            </div>
                            <FormItem :label-width="0" prop="max_value">
                                <div class="flex-s-c">
                                    <custom-input
                                        style="width: 66px"
                                        v-model="formData.max_value"
                                        type="number"
                                        placeholder="" 
                                    ></custom-input>
                                </div>
                            </FormItem> 
                            <div class="errorDistrict" v-if="showErrorDistrict">{{showErrorDistrict}}</div>
                        </div>
                    </FormItem>
                    <FormItem label="结论" prop="short_desc">
                        <custom-input
                            style="width: 280px"
                            v-model="formData.short_desc"
                            type="text"
                            placeholder=""
                            :maxlength="30"
                        ></custom-input>
                    </FormItem> 
                    <FormItem label="结果描述" prop="description">
                        <custom-input
                            style="width: 280px"
                            v-model="formData.description" 
                            type="textarea"
                            placeholder=""
                            :maxlength="150"
                            :rows="3"
                        ></custom-input>
                    </FormItem> 
                </Form>
                <div class="flex-c-c m-t-10">
                    <Button @click="cancel" class="m-r-20">取消</Button>
                    <Button @click="confirm" type="primary" class="m-r-20">保存设置</Button>
                </div> 
            </div>
        </custom-modal>
    </div>
</template>

<script>
import settingTable from "./setting-table/index.vue";
import dimensionSelect from "./components/dimension-select/index.vue"
const ERROR_MSG = "与现有的区间重叠，请调整范围";
export default {
    data() {
        return { 
            formData:{
                id:0,
                addDimension:0,
                total:0,
                min_value:0,
                max_value:0,
                short_desc :'',
                description:'',
            },
            ruleValidate:{  
                addDimension: [
                    {
                        required: true,
                        validator: (rule, value, callback)=>{
                            if(Number(value) > 0){  
                                this.$refs.formId.validateField('min_value');
                                this.$refs.formId.validateField('max_value');
                                callback();
                            } else {
                                callback(new Error('请选择维度'));
                            }
                        },
                        trigger: "change",
                    },
                ],
                short_desc: [
                    {
                        required: true,
                        validator: this._checkString,
                        message: "结论不能为空",
                        trigger: "blur",
                    },
                ],
                description: [
                    {
                        required: true,
                        validator: this._checkString,
                        message: "描述不能为空",
                        trigger: "blur",
                    },
                ],
                min_value: [
                    {
                        required: true,
                        validator: (rule, value, callback)=>{
                            let check = this.checkDistrict('min');
                            if(check && check.bool){
                                this.bothCheck();
                                value || value===0 ? callback() : callback("");
                            }else{
                                callback("");
                            }
                        },
                        trigger: "blur",
                    },
                ],
                max_value: [
                    {
                        required: true,
                        validator: (rule, value, callback)=>{
                            let check = this.checkDistrict('max')
                            if(check && check.bool){
                                this.bothCheck();
                                value || value===0 ? callback() : callback("");
                            }else{
                                callback("");
                            }
                        },
                        trigger: "blur",
                    },
                ],
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
        dimensionSelect
    },
    methods: {
        edit(item={},type="edit"){
            if(!this.inited)return
            if(this.baseInfo.publish_state == 1){
                this.$Message.info("已发布状态不能编辑");
                return
            }
            this.curSel = item||{};
            console.log('edit',item,type)
            if(type == 'delete'){
                this.delStatRuleRange(item);
                return
            }else if(this.curSel.id){
                this.formData.min_value = this.curSel.min_value||0;
                this.formData.max_value = this.curSel.max_value||0;
                this.formData.short_desc = this.curSel.short_desc||"";
                this.formData.description = this.curSel.description||"";
                this.formData.is_warn = this.curSel.is_warn||0;
                this.formData.addDimension = this.curSel.addDimension||0;
            }else{
                this.initFormData();
            }
            type == 'edit' && this.$nextTick(()=>{
                let temp = JSON.parse(JSON.stringify(this.formData));
                this.showErrorDistrict = "";
                this.$refs.formId.resetFields();
                this.formData = temp;
                this.$refs.modalId.show();
            })
            type == 'warning' && this.confirm(type)
        },
        initFormData(){
            this.formData.min_value = 0;
            this.formData.max_value = 0;
            this.formData.short_desc = "";
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
                    let points_rule_info = data.points_rule_info;
                    let totalList = points_rule_info && points_rule_info.range_list || [];
                    let dimensionList = data.dimension_rule_list || []; 
                    totalList = totalList.map(item=>({
                        rule_info:item.rule_info||{},
                        range:[item]
                    }));
                    dimensionList = dimensionList.map(item=>({
                        rule_info:item.rule_info||{},
                        range:item.range_list||[]
                    }));
                    dimensionList = dimensionList.filter(item=>{return item.range.length>0});
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
        saveRule(type){
            return this.setStatRule().then(rule_id=>{
                return this.setStatRuleRange(rule_id,type).then(res=>{
                    if(res.code){
                        return res;
                    }
                    return Promise.reject(res)
                });
            })
        },
        setStatRule(){
            // if(this.curSel.rule_id>0)return Promise.resolve(this.curSel.rule_id);
            let tab = this.currentTab;
            return this.$MainApi.setStatRule({
                data: {
                    rule_type:tab=='total'?'total':'dimension',
                    rule_name:tab=='total'? '总分' : this.curSel.rule_name || "",
                    description:this.formData.description||'',
                    model_id:this.pageQuery.id||0,
                    dimension_id:tab=='total'?0:(this.formData.addDimension||0),
                    is_main:tab=='total'?1:0,
                    is_warn:tab=='total'?1:0,
                }, 
            }).then(res=>{
                if(res.code){
                    let data = res.data||0;
                    return data
                }
                return Promise.reject(res);
            })
        },
        setStatRuleRange(rule_id,type){ 
            return this.$MainApi.setStatRuleRange({
                data: {
                    id:this.curSel.id||0,
                    rule_id:rule_id||this.curSel.rule_id||0, 
                    range_name:this.formData.short_desc||"",
                    short_desc:this.formData.short_desc||"",
                    description:this.formData.description||"", 
                    min_value:this.formData.min_value||0,
                    max_value:this.formData.max_value||0,
                    is_warn:type == 'warning' ? this.formData.is_warn == 1 ? 0 : 1 : this.formData.is_warn||0,
                }, 
            })
        },
        delStatRuleRange(item){
            this.modalTipPop({content:"是否要删除该条数据？"}).then(()=>{
                this.setLoading();
                return this.$MainApi.delStatRuleRange({
                    data: {
                        rule_range_id:item.id||0
                    }
                }).then(res=>{
                    this.init();
                    this._reqMessage(res);
                }).finally(()=>{
                    this.setLoading(false);
                })
            })
        },
        cancel(){
            this.$refs.modalId.dismiss();
        },
        confirm(type){
            return this.validate().then(()=>{
                this.setLoading();
                return this.saveRule(type).then(res=>{
                    this.init();
                    this._reqMessage(res);
                    this.$refs.modalId.dismiss();
                    this.setLoading(false);
                    return res;
                }).catch(e=>{
                    return Promise.reject(e);
                }) 
            }).catch(e=>{
                this.setLoading(false);
                console.log('confirm catch',e)
                this.$Message.error(e && e.message || "操作失败");
                return Promise.reject(e);
            })
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
        validate(){
            return new Promise((rs,rj)=>{
                try{
                    this.$refs.formId.validate((valid) => {
                        if (valid) {
                            return this.bothCheck().then(()=>{
                                return rs();
                            }).catch(()=>{
                                return rj();
                            })
                        }else{ 
                            return rj();
                        }
                    })

                }catch(e){
                    console.log('catch',e)
                }
            })
        },
        bothCheck(){
            return new Promise((rs,rj)=>{
                let check = this.checkDistrict('both');
                if(check && !check.bool){
                    // this.showErrorDistrict = ERROR_MSG;
                    return rj(check);
                }else{
                    this.showErrorDistrict = "";
                    return rs(check);
                }
            })
        },
        checkDistrict(type){ 
            let check = {bool:true,min:-1,max:-1};
            let list = this.getList(this.currentTab)||[];
            let curId = this.curSel.id||0,minVal=Number(this.formData.min_value),maxVal=Number(this.formData.max_value),RangError = "最大值需要大于最小值";
            let rangeCheck=(minVal>=maxVal || this.checkEmpty(this.formData.min_value,this.formData.max_value));
            type == 'min' && (this.minInited = true);
            type == 'max' && (this.maxInited = true);
            if(this.dimensionGet().length<=0 && (minVal>=maxVal)){
                type == 'min' && this.maxInited && (this.showErrorDistrict = RangError );
                type == 'max' && this.minInited && (this.showErrorDistrict = RangError );
                type == 'both' && (this.minInited && this.maxInited) && (this.showErrorDistrict = RangError);
                this.showErrorDistrict && (check.bool = false);
                return check
            }
            for(let i = 0,len=list.length;i<len;i++){
                let l_item = list[i]||{};
                let range = l_item.range || [];
                if(this.currentTab == 'dimension' && this.formData.addDimension && l_item.rule_info){ //维度遍历过滤
                    if(l_item.rule_info.dimension_id != this.formData.addDimension){
                        continue;
                    }
                }
                for(let j = 0,jLen=range.length;j<jLen;j++){
                    let r_item = range[j]||{};
                    console.log('item',type,minVal,maxVal,r_item.min_value,r_item.max_value,',');
                    if((!curId || (curId>0 && curId!=r_item.id))){
                        let referArr = [Number(r_item.min_value),Number(r_item.max_value)-0.01];
                        switch (type) {
                            case 'both': //最小最大值交集校验
                                if((minVal>=maxVal) || this.isIntersect([minVal,maxVal-0.01],referArr)){
                                    check.bool = false;
                                    check.min = r_item.min_value;
                                    check.max = r_item.max_value;
                                    (this.minInited && this.maxInited) && (this.showErrorDistrict = rangeCheck ? RangError : ERROR_MSG);
                                }
                                break; 
                            case 'min': //最小值交集校验
                                if(this.isIntersect([minVal],referArr)){
                                    check.bool = false;
                                    check.min = r_item.min_value;
                                    check.max = r_item.max_value;
                                    this.maxInited && (this.showErrorDistrict = rangeCheck ? RangError : ERROR_MSG );
                                };
                                break;
                            case 'max': //最大值交集校验
                                if(this.isIntersect([maxVal-0.01],referArr)){
                                    check.bool = false;
                                    check.min = r_item.min_value;
                                    check.max = r_item.max_value;
                                    this.minInited && (this.showErrorDistrict = rangeCheck ? RangError : ERROR_MSG );
                                }
                                break;
                            default:
                                break;
                        }
                        if(!check.bool){
                            break
                        } 
                    }
                };
                if(!check.bool){
                    break;
                }
            }
            return check;
        },
        checkEmpty(a,b){
            return (a==='' || b==='')
        },
        isIntersect(arr1,arr2){
            let start = [Math.min(...arr1),Math.min(...arr2)];
            let end = [Math.max(...arr1),Math.max(...arr2)];
            return Math.max(...start) <= Math.min(...end);
        },
        dimensionChange(e){
            this.dimensionList = e==0 ? this.initDimensionList : this.initDimensionList.filter(item=>item.rule_info && item.rule_info.dimension_id == this.curDimensions)
        },
        dimensionGet(){
            return this.initDimensionList.filter(item=>item.rule_info && ((item.rule_info.dimension_id == (this.formData.addDimension)) || this.formData.addDimension==0));
        },
        dimensionAdd(e,item){
            this.curSel.rule_name = item.dimension_name||"";
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
.errorDistrict{
    position: absolute;
    left: 0;
    top: 100%;
    color: #ed4014;
}
.modalTitle{ 
    font-size: 14px; 
    font-weight: 600;
    color: #000000;
    margin-bottom: 16px;
    padding-left: 12px;
}
</style>