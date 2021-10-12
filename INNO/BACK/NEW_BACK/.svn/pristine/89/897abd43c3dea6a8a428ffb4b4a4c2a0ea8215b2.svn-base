<template>
  <div class="goods-size-explain">
    <Card>
      <Row>
        <Col span="12">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="12" class="btn-group">
          <Poptip placement="bottom-start" width="200" v-model="visible">
            <!--<Button type="primary">核销码设置</Button>-->
            <div class="api" slot="content">
              <Input type="text" v-model="codeValue"/>
              <div style="margin-top: 10px;">
                <Button @click="visible = false">取消</Button>
                <Button type="primary" @click="comfirmCode">确定</Button>
              </div>
            </div>
          </Poptip>
          <Button type="primary" icon="md-add" @click="create" v-if="canCreate.add">添加尺码图</Button>
          <Button type="primary"  @click="cat_list">尺码图分类</Button>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <!--<template slot-scope="{ row }" slot="name">
          <div class="img_list_wrap">
            <div class="img_fixed">
              <img :src="row.goods_brand_image" v-if="row.goods_brand_image" :alt="row.goods_brand_name" v-viewer/>
              <img src="@rs/images/default-img.jpg" :alt="row.goods_brand_name" v-viewer v-else></img>
            </div>
            <span class="name">{{row.goods_brand_name}}</span>
          </div>
        </template>-->
        <template slot-scope="{ row }" slot="name">
          <div class="img_list_wrap">
            <div class="img_fixed">
              <img :src="row.size_img1" v-if="row.size_img1" :alt="row.size_img1" v-viewer/>
              <img src="@rs/images/default-img.jpg" :alt="row.size_img1" v-viewer v-else></img>
            </div>
            <span class="name">{{row.name}}</span>
          </div>
        </template>

        <!-- <template slot-scope="{ row }" slot="createTime">
          <p>{{row.from_date | initDate}}</p>
          <p>{{row.from_date | initTime}}</p>
        </template>

        <template slot-scope="{ row }" slot="endTime">
          <p>{{row.to_date | initDate}}</p>
          <p>{{row.to_date | initTime}}</p>
        </template>

        <template slot-scope="{ row }" slot="isEnabled">
          <Tag type="dot" :color="row.is_enabled == 1 ? 'green' : (row.is_enabled == 0 ? 'red' : 'yellow')">{{row.is_enabled == 1  ? '启用' : (row.is_enabled ==0 ? '关闭' : '过期')}}</Tag>
        </template> -->


        <template slot-scope="{ row, index }" slot="handle">
          <span v-show="row.handle.edit" @click="editItem(index, row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.edit && row.handle.remove"/>
          <span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除吗？')"><a>删除</a></span>
          <Divider type="vertical" v-show="row.handle.edit && row.handle.remove"/>
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
import SearchForm from './search-form-size-explain';
import Mixin from './mixin-size-explain.js';
import PageHelper from '@/libs/page-helper.js';

export default {
  components: {
    SearchForm
  },
  data () {
    return {
      canCreate: {},
      codeValue: '',
      condition: {
        searchq: '',
        type: 1
      },
      visible: false
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.goodsSizeExplain, params)
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
    //创建
    create () {
      this.$router.push({
        name: 'goods-size-explain-add'
      });
    },
    editItem(index,row) {
        this.$router.push({
            name: 'goods-size-explain-edit',
            params: {
                id: row.id
            }
        });
    },
    cat_list(){
      this.$router.push({
        name: 'goods-size-explain-cat'
      });
    },
    onDelItem (row) {
      return this.$ajax.post(this.$api.goodsSizeExplainDel, {
        id: row.id
      });
    },
    handleRecord () {
      this.$router.push({
        name: 'record-list'
      })
    },
    comfirmCode () {
      this.visible = false;
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.goods-size-explain{
  .brand-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
  }
}
</style>
