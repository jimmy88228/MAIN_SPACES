<template>
  <div class="category-menu-list">
    <Card>
      <div class="action">
        <Button type="primary" icon="md-add" @click="openModal({})" v-if="canCreate">添加分类菜单</Button>
      </div>
      <Table :loading="tableLoading" :height="tableHeight" :columns="field" :data="tableData" ref="myTable">
         <template slot-scope="{ row }" slot="cat_name">
          <p>{{row.cat_name}}</p>
          <p v-if="row.hide_cat_name" class="sign">对应分类关闭了显示</p>
        </template>
        <template slot-scope="{ row }" slot="handle">
          <Divider type="vertical" v-show="row.handle.edit"/>
          <span v-show="row.handle.edit" @click="editCat(row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.edit && row.handle.remove"/>
          <span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除标签吗？')"><a>删除</a></span>
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
      <Spin size="large" fix v-if="spinShow"></Spin>
    </Card>
    <CatForm ref="catForm" @on-success="onFormSuccess"></CatForm>
  </div>
</template>

<script>
import PageHelper from '@/libs/page-helper.js';
import Mixin from './ad-cat-mixin.js';
import CatForm from './cat-form';

/**
 * 分类菜单设置
 */
export default {
	name: 'adCat',
    components: {
      CatForm
    },
    data () {
      return {
        spinShow: false,
        canCreate: false
      }
    },
    mixins: [PageHelper, Mixin],
    methods: {
      onLoadData (page, data) {
        return this.$ajax.post(this.$api.categoryMenuList, { isInit: 1, ...data })
        .then(response => {
          const res = response.data;
          if (res.code) {
            this.data = res.data;
            this.canCreate = res.data && res.data.canCreate;
          }
        });
      },
      openModal (row) {
        this.$refs.catForm.openModal(row);
      },
      editCat (row) {
        this.$ajax.post(this.$api.categoryMenuInfo, {
          id: row.id
        })
        .then(response => {
          const res = response.data;
          if (res.code) {
              this.openModal(res.data);
          }
        });
        
      },
      onDelItem (row) {
        return this.$ajax.post(this.$api.delCategoryMenu, {
          id: row.id
        });
      },
      // 开启/关闭
      updateEnabled (row) {
        this.tableLoading = true;
        return this.$ajax.post(this.$api.changeCategoryMenuStatus, {
          id: row.id,
          is_show: row.is_show === '1' ? '0' : '1'
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
.category-menu-list{
  .action{
    text-align: right;
    margin-bottom: 10px;
  }
  .btn-group{
      text-align: right;
  }
  .group-list_title{
      display: flex;
      align-items: center;
      .group-list_back{
          margin-right: 20px;
      }
  }
  .sign{
    color: red;
  }
}
</style>