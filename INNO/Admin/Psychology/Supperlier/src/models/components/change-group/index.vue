<template>
  <Modal v-model="isShowModal" title="切换分组" :width="300">
    <div class="m-b-10">{{tip}}: {{handleTitle}}</div>
    <data-select ref="groupSelectRef" :type="groupType" v-model="groupId" valueKey="group_id" nameKey="group_name"></data-select>
    <div slot="footer" class="text-c">
      <Button @click="isShowModal = false">取消</Button>
      <Button type="primary" @click="success">确定</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  props: {
    tip: String,
    isMultiple: {
      type: Boolean,
      default: false
    },
    groupType: {
      type: String,
      default: ""
    }
  },
  data(){
    return {
      isShowModal: false,
      groupId: 0,
      data: [],
    }
  },
  computed:{
    handleTitle(){
      let data = this.data;
      if(data instanceof Array){
        return "已选择"+ data.length + "个"
      } else {
        return data.title || ""
      }
    }
  },
  methods: {
    showModal({data}){
      this.isShowModal = true;
      this.data = data;
      this.groupId = data.group_id || 0;
      this.refesh();
    },
    success(){
      this.isShowModal = false;
      this.$emit("success", { data: this.data, group_id: this.groupId || 0 });
    },
    refesh(){
      this.$refs["groupSelectRef"] && this.$refs["groupSelectRef"].getData();
    }
  }
}
</script>

<style>

</style>