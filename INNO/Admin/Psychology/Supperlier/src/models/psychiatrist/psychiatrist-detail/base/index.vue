<template>
<div class="psychiatrist-detail-area">
  <Form :label-width="140" :model="formData" ref="formDataRef" :rules="ruleValidate">
      <FormItem label="头像" prop="profile_picture">
        <img-view uploadType="consultant" :width="80" :img="formData.profile_picture" @delImg="formData.profile_picture = ''" @selectImg="(src)=>changeImg(src, 'profile_picture')"></img-view>
        <Input v-model="formData.profile_picture" v-show="false"></Input>
      </FormItem>
      <FormItem label="姓名" prop="name">
        <custom-input size="large" class="base-320" v-model="formData.name" :show-word-limit="true" :maxlength="30"></custom-input>
      </FormItem>
      <FormItem label="手机号" prop="mobile_phone">
        <custom-input size="large" class="base-320" type="number" v-model="formData.mobile_phone" :show-word-limit="true" :maxlength="11" ></custom-input>
      </FormItem>
      <FormItem label="时数经验（小时）" prop="experience_hour">
        <div class="flex-s-c">
          <custom-input size="large" :isInt="true" type="number" class="base-320" v-model="formData.experience_hour" :min="0" ></custom-input>&nbsp;小时
        </div>
      </FormItem>
      <FormItem label="从业时间" prop="experience_year">
        <div class="flex-s-c">
          <custom-input size="large" :isInt="true" type="number" class="base-320" v-model="formData.experience_year" :min="0" :max="90"></custom-input>&nbsp;年
        </div>
      </FormItem>
      <FormItem label="接受的咨询语言" prop="language">
        <custom-input size="large" class="base-320" v-model="formData.language" :show-word-limit="true" :maxlength="30"></custom-input>
      </FormItem>
      <FormItem label="所在位置(城市名)" prop="address">
        <custom-input size="large" class="base-320"  v-model="formData.address" :show-word-limit="true" :maxlength="6"></custom-input>
      </FormItem>
      <FormItem label="资质" prop="qualification">
        <custom-input size="large" class="base-320" 
         v-model="formData.qualification" :show-word-limit="true" :maxlength="30"></custom-input>
      </FormItem>
      <FormItem label="擅长领域" prop="good_at_skilled">
        <div class="goodsat-list">
            <CheckboxGroup v-model="formData.good_at_skilled">
              <Checkbox :label="Number(index)" v-for="(item, index) in specializeData" :key="index">{{item}}</Checkbox>
            </CheckboxGroup>
        </div>
      </FormItem>

      <FormItem label="咨询方式" prop="service_data">
        <div class="consult-methods">
            <CheckboxGroup v-model="formData.service_data">
              <Checkbox :label="item.id" v-for="(item, index) in counselorServiceData" :key="index">{{item.name}}</Checkbox>
            </CheckboxGroup>
        </div>
      </FormItem>
      <FormItem label="个人简介" prop="personal_info">
        <custom-input class="base-320" type="textarea" :show-word-limit="true" :maxlength="800" v-model="formData.personal_info"></custom-input>
      </FormItem>
      <FormItem label="受训背景" prop="training_info">
        <custom-input class="base-320" type="textarea" :show-word-limit="true" :maxlength="800" v-model="formData.training_info"></custom-input>
      </FormItem>
      <FormItem label="工作经历" prop="work_info">
        <custom-input class="base-320" type="textarea" :show-word-limit="true" :maxlength="800" v-model="formData.work_info"></custom-input>
      </FormItem>
      <FormItem label="擅长疗法" prop="good_at_info">
        <custom-input class="base-320" type="textarea" :show-word-limit="true" :maxlength="800" v-model="formData.good_at_info"></custom-input>
      </FormItem>
      <FormItem label="" >
        <Button style="padding: 0px 30px;" type="primary" @click="confirm">确 认</Button>
      </FormItem>
    </Form>
    <Spin fix v-if="pageLoading"></Spin>
  </div>
</template>

