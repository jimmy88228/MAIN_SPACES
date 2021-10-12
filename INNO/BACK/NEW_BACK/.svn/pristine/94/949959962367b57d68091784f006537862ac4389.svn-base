<template>
  <div class="discount-buy-activity-list">
    <Card>
      <Row>
        <Col span="12">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="12" class="btn-group">
          <Button type="primary" icon="md-add" @click="addItem()" v-if="canCreate.add">添加活动</Button>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="activity_img">
            <div class="img_list_wrap">
              <div class="img_fixed">
                <img :src="row.activity_img" v-if="row.activity_img" :alt="row.name" class="img" v-viewer/>
                <img src="@rs/images/default-img.jpg" :alt="row.name" class="img" v-viewer v-else />
              </div>
            </div>
        </template>
        <template slot-scope="{ row }" slot="time">
            <p>{{row.begin_time}}</p>
            <p>{{row.end_time}}</p>
        </template>
        <template slot-scope="{ row }" slot="enable">
					<Tag type="dot" :color="Number(row.enable) ? 'success' : 'error'">{{Number(row.enable) ? '启用' : '关闭'}}</Tag>
        </template>
        <template slot-scope="{ row }" slot="handle">
          <span v-show="row.handle.edit" @click="editItem(row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.remove"/>
          <span v-show="row.handle.remove" @click="removeStatus(row)"><a>移除</a></span>
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
    <!--导入组件-->
    <!-- <BatchImport ref="batchImport" @on-success="onImportSuccess" :upLoadPayLoad="upLoadPayLoad"></BatchImport> -->
  </div>
</template>
<script>

import SearchForm from './search-form';
import listMixin from './list-mixin.js';
import PageHelper from '@/libs/page-helper.js';
// import BatchImport from '@/views/my-components/batch-import/batch-import';

export default {
  components: {
    SearchForm,
    // BatchImport
  },
  data () {
    return {
      canCreate: {},
      condition: {
        searchq: ''
      },
      upLoadPayLoad: {}
    }
  },
  mixins: [ PageHelper, listMixin],
  methods: {
    // clearOptions () {
    //   this.condition = {
    //     searchq: ''
    //   };
    //   this.$refs.search.clearOptions();
    // },
    onLoadData (page, extraData) {
      return this.$ajax.post(this.$api.BargainBuyList, {
				...this.condition,
				...extraData
			})
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
    // handleImport (row) {
    //   let params={
    //     id:row.id
    //   }
    //   this.upLoadPayLoad = params;
    //   let handle={
    //     upload:true,
    //     download:true
    //   }
    //   this.$refs.batchImport.openModal(handle,this.$api.phoneCallImport, this.$api.phoneCallTpl);
    // },
    // onImportSuccess(){
    //   this.loadData();
    // },
    removeStatus (row) {
			this.$Modal.confirm({
					title: '超值购活动',
					content: '确定要删除该活动吗，<span style="color:red;">数据将不可恢复，请谨慎操作！</span>点确定继续删除',
					okText: '确定',
					onOk: () => {
						return this.$ajax.post(this.$api.BargainBuyRemove, {
								id: row.id,
							}).then(response => {
								const res = response.data;
								if (res.code) {
									this.$Message.success(res.message);
									return this.loadData();
								}
							}).finally(()=>{
										this.$store.commit("setLoading", false);
							})
						// util.ajax.post(util.apiUrl.deleteDiscountBuyActivity,{id:row.id})
						// 	.then( (response)=>{
						// 		if (response.data.code==1) {
						// 			this.$Message.success('删除成功!');
						// 			this.$delete(this.data,index);
						// 		}else{
						// 			this.$Message.error(response.data.msg);
						// 		}
						// })
					}
			});
      // this.$store.commit("setLoading", true);
      // return this.$ajax.post(this.$api.BargainBuyRemove, {
      //     id: row.id,
      //   }).then(response => {
      //     const res = response.data;
      //     if (res.code) {
      //       this.$Message.success(res.message);
      //       return this.loadData();
      //     }
      //   }).finally(()=>{
      //         this.$store.commit("setLoading", false);
      //   })
    },
    addItem () {
      this.$router.push({
        name: 'discount-buy-form',
        query: {
          id:0
        }
      });
    },
    editItem (row) {
      this.$router.push({
        name: 'discount-buy-form',
        query: {
          id: row.id
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
.discount-buy-activity-list{
  .btn-group{
    text-align: right;
  }
}
</style>
