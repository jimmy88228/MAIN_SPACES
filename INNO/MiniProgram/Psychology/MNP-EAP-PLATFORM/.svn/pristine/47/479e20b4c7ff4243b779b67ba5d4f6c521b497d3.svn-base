<template>  
     <view> 
      <!-- uview u-picker 交互效果不理想 -->
      <view v-if="type == 'uPicker'" class="picker" >
        <slot name="content"></slot>
        <u-picker ref="uPicker" :defaultIndex="defaultIndex" :show="showBool" :columns="columns" :closeOnClickOverlay="closeOnClickOverlay" @confirm="confirm" @change="change" @close="close" @cancel="cancel"></u-picker>
      </view>
    </view>
</template>

<script>
const pageOption = Page.BaseComp({
  data() {
    return { 
      picker_value:'',
      showBool:false,
    }
  },
  props: {  
    // uPicker
    columns:{
      type: Array,
      default: function(){
        return [];
      }
    }, 
    closeOnClickOverlay:{
       type:Boolean,
        default:true
    },
    defaultIndex:{
      type: Array,
      default: function(){
        return [];
      }
    }
  },
  methods: {   
    // uPicker
    show(){
      this.showBool = true;
    },
    dismiss(){
      this.showBool = false;
    },
    getData(type){
      if(type == 'picker'){
        return  this.$refs.uPicker;
      }
      return this;
    },
    confirm(e){
      console.log('confirm',e);
      this.$emit('confirm',e);
      this.dismiss();
    },
    change(e){
      console.log('change',e)
      this.$emit('change',e);
    },
    cancel(){
      console.log('cancel',)
      this.dismiss();
    },
    close(){
      console.log('close',)
      this.dismiss();
    },
     
  },
})
export default pageOption
</script>

<style scoped lang="scss">

</style>