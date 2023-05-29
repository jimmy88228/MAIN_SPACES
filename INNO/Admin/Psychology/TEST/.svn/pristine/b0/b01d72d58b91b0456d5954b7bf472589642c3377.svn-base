<template>
  <div class="school-form p-t-5">
    <Form :label-width="120" :model="schoolInfo" ref="formDataRef" :rules="ruleValidate">
      <drawerForm>
          <div slot="title">学校基本信息</div>
          <div slot="content">
            <FormItem label="上级管理" prop="structure_id">
              <div v-if="schoolInfo.id && schoolInfo.structure_id || _structureType == 'edu_street'">{{schoolInfo.structure_name}}</div>
              <div v-if="!schoolInfo.id && _structureType != 'edu_street'" class="flex">
                <div class="w-break">{{schoolInfo.structure_name}}</div>
                <a class="inline-b p-l-10 text-underline" @click="chooseSuperior">{{schoolInfo.structure_id ? '更改上级' : '选择上级'}}</a>
                <Input v-show="false" v-model="schoolInfo.structure_id"></Input>
              </div>
            </FormItem>
            <FormItem label="学校名称" prop="school_name">
              <custom-input class="base-input" size="large" v-model="schoolInfo.school_name"></custom-input>
            </FormItem>
            <FormItem label="学校编码" prop="school_code">
              <custom-input class="base-input" size="large" v-model="schoolInfo.school_code"></custom-input>
            </FormItem>
            <FormItem label="校区信息" >
              <campousView  ref="campousViewRef" :schoolId="schoolId" :defaultCampus="defaultCampus" :campusData="schoolInfo.campus_data" @setClass="setCampousClass"></campousView>
            </FormItem>
          </div>
      </drawerForm>
      <drawerForm>
          <div slot="title">学校后台管理员</div>
          <div slot="content">
            <FormItem label="管理员手机号" prop="admin_phone">
                <div v-if="schoolInfo.id">{{schoolInfo.admin_phone}}</div>
                <div v-else>
                  <custom-input type="number" :showWordLimit="false" :maxlength="11" class="base-input" size="large" v-model="schoolInfo.admin_phone"></custom-input>
                  <div class="desc-notice m-t-10">手机号将用作后台登录账号，首次登录凭手机验证码登录</div>
                </div>
            </FormItem>
          </div>
      </drawerForm>
      <drawerForm v-for="(item, index) in schoolInfo.school_contact" :key="index">
          <div slot="title" class="flex-b-c">
            <div><span v-if="schoolInfo.school_contact && schoolInfo.school_contact.length > 1">({{index + 1}})</span>学校联系人<span class="desc-notice">（非必填）</span></div>
            <div class="contact-operate">
              <a  @click="addSchoolContact" v-if="index == 0 && schoolInfo.school_contact.length < 5">增加</a>
              <a class="desc-notice" @click="removeSchoolContact(index)" v-if="index > 0">删除</a>
            </div>
          </div>
          <div slot="content">
            <div >
              <FormItem label="联系人姓名" :prop="'school_contact'+ index + 'name'" >
                  <custom-input class="base-input" size="large" v-model="item.name"></custom-input>
              </FormItem>
              <FormItem label="手机号" :prop="'school_contact.'+ index + '.mobile_phone'" :rules="[{ required: item.mobile_phone ? true : false,  validator: _checkPhoneFormat }]">
                  <custom-input class="base-input" type="number" :showWordLimit="false" :maxlength="11" size="large" v-model="item.mobile_phone"></custom-input>
              </FormItem>
              <FormItem label="备注" :prop="'school_contact'+ index + 'remark'">
                  <custom-input class="base-input" size="large" v-model="item.remark"></custom-input>
              </FormItem>
            </div>
          </div>
      </drawerForm>
      
    </Form>
  </div>
</template>

<script>
import drawerForm from "@/components/view-components/drawer-form/index.vue";
import campousView from "./campus/campus-view.vue";
export default {
  components: { drawerForm, campousView },
  props: {
    schoolId: Number,
    defaultContact: {
      type: Object,
      default:()=>{
        return {}
      }
    },
    defaultCampus: {
      type: Object,
      default:()=>{
        return {}
      }
    },
    schoolInfo: {
      type: Object,
      default(){
        return {}
      }
    }
  },
  data(){
    return {
      ruleValidate: {
        structure_id: [
          {
              required: true,
              validator: this._checkThanInt,
              trigger: "blur",
              message: "请选择学校上级",
            },
        ],
        school_name: [
            {
                required: true,
                validator: this._checkString,
                trigger: "blur",
                message: "请填写学校名称",
            },
        ],
        school_code: [
            {
                required: true,
                validator: this._checkString,
                trigger: "blur",
                message: "请填写学校编码",
            },
        ],
        admin_phone: [
            {
                required: true,
                validator: this._checkPhone,
                trigger: "blur",
            },
        ]
    },
    }
  },
  methods: {
    addSchoolContact(){
      let defaultContact = JSON.parse(JSON.stringify(this.defaultContact)) || {};
      this.schoolInfo.school_contact.push(defaultContact);
    },
    removeSchoolContact(index){
      this.schoolInfo.school_contact.splice(index, 1)
    },
    setCampousClass(detail){
      this.$emit("setCampousClass", detail);
    },
    checkCampus(){
      return this.$refs["campousViewRef"] && this.$refs["campousViewRef"].checkForm();
    },
    setCampusWarn(index){
      this.$refs["campousViewRef"] && this.$refs["campousViewRef"].setCampusWarn(index);
    },
    checkSchool(){
      return new Promise((rs, rj)=>{
        this.$refs["formDataRef"].validate((valid) => {
          if(valid){
            return rs();
          } else {
            this.$Message.warning("请完善学校信息");
            return rj();
          }
        })
      })
    },
    checkForm(){
      return this.checkCampus().then(()=>{
        return this.checkSchool();
      })
    },
    chooseSuperior(){
      this.$UIModule({
          mode: "superior-view",
          options: {},
          success: (data) => {
            data = data || [];
            this.$set(this.schoolInfo, 'structure_id', data[0].id);
            this.$set(this.schoolInfo, 'structure_type', data[0].structure_type);
            this.$set(this.schoolInfo, 'structure_name', data[0].title);
          },
      });
    }
  },
  watch: {

  }
}
</script>

<style lang="less" scoped>
.school-form{

}
.contact-operate{
  font-weight: unset;
}
</style>