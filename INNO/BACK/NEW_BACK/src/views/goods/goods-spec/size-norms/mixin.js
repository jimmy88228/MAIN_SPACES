import SpecSort from '../spec-sort.vue';

export default {
  watch: {
    defaultColums(orderColum) {
      const _this = this;
      // 获取图片，加载错误则不显示
      this.columns = orderColum.map(item => {
        switch (item.key) {
          case 'size_name':
            return {
              ...item,
              align: 'left',
              minWidth: 200
            }
          case 'size_code':
            return {
              ...item,
              align: 'left',
              width: 'auto',
              minWidth: 200
            }
          case 'size_sort':
            return {
              ...item,
              align: 'left',
              width: 'auto',
              minWidth: 100,
              render(h, params) {
                return h(SpecSort, {
                  props: {
                    type: 'size_sort',
                    value: params.row.size_sort,
                    id: params.row.size_id
                  },
                  on: {
                    'edit-success'() {
                      _this.handleUpdate();
                    }
                  }
                })
              }
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
