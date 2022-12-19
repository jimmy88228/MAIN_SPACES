export default {
  data() {
    return {
      isGlobalLeaveTip: true
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.isGlobalLeaveTip) { 
      document.onkeydown = ()=>{ //监听回车
        var e = window.event;
        if (e && e.keyCode == 13) {
          this.$Modal.remove();
          next();
          document.onkeydown = null; 
        }
      } 
      this.$Modal.confirm({
        title: '温馨提示',
        content: '确定要离开当前页面吗?',
        closable:true,
        onOk() {
          document.onkeydown = null; 
          next();
        },
        onCancel() {
          document.onkeydown = null; 
          next(false);
        }
      });
       
    } else {
      next();
    }
  }
}
