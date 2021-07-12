<template>
  <div class="service-list">
    <Card>
      <div class="service-list_header">
        <Button type="primary" icon="md-add" @click="openModal({})" v-if="canCreate.add">添加商品服务</Button>
      </div>
      <Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="name">
          <div class="img_list_wrap">
            <div class="img_fixed">
              <img :src="row.icon" v-if="row.icon" :alt="row.name" v-viewer/>
              <img src="@rs/images/default-img.jpg" :alt="row.name" v-viewer v-else></img>
            </div>
            <span class="name">{{row.name}}</span>
          </div>
        </template>
        <template slot-scope="{ row }" slot="createTime">
          <p>{{row.created_at_format | initDate}}</p>
          <p>{{row.created_at_format | initTime}}</p>
        </template>
        <template slot-scope="{ row, index }" slot="handle">
          <span v-show="row.handle.edit" @click="editService(index, row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.edit"/>
          <span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除商品服务吗？')"><a>删除</a></span>
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
    <ServiceForm ref="serviceForm" @on-success="onFormSuccess"></ServiceForm>
  </div>
</template>
<script>
import Mixin from './mixin.js';
import ServiceForm from './service-form';
import PageHelper from '@/libs/page-helper.js';

export default {
  components: {
    ServiceForm
  },
  data () {
    return {
      canCreate: {}
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      return this.$ajax.post(this.$api.ShopGoodsServiceList, data)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = res.data && res.data.canCreate;
        }
      });
    },
    openModal (row) {
      this.$refs.serviceForm.openModal(row);
    },
    editService (index, row) {
      this.openModal(row);
    },
    onDelItem (row) {
      return this.$ajax.post(this.$api.ShopGoodsServiceRemove, {
        id: row.id
      });
    },
    // 开启/关闭
    updateEnabled (index, row) {
      this.tableLoading = true;
      return this.$ajax.post(this.$api.ShopGoodsServiceIsenable, {
        id: row.id,
        enable: !Number(row.enable)
      })
      .then((response) => {
        var res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
          this.handleUpdate();
        }
        this.tableLoading = false;
      });
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>
<style lang="less" scoped>
.service-list{
  .service-list_import{
    margin-right: 10px;
  }
  .service-list_header{
    text-align: right;
    margin-bottom: 24px;
  }
}
</style>
