<template>
  <div class="brand-goods-sync">
    <div class="brand-goods-sync-list" v-show="act=='list'">
         <Card>
          <Row>
            <Col span="12">
              <!-- <SearchForm ref="search" @on-search="searchPage"></SearchForm> -->
              <!-- <p>备注: 展示活动方式：首页添加广告位并设置跳转链接为：<a style="color: red;">pages/micro_mall/video_shopping/v_page/index</a></p> -->
            </Col>
            <Col span="12" class="btn-group">
              <Button type="primary" icon="md-add" @click="createActivity" v-if="canCreate.add">创建活动</Button>
            </Col>
          </Row>
          <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
            <template slot-scope="{ row }" slot="status">
              <Tag type="dot" :color="row.status_color">{{row.status_str}}</Tag>
            </template>
            <template slot-scope="{ row }" slot="handle">
              <!-- <span v-show="row.handle.edit" @click="editBrand(row)"><a>编辑</a></span>
              <Divider type="vertical" v-show="row.handle.edit && row.handle.remove"/>
              <span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除活动吗？')"><a>删除</a></span> -->
              <span v-show="row.handle.exec" @click="execItem(row, '执行提示', '确定执行任务吗？')"><a>执行</a></span>
              <span v-show="row.handle.detail" @click="showDetail(row)"><a>查看</a></span>
              <!-- <Divider type="vertical" v-show="row.handle.edit && row.handle.remove"/> -->
              <span v-show="row.handle.record" @click="showRecord(row)"><a>同步记录</a></span>
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
    <div class="brand-goods-sync-detail" v-show="act=='detail'">
        <div class="table-list" >
        <div style="text-align:left;margin-bottom:10px;"><Button @click.native="act='list'">返回上一级</Button></div>

        <!-- <div style="margin:10px 0;">当前位置：<span style="font-size:14px;font-weight:bold;">{{group.name}}广告组 / 广告位</span></div> -->
        <Table :loading="tableLoading" :columns="detailColumns" :data="detailData">
            <template slot-scope="{ row }" slot="goods_thumb">
              <div class="img_list_wrap">
                <div class="img_fixed">
                  <img :src="row.goods_thumb" v-if="row.goods_thumb" :alt="row.goods_name" v-viewer />
                  <img src="@rs/images/default-img.jpg" :alt="row.goods_name" v-viewer v-else></img>
                </div>
                <span class="name">{{row.goods_name}}</span>
              </div>
            </template>

        </Table>
        <div style="margin: 10px;overflow: hidden">

          <div style="float: right;margin:auto 10px;">
            <Page :total="deatilPageTotal" :page-size="detailPageSize" :current="1" @on-change="brandGoodsSyncDetail" show-total></Page>

          </div>
          <div class="fr" style="float: right;">每页条数&nbsp;&nbsp;<InputNumber v-model="detailPageSize" :step="5" :min="1" :precision="0" :active-change="false" @on-change="brandGoodsSyncDetail(-1)"></InputNumber></div>
        </div>
      </div>
      </div>

      <div class="brand-goods-sync-record" v-show="act=='record'">
        <div class="table-list" >
        <div style="text-align:left;margin-bottom:10px;"><Button @click.native="act='list'">返回上一级</Button></div>

        <!-- <div style="margin:10px 0;">当前位置：<span style="font-size:14px;font-weight:bold;">{{group.name}}广告组 / 广告位</span></div> -->
        <Table :loading="tableLoading" :columns="recordColumns" :data="recordData">

        </Table>
        <div style="margin: 10px;overflow: hidden">

          <div style="float: right;margin:auto 10px;">
            <Page :total="recordPageTotal" :page-size="recordPageSize" :current="1" @on-change="brandGoodsSyncRecord" show-total></Page>

          </div>
          <div class="fr" style="float: right;">每页条数&nbsp;&nbsp;<InputNumber v-model="recordPageSize" :step="5" :min="1" :precision="0" :active-change="false" @on-change="brandGoodsSyncRecord(-1)"></InputNumber></div>
        </div>
      </div>

    </div>
  </div>
  
</template>
<script>
// import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';

export default {
  components: {

  },
  data () {
    return {
      canCreate: {},
      condition: {
        searchq: ''
      },
      act:'list',	// list:列表，detail:详情，record:同步记录
      task_id:0,
      detailColumns: [],
      detailData: [],
      deatilPageTotal:0,
      detailPageSize: 20,
      recordColumns: [],
      recordData: [],
      recordPageTotal:0,
      recordPageSize: 20,
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.brandGoodsSyncList, params)
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
        name: 'brand-goods-sync-add'
      })
    },
    // editBrand (row) {
    //   this.$router.push({
    //     name: 'video-shopping-activity-edit',
    //     params: {
    //       id: row.id
    //     }
    //   })
    // },
    handleSort () {
      this.loadData();
    },
    execItem (row) {
      return this.$ajax.post(this.$api.brandGoodsSyncExcTask, {
        id: row.id
      }).then(response => {
            const res = response.data;
            if (res.code) {
              this.$Message.success(res.message);
              this.loadData();
            } else {
              this.$Message.error(res.message);
            }
          });
    },
    showDetail (row) {
       this.act = 'detail';
       this.task_id = row.id;
       this.detailData = [];
       this.detailPageSize = 20;
       this.deatilPageTotal = 0;
       this.brandGoodsSyncDetail();
    },
    brandGoodsSyncDetail(page) {
      this.tableLoading = true;
      this.detailPageSize = !this.detailPageSize? 1: this.detailPageSize;
      this.$ajax.post(this.$api.brandGoodsSyncDetail,{
         id: this.task_id,
         page:page,
         pageSize:this.detailPageSize,
       }).then((response)=>{
            this.tableLoading = false;
            const res = response.data;
            if (res.code) {
              this.detailData = res.data.items;
              this.detailColumns =res.data.columns;
              this.deatilPageTotal = res.data.total;
              this.detailPageSize = res.data.pageSize;
            } else {
              this.$Message.error(res.msg);
            }
        })
    },
    showRecord (row) {
       this.act = 'record';
       this.task_id = row.id;
       this.recordData = [];
       this.recordPageSize = 20;
       this.recordPageTotal = 0;
       this.brandGoodsSyncRecord();
    },
    brandGoodsSyncRecord(page) {
      this.tableLoading = true;
      this.recordPageSize = !this.recordPageSize? 1: this.recordPageSize;
      this.$ajax.post(this.$api.brandGoodsSyncRecord,{
         id: this.task_id,
         page:page,
         pageSize:this.recordPageSize,
       }).then((response)=>{
            this.tableLoading = false;
            const res = response.data;
            if (res.code) {
              this.recordData = res.data.items;
              this.recordColumns =res.data.columns;
              this.recordPageTotal = res.data.total;
              this.recordPageSize = res.data.pageSize;
            } else {
              this.$Message.error(res.msg);
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
.brand-goods-sync{
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
