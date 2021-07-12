// 说明
// 1.保证选中以及原数据使用的都是ID
// 2.表格原数据字段为tableData(如与page-helper使用可忽略)
// 3.module_is_check_all用于外部用来控制全选所有的数据(所有页)
// 4.module_reload_data默认有数据该标识才有用

export default {
  data () {
    return {
      module_select_data: [],
      module_is_check_all: false,
      // 可选(存在源数据)
      module_reload_data: true
    }
  },
  methods: {
    $_handleSelect (selection, row) {
      this.module_select_data.push(row);
    },
    $_handleSelectCancel (selection, row) {
      const id = row.id;
      this.module_select_data.forEach((item, index) => {
        if (item.id == id) this.module_select_data.splice(index, 1);
      });
    },
    $_handleSelectAll (selection) {
      const exitId = this.module_select_data.map(item => Number(item.id));
      const filter = selection.filter(item => exitId.indexOf(Number(item.id)) == -1);
      filter.forEach(item => {
        this.module_select_data.push(item);
      });
    },
    $_handleSelectAllCancel () {
      const exitId = this.module_select_data.map(item => Number(item.id));
      const filter = this.tableData.filter(item => exitId.indexOf(Number(item.id)) != -1);
      const delCol = filter.map(item => Number(item.id));
      for (let i = this.module_select_data.length - 1; i >= 0; i--) {
        if (delCol.indexOf(Number(this.module_select_data[i].id)) != -1) {
          this.module_select_data.splice(i, 1);
        }
      }
    },
    $_handle_selection () {
      // 勾选状态
      if (!this.module_is_check_all) {
        this.$_handleCheck();
      } else {
        this.$_handleCheckAll(this.module_is_check_all);
      }
    },
    $_handleCheck () {
      // 每次切换页面需要重新读取选中的数据
      if (this.module_select_data.length > 0) {
        this.tableData.forEach((item, index) => {
          this.module_select_data.forEach(selectItem => {
            if (selectItem.id == item.id) {
              this.$set(this.tableData[index], '_checked', true);
            }
          });
        });
      }
    },
    $_handleCheckAll (bool = false) {
      this.tableData.forEach((item, index) => {
        this.$set(this.tableData[index], '_checked', bool);
      });
      if (!bool) this.module_select_data = [];
      this.module_reload_data = bool;
    }
  }
}