<script>
export default {
  props: {
    formData: {
      type: Object,
      default(){
        return {}
      }
    },
    specializeData:{
      type: Object,
      default(){
        return {}
      }
    },
    counselorServiceData: {
      type: Array,
      default(){
        return []
      }
    },
  },
  data(){
    return {
      // formData: {
      //   consultant_id:0,
      //   profile_picture: "",
      //   name: "",
      //   mobile_phone: "",
      //   qualification: "",
      //   good_at_skilled: [],
      //   personal_info: "",
      //   training_info: "",
      //   work_info: "",
      //   good_at_info: "",
      //   experience_hour: 0,
      //   experience_year: '',
      //   language: "",
      //   address:"",
      //   service_data: [],
      // },
      ruleValidate: {
        profile_picture: [
          {
            required: true,
            validator: this._checkString,
            message: "请上传头像",
            trigger: "change",
          },
        ],
        name: [
          {
            required: true,
            validator: this._checkString,
            message: "请填写姓名",
            trigger: "blur",
          },
        ],
        mobile_phone: [
          {
            required: true,
            validator: this._checkPhone,
            trigger: "blur"
          },
        ],
        experience_hour:[
          {
            required: true,
            validator: this._checkThanInt,
            trigger: "blur",
            message: "请填写时数经验"
          },
        ],
        qualification:[
          {
            required: true,
            validator: this._checkString,
            message: "请填写资质",
            trigger: "blur",
          },
        ],
        good_at_skilled: [
          {
            required: true,
            validator: this._checkArray,
            message: "请勾选擅长领域",
            trigger: "blur",
          },
        ],
        personal_info:[
          {
            required: true,
            validator: this._checkString,
            message: "请填写个人简介",
            trigger: "blur",
          },
        ],
        service_data: [{
            required: true,
            validator: this._checkArray,
            message: "请勾选咨询方式",
            trigger: "blur",
        }]
        // training_info:[
        //   {
        //     required: true,
        //     validator: this._checkString,
        //     message: "请填写受训背景",
        //     trigger: "blur",
        //   },
        // ],
        // work_info:[
        //   {
        //     required: true,
        //     validator: this._checkString,
        //     message: "请填写工作经历",
        //     trigger: "blur",
        //   },
        // ],
        // good_at_info:[
        //   {
        //     required: true,
        //     validator: this._checkString,
        //     message: "请填写擅长疗法",
        //     trigger: "blur",
        //   },
        // ],
      },
      // specializeData: [],
      // counselorServiceData: []
    }
  },
  methods: {
    // getSpecializeInSkilled(){
    //   return this.$MainApi
    //     .specializeInSkilled({
    //       data: {},
    //     })
    //     .then((res) => {
    //       if (res.code) {
    //         let data = res.data || {};
    //         this.specializeData = data.items || []
    //       }
    //     });
    // },
    // getCounselorService(){
    //   return this.$MainApi
    //     .counselorService({
    //       data: {},
    //     })
    //     .then((res) => {
    //       if (res.code) {
    //         let data = res.data || {};
    //         this.counselorServiceData = data.items || [];
    //       }
    //     });
    // },
    // loadData(){
    //   let pageQuery = this.pageQuery || {};
    //   let consultant_id = Number(pageQuery.id) || 0;
    //   if(consultant_id){
    //     this.formData.consultant_id = consultant_id;
    //     this.pageLoading = true;
    //     return this.$MainApi
    //     .psychologicalInfo({
    //       data: {
    //         consultant_id: consultant_id
    //       },
    //       other: {
    //         isErrorMsg: true
    //       }
    //     })
    //     .then((res) => {
    //       if (res.code) {
    //         let data = res.data || {};
    //         delete data.create_time;
    //         delete data.update_time;
    //         this.formData = data;
    //       }
    //     }).finally(()=>{
    //       this.pageLoading = false;
    //     })
    //   }
    // },
    initData(){},
    changeImg(src, key){
      this.formData[key] = src
    },
    confirm(){
      this.$refs["formDataRef"].validate((valid) => {
          if (valid) {
            this.psychologicalReq();
          } else {
              this.$Message.error('请完善相关信息');
          }
      })
    },
    psychologicalReq(){
      let formData = this.formData || {};
      let req = Number(formData.consultant_id) ? 'psychologicalUpdate' : 'psychologicalAdd';
      this.pageLoading = true;
      return this.$MainApi[req]({
          data: formData,
        })
        .then((res) => {
          if (res.code) {
            this.$Message.success(res.message || (Number(formData.consultant_id) ? '编辑成功' : '添加成功'));
            let data = res.data;
            if(data.consultant_id){
              this.$router.replace({
                name: this.$route.name,
                query: {
                  ...this.pageQuery,
                  ...this.pageParams,
                  id: data.consultant_id || 0,
                  $isReplace: true
                },
              })
              this.$emit("saveCallback", data)
            }
          } else {
            this.$Message.warning(res.message || (Number(formData.consultant_id) ? '编辑失败' : '添加失败'))
          }
        }).finally(()=>{
          this.pageLoading = false;
        })
    },
  },
  mounted(){
    // this.getSpecializeInSkilled();
    // this.getCounselorService().finally(()=>{
    //   this.loadData();
    // })
  }
}
</script>

<style lang="less" scoped>
.psychiatrist-detail-area{
  position:relative;
  padding: 20px 0px;
  .goodsat-list{
    max-width: 80%;
    .goodsat-item{
      display: inline-block;
    }
  }
}
</style>