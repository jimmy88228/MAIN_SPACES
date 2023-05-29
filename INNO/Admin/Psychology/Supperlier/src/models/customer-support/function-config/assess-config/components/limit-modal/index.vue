<template>
  <custom-modal ref="modal" :width="530" :footerHide="true">
    <div class="limit-modal-title bold">
      {{isLimit ? '设置为不限制次数' : '设置为按次数计算'}}
    </div>
    <div class="limit-modal-content text-c">
      <template v-if="isLimit">
        <p>确认开启后参与活动将停止次数的计算</p>
      </template>
      <template v-else>
        <p>确认开启后参与活动将扣减品牌可参与活动次数</p>
        <p>次数为0后用户则无法参与活动</p>
      </template>
    </div>
    <div class="flex-c-c footer-btns">
      <Button size="large" @click="dismiss" >&nbsp;取消&nbsp;</Button>&nbsp;&nbsp;&nbsp;
      <Button size="large" type="primary" :loading="limitLoading" @click="confirm">确认开启</Button>
    </div>
    <p class="limit-modal-tip text-c">*此设置为总设置，开启后对品牌下所有组织生效</p>
  </custom-modal>
</template>

<script>
export default {
  props: {
    isLimit: Boolean,
    limitLoading: Boolean,
  },
  data(){
    return {}
  },
  methods: {
    dismiss() {
      this.$refs.modal.dismiss();
    },
    showModal(){
      this.$refs.modal.show();
    },
    confirm(){
      this.$emit("confirm", { isLimit: this.isLimit });
      this.dismiss();
    }
  }
}
</script>

<style scoped>
.limit-modal-title{
  padding: 20px 10px;
  text-align:center;
  font-size: 20px;
  font-family: PingFangSC-Medium, PingFang SC;
  color: #333333;
  line-height: 28px;
}
.limit-modal-content{
  font-size: 18px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 30px;
  padding: 10px 0px;
}
.limit-modal-tip{
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #7F7F7F;
  line-height: 30px;
}
.footer-btns{
  padding-top: 30px;
  padding-bottom: 10px;
}
</style>