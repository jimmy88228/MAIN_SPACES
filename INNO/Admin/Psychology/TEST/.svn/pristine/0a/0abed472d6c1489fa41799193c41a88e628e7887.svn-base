	<template>
  <div class="page-setting-weixin p-10">
    <Divider>微信分享设置</Divider>
    <Form ref="formValidate" :model="pageInfo" label-position="top">
      <FormItem label="微信分享标题" prop="name">
        <Input v-model="pageInfo.wx_share_title" placeholder="请输入微信分享标题" maxlength="30" show-word-limit></Input>
      </FormItem>
      <!-- <FormItem label="微信分享详情" prop="page_desc">
        <Input v-model="pageInfo.wx_share_desc" placeholder="请输入微信分享详情" type="textarea" maxlength="100" show-word-limit :rows="3"></Input>
      </FormItem> -->
      <FormItem label="微信分享图片">
        <img-view uploadType="custom_page" :img="pageInfo.wx_share_img" :isCustomChoose="false" @selectImg="(data)=>{selectImage('wx_share_img', data)}" @delImg="removeImg('wx_share_img')"></img-view>
      </FormItem>
      <!-- <FormItem label="微信海报图片">
        <img-view :img="pageInfo.wx_poster_image" :isCustomChoose="false" @selectImg="(data)=>{selectImage('wx_poster_image', data)}" @delImg="removeImg('wx_poster_image')"></img-view>
      </FormItem> -->
    </Form>
  </div>
</template>	

<script>
/**
 * 微信分享设置
 */
export default {
  name: "pageSettingWeixin",
  components: {},
  props: {
    pageInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  methods: {
    // 选择图片（单选）
    selectImage(name, src) {
      src = src || "";
			this.$set(this.pageInfo, name, src);
    },
    removeImg(name) {
      this.$set(this.pageInfo, name, "");
    },
  },
  mounted() {
  },
};
</script>	