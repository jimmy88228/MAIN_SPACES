<template>
  <div class="today-report">
    <Card>
      <Row class="m-bottom-15">
        <Col span="20">
          <p>注：升级规则按照顺序依次从小到大向上升级，排序越大等级越高；关联会员等级后会同步修改， 一天仅执行一次升级规则。</p>
        </Col>
        <Col span="4" class="btn-group">
          <div class="flex" style="justify-content:flex-end;">
            <Button type="primary" @click="openModal">添加等级</Button>
            <p class="m-top-5" v-if="this.cashBackSelfGetVal == 0"><Icon style="font-size:26px;"  type="ios-help-circle-outline" @click="showPic" /></p>
          </div>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="name">
          <div class="img_list_wrap">
            <div class="img_fixed">
              <img :src="row.goods_brand_image" v-if="row.goods_brand_image" :alt="row.goods_brand_name" v-viewer/>
              <img src="@rs/images/default-img.jpg" :alt="row.goods_brand_name" v-viewer v-else/>
            </div>
            <span class="name">{{row.goods_brand_name}}</span>
          </div>
        </template>
        <template slot-scope="{ row }" slot="createTime">
          <p>{{row.created_at_format | initDate}}</p>
          <p>{{row.created_at_format | initTime}}</p>
        </template>
        <template slot-scope="{ row, index }" slot="handle">
          <span v-show="row.handle.edit" @click="editBrand(index, row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.set"/>
          <span @click="handleSet(row)" v-show="row.handle.set"><a>设置默认</a></span>
          <Divider type="vertical" v-show="row.handle.remove"/>
          <span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除等级吗？')"><a>删除</a></span>
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
    <RankForm ref="rankForm" @on-success="loadData()"></RankForm>
    <Modal
        v-model="modalPic"
        title="说明图解"
        :footer-hide="true"
        :width="1000"
    >
      <img :src="picUrl" style="width:970px;" />
    </Modal>
  </div>
</template>
<script>
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';
import RankForm from './rank-form';

export default {
  components: {
    RankForm
  },
  data () {
    return {
      canCreate: {},
      modalPic:false,
      picUrl:"",
      cashBackSelfGetVal: '0'
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data);
      return this.$ajax.post(this.$api.distributionRankList, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = res.data && res.data.canCreate;
          this.picUrl =res.data.picUrl;
          this.cashBackSelfGetVal =res.data.cashBackSelfGetVal;
        }
      });
    },
    openModal (row) {
      this.$refs.rankForm.setData(row).show();
    },
    editBrand (index, row) {
      this.openModal(row);
    },
    onDelItem (row) {
      return this.$ajax.post(this.$api.distributionRankRemove, {
        id: row.id
      });
    },
    handleSet (row) {
      return this.$ajax.post(this.$api.distributionRankSet, {
        id: row.id
      }).then( _ => {
        this.$Message.success('设置成功!');
        this.loadData();
      });
    },
    showPic(){
      this.modalPic=true;
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.today-report{
  .brand-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
  }
}
</style>
