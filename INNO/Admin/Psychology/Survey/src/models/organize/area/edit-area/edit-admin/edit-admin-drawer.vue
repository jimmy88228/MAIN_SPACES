<template>
<rewrite-drawer class="edit-admin-drawer" v-model="drawerShow" :width="418">
  <div class="bold" slot="header">{{title}}</div>
  <editMember ref="editMemberRef" :formData="adminInfo" type="edu_area"></editMember>
  <div slot="footer">
    <Button @click="drawerShow = false">取消</Button>
    <Button type="primary" @click="confirm">确定</Button>
  </div>
</rewrite-drawer>
  <!-- <Drawer class="page-drawer-area edit-admin-drawer" :transfer="true" :inner="false" :closable="false" v-model="drawerShow" :width="530">
    <div slot="header">
        <div class="edit-title bold">{{title}}</div>
      </div>
    <editMember ref="editMemberRef" :formData="adminInfo" type="edu_area"></editMember>
    <div style="margin-left: 100px;">
      <Button @click="drawerShow = false">取消</Button>
      <Button type="primary" @click="confirm">确定</Button>
    </div>
    <Spin fix v-if="pageLoading"></Spin>
  </Drawer> -->
</template>

<script>
import editMember from "@/models/system/member/edit-member/index";
export default {
  components: { editMember },
  props: {
    title: {
      type: String,
      default: ""
    },
    
  },
  data(){
    return {
      drawerShow: false,
      adminInfo: {
        admin_name: "",
        admin_type: "",
        admin_phone:""
      },
      areaId: 0
    }
  },
  methods:{
    showModal({ adminId, areaId }){
      this.drawerShow = true;
      this.adminInfo.admin_id = adminId || 0;
      this.areaId = areaId || 0;
      this.getRole();
    this.loadData(adminId);
    },
    getRole(){
        let _adminRoleData = this._adminRoleData || [];
        for(let i = 0; i < _adminRoleData.length; i++){
            let roleData = _adminRoleData[i] || {};
            let structure_type = roleData.structure_type || '';
            if(structure_type == "edu_area"){
                this.role_id = roleData.role_id || 0;
                break;
            }
        }
    },
    loadData(adminId){
      if(!Number(adminId)) {
        this.adminInfo = {
          admin_name: "",
          admin_type: "",
          admin_phone:""
        }
        return Promise.reject()
      };
      this.pageLoading = true
      return this.$MainApi.areaMaintAdminInfo({
        data: {
            admin_id: adminId
        },
        other: {
          isErrorMsg: true
        }
      })
      .then((res) => {
          if (res.code) {
              let data = res.data || {};
              this.adminInfo = data;
          }
      }).finally(()=>{
        this.pageLoading = false;
      })
    },
    confirm(){
      this.$refs["editMemberRef"].validate().then(()=>{
        this.updateMemberData();
      })
    },
    updateMemberData(){
      let adminInfo = this.adminInfo || {};
      !(Number(adminInfo.admin_id)) && delete adminInfo.admin_id;
      let req = Number(adminInfo.admin_id) ? 'areaMaintAdminUpdate' : 'areaMaintAdminAdd';
      this.pageLoading = true;
      return this.$MainApi[req]({
          data: {
            admin_id: adminInfo.admin_id,
            admin_name: adminInfo.admin_name,
            admin_phone: adminInfo.admin_phone,
            area_id: this.areaId,
            role_id: this.role_id
          },
      })
      .then((res) => {
          if (res.code) {
             this.$Message.success(res.message || "操作成功");
             this.drawerShow = false;
             this.$emit("confirm")
          } else {
            this.$Message.warning(res.message || "操作失败");
          }
      }).finally(()=>{
        this.pageLoading = false;
      })
    }
  }
}
</script>

<style lang="less">
.edit-admin-drawer{
  .ivu-drawer-mask{
    padding-top: 0px;
    top:0px;
    z-index: 1003;
  }
  .ivu-drawer-wrap{
    padding-top: 0px;
    top:0px;
    z-index: 1003;
    .edit-title{
      width: 100%;
      line-height: 40px;
      font-size: 18px;
      color: #171717;
    }
  }
}
</style>