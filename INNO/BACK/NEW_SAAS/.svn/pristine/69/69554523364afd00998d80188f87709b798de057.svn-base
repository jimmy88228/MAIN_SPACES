export default {
  confirm: {
    name: '确认',
    cb () {
      this.handleConfirm('confirm');
    }
  },
  prepare: {
    name: '配货',
    cb() {
      this.handleConfirm('prepare');
    }
  },
  ship: {
    name: '生成发货单',
    cb() {
      if (this.actionNote) sessionStorage.setItem("note", this.actionNote);
      this.$router.push({
        name: 'shop-ship-order-info',
        params: {
          sn: this.sn
        }
      });
    }
  },
  confirmShip: {
    name: '确认生成发货单',
    cb() {}
  },
  receive: {
    name: '已收货',
    cb() {
      this.handleConfirm('receive');
    }
  },
  to_delivery: {
    name: '去发货',
    cb() {
      let routeUrl = this.$router.resolve({
        name: 'shop-delivery-order-list',
        params: {
          sn: this.orderSn
        }
      });
      window.open(routeUrl.href, '_self');
    }
  },
  apply_cancel: {
    name: '确认取消',
    tip: "点击 '确定' 继续执行 '确认取消' 操作？",
    cb() {
      this.handleConfirm('apply_cancel');
    }
  },
  reject_cancel: {
    name: '拒绝取消',
    tip: "点击 '确定' 继续执行 '拒绝取消' 操作？",
    cb() {
      this.handleConfirm('reject_cancel');
    }
  },
  refundment: {
    name: '确定退款',
    tip: "点击 '确定' 继续执行 '确定退款' 操作？",
    cb() {
      this.showRefundment = true;
    }
  },
  reject: {
    name: '拒收',
    cb() {
      this.handleConfirm('reject');
    }
  },
  // after_service: {
  //   name: '售后',
  //   cb() {
  //     this.handleConfirm('after_service');
  //   }
  // },
  confirm_receive: {
    name: '开启确认收货',
    cb() {
      this.handleConfirm('confirm_receive');
    }
  },
  cancel_rollback: {
    name: '反审核',
    tip: "订单将回退至上一步状态",
    cb() {
      this.handleConfirm('cancel_rollback');
    }
  },
  close_order: {
    name: '关闭订单',
    tip: "订单关闭后将无法对其进行任何操作(订单将永久停留在当前状态)且不可恢复!请慎重操作!请确认是否继续?",
    cb() {
      this.handleConfirm('close_order');
    }
  },
  cancel_prepare: {
    name: '取消配货',
    cb() {
      this.handleConfirm('cancel_prepare');
    }
  },
  cancel: {
    name: '取消',
    tip: "确定进行取消操作?",
    cb() {
      this.handleConfirm('cancel');
    }
  },
  seckill_order: {
    name: '秒杀订单',
    cb() {
      console.log(this);
    }
  },
  extra_return: {
    name: '开放退货入口',
    tip: "确定要退单吗?",
    cb() {
      this.handleConfirm('extra_return');
    }
  },
  refund_shipping: {
    name: '退运费',
    cb() {
      // 显示弹窗
      this.showRefundShipping = true;
    }
  }
}
