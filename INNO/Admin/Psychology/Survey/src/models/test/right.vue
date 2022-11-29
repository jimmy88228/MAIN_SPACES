<template>
  <draggable :list="rightData" :group="{name:'itemBox'}" class="drag-area" @change="dragChange">
    <div v-for="item in rightData" style="padding: 20px;" class="drag-item" :key="item.code">
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
  data() {
    return {
      rightData: [],
    };
  },
  methods: {
    dragChange(e) {
      console.log("dragChange", e);
      console.log("rightData", this.rightData);
    },
  },
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