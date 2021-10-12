export default {
  watch: {
    defaultColums (orderColum) {
      this.columns = orderColum.map(item => {
        switch (item.key) {
          case 'image_url':
            return {
              ...item,
              slot: 'image_url',
              align: 'left',
              width: 'auto',
              minWidth: 150
            }
          case 'img_url':
            return {
              ...item,
              slot: 'img_url',
              align: 'left',
              width: 'auto',
              minWidth: 150
            }
          case 'goods_name':
            return {
              ...item,
              align: 'left',
              width: 200
            }
          case 'goods_sn':
            return {
              ...item,
              align: 'left',
              width: 200
            }
          case 'update_time':
            return {
              ...item,
              align: 'left',
              slot: 'update_time'
            }
          case 'handle':
            return {
              ...item,
              align: 'left',
              slot: 'handle'
            }
          default:
            return item;
        }
      });
    }
  }
}
