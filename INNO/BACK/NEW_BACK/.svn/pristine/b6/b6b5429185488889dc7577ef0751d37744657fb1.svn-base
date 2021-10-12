<template>
  <div class="contact-list">
    <Card>
      <Row>
        <Col span="12">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="12" class="btn-group">
          <Button type="primary" icon="md-add" @click="createContact" v-if="canCreate.add">新增方式</Button>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="worker_str">
          <p>{{row.worker_str}}</p>
          <span v-show="row.c_type=='2'" @click="handleShowMore(row)"><a>显示更多</a></span>
           <!-- <p>{{row.all_worker_str}}</p> -->
        </template>

        <template slot-scope="{ row }" slot="handle">
          <span v-show="row.handle.downloadQrcode" @click="handleDownloadQrcode(row)"><a>二维码</a></span>
          <Divider type="vertical" v-show="row.handle.downloadQrcode"/>
          <span v-show="row.handle.edit" @click="editItem(row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.edit"/>
          <span v-show="row.handle.del" @click="delItem(row, '删除提示', '确定删除联系方式吗？')"><a>删除</a></span>
          <Divider type="vertical" v-show="row.handle.remove"/>
          <span v-show="row.handle.copy" @click="handleCopy(row)"><a>复制</a></span>
        </template>
      </Table>
      <div v-show="pageTotal" class="list_page">
        <Page
          :total="pageTotal"
          :page-size="pageSize"
          :current="currentPage"
          :page-size-opts="pageSizeOpts"
          @on-change="e => changePage(e)"
          @on-page-size-change="ps => handlePageSize(ps)"
          show-elevator
          show-total
          show-sizer></Page>
      </div>
    </Card>
  </div>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';

export default {
  components: {
    SearchForm
  },
  data () {
    return {
      canCreate: {},
      condition: {
        searchq: ''
      }
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.qwContactList, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = res.data && res.data.canCreate;
        }
      });
    },
    searchPage (searchData) {
      this.condition = searchData;
      this.loadData();
    },
    createContact () {
      this.$router.push({
        name: 'qw-contact-add'
      });
    },
    editItem (row) {
      this.$router.push({
        name: 'qw-contact-edit',
        params: {
          id: row.id
        }
      });
    },
    handleBinding (row) {
      this.$router.push({
        name: 'goods-coupons-activity-goods',
        params: {
          id: row.id
        }
      });
    },
    handleCopy (row) {
      return this.$ajax.post(this.$api.goodsCouponsActivityCopy, {
        id: row.id
      }).then(() => {
        this.loadData();
      });
    },
    onDelItem (row) {
      return this.$ajax.post(this.$api.qwContactDelete, {
        id: row.id
      });
    },
    handleDownloadQrcode(row) {
      this.$Modal.confirm({
								title: '二维码',
								render: (h) => {
									
									return h('div',{
										style:{
											textAlign: 'center'
										}
									},[
										h('img',{
											attrs:{
												src: row.qrcode_url
											},
											style:{
												width: '220px',
												'object-fit': 'contain',
											}
										}),
									]);
								}
							});
    },
    handleShowMore(row) {
      this.$Modal.confirm({
								title: '显示更多人员',
								render: (h) => {
									
									return h('div',{
										style:{
											textAlign: 'center'
										}
									},[
										h('div',{
											style:{
												textAlign: 'center'
											}
										}, row.all_worker_str ),
									]);
								}
							});
    },
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.contact-list{
  .btn-group{
    text-align: right;
  }
}
</style>
