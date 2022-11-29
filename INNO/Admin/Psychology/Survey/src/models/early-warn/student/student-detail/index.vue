<template>
  <hold-layout :isFull="true">
    <rewrite-area class="flex">
      <div>
        <Button @click="editClass()">创建班级</Button>
        <Button>批量创建</Button>
      </div>
    </rewrite-area>
    <Table ref="myTable" class="full-table" :columns="columns" :data="list" border>
      <template slot="handle" slot-scope="{ row }">
          <div class="operate-area">
            <a class="operate" @click="editClass(row.id)">编辑</a>
            <a class="operate" @click="removeClass(row.id)">删除</a>
          </div>
      </template>
      
    </Table>
    <rewrite-page
      slot="footer"
      :total="total"
      :current="page"
      :page-size="pageSize"
      :page-size-opts="pageSizeOpts"
      @on-change="e=>loadData(e)"
      @on-page-size-change="handlePageSizeChange"
      show-sizer
      show-elevator
      show-total
      transfer
      ></rewrite-page>
  </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import mixins from "./mixins";
export default {
  name: "classMaint",
  components: {
  },
  mixins: [ListMixin, mixins],
  data(){
    return {
      editClassTitle: ""
    }
  },
  methods:{
    editClass(id){
      this.editClassTitle = id ? "编辑班级" : "创建班级"
      this.$refs["editClassRef"].showDrawer(id);
    },
    removeClass(){

    }
  }
}
</script>

<style>

</style>