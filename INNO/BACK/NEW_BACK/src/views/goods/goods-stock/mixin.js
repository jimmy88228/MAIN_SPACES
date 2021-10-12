export default {
  watch: {
    defaultColums (orderColum) {
      this.columns = orderColum.map(item => {
        switch (item.key) {
          case 'store_name':
            return {
              ...item,
              align: 'left',
              minWidth: 200
            }
          case 'goods_sn':
            return {
              ...item,
              align: 'left',
              minWidth: 200
            }
          case 'num':
            return {
              ...item,
              align: 'left'
            }
          case 'handle':
            return {
              ...item,
              slot: 'handle'
            }
          default:
            return item;
        }
      });
    }
  }
}
