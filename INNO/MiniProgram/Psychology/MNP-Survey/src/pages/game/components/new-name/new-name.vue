<template>
<view class="new-record-popup" @touchmove.stop.prevent="noAction">
  <ori-popup
      ref="popup"
      type="center"
      @change="changePopup"
  >
    <template v-slot:content>
      <view class="new-record-area">
        <view class="record-tip">修改排行榜昵称</view>
        <ori-input  @onInput="(e) => onInput(e, 'name')" :value="name"
          placeholder="给自己起个霸气的名字吧" placeholderStyle="font-size: 32rpx;line-height: 40rpx;text-align:center;" class="_input" 
          :maxlength="20"
          :boxStyle="inputStyle">
        </ori-input>
        <view class="operate-area">
          <button class="operate-btn" @click="confirm">确认</button>
        </view>
      </view>
    </template>
  </ori-popup>
</view>
</template>

<script>
import oriPopup from "@/components/ori-comps/popup/ori-popup";
import oriInput from "@/components/ori-comps/input/ori-input.vue";
const app = getApp();
const BaseComp = Page.BaseComp({
  data() {
    return {
      name: ""
    }
  },
  computed:{
    inputStyle() {
      return "width:100%;font-size: 32rpx;line-height: 40rpx;";
    }
  },
  components: { oriPopup, oriInput },
  methods: {
    dismiss(){
      this.$refs.popup.dismiss();
    },
    showModal({ name }) {
      this.$refs.popup.show();
      this.name = name || '';
    },
    onInput(e, key){
      let value = e.detail.value || '';
      this[key] = value;
    },
    confirm(){
      if(!this.name){
        app.SMH.showToast({
          title: "请输入修改的名称"
        })
        return;
      }
      this.$emit("changeName", this.name);
    },
    
    changePopup(){}
  },
});
export default BaseComp
</script>

<style lang="scss" scoped>
.new-record-area{
  width: 600rpx;
  height: 450rpx;
  background: #FFFFFF;
  border-radius: 60rpx;
  padding: 40rpx;
  box-sizing: border-box;
  position:relative;
  text-align:center;
  .record-tip{
    width: 100%;
    text-align: left;
    color: #333333;
    font-size: 32rpx;
    margin-top: 20rpx;
    margin-bottom: 50rpx;
    padding-left: 20rpx;
    font-weight: bold;
  }
  .operate-btn{
    margin: 0 auto;
    width: 300rpx;
    height: 100rpx;
    background: #F0570F;
    border-radius: 50rpx;
    font-size: 40rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #FFF9D9;
    line-height: 40rpx;
  }
  ._input{
    width:100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height:110rpx;
    // line-height: 110rpx;
    background: #FAFAFA;
    box-sizing:border-box;
    border-radius: 55rpx;
    margin-bottom: 56rpx;
  }
  ._input-placeholder{
    width: 100%; 
    font-size: 32rpx;
    // line-height: 40rpx;
    text-align:center;
  }
  // .hold-style{
  //   font-size: 32rpx;
  //   font-family: PingFang SC;
  //   font-weight: 300;
  //   color: #B3B3B3;
  //   line-height: 40rpx;
  // }
}

</style>