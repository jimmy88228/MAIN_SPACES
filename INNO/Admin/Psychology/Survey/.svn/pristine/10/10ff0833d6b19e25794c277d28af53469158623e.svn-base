<template>
  <custom-modal ref="modal" :width="750" :footerHide="true"  :isSlotHeader="true" :isSlotFooter="false" :closable="true">
    <div slot="header">
      3 标题标题标题标题标题标题标题标
    </div>
    <div>
      <rewrite-area >
        <rewrite-search placeholder="答案关键词搜索"/>
      </rewrite-area>
      <Table ref="myTable" :height="400" :columns="columns" :data="list" border :loading="tableLoading">
      </Table>
      <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
    </div>
  </custom-modal>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import mixins from "./mixins";
export default {
  components: {  },
  mixins: [ ListMixin, mixins ],
  data(){
    return {}
  },
  methods:{
    showModal(){
      this.$refs["modal"] && this.$refs["modal"].show();
    },
    dismiss(){
      this.$refs["modal"] && this.$refs["modal"].dismiss();
    }
  }
}
</script>

<style>

</style>