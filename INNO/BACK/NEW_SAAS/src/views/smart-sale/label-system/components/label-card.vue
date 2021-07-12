

<template>
  <Card :title="title" class="label-card">
    <slot></slot>
    <Icon type="md-close-circle" size="25" class="close-icon" @click="hideCard"/>
  </Card>
</template>

<script>
export default {
  name: 'labelCard',
  components: {},
  props: ["title"],
  data () {
    return {}
  },
  methods: {
    hideCard(){
      this.$emit("on-hideCard");
    }
  },
}
</script>

<style lang="less">
.label-card{
  position:relative;
  margin:5px;
  margin-bottom:10px;
  border-radius:10px;
  .ivu-card-body{
    padding-bottom:5px;
  }
  .close-icon{
      opacity: 0;
      cursor: pointer;
      position: absolute;
      top:0px;
      right:0px;
      transform: translate(40%,-40%);
      transition: opacity .35s;
  }
}
.label-card:hover{
  .close-icon{
      opacity: 1;
  }
}
</style>
