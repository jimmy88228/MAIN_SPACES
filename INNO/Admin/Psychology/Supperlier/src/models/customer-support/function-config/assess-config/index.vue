<template>
    <hold-layout :isFull="true" class="assess-config-layout">
      <searchForm :isLimit="isLimit" :limitLoading="limitLoading" :searchForm="searchForm" @add="addCount()" @setLimit="setLimit()"></searchForm>
      <Table ref="myTable" class="full-table" :columns="columns" :data="list" border :loading="tableLoading">
        
        <template slot="has_count" slot-scope="{ row }">
          {{ Number(row.total_count) - Number(row.used_count) }}
        </template>
        <template slot="time" slot-scope="{ row }">
          {{row.begin_date_str + '-' + row.end_date_str}}
        </template>
        <template slot="handle" slot-scope="{ row }">
          <div class="operate-area">
            <a class="operate" v-hasAction="true" @click="checkCount(row)">编辑</a>
          </div>
        </template>
      </Table>
      <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
      <!--开启关闭次数-->
      <limitModal ref="limitModalRef" :isLimit="isLimit" :limitLoading="limitLoading" @confirm="setLimitReq"></limitModal>
      <!--新增次数-->
      <editCount ref="editCountRef" @confirm="handleUpdate"></editCount>
      <!--查看次数详情-->
      <checkCount ref="checkCountRef" title="测评活动" @confirm="handleUpdate"></checkCount>
    </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import searchForm from "./search-form";
import mixins from "./mixins";
import limitModal from "./components/limit-modal/index.vue";
import editCount from "./components/edit-count/index.vue";
import checkCount from "./components/check-count/index.vue";
import dateUtil from "@/helper/utils/date-util.js";

export default {
  name: "assessConfigIndex",
  mixins: [ListMixin, mixins],
  components: { searchForm, limitModal, editCount, checkCount },
  data() {
    return {
      searchForm: {
        customer_id: "" , //单主体下的所有组织 
      },
      isLimit: true,
      limitLoading: false
    };
  },
  methods: {
    init(){
      this.getConfig();
      this.loadData();
    },
    getConfig(){
      let customer_id = this.pageQuery.customer_id || 0;
      if(!Number(customer_id)) return;
      return this.$MainApi
        .getEvaluateConfig({
          data: {
            customer_id: customer_id
          },
        })
        .then((res) => {
          let data = res.data;
          let items = data.items || {};
          if(customer_id == items.customer_id && items.customer_id){
              this.isLimit = items.is_limit_count ? true : false;
            }
        });
    },
    onLoadData(page, extraData) {
      let customer_id = this.pageQuery.customer_id || 0;
      let target_id = this.pageQuery.target_id || '';
      if(!Number(customer_id) || !target_id) return;
      return this.$MainApi
        .getConsultantEvaluateOrderList({
          data: {
            customer_id: customer_id,
            target_id: target_id,
            ...extraData,
          },
          other: {
            isErrorMsg: true
          }
        })
        .then((res) => {
          if (res.code) {
            let data = res.data || {};
            let items = data.items || [];
            for(let i = 0; i < items.length; i++){
              items[i].update_time_str = dateUtil.formatStr(items[i].update_time, "yyyy.MM.dd HH:mm");
              items[i].begin_date_str = dateUtil.formatStr(items[i].begin_date, "yyyy.MM.dd");
              items[i].end_date_str = dateUtil.formatStr(items[i].end_date, "yyyy.MM.dd");
            }
            this.data = {
              total: data.total,
              list: items,
            };
          }
        });
    },
    setLimit(){
      this.$refs["limitModalRef"] && this.$refs["limitModalRef"].showModal();
    },
    setLimitReq(){
      this.limitLoading = true;
      let customer_id = this.pageQuery.customer_id || 0;
      if(!Number(customer_id)) return;
      return this.$MainApi
        .consultantEvaluateOrderConfig({
          data: {
            customer_id: customer_id,
            is_limit_count: this.isLimit ? 0 : 1,
          },
        })
        .then((res) => {
          if (res.code) {
            this.$Message.warning(res.message || "设置成功");
            return this.getConfig();
          } else {
            this.$Message.warning(res.message || "设置失败");
          }
          
        }).finally(()=>{
          this.limitLoading = false
        })
    },
    checkCount(row){
      this.$refs["checkCountRef"] && this.$refs["checkCountRef"].showDrawer(row);
    },
    addCount(){
      this.$refs["editCountRef"] && this.$refs["editCountRef"].showModal({customer_id: Number(this.pageQuery.customer_id)});
    }
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.assess-config-layout{
  position: relative;
}
</style>
<style lang="less">
</style>