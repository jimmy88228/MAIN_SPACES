<template>
  <div class="manager-form">
    <PageTopBase>
      <div>
        <Row>
          <Col span="12">
            <SearchForm ref="search" @on-search="searchPage"></SearchForm>
          </Col>
          <Col span="12" class="btn-group">
            <Button type="primary" icon="md-add" @click="openMarkModal({})">添加水印图片</Button>
          </Col>
        </Row>
        <Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="tableData" ref="myTable">
          <template slot-scope="{ row }" slot="watermark_url">
            <div class="img_list_wrap">
              <div class="img_fixed">
                <img :src="row.watermark_url" v-if="row.watermark_url" :alt="row.watermark_name" v-viewer/>
                <img src="@rs/images/default-img.jpg" :alt="row.watermark_name" v-viewer v-else></img>
              </div>
              <span class="name">{{row.watermark_name}}</span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="createTime">
            <p>{{row.created_at_format | initDate}}</p>
            <p>{{row.created_at_format | initTime}}</p>
          </template>
          <template slot-scope="{ row }" slot="handle">
            <span v-show="row.handle.edit" @click="editMarkPic(row)"><a>编辑</a></span>
            <Divider type="vertical" v-show="row.handle.edit && row.handle.remove"/>
            <span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除水印吗？')"><a>删除</a></span>
            <Divider type="vertical" v-show="row.handle.remove && row.handle.clean"/>
            <span v-show="row.handle.clean" @click="cleanMark(row)"><a>清除水印</a></span>
            <Divider type="vertical" v-show="row.handle.clean && row.handle.immediately"/>
            <span v-show="row.handle.immediately" @click="startMarkPic(row)"><a>立即打水印</a></span>
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
      </div>
    </PageTopBase>

    <ManagerForm ref="managerForm" @on-success="onFormSuccess"></ManagerForm>
  </div>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import ManagerForm from './manager-form';
import PageHelper from '@/libs/page-helper.js';
import PageTopBase from '@/views/my-components/page-top-base/index';

export default {
  components: {
    SearchForm,
    ManagerForm,
    PageTopBase
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
    clearOptions () {
      this.condition.searchq = '';
      this.$refs.search.clearOptions();
    },
    onLoadData (page, data) {
      return this.$ajax.post(this.$api.goodsWatermarkWaterList, {
        searchq: this.condition.searchq,
        ...data
       })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = (res.data && res.data.canCreate) || {};
          this.watermarkCat = (res.data && res.data.watermark_cat) || {};
        }
      });
    },
    searchPage (searchData) {
      this.condition = searchData;
      this.loadData();
    },
    openMarkModal (row) {
      this.$refs.managerForm.openModal(row, this.watermarkCat);
    },
    // 编辑水印图片
    editMarkPic (row) {
      this.openMarkModal(row, this.watermarkCat);
    },
    onDelItem (row) {
      return this.$ajax.post(this.$api.goodsWatermarkWaterRemove, {
        id: row.id || 0
      });
    },
    cleanMark (row) {
      this.$Modal.confirm({
        title: '水印即时操作',
        content: `确定要给【${row.watermark_name}】设置的货号执行清除水印操作吗？点‘确定’继续操作？`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.onCleanItem(row);
        }
      });
    },
    onCleanItem (row) {
      return this.$ajax.post(this.$api.goodsWatermarkWaterClean, {
        id: row.id || 0,
        type: 0 // 清除打水印
      })
      .then((response) => {
        var res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
        }
      });
    },
    startMarkPic (row) {
      this.$Modal.confirm({
        title: '水印即时操作',
        content: `确定要给【${row.watermark_name}】设置的货号执行打水印操作吗？点‘确定’继续操作？`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.onMarkItem(row);
        }
      });
    },
    onMarkItem (row) {
      return this.$ajax.post(this.$api.goodsWatermarkWaterClean, {
        id: row.id || 0,
        type: 1 // 立即打水印
      })
      .then((response) => {
        var res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
        }
      });
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>
<style lang="less">
.manager-form{
  .btn-group{
    text-align: right;
  }
}
</style>
