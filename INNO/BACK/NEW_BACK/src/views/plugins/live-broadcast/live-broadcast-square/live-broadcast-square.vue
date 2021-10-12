<template>
  <div class="brand-list">
    <Card>
      <Row>
        <Col span="12">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="12" class="btn-group">
          <Button type="primary" @click="asyncData">同步直播间</Button>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="name">
          <div class="img_list_wrap">
            <div class="img_fixed">
              <img :src="row.cover_img" v-if="row.cover_img" :alt="row.name" v-viewer/>
              <img src="@rs/images/default-img.jpg" :alt="row.name" v-viewer v-else></img>
            </div>
            <div>
              <p>{{row.name}}</p>
              <p>房间: {{row.room_id}}</p>
              <p>开播: {{row.start_time}}</p>
              <p>主播: {{row.author_name}}</p>
            </div>
          </div>
        </template>
        <template slot="is_enable" slot-scope={row}>
          <i-switch size="large" v-model="row.is_enable" true-value="1" false-value="0" :before-change="handleEnableChange.bind(this, row)">
            <span slot="open">启用</span>
            <span slot="close">关闭</span>
          </i-switch>
        </template>
        <template slot-scope="{ row }" slot="handle">
          <span v-show="row.handle.edit" @click="handleEdit(row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.remove"/>
          <span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除活动吗？')"><a>删除</a></span>
          <Divider type="vertical" v-show="row.handle.stick"/>
          <span v-show="row.handle.stick" @click="handleStick(row, row.handle.stick && row.sort !== '1')"><a>{{(row.handle.stick && row.sort !== '1') ? '置顶': '取消置顶'}}</a></span>
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
        selectType: '0'
      }
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.liveBroadcastSquareList, params)
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
    handleEdit (row) {
      this.$router.push({
        name: 'live-broadcast-form',
        params: {
          id: row.id
        }
      })
    },
    asyncData () {
      return this.$ajax.post(this.$api.liveBroadcastSquareSync).then(_ => {
        this.loadData();
      });
    },
    onDelItem (row) {
      return this.$ajax.post(this.$api.liveBroadcastSquareListRemove, {
        id: row.id
      });
    },
    handleStick (row, type) {
      return this.$ajax.post(this.$api.liveBroadcastSquareListStick, {
        id: row.id,
        type: type ? 1 : 0
      }).then(_ => {
        this.loadData();
      });
    },
    toggleChange (row) {
      return this.$ajax.post(this.$api.liveBroadcastSquareListStatus, {
        id: row.id,
		    is_enabled: row.is_enabled == 1 ? 0 : 1
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
          this.loadData();
        }
      });
    },
    handleEnableChange (row) {
      return new Promise((resolve, reject) => {
        this.toggleChange(row);
        reject();
      })
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.brand-list{
  .brand-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
  }
}
</style>
