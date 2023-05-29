<template>
  <draggable :list="baseData" class="drag-area" :group="{name:'itemBox', pull:'clone', put: false}">
    <div v-for="item in baseData" style="padding: 20px;" class="drag-item" :key="item.code">
      <p style="width:30px;height:30px;background-color:#efefef;"></p>
      {{item.name}}
    </div>
  </draggable>
</template>

<script>
import draggable from "vuedraggable";
export default {
  components: {
    draggable,
  },
  inject: {
    compInfo:{
      default(){
        return {}
      }
    }
  },
  data() {
    return {
      baseData: [
        {
          cat: "basic",
          code: "IMAGE-AD",
          desc: "常规图片广告，有多种显示形式",
          hideMenu: false,
          icon: "ios-images-outline",
          icon_class: "icon",
          icon_color: "#19be6b",
          name: "图片广告",
          plugins_code: "",
          show_in_toolbar: true,
        },
        {
          cat: "basic",
          code: "IMAGE-AD2",
          desc: "常规图片广告，有多种显示形式2",
          hideMenu: false,
          icon: "ios-images-outline",
          icon_class: "icon",
          icon_color: "#19be6b",
          name: "图片广告2",
          plugins_code: "",
          show_in_toolbar: true,
        },
      ],
    };
  },
  watch:{
    compInfo: {
			handler(nV){
				console.log("注入子组件", nV);
			},
			deep: true,
			immediante: true
		}
  }
};
</script>

<style lang="less" scoped>
.drag-area {
  width: 100%;
  min-height: 100%;
}
.drag-item {
  border: 1px solid #efefef;
  background-color: #fff;
}
.drag-item:hover {
  opacity: 0.6;
}
</style>