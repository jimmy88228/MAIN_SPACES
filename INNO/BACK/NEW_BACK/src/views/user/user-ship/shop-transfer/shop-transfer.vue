<template>
  <div class="shop-transfer">
    <Card>
      <Alert show-icon>
        什么是会员本店转移？
        <Icon type="ios-bulb-outline" slot="icon"></Icon>
        <template slot="desc">在添加会员或者会员管理中，如果需要对导购的会员进行变更，那么你可以通过此功能，正确管理你的会员。</template>
      </Alert>
      <div class="search">
        <Form inline>
          <FormItem label="所属店铺" :label-width="80">
            <store-select :data="storeData" type="radio" @del-tag="handleStoreTag">
              <Button type="dashed" @click="handleStoreSelect">选择所属店铺</Button>
            </store-select>
          </FormItem>
          <FormItem label="从导购" :label-width="60">
            <staff-select :data="fromStaffData" type="radio" @del-tag="handleFromStaffTag">
              <Button type="dashed" @click="handleFromStaffSelect" :disabled="!storeId">选择转移导购</Button>
            </staff-select>
          </FormItem>
          <FormItem :label-width="0">
            <Divider type="vertical" />
            <span>转移至</span>
            <Divider type="vertical" />
          </FormItem>
          <FormItem label="目标导购" :label-width="80">
            <staff-select :data="toStaffData" type="radio" @del-tag="handleToStaffTag">
              <Button type="dashed" @click="handleToStaffSelect" :disabled="!storeId">选择转移导购</Button>
            </staff-select>
          </FormItem>
        </Form>
      </div>
      <div class="tranfer_wrapper">
        <Transfer
          :titles="titles"
          :list-style="transferStyle"
          :data="data"
          :target-keys="targetKeys"
          :render-format="render"
          @on-change="handleChange"></Transfer>
          <div v-show="pageFromTotal" class="list_page left">
            <Page
              :total="pageFromTotal"
              :page-size="pageSize"
              :current="currentFromPage"
              :page-size-opts="pageSizeOpts"
              @on-change="changeFromPage"
              @on-page-size-change="handleFromPageSize"
              show-elevator
              show-total
              show-sizer></Page>
          </div>
          <div v-show="pageToTotal" class="list_page left">
            <Page
              :total="pageToTotal"
              :page-size="pageSize"
              :current="currentToPage"
              :page-size-opts="pageSizeOpts"
              @on-change="changeToPage"
              @on-page-size-change="handleToPageSize"
              show-elevator
              show-total
              show-sizer></Page>
          </div>
      </div>
    </Card>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import StoreSelect from '@/views/my-components/list-component/index-edit';
import StaffSelect from '@/views/my-components/list-component/index-edit';
import Conf from '@/config/index.js';

