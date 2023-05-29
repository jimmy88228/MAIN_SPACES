<template>
  <Modal v-model="isShowModal" :title="title" :width="300">
    <data-select v-model="groupId"></data-select>
    <div slot="footer" class="text-c">
      <Button @click="isShowModal = false">取消</Button>
      <Button type="primary" @click="success">确定</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  props: {
    title: {
      type: "",
      default: "切换分组"
    },
    isMultiple: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      isShowModal: false,
      groupId: 0
    }
  },
  methods: {
    showModal(){
      this.isShowModal = true;
    },
    success(){
      this.isShowModal = false;
      this.$emit("success");
    }
  }
}
</script>

<style>

</style>