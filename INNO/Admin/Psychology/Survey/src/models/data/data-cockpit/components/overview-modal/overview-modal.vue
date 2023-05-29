<template>
  <div class="overview-modal-area">
    <custom-modal 
    ref="modal" 
    class="overview-modal" 
    :transfer="false"
    :footerHide="true" 
    width="96%"
    :closable="true"
    closeMode="light"
    >
      <actOverView ref="actOverViewRef" :isModal="true"></actOverView>
    </custom-modal>
  </div>
</template>

<script>
import actOverView from "@/models/survey/activity/assess/overview/index.vue";
export default {
  components: { actOverView },
  data(){
    return {}
  },
  methods:{
    dismiss() {
      this.$refs.modal.dismiss();
    },
    showModal(detail) {
      let actOverViewRef = this.$refs["actOverViewRef"];
      if(actOverViewRef){
          actOverViewRef.pageQuery.activityId = detail.id;
          actOverViewRef.pageQuery.type = "task";
          actOverViewRef.pageQuery.theme = "dataCockpit";
          actOverViewRef.pageQuery.schoolId = this._getReqStructureId;
          actOverViewRef.init();
      }
      this.$refs.modal.show();
    },
  }
}
</script>

<style lang="less">
.overview-modal{
  .ivu-modal-body{
    background-color:#06002A;
  }
}
</style>