export default {
  data () {
    return {
      storeData: [],
      fromStaffData: [],
      toStaffData: [],
      // 所属导购的店员
      fromMemberData: [],
      toMemberData: [],
      currentType: 'from',
      storeId: 0,
      fromStaffId: 0,
      toStaffId: 0,
      condition: {
        staff_id: 0,
        common_store: 0,
        searchq: ''
      },
      // transfer
      titles: ['会员编号/会员昵称/所属导购', '会员编号/会员昵称/所属导购'],
      transferStyle: {
        width: '40%',
        height: '400px'
      },
      data: [],
      targetKeys: [],
      pageFromTotal: 0,
      pageSize: Conf.PAGE_SIZE_DEF,
      currentFromPage: Conf.PAGE_START,
      pageSizeOpts: Conf.PAGE_SIZE_OPTS,
      pageToTotal: 0,
      currentToPage: Conf.PAGE_START,

      spinShow: false
    }
  },
  components: {
    StoreSelect,
    StaffSelect
  },
  methods: {
    render (row) {
      return `
        <div style="display: inline-flex;align-items: center;justify-content: space-between;width: 90%;">
          <span>${row.user_name ? row.user_name: '--'}</span>
          <span>${row.real_name ? row.real_name : '--'}</span>
          <span>${row.store_code ? row.store_code : '--'}</span>
        </div>
      `;
    },
    loadData () {
      this.spinShow = true;
      let params = Object.assign({}, {
        page: this.currentType === 'from' ? this.currentFromPage : this.currentToPage,
        pageSize: this.pageSize
      }, this.condition);
      return this.$ajax.post(this.$api.memberUnbindList, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          if (this.currentType === 'from') {
            this.fromMemberData = res.data.items;
          } else {
            this.toMemberData = res.data.items;
          }
          if (this.currentType === 'from') {
            this.pageFromTotal = res.data.total;
          } else {
            this.pageToTotal = res.data.total;
          }
          // 合并为源数据
          this.mergeData();
          this.spinShow = false;
        }
      });
    },
    mergeData () {
      const merge = [...this.fromMemberData, ...this.toMemberData];
      this.data = merge.map(item => {
        return {
          key: item.user_id,
          label: '',
          ...item
        }
      });
      // 目标转移
      this.targetKeys = this.toMemberData.map(item => item.user_id);
    },
    handleChange (targetKeys, direction, moveKeys) {
      if (!this.toStaffId) {
        this.$Message.error('请选择转移导购');
        return false;
      }
      this.targetKeys = targetKeys;
      if (direction === 'left') {
        // 转移到左边
        const filterData = this.data.filter(item => !this.targetKeys.includes(item.user_id)).map(item => item.user_id);
        this.handleTransfer(this.fromStaffId, filterData);
      } else {
        // 转移到右边
        this.handleTransfer(this.toStaffId, this.targetKeys);
      }
    },
    handleTransfer (targetId, userCol) {
      this.spinShow = true;
      return this.$ajax.post(this.$api.memberTransfer, {
        shift_staff_id: targetId,
        shift_user_id: userCol
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
        }
        this.spinShow = false;
      });
    },
    changeFromPage (page) {
      this.condition.staff_id = this.fromStaffId;
      this.currentType = 'from';
      this.currentFromPage = page;
      this.loadData();
    },
    handleFromPageSize (pageSize) {
      this.condition.staff_id = this.fromStaffId;
      this.currentType = 'from';
      this.pageSize = pageSize;
      this.loadData();
    },
    changeToPage (page) {
      this.condition.staff_id = this.toStaffId;
      this.currentType = 'to';
      this.currentToPage = page;
      this.loadData();
    },
    handleToPageSize (pageSize) {
      this.condition.staff_id = this.toStaffId;
      this.currentType = 'to';
      this.pageSize = pageSize;
      this.loadData();
    },
    handleStoreTag (data) {
      this.storeData = data;
      if (this.storeData.length === 0) {
        this.storeId = 0;

        this.fromStaffData = [];
        this.fromStaffId = 0;

        this.toStaffData = [];
        this.toStaffId = 0;
      }
    },
    handleStoreSelect () {
      this.$selectContent({
        mode: 'store',
        type: 'radio',
        data: this.storeData,
        getList: (data) => {
          this.storeData = data;
          this.storeId = this.storeData[0].id;
        }
      });
    },
    handleFromStaffTag (data) {
      this.fromStaffData = data;
      this.fromStaffId = 0;
    },
    handleFromStaffSelect () {
      this.$selectContent({
        mode: 'staff',
        type: 'radio',
        data: this.fromStaffData,
        extraAddtion: {
          store_id: this.storeId
        },
        getList: (data) => {
          if (data[0].id === this.toStaffId) {
            this.$Message.error('转移的导购一致,操作失败!');
            return false;
          }
          this.fromStaffData = data;
          this.fromStaffId = this.fromStaffData[0].id;
        }
      });
    },
    handleToStaffTag (data) {
      this.toStaffData = data;
      this.toStaffId = 0;
    },
    handleToStaffSelect () {
      this.$selectContent({
        mode: 'staff',
        type: 'radio',
        data: this.toStaffData,
        extraAddtion: {
          store_id: this.storeId
        },
        getList: (data) => {
          if (data[0].id === this.fromStaffId) {
            this.$Message.error('转移的导购一致,操作失败!');
            return false;
          }
          this.toStaffData = data;
          this.toStaffId = this.toStaffData[0].id;
        }
      });
    }
  },
  watch: {
    fromStaffId(nV) {
      if (!nV) return false;
      this.condition.staff_id = nV;
      this.currentType = 'from';
      this.loadData();
    },
    toStaffId(nV) {
      if (!nV) return false;
      this.condition.staff_id = nV;
      this.currentType = 'to';
      this.loadData();
    }
  }
}
</script>

<style lang="less" scoped>
.shop-transfer{
  .list_page{
    display: inline-block;
    width: 44%;
    margin-left: 0;
  }
}
</style>
