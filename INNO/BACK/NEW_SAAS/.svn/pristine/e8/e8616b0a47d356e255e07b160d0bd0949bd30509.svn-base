<template>
    <div class="label-range">
        <Form :model="formData" :rules="ruleValidate" ref="labelForm">
            <div class="-title"><slot name="title"></slot></div>
            <div class="flex f-align-center range-cont">
                <FormItem prop="minData">
                    <div class="flex">
                        <Input type="number" placeholder="最小" v-model="formData.minData" style="width:100px;" @on-change="syncMinData"/>
                        &nbsp;<span v-if="unit">{{ unit }}</span>
                        &nbsp;<slot name="middle"></slot>&nbsp;
                    </div>
                </FormItem>
                <FormItem prop="maxData">
                    <div class="flex">
                        <Input type="number" placeholder="最大" v-model="formData.maxData" style="width:100px;" @on-change="syncMaxData"/>
                        &nbsp;<span v-if="unit">{{ unit }}</span> <slot name="tip"></slot>
                    </div>
                </FormItem>
                
            </div>
        </Form>
    </div>
</template>
<script>
export default{
    name: "rangeModule",
    components: { },
    props:["unit", "minData", "maxData", "type"],
    data(){
        return {
            ruleValidate: {
                minData: [
                    { required: true, message: '请填写最小值', trigger: 'blur' },
                    { type: 'string', pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/, message:'数量应为正浮点数', trigger:'blur' }
                ],
                maxData: [
                    { required: true, message: '请填写最大值', trigger: 'blur' },
                    { type: 'string',pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/, message:'数量应为正浮点数', trigger:'blur' }
                ],
            }
        }
    },
    computed: {
        formData(){
            return {
                minData: this.minData,
                maxData: this.maxData
            }
        }
    },
    mounted(){

    },
    methods:{
        syncMinData(){
            this.$emit('update:minData', this.formData.minData)
        },
        syncMaxData(){
            this.$emit('update:maxData', this.formData.maxData)
        },
        validate(){
            return new Promise((rs,rj)=>{
                let formData = this.formData || {};
                if((parseFloat(formData.minData) > parseFloat(formData.maxData))){
                    this.$Message.warning(this.title + "的最小值不能大于最大值");
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
    .label-range{
        padding-top:5px;
        // padding-bottom:10px;
        border-bottom:1px solid #efefef;
        .-title{
            margin-bottom:5px;
        }
        .range-cont{
            padding-left:20px;
        }
    }
</style>