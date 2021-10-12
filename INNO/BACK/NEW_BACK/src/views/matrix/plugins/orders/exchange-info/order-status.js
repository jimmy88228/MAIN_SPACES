export default {
  confirm: {
    name: '确认',
    tip: '确定要进行该操作吗？点‘确定’继续操作，数据将不可恢复，请谨慎操作！',
    cb() {
      this.handleConfirm('confirm');
    }
  },
  refuse: {
    name: '拒绝',
    tip: '确定要进行该操作吗？点‘确定’继续操作，数据将不可恢复，请谨慎操作！',
    cb() {
      this.handleConfirm('refuse');
    }
  },
  receive: {
    name: '确认收货',
    tip: '确定要进行该操作吗？点‘确定’继续操作，数据将不可恢复，请谨慎操作！',
    cb() {
      this.handleConfirm('receive');
    }
  },
  return_rollback: {
    name: '反审核',
    tip: '确定要进行该操作吗？点‘确定’继续操作，数据将不可恢复，请谨慎操作！',
    cb() {
      this.handleConfirm('return_rollback');
    }
  },
  generate_order: {
    name: '重新生成订单',
    tip: '确定要进行该操作吗？点‘确定’继续操作，数据将不可恢复，请谨慎操作！',
    cb() {
      this.handleConfirm('generate_order');
    }
  },
  remove: {
    name: '删除',
    tip: '确定要进行该操作吗？点‘确定’继续操作，数据将不可恢复，请谨慎操作！',
    cb() {
      this.handleConfirm('remove')
      .then(() => {
        this.$router.push({
          name: 'exchange-goods-list'
        });
      });
    }
  },
  new_order: {
    name: '查看新订单',
    cb() {
      let routeUrl = this.$router.resolve({
        name: 'order-info',
        params: {
          sn: this.newOrderId
        }
      });
      window.open(routeUrl.href, '_blank');
    }
  }
}
