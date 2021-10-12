<template>
  <div>
    <Modal
      class="brand-form"
      v-model="modalShow"
      :title="modalTitle"
      :loading="modalLoading"
      :mask-closable="maskClose"
      :width="1200"
      @on-ok="confirm">
        <detail-info :user-id="userId" :id="id" ref="detailInfo"></detail-info>
    </Modal>
  </div>
</template>
<script>
import Dialog from '@/libs/dialog';
import DetailInfo from '../detail-info/detail-info';

export default {
  mixins: [Dialog],
  components: {
    DetailInfo
  },
  data () {
    return {
      userId: 0,
      id: 0
    }
  },
  methods: {
    confirm () {

    },
    // 打开模态框
    setData (row, id) {
      this.userId = row.userId;
      this.id = id;
      this.$nextTick(() => {
        this.$refs.detailInfo.loadData();
      });
      return this;
    }
  }
}
</script>
