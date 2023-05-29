<template>
  <custom-modal ref="modal" :isSlotHeader="true" :isSlotFooter="true" :width="430">
    <div slot="header">
      学生迁移
    </div>
    <div>
      <rewrite-choose :data="migrateType" v-model="migrateInfo.migrateType" @on-change="changeMigrateType"></rewrite-choose>
      <div class="export-operate">
        <template v-if="migrateInfo.migrateType == 1">
          从“三年7班”迁移至 
        </template>
        <template v-else-if="migrateInfo.migrateType == 2">
          
        </template>
        <template v-else-if="migrateInfo.migrateType == 3">
          迁出状态默认标记为“已转校”
        </template>
      </div>
    </div>
    <div slot="footer">
      <Button type="default" @click="dismiss">取消</Button>
      <Button type="primary" @click="confirm">确定</Button>
    </div>
  </custom-modal>
</template>

<script>
export default {
  data(){
    return {
      migrateType: [
        {
          key: 1,
          name: "按班级迁移"
        },
        {
          key: 2,
          name: "按年级迁移"
        },
        {
          key: 3,
          name: "迁移出校"
        }
      ],
      migrateInfo: {
        migrateType: 1
      },
      studentInfo: {}
    }
  },
  methods: {
    showModal(detail = { }){
      let studentInfo = detail.studentInfo || {};
      this.$refs["modal"] && this.$refs["modal"].show();
    },
    dismiss(){
      this.$refs["modal"] && this.$refs["modal"].dismiss();
    },
    changeMigrateType(){

    },
    confirm(){

    }
  }
}
</script>

<style lang="less" scoped>
.export-operate{
  padding: 20px 0px;
}
</style>