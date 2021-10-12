export default {
  confirm: {
    name: '确认',
    cb () {
      this.handleConfirm('confirm');
    }
  },
  unconfirm: {
    name: '废弃',
    cb() {
      this.handleConfirm('unconfirm');
    }
  },
  receive: {
    name: '确认收货',
    cb() {
      this.handleConfirm('receive');
    }
  },
  finish: {
    name: '结算',
    tip: "点击 '确定' 继续执行 '结算' 操作？",
    cb() {
      this.showRefundment = true;
    }
  },
  return_rollback: {
    name: '反审核',
    tip: '订单将回退至上一步状态',
    cb() {
      this.handleConfirm('return_rollback');
    }
  },
  remove: {
    name: '删除',
    tip: '确定进行删除操作?',
    cb() {
      this.handleConfirm('remove')
      .then(() => {
        this.$router.push({
          name: 'return-order-list'
        });
      });
    }
  }
}
