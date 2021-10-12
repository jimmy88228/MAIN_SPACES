<template>
  <div class="integral-coupons-list">
    <Card>
      <Row>
        <Col span="20">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="4" class="btn-group">
          <Button type="primary" icon="md-add" @click="createActivity" v-if="canCreate.add">创建活动</Button>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable" 
      @on-selection-change="getSelectCoupon" @on-select-all="handleSelectAll">
        <template slot-scope="{ row }" slot="name">
          <div class="img_list_wrap">
            <div class="img_fixed">
              <img :src="row.picture" v-if="row.picture" :alt="row.name" v-viewer/>
              <img src="@rs/images/default-img.jpg" :alt="row.name" v-viewer v-else></img>
            </div>
            <span class="name">{{row.name}}</span>
          </div>
        </template>
        <template slot-scope="{ row }" slot="start_time">
          <p>{{row.start_time | initDate}}</p>
          <p>{{row.start_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="end_time">
          <p>{{row.end_time | initDate}}</p>
          <p>{{row.end_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="enable">
          <Tag type="dot" :color="row.enable === '1' ? 'success' : 'error'">{{row.enable === '1'  ? '启用' : '关闭'}}</Tag>
        </template>
        <template slot-scope="{ row }" slot="handle">
          <span v-show="row.handle.edit" @click="editItem(row)"><a>编辑</a></span>
        </template>
      </Table>
      <div v-show="pageTotal" class="list_page list_page_fixed">
        <div class="btn_group"  v-if="canCreate.edit_status">
          <Checkbox v-model="isCheckAll" @on-change="handleCheck">当页全选</Checkbox>
          <ButtonGroup>
            <Button @click="handleBatchStatus(1)">批量启用</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button @click="handleBatchStatus(0)">批量关闭</Button>
          </ButtonGroup>
        </div>
        <div v-else></div>
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
        searchq: '',
        status: -1,
        start_time: '',
        end_time: ''
      },
      selectedCoupon: [],
      isCheckAll: false,
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.intergralCouponsList, params)
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
        name: 'integral-coupons-add'
      })
    },
    editItem (row) {
      this.$router.push({
        name: 'integral-coupons-edit',
        params: {
          id: row.id
        }
      })
    },
    handleCheck() {
				this.tableData.forEach((item, index) => {
					if ('_checked' in item) {
						item._checked = this.isCheckAll;
					} else {
						this.$set(this.tableData[index], '_checked', this.isCheckAll);
					}
				});
				this.selectedCoupon = [...this.tableData].filter(item => item._checked);
			},
    getSelectCoupon(selection) {
      this.selectedCoupon = selection;
      let allLen = this.tableData.length;
      this.isCheckAll = allLen > 0 && allLen === selection.length;
      const hasSelected = this.selectedCoupon.map(item => item.id);
      this.tableData.forEach((item, index) => {
        this.$set(this.tableData[index], '_checked', hasSelected.includes(item.id));
      });
    },
    handleSelectAll() {
      this.isCheckAll = true;
    },
    handleBatchStatus(val) {
				if (this.selectedCoupon.length === 0) {
					this.$Message.error('请勾选活动');
					return false;
				}
				this.spinShow = true;
				return this.$ajax.post(this.$api.intergralCouponsEditStatus, {
						ids: this.selectedCoupon.map(item => item.id),
            status: val
					})
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.$Message.success(res.message);
							this.loadData();
						}
            this.isCheckAll = false;
            this.selectedCoupon = [];
						this.spinShow = false;
					});
			},
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.integral-coupons-list{
  .btn-group{
    text-align: right;
  }
  .list_page_fixed {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
}
</style>
