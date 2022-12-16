<style lang="less">
.background-form {
  padding: 10px;

  .ivu-color-picker {
    .ivu-select-dropdown {
      z-index: 1000;
    }
  }

  .image-box {
    width: 75px;
    height: 75px;
    line-height: 75px;
    border: 1px solid #eee;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
    background: center center no-repeat;
    background-size: 100% auto;
    margin-right: 5px;
    position: relative;

    .close {
      position: absolute;
      top: -8px;
      right: -8px;
    }
  }
}
</style>
	
<template>
  <div class="background-form">
    <Divider>页面背景设置</Divider>

    <Form ref="formValidate" :model="setting" label-position="top">
      <FormItem label="页面背景颜色( 建议用淡颜色作为页面背景色 )">
        <ColorPicker v-model="setting.backgroundColor" style="margin-left: 100px;"/>
      </FormItem>
      <FormItem label="背景图片">
        <img-view uploadType="custom_page" :img="setting.backgroundImage" @selectImg="selectImage" @delImg="setting.backgroundImage = ''"></img-view>
      </FormItem>
      <FormItem label="背景图片位置">
        <RadioGroup v-model="setting.backgroundPosition">
          <Radio label="top">顶部对齐</Radio>
          <Radio label="center">居中对齐</Radio>
          <Radio label="bottom">底部对齐</Radio>
        </RadioGroup>
      </FormItem>
      <div style="height:50px;width:100%;"></div>
    </Form>
  </div>
</template>

<script>
/**
 * 页面背景设置
 */
export default {
  name: "pageSettingBackground",
  components: {},
  props: {
    pageInfo: {
      type: Object,
      default: () => {},
    },
    currIndex: {
      type: [Number, String],
      default: 0,
    },
  },
	computed:{
    setting(){
      return this.pageInfo && this.pageInfo.setting||{};
    },
	},
  data() {
    return {
    };
  },
  methods: {
    // 选择图片（单选）
    selectImage(src) {
      this.$set(this.pageInfo.setting, "backgroundImage", src);
      // this.$selectMaterial({
      //   type: "image",
      //   selectedData: this.formItem.setting.backgroundImage,
      //   getList: (item) => {
      //     let src = item.src || "";
      //     this.formItem.setting.backgroundImage = src;
      //   },
      // });
    },
  },
  watch: {},
  mounted() {},
};
</script>