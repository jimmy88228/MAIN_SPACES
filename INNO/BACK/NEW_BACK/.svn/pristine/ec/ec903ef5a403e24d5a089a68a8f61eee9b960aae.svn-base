<template>
        <Form :model="formData" :rules="ruleValidate" ref="labelForm" class="label-configure-item">
            <RadioGroup v-model="formData.timeType" @on-change="changeType">
                <Radio label="1" class="f-align-center " style="display:flex;">
                    <span>绝对时间段：</span>
                    <dataSelect :customDate="formData.timeType == 1 ? getTimeRange : []" defaultTime="" @sT="(date)=>getDate(date,'minDate')" @eT="(date)=>getDate(date,'maxDate')"></dataSelect>
                </Radio>
                <div class="flex f-just-end text-r m-bottom-25 fs-0" style="width:100%;" >
                    <div v-if="formData.timeType == 1">
                        <FormItem prop="minDate" class="margin-0" style="width:180px;"></FormItem>
                        <span class="hold_stay"></span>
                        <FormItem prop="maxDate" class="margin-0" style="width:180px;"></FormItem>
                    </div>
                </div>
                <Radio label="2" class="f-align-center m-bottom-25" style="display:flex;">
                    <span>相对时间段：</span>
                    <slot name="tip">
                        <span>距离今天</span>
                    </slot>&nbsp;
                    <template v-if="formData.timeType == 2">
                        <FormItem prop="minVal" class="margin-0">
                            <Input type="text" placeholder="开始时间" style="width:100px;" v-model="formData.minVal" @on-change="blurVal('minVal')"/>&nbsp;&nbsp;
                        </FormItem>
                        -&nbsp;
                        <FormItem prop="maxVal" class="margin-0">
                            <Input type="text" placeholder="结束时间" style="width:100px;" v-model="formData.maxVal" @on-change="blurVal('maxVal')"/>&nbsp;&nbsp;{{unit}}
                        </FormItem>
                    </template>
                    <template v-else>
                        <Input type="text" placeholder="开始时间" style="width:100px;" />&nbsp;&nbsp;-&nbsp;
                        <Input type="text" placeholder="结束时间" style="width:100px;" />&nbsp;&nbsp;{{unit}}
                    </template>
                </Radio>
            </RadioGroup>
        </Form>
</template>
<script>
import dataSelect from "@/views/my-components/date-select/index";
export default{
    name: "relativeTime",
    components: { dataSelect },
    props:["timeType", "minDate", "maxDate", "minVal", "maxVal", "title","unit" , "shareVal"], // sameVal 绝对，相对时间公用统一变量
    data(){
        return {
            ruleValidate: {
                minDate: [{required: true, message: '请选择绝对开始时间', trigger: 'blur'}],
                maxDate: [{required: true, message: '请选择绝对结束时间', trigger: 'blur'}],
                minVal: [{required: true, message: '请选择开始时间', trigger: 'blur'}],
                maxVal: [{required: true, message: '请选择结束时间', trigger: 'blur'}]
            }
        }
    },
    computed: {
        formData(){
            if(!this.timeType || this.timeType == 0) { this.$emit("update:timeType", "1"); }
            return {
                timeType: this.timeType ? this.timeType + "" : this.timeType,
                minDate: this.minDate,
                maxDate: this.maxDate,
                minVal: this.minVal,
                maxVal: this.maxVal,
            }
        },
        getTimeRange(){
            let formData = this.formData || {};
            return [formData.minDate, formData.maxDate]
        }
    },
    watch:{
			// minVal(nV){
			// 	console.log("minVal", nV);
			// },
			// maxVal(nV){
			// 	console.log("maxVal", nV);
			// }
		},
    mounted(){},
    methods:{
        getDate(date, type){
            console.log("切换")
            this.formData[type] = date;
            if(type == 'minDate'){
                this.$emit("update:minDate", date);
            } else if(type == 'maxDate'){
                this.$emit("update:maxDate", date);
            }
        },
        blurVal(type){
            if(type == "minVal"){
                this.$emit("update:minVal", this.formData.minVal);
            } else if(type == "maxVal"){
                this.$emit("update:maxVal", this.formData.maxVal);
            }
        },
        changeType(val){
            // this.shareVal 共用同一个变量，不同步数据
            console.log("旧的值",this.timeType);
            if(val == 1){
                this.formData.minVal = "";
                this.formData.maxVal = "";
                if(this.timeType){
                    this.$emit("update:minVal", "");
                    this.$emit("update:maxVal", "");
                } 
            } else if(val == 2){
                this.formData.minDate = "";
                this.formData.maxDate = "";
                if(this.timeType){
                    this.$emit("update:minDate", "");
                    this.$emit("update:maxDate", "");
                }
            }
            this.$emit("update:timeType", val);
        },
        validate(){
            return new Promise((rs,rj)=>{
                let formData = this.formData || {};
                if(formData.timeType == 2 && (parseFloat(formData.minVal) > parseFloat(formData.maxVal))){
                    this.$Message.warning(this.title + "开始时间不能大于结束时间");
                    return rj();
                }
                return this.$refs["labelForm"].validate(valid=>{
                    if(valid){
                        return rs();
                    } else {
                        return rj();
                    }
                })
            }) 
           
        }
    }

}
</script>
<style lang="less">
    .label-configure-item{
        .ivu-form-item{
            display: inline-block;
        }
        .ivu-form-item.margin-0{
            margin:0px;
        }
        .ivu-radio-group{
            .ivu-form-item-error-tip{
                white-space: nowrap;
            }
        }
    }
</style>