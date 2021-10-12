<template>
  <div>
    <Modal
      class="tree-show"
      v-model="modalShow"
      :title="modalTitle"
      :loading="modalLoading"
      :mask-closable="maskClose"
      :footer-hide="hideFooter"
      class-name="modal_height"
      @on-ok="confirm">
        <Tree :data="treeData" multiple show-checkbox @on-check-change="handleCheck"></Tree>
    </Modal>
  </div>
</template>
<script>
import Dialog from '@/libs/dialog';

export default {
  mixins: [Dialog],
  data () {
    return {
      modalTitle: '',
      treeData: [],
      // 选中的分类节点
      idCol: [],
      hideFooter: false
    }
  },
  methods: {
    confirm () {
      if (this.idCol.length) {
        this.modalShow = false;
        this.$emit('get-data', this.idCol);
      } else {
        this.$Message.error('请选择分类内容!');
        this.showLoading();
      }
    },
    // 打开模态框
    setData (data, title, isEdit) {
      this.treeData = data;
      this.modalTitle = title;
      this.hideFooter = isEdit;
      return this;
    },
    handleCheck (value) {
      this.idCol = value.map(item => item.value);
    }
  }
}
</script>
<style lang="less">
.modal_height .ivu-modal-body{
  max-height: 500px;
  overflow-y: scroll;
}
</style>
