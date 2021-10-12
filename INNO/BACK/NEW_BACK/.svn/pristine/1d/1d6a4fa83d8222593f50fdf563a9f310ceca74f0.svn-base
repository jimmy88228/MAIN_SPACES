export default {
  data() {
    return {
      isGlobalLeaveTip: true
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.isGlobalLeaveTip) {
      this.$Modal.confirm({
        title: '温馨提示',
        content: '确定要离开当前页面吗?',
        onOk() {
          next();
        },
        onCancel() {
          next(false);
        }
      });
    } else {
      next();
    }
  }
}
