<template>
  <div class="structure-box flex-s-c" style="display: inline-flex">
    <div class="flex max-box">
      <div class="flex1" style="overflow:hidden;">
        <div class="tag-box" v-bar>
          <tag-label :data="tagData" :disabled-del="disabledDel" :type="type" @del-tag="handleDeleteTag" :nameKey="nameKey">
          </tag-label>
          <a v-if="!disabledSel" class="tag-btn" @click="handleSelect">选择</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import tagLabel from "@/components/view-components/tag-label/tag-label.vue";
export default {
  components: {
    tagLabel,
  },
  props: {
    type: {
      type: String,
      default: "checkBox",
    },
    tagData: {
      type: Array,
      default: function () {
        return [];
      },
    },
    nameKey: {
      type: String,
      default: "structure_name"
    },
    'disabled-del':{
      type:Boolean,
      default:false
    },
    'disabled-sel':{
      type:Boolean,
      default:false
    },
  },
  methods: {
    handleDeleteTag(data) {
      this.$emit("handleDeleteTag", data);
    },
    handleSelect() {
      this.$emit("handleSelect");
    },
  },
};
</script>

<style lang="less" scoped> 
.structure-box {
  padding-left: 5px;
  box-sizing: border-box;
  border: 1px solid #dddddd;
  border-radius: 2px;
  position: relative;
}
.max-box{
  max-height: 150px;
}
.tag-box {
  min-width: 211px;
  max-width: 320px;
  height: 100%;
  padding-right: 45px;
  position: relative;
}
.tag-btn {
  color: #008acb;
  position: absolute;
  right: 20px;
  top:50%;
  transform: translateY(-50%);
}
.radio-box {
}
.radio {
  padding: 2px 10px;
  border-radius: 2px;
  background-color: #fff;
  transition: all 0.2s;
  border: 1px solid #dddddd;
  margin-right: 10px;
  .radio-cir {
    width: 16px;
    height: 16px;
    background-color: #ffffff;
    border: 1px solid #b2b2b2;
    position: relative;
    border-radius: 50%;
    margin-right: 10px;
  }
  &.active {
    background-color: #effaff;
    color: #008acb;
    .radio-cir {
      background-color: #008acb;
      border: 1px solid #008acb;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
      }
    }
  }
}
</style>