import SpecSort from '../spec-sort.vue';

export default {
  watch: {
    defaultColums(orderColum) {
      const _this = this;
      // 获取图片，加载错误则不显示
      this.columns = orderColum.map(item => {
        switch (item.key) {
          case 'color_name':
            return {
              ...item,
              align: 'left',
              minWidth: 200
            }
          case 'color_code':
            return {
              ...item,
              align: 'left',
              width: 'auto',
              minWidth: 200
            }
          case 'color_sort':
            return {
              ...item,
              align: 'left',
              width: 'auto',
              minWidth: 100,
              render (h, params) {
                return h(SpecSort, {
                  props: {
                    type: 'color_sort',
                    value: params.row.color_sort,
                    id: params.row.color_id
                  },
                  on: {
                    'edit-success'() {
                      _this.handleUpdate();
                    }
                  }
                })
              }
            }
            break;
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
