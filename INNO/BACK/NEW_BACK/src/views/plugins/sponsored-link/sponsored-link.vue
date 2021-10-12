<template>
  <div class="brand-list">
    <Card>
      <Row>
        <Col span="12">
          <!--<SearchForm ref="search" @on-search="searchPage"></SearchForm>-->
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
          <Button type="primary" icon="md-add" @click="createActivity" v-if="canCreate.add">生成链接</Button>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="createTime">
          <p>{{row.from_date | initDate}}</p>
          <p>{{row.from_date | initTime}}</p>
        </template>

        <template slot-scope="{ row }" slot="endTime">
          <p>{{row.to_date | initDate}}</p>
          <p>{{row.to_date | initTime}}</p>
        </template>

        <template slot-scope="{ row }" slot="isEnabled">
          <Tag type="dot" :color="row.is_enabled == 1 ? 'green' : (row.is_enabled == 0 ? 'red' : 'yellow')">{{row.is_enabled == 1  ? '启用' : (row.is_enabled ==0 ? '关闭' : '过期')}}</Tag>
        </template>


        <template slot-scope="{ row, index }" slot="handle">
          <span v-show="row.handle.edit" @click="editBrand(index, row)"><a>修改</a></span>
          <span v-show="row.handle.edit" @click="showlink(row.link)"><a>复制链接</a></span>
          <!--<Divider type="vertical" v-show="row.handle.edit && row.handle.remove"/>
          <span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除分享有礼活动吗？')"><a>删除</a></span>
          <Divider type="vertical" v-show="row.handle.edit && row.handle.remove"/>-->
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
    showlink(url){
        this.$Modal.confirm({
            title: '复制链接',
            content: '<input value="'+url+'" style="width:100%;border:0px;">',
            okText: '复制',
            cancelText: '取消',
            onOk: () => {
                var some=url;//前端链接
                var oInput = document.createElement('input');
                oInput.value = some;
                document.body.appendChild(oInput);
                oInput.select(); // 选择对象
                document.execCommand("Copy"); // 执行浏览器复制命令
                oInput.className = 'oInput';
                oInput.style.display='none';
                this.$Message.info('复制成功');
            },
            onCancel: () => {
            }
        })
    },
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.sponsoredLinkList, params)
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
    //创建活动
    createActivity () {
      this.$router.push({
        name: 'sponsored-link-add'
      });
    },
    editBrand(index, row) {
        this.$router.push({
            name: 'sponsored-link-edit',
            params: {
                id: row.id
            }
        });
    },
    onDelItem (row) {
      return this.$ajax.post(this.$api.shareActivityRemove, {
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
.brand-list{
  .brand-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
  }
}
</style>
