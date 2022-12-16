<style lang="less">
.user-service-form {
  padding: 10px;
  .img-item-list {
    border-radius: 5px;
    margin-bottom: 12px;
    margin-right: 10px;
    position: relative;
    padding: 10px;
    background: #fff;
    box-shadow: 0 0 4px 0 rgba(10, 42, 97, 0.2);

    .handle_u {
      position: absolute;
      right: 5px;
      top: -10px;
      font-size: 10px;
      cursor: move;
      display: none;
      color: #2d8cf0;
      font-size: 22px;
    }
    &:hover {
      .close,
      .handle_u {
        display: block;
      }
    }
  }
}
</style>

<template>
  <div class="user-service-form">
    <title-bar style="margin-top: -10px;">编辑功能</title-bar>
    <Form ref="formValidate" :model="dynamic_setting" label-position="top">
      <!-- <FormItem label="标题文字">
        <Input v-model="dynamic_setting.title" placeholder=""></Input>
      </FormItem>
      <FormItem label="标题提示文字">
        <Input v-model="dynamic_setting.tip" placeholder=""></Input>
      </FormItem>
      <FormItem label="显示形式">
        <RadioGroup v-model="dynamic_setting.display_format">
          <Radio label="grid">宫格</Radio>
          <Radio label="list">列表</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem v-show="dynamic_setting.display_format =='grid' " label="宫格一行">
        <RadioGroup v-model="dynamic_setting.row">
          <Radio :label="3">3个</Radio>
          <Radio :label="4">4个</Radio>
        </RadioGroup>
      </FormItem> -->
      <FormItem>
        <draggable :list="module_data.serviceList" :group="{name:'serviceBox'}" handle=".handle_u" v-bind="dragOptions">
          <div v-for="(item,index) in module_data.serviceList" :name="index" :key="item.code" class="img-item-list">
            <Icon type="md-apps" class="handle_u" title="拖拽排序" />
            <div class="flex">
              <div class="p-l-5 p-r-10">
                <img-view uploadType="custom_page" display="block" :width="60" :img="item.icon" :isCustomChoose="false" @selectImg="(data)=>{selectImage(index, data)}" @delImg="removeImage(index)"></img-view>
                <p>
                  <i-switch v-model="item.is_enable" size="large" :true-value="1" :false-value="0">
                    <span slot="open">启用</span>
                    <span slot="close">关闭</span>
                  </i-switch>
                </p>
              </div>
              <div >
                <div class="flex-s-c">
                  <span class="w-nowrap m-r-10">标题</span>
                  <Input v-model="item.name" size="small" placeholder="名称" />
                </div>
                <div class="flex-s-c">
                  <span class="w-nowrap m-r-10">提示</span>
                  <Input v-model="item.tip" size="small" placeholder="提示信息" />
                </div>
                <div class="flex-s-c">
                  <span class="w-nowrap m-r-10">关联功能</span>
                  <tag style="margin-left:10px;">{{item.type_name}}</tag>
                </div>
              </div>
            </div>
          </div>
        </draggable>

      </FormItem>
    </Form>

    <!--图标选择组件-->
    <!-- <iconSelect ref="icon-select" @on-return-url="onReturnIcon"></iconSelect> -->
  </div>
</template>

<script>
// import iconSelect from "@/views/my-components/icon-select/icon-select";
import draggable from "vuedraggable";
export default {
  name: "userServiceForm",
  components: {
    // iconSelect,
    draggable,
  },
  props: {
    compInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
    dynamic_setting(){
      let compInfo = this.compInfo || {};
      let dynamic_setting = compInfo.dynamic_setting || {};
      // if(!dynamic_setting){
      //   this.$set(module_data, "serviceList", []);
      // }
      return dynamic_setting || {}
    },
    module_data() {
      let compInfo = this.compInfo || {};
      let module_data = compInfo.module_data || {};
      if (!module_data.serviceList) {
        this.$set(module_data, "serviceList", []);
      }
      return module_data || {};
    },
  },
  methods: {
    // 调起icon选择器
    openIconsModal(name = "", url = "") {
      this.$refs["icon-select"].showModal({
        name: name,
        multi: 0,
        selectedImage: url,
        contentType: "SYSTEM_ICON",
        maxSize: 500,
      });
    },
    // // icon 回调
    // onReturnIcon(obj) {
    //   this.$set(this.formItem.list[obj.name], "icon", obj.val);
    // },
    selectImage(index, src) {
      this.$set(this.module_data.serviceList[index], "icon", src );
    },
    removeImage(index) {
      this.$set(this.module_data.serviceList[index], "icon", "" );
    },
  },
  watch: {},
  mounted() {},
};
</script>
