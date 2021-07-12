export default {
  watch: {
    defaultColums (orderColum) {
      this.columns = orderColum.map(item => {
        switch (item.key) {
          case 'goods_brand_name':
            return {
              ...item,
              slot: 'name',
              align: 'left',
              minWidth: 200
            }
          case 'goods_brand_code':
            return {
              ...item,
              width: 'auto',
              align: 'left',
              minWidth: 200
            }
          case 'created_at_format':
            return {
              ...item,
              width: 'auto',
              minWidth: 100,
              align: 'left',
              slot: 'createTime'
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
