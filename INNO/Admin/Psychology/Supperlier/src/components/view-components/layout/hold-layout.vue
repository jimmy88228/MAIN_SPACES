<template>
  <div class="hold-layout" :class="{'full-height-layout':isFullHeight || isFull}" :style="layoutCustomStyle">
    <div class="hold-layout-content" :style="layoutContentCustomStyle" :class="{ 'full-height' : isFullHeight || isFull }">
      <slot></slot>
    </div>
    <div class="hold-layout-footer">
      <slot name="footer"></slot> 
      <div class="flex-c-c m-t-20 m-b-20" v-if="isShowFormSave">
          <Button @click="_cancel" type="default" v-if="!formSaveMsg.isHideCancel">{{formSaveMsg.cancelText||"取消"}}</Button>
          <Button @click="_save" type="primary" class="m-l-20" v-if="!formSaveMsg.isHideSave">{{formSaveMsg.saveText||"保存"}}</Button>
          <Button @click="_saveAll" type="primary" class="m-l-20" v-if="!formSaveMsg.isHideSave && isShowAllSave">{{formSaveMsg.saveAllText||"保存全部"}}</Button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "holdLayout",
  props: {
    'layout-custom-style':{
      type:String,
      default:''
    },
    'layout-content-custom-style':{
      type:String,
      default:''
    },
    'isFullHeight':{
      type:Boolean,
      default:false
    },
    'isFull':{
      type:Boolean,
      default:false
    },
    'isShowFormSave':{
      type:Boolean,
      default:false
    },
    'isShowAllSave': {
      type: Boolean,
      default: false
    },
    'formSaveMsg':{
      type:Object,
      default:()=>({})
    }
  },
  methods: {
    _cancel() {
      this.$emit('_cancel',)
    },
    _save() {
      this.$emit('_save',)
    },
    _saveAll(){
      this.$emit('_saveAll')
    }
  },
}
</script>

<style lang="less" scoped>
.hold-layout{
  width:100%;
  min-height: calc(100%);
  display: flex;
  flex-direction: column;
  &.full-height-layout{
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: calc(100%);
  }
  .hold-layout-content{
    flex: 1;
    overflow: hidden;
  }
  .full-height{
    display: flex;
    flex-direction: column;
    // height:100%;
    // min-height: calc(100%);
  }
  .hold-layout-footer{
    position: sticky;
    bottom: 0px;
  }
}
</style>