<template>
  <div>
    <Modal v-model="modalShow" :width="1100" class="hide-close school-bind-admin-modal" @on-visible-change="confirmBindAdmin">
      <searchForm :searchForm="searchForm" @search="loadData" @addAdmin="addAdmin"></searchForm>
      <Table ref="myTable" :columns="columns" height="500" :data="list" border :loading="tableLoading">
      <template slot="structure_name" slot-scope="{ row, index }">
          <span v-for="(_item, _index) in row.get_sa" :key="_index">
              {{_item.get_name && _item.get_name.structure_name}}
              <template v-if="row.get_sa.length > (_index + 1)">,</template>
          </span>
      </template>
      <template slot="state" slot-scope="{ row, index }">
        <i-switch v-model="row.admin_state" :before-change="()=>{return beforeChangeState(index, row)}" :true-value="1" :false-value="0" size="large" :loading="row.stateLoading" v-hasAction="'school_maintenance_adminstate'">
          <span slot="open">正常</span>
          <span slot="close">关闭</span>
        </i-switch>
      </template>
      <template slot="handle" slot-scope="{ row, index }">
          <div class="operate-area">
            <a class="operate" @click="editAdmin(row.admin_id)" v-hasAction="'school_maintenance_adminupdate'">编辑</a>
            <Poptip
                confirm
                title="确定删除该管理员？"
                placement="left"
                @on-ok="removeItem(row.admin_id, index)" v-hasAction="'school_maintenance_adminremove'">
                <a class="operate">删除</a>
            </Poptip>
            <a class="operate" @click="resetPAW(row.admin_id)" v-hasAction="'school_maintenance_adminrest'">重置密码</a>
          </div>
      </template>
      </Table>
      <rewrite-page
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
      <div slot="footer">
        <!-- <Button @click="modalShow = false">取消</Button> -->
        <Button type="primary" @click="modalShow = false">确定</Button>
      </div>
    </Modal>
    <editAdmin ref="editAdminRef" :title="editTitle" @confirm="updateAdmin"></editAdmin>
  </div>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import searchForm from "./search-form.vue";
import editAdmin from "../edit-admin/edit-admin-drawer.vue";
import mixins from "./mixins";
export default {
  mixins: [ListMixin, mixins],
  components: {
    searchForm,
    editAdmin
  },
  data(){
    return {
      modalShow: false,
      searchForm: {
        school_id: 0,
        searchq: "",
        state: -1
      },
      editTitle: "",
      confirmCallback: null
    }
  },
  methods:{
    showModal({ schoolId, confirm }){
      this.modalShow = true;
      this.searchForm.school_id = Number(schoolId) || 0;
      this.confirmCallback = confirm;
      this.loadData();
    },
    onLoadData(page, extraData) {
      return this.$MainApi.schoolMaintBindAdmin({
        data: {
            ...this.searchForm,
            ...extraData,
        },
        other:{
          isErrorMsg: true
        }
      })
      .then((res) => {
          if (res.code) {
              let data = res.data || {};
              let items = data.items || [];
              for(let i = 0; i < items.length; i++){
                items[i].stateLoading = false;
              }
              this.data = {
                  total: data.total,
                  list: items,
              };
          }
      });
    },
    beforeChangeState(index, row){
      let adminId = row.admin_id || 0;
      let admin_state = row.admin_state || 0;
      let set_admin_state = admin_state == 1 ? 0 : 1;
      this.$set(row, 'stateLoading', true);
      return new Promise((rs, rj)=>{
        this.setAdminState(adminId, set_admin_state).then(()=>{
          this.$set(row, 'stateLoading', false);
          return rs();
        }).catch(()=>{
          this.$set(row, 'stateLoading', false);
          return rj();
        })
        // .finally(()=>{
        //   this.$nextTick(()=>{
        //     this.$set(this.data.list[index], 'admin_state', set_admin_state);
        //   })
        // })
      })
    },
    updateAdmin(){
      this.handleUpdate();
    },
    addAdmin(){
      this.editTitle = "添加人员";
      let schoolId = this.searchForm.school_id;
      this.$refs["editAdminRef"] && this.$refs["editAdminRef"].showModal({ schoolId });
    },
    editAdmin(adminId){
      this.editTitle = "编辑人员";
      this.$refs["editAdminRef"] && this.$refs["editAdminRef"].showModal({adminId});
    },
    removeItem(adminId, index){
      if(!adminId) {
        this.$Message.warning("无效人员id");
        return Promise.reject();
      }
      return this.$MainApi.schoolMaintAdminRemove({
        data: {
            admin_id: adminId
        },
      })
      .then((res) => {
          if (res.code) {
            this.delItem(index);
            this.$Message.success(res.message || '删除成功');
          } else {
            this.$Message.warning(res.message || '删除失败');
          }
      });
    },
    resetPAW(adminId){
      if(!adminId) {
        this.$Message.warning("无效人员id");
        return Promise.reject();
      }
      return this.$MainApi.schoolMaintAdminRest({
        data: {
            admin_id: adminId,
        },
      })
      .then((res) => {
          if (res.code) {
            this.$Message.success(res.message || '重置成功');
            return Promise.resolve();
          } else {
            this.$Message.warning(res.message || '重置失败');
            return Promise.reject();
          }
      });
    },
    setAdminState(adminId, adminState){
      if(!adminId) {
        this.$Message.warning("无效人员id");
        return Promise.reject();
      }
      return this.$MainApi.schoolMaintAdminState({
        data: {
            admin_id: adminId,
            admin_state: adminState
        },
      })
      .then((res) => {
          if (res.code) {
            this.$Message.success(res.message || '修改成功');
            return Promise.resolve();
          } else {
            this.$Message.warning(res.message || '修改失败');
            return Promise.reject();
          }
      });
    },
    confirmBindAdmin(state){
      // 由于添加人员数据即表示默认开启绑定改人员，SO 关闭时直接刷新列表数据
      if(typeof(state) == 'boolean' && !state){
        let list = this.data.list || [];
        let bindAdmins = list.filter((item)=>{
          return item.admin_state == 1;
        })
        this.modalShow = false;
        typeof(this.confirmCallback) == 'function' && this.confirmCallback(bindAdmins);
      }
    },
  }
}
</script>

<style lang="less">
.school-bind-admin-modal{
  .ivu-modal-mask{
    z-index: 1002 !important;
  }
  .ivu-modal-wrap{
    z-index: 1002 !important;
  }
}
</style>