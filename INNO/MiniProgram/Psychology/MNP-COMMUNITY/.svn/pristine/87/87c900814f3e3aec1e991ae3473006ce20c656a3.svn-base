<template>  
  <view class="ori-popup">
    <uni-popup ref="popup" 
      :type="type" 
      :safe-area="safeArea"
      :is-mask-click="isMaskClick" 
      :background-color="backgroundColor" 
      :mask-background-color="maskBackgroundColor"
      @close="close"
      @change="change"
      >
      <slot name="content"></slot>
    </uni-popup>
  </view>
</template>

<script>
const pageOption = Page.BaseComp({
  props: {
    'type': {
      type: String,
      default: ''
    },
    'safeArea':{
      type:Boolean,
      default:true
    },
    'background-color': {
      type: String,
      default: 'none'
    },
    'is-mask-click': {
      type: Boolean,
      default: function(){
        return true
      }
    },
    'mask-background-color': {
      type: String,
      default: 'rgba(0,0,0,0.4)'
    },
  },
  methods: {
    show() {
      this.$refs.popup.open();
    },
    dismiss(){
      this.$refs.popup.close();
    },
    close(e){
      this.$emit('close',e);
    },
    change(e){
      this.$emit('change',e);
    },
  },
})
export default pageOption
</script>

<style scoped lang="scss">

</style>