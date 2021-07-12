<template>
  <Modal
    class="user-common-form"
    v-model="modalShow"
    :loading="loading"
    :title="modalTitle"
    :width="modalWidth"
    :footer-hide="footerShow"
    :mask-closable="false">
    <template v-if="type == 'userBonus'">
      <Form ref="formValidate" :model="formItem" :label-width="60" inline>
        <FormItem label="券状态">
          <Select v-model="formItem.effective" class="basic_select">
            <Option :value="0">有效</Option>
            <Option :value="1">无效</Option>
          </Select>
        </FormItem>
        <FormItem label="券类型">
          <Select v-model="formItem.send_type" class="basic_select">
            <Option :value="0">全部</Option>
            <Option :value="key" v-for="(val, key) in bounsList" :key="key">{{val}}</Option>
          </Select>
        </FormItem>
        <Button type="primary" @click="searchPage">查询</Button>
      </Form>
    </template>
    <Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="tableData" ref="myTable"></Table>
    <div v-show="pageTotal" class="user-list_page">
      <Page :total="pageTotal" :page-size="pageSize" :current="currentPage" @on-change="changePage" show-total></Page>
    </div>
  </Modal>
</template>

<script>
import config from '@/config/index';

const typeMap = {
  userPointList: '账户积分',
  userStoredValue: '储值余额',
  userBonus: '优惠券',
  userBalance: '账户余额'
}

export default {
  props: {
    type: {
      type: String,
      required: true
    },
    bounsList: {
      type: Object,
      required: true
    },
    userData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      modalShow: false,
      modalWidth: 900,
      footerShow: true,
      loading: false,
      tableHeight: 300,
      pageSize: config.PAGE_SIZE_DEF,
      currentPage: 1,
      columns: [],
      tableData: [],
      pageTotal: 0,
      tableLoading: false,
      formItem: {
        effective: 0,
        send_type: 0
      }
    }
  },
  computed: {
    modalTitle () {
      return typeMap[this.type];
    }
  },
  methods: {
    openModal () {
      this.modalShow = true;
      this.loadData();
    },
    loadData () {
      this.loading = true;
      this.tableLoading = true;
      return this.$ajax.post(this.$api[this.type], {
        page: 1,
        pageSize: this.pageSize,
        user_id: this.userData.user_id
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.pageTotal = res.data && res.data.total;
          this.columns = res.data && res.data.columns;
          this.formatColumn();
          this.tableData = res.data && res.data.data;
          this.loading = false;
          this.tableLoading = false;
        }
      });
    },
    changePage (page) {
      return this.$ajax.post(this.$api[this.type], {
        page: page,
        pageSize: this.pageSize,
        user_id: this.userData.user_id,
        ...this.formItem
      })
      .then((response) => {
        var res = response.data;
        if (res.code) {
          this.pageTotal = res.data && res.data.total;
          this.columns = res.data && res.data.columns;
          this.formatColumn();
          this.tableData = res.data && res.data.data;
          this.loading = false;
          this.tableLoading = false;
        }
      });
    },
    searchPage () {
      return this.$ajax.post(this.$api[this.type], {
        page: 1,
        pageSize: this.pageSize,
        user_id: this.userData.user_id,
        ...this.formItem
      })
      .then((response) => {
        var res = response.data;
        if (res.code) {
          this.pageTotal = res.data && res.data.total;
          this.columns = res.data && res.data.columns;
          this.formatColumn();
          this.tableData = res.data && res.data.data;
          this.loading = false;
          this.tableLoading = false;
          this.currentPage = 1;
        }
      });
    },
    formatColumn () {
      this.columns.forEach((item, index) => {
        if (item.type === 'time') {
          this.$set(this.columns[index], 'render', (h, p) => {
            const isVaildDate = p.row[item.key].indexOf('-') !== -1;
            const time = isVaildDate ? p.row[item.key].split(' ') : p.row[item.key];
            return h('div', isVaildDate ? [
              h('p', time[0]),
              h('p', time[1])
            ] : time)
          });
          this.$set(this.columns[index], 'align', 'left');
          this.$set(this.columns[index], 'width', 'auto');
          this.$set(this.columns[index], 'minWidth', 120);
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.user-common-form{
  .basic_select{
    width: 200px;
  }
  .user-list_page{
    margin: 10px 10px 0 10px;
    overflow: hidden;
    text-align: right;
  }
}
</style>
