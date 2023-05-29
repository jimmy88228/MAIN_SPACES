<template>
  <div>
    <div class="flex-b-c">
      <div>海关心理健康平台</div>
      <div><Button type="primary">分配资源</Button></div>
    </div>
    <div class="">
      <Tabs value="name1">
        <TabPane label="视频内容" name="name1">
          
        </TabPane>
        <TabPane label="音频内容" name="name2"></TabPane>
        <TabPane label="文章内容" name="name3"></TabPane>
        <TabPane label="心理咨询师" name="name3"></TabPane>
      </Tabs>
    </div>
    <Form :label-width="100" :model="formData" ref="formDataRef" :rules="ruleValidate">
      <FormItem label="上传视频">
        <Button type="primary">重新上传</Button>
        <p class="">视频原标题</p>
      </FormItem>
      <FormItem label="视频标题" prop="class_name">
        <Input size="large" class="base-320" v-model="formData.class_name" :show-word-limit="true" :maxlength="30"></Input>
      </FormItem>
      <FormItem label="视频封面" prop="class_name">
        <img-view uploadType="video" :width="87"></img-view>
        <span>默认使用视频第一帧&nbsp;<a>更改封面</a></span>
        <p class="desc-notice">按比例16:9上传最佳，图片大小不得超过</p>
      </FormItem>
      <FormItem label="视频背景" prop="class_name">
        <img-view uploadType="video" width="89" height="116"></img-view>
        <p class="desc-notice">建议尺寸：600像素 * 1300像素，图片大小不得超过 3M</p>
      </FormItem>
      <FormItem label="视频介绍" prop="class_name">
        <Input class="base-320" type="textarea" :show-word-limit="true" :maxlength="200" v-model="formData.class_name"></Input>
      </FormItem>
      <FormItem label="视频分组" prop="campus_id">
        <data-select size="large" class="base-320" v-model="formData.campus_id" :schoolId="formData.school_id" @changeData="getChangeCampus"></data-select>
      </FormItem>
      <FormItem label="" >
        <Button style="padding: 0px 30px;" type="primary" @click="confirm">确 认</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  components: { },
  data() {
    return {
      formData: {

      },
      ruleValidate: {
        grade_id: [
          {
            required: true,
            validator: this._checkInt,
            trigger: "blur",
            message: "请选择年级",
          },
        ],
        class_name: [
          {
            required: true,
            validator: this._checkString,
            message: "请填写班级",
            trigger: "blur",
          },
        ],
        campus_id: [
          {
            required: true,
            validator: this._checkThanInt,
            message: "请选择校区",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    confirm(){
      this.$refs["formDataRef"].validate((valid) => {
          if (valid) {

          } else {
              this.$Message.error('请完善相关信息');
          }
      })
    }
  }
};
</script>

<style>
</style>