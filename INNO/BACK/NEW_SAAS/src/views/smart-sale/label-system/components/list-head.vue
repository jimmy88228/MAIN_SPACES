

<template>
  <div class="list-head statistics-page">
      <Divider orientation="left">{{ title }}</Divider>
      <div class="operate-btn">
        <Button type="primary" @click="labelHandle" v-if="canAction.add">+ 新建标签</Button>&nbsp;&nbsp;
        <Button type="primary" @click="groupHandle" v-if="canAction.addgroup">+ 新建分组</Button>
      </div>
  </div>
</template>

<script>
export default {
  name: 'labelHead',
  components: {},
  props: {
    title: {
      type: String,
      default(){
        return "标题"
      }
    },
    canAction: {
      type: Object,
      default(){
        return {}
      }
    }
  },
  data () {
    return {}
  },
  methods: {
    labelHandle(){
      this.$emit("on-labelHandle");
    },
    groupHandle(){
      this.$emit("on-groupHandle");
    }
  },
}
</script>

<style lang="less">
.list-head{
  padding-bottom:20px;
  .operate-btn{
    width:100%;
    display:flex;
    justify-content: flex-end;
  }
} 
</style>
