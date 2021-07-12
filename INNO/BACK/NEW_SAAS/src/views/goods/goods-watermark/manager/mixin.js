export default {
  watch: {
    defaultColums (orderColum) {
      this.columns = orderColum.map(item => {
        switch (item.key) {
          case 'watermark_url':
            return {
              ...item,
              slot: 'watermark_url',
              align: 'left',
              width: 'auto',
              minWidth: 150
            }
          case 'watermark_cat':
            return {
              ...item,
              align: 'left',
              width: 'auto',
              minWidth: 150
            }
          case 'created_at_format':
            return {
              ...item,
              align: 'left',
              slot: 'createTime'
            }
          case 'handle':
            return {
              ...item,
              slot: 'handle',
              align: 'left',
              width: 300
            }
          default:
            return item;
        }
      });
    }
  }
}
