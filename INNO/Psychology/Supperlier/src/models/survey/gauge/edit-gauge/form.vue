<template>
  <Form
    class="form-setting"
    :label-width="150"
    ref="formId"
    :model="formData"
    :rules="ruleValidate"
  >
    <FormItem label="量表图片">
        <div class="relative">
            <img-view uploadType="activity" :img="formData.cover_pic" @selectImg="selectActImg" @delImg="removeImage"></img-view>
        </div>
    </FormItem>
    <FormItem label="量表名称" prop="model_name">
      <custom-input
        style="width: 260px"
        v-model="formData.model_name"
        type="text"
        placeholder=""
        :maxlength="30"
      ></custom-input>
    </FormItem>
    <FormItem label="指导语" prop="instruction">
      <custom-input
        style="width: 260px"
        v-model="formData.instruction"
        type="text"
        placeholder="指导语不超过40个字符"
        :maxlength="40"
        :show-word-limit="true"
      ></custom-input>
    </FormItem>
    <FormItem label="预计答题时间" prop="estimated_time">
      <div class="flex-s-c">
        <custom-input
            style="width: 80px"
            v-model="formData.estimated_time"
            type="number"
            :maxlength="6"
            :showWordLimit="false"
        ></custom-input>
        <div class="m-l-15">(分钟)</div>
      </div>
    </FormItem>
    <FormItem label="引语" prop="description">
      <custom-input
        style="width: 260px"
        v-model="formData.description"
        type="textarea"
        placeholder="引语不超过150个字符"
        :maxlength="150"
        :rows="9"
        :show-word-limit="true"
      ></custom-input>
    </FormItem>
  </Form>
</template>

<script>
export default {
    data() {
        return {
            ruleValidate: {
                model_name: [
                    {
                        required: true,
                        validator: this._checkString,
                        message: "量表名称不能为空",
                        trigger: "blur",
                    },
                ],
                instruction: [
                    {
                        required: true,
                        validator: this._checkString,
                        message: "指导语不能为空",
                        trigger: "blur",
                    },
                ],
                description: [
                    {
                        required: true,
                        validator: this._checkString,
                        message: "引语不能为空",
                        trigger: "blur",
                    },
                ],
            },
            formData:{
                model_name:"",
                instruction:"",
                description:"",
                estimated_time:0,
                cover_pic:""
            },
            // inited:false
        }
    }, 
    props: {
        baseInfo: {
            type: Object,
            default: ()=>({})
        },
    },
    methods: {
        save() {
            // if(!this.inited)return Promise.resolve();
            return this.validate().then(()=>{
                return this.scaleUpdate().then(res=>{
                    return res;
                }).catch(e=>{
                    return Promise.reject(e);
                }) 
            }).catch(e=>{
                this.$Message.info(e && e.message || "请完善基础信息");
                return Promise.reject(e);
            })
        },
        validate(){
            return new Promise((rs,rj)=>{
                this.$refs.formId.validate((valid) => {
                    if (valid) {
                        return rs(this.formData);
                    }else{ 
                        return rj();
                    }
                })
            })
        }, 
        scaleUpdate(){
            return this.$MainApi.scaleUpdate({
                data: {
                    id: this.pageQuery.id||0,
                    ...this.formData,
                    description:this.formData.description.slice(0,150),
                    instruction:this.formData.instruction.slice(0,40),
                    model_name:this.formData.model_name.slice(0,30),
                    estimated_time:parseFloat(this.formData.estimated_time||0),
                },
                other: {
                    isShowLoad: true
                }
            })
            .then((res) => {
                if (res.code) {
                    return res
                }else{
                    res.message && this.$Message.warning(res.message);
                    return Promise.reject(res);
                }
            })
        },
        init(){
            let id = parseInt(this.pageQuery.id||0);
            if(!id){
                this.formData = {
                    model_name:"",
                    instruction:"",
                    description:"",
                    estimated_time:0,
                    cover_pic:""
                }
                return;
            }  
            // this.getInfoApi('scaleInfo',id).then(res=>{
            //     this.inited =true;
            //     let data = res.data||{};
            //     let items = data.items ||{};
            //     let {model_name,instruction,description,estimated_time} = items;
            //     this.formData.model_name = model_name||"";
            //     this.formData.instruction = instruction||"";
            //     this.formData.description = description||""; 
            //     this.formData.estimated_time = estimated_time||0; 
            // })
        },
        initBaseInfo(){
            let {model_name,instruction,description,estimated_time,cover_pic} = this.baseInfo || {};
            this.formData.model_name = model_name||"";
            this.formData.instruction = instruction||"";
            this.formData.description = description||""; 
            this.formData.estimated_time = estimated_time||0; 
            this.formData.cover_pic = cover_pic || "";
        },
        selectActImg(img){
            this.formData.cover_pic = img;
        },
        removeImage(){
            this.formData.cover_pic = ""; 
        },
    },
    watch:{
        baseInfo:{ 
            handler(nV){
                this.initBaseInfo();
            },
            immediante: true,
            deep: true
        }
    }
};
</script>

<style lang="less" scoped>
.form-setting{
    padding-top: 20px;
}
</style>