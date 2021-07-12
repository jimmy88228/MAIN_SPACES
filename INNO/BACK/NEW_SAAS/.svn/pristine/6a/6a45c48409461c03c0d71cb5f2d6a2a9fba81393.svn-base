<template>
  <div>
    <Modal
      class="brand-form"
      v-model="modalShow"
      :title="modalTitle"
      :loading="modalLoading"
      :mask-closable="maskClose"
      @on-ok="confirm">
        <div style="margin-bottom: 24px;">
          <label>微信模板</label>
          <i-switch size="large" v-model="is_enabled" true-value="1" false-value="0">
            <span slot="open">启用</span>
            <span slot="close">关闭</span>
          </i-switch>
        </div>
        <Card style="width:350px">
          <p slot="title">新任务提醒</p>
          <p>8月8日</p>
          <p>描述：报告昨日工作成果</p>
          <p>工作量：1天</p>
          <p>备注：具体描述清楚</p>
          <p>时限：下午下班前</p>
          <p>来自：王总</p>
          <div class="details" style="height: 60px; line-height: 60px; text-align: center; border: 1px dashed red; border-radius: 5px;cursor: pointer;">
            点击查看详情
          </div>
        </Card>
    </Modal>
  </div>
</template>
<script>
import Dialog from '@/libs/dialog';

export default {
  mixins: [Dialog],
  data () {
    return {
      is_enabled: '0'
    }
  },
  methods: {
    confirm () {
    },
    // 打开模态框
    setData (row) {

      return this;
    }
  }
}
</script>

