<template>
  <div class="video-shopping">
    <Card>
      <Row>
        <Col span="18">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
          <p>展示活动方式：首页添加广告位并设置跳转链接为：<a style="color: red;">pages/micro_mall/video_shopping/v_page/index</a></p>
        </Col>
        <Col span="6" class="btn-group">
          <Button type="primary" icon="md-add" @click="createActivity" v-if="canCreate.add">创建活动</Button>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="is_enabled">
          <Tag type="dot" :color="row.is_enabled === '1' ? 'success' : 'error'">{{row.is_enabled === '1'  ? '启用' : '关闭'}}</Tag>
        </template>
        <template slot-scope="{ row }" slot="sort">
          <video-sort :id="row.id" :value="row.sort" @edit-success="handleSort"></video-sort>
        </template>
        <template slot-scope="{ row }" slot="handle">
					<div class="v-lines">
						<template v-if="row.handle.edit">
							<a @click="editBrand(row)">编辑</a>
							<span class="v-line">|</span>
						</template>
						<template>
							<a @click="checkVideoGoods(row)">商品列表</a>
							<span class="v-line">|</span>
						</template>
						<template v-if="row.handle.remove">
							<a @click="delItem(row, '删除提示', '确定删除活动吗？')">删除</a>
							<span class="v-line">|</span>
						</template>
					</div>
          <!-- <span v-show="row.handle.edit" @click="editBrand(row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.edit && row.handle.remove"/>
          <span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除活动吗？')"><a>删除</a></span> -->
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
import VideoSort from './video-sort';

export default {
  components: {
    SearchForm,
    VideoSort
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
      return this.$ajax.post(this.$api.videoShoppingList, params)
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
    createActivity () {
      this.$router.push({
        name: 'video-shopping-activity-add'
      })
    },
    editBrand (row) {
      this.$router.push({
        name: 'video-shopping-activity-edit',
        params: {
          id: row.id
        }
      })
    },
    handleSort () {
      this.loadData();
    },
    onDelItem (row) {
      return this.$ajax.post(this.$api.videoShoppingRemove, {
        id: row.id
      });
    },
		checkVideoGoods(row){
			this.$router.push({
			  name: 'video-shopping-activity-edit',
			  params: {
			    id: row.id,
					step: 1
			  }
			})
		}
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.video-shopping{
  .handle_wrapper{
    margin: 10px 10px 0 10px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }
  .brand-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
  }
}
</style>
