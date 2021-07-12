<template>
  <div>
    <Modal
      class="brand-form"
      v-model="modalShow"
      :title="modalTitle"
      :loading="modalLoading"
      :mask-closable="maskClose"
      @on-ok="confirm">
        <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd"/>
    </Modal>
    <!--异步处理导出excel组件-->
    <div class="col">
      <notice :ref="'notice' + item" @finish="modalShow=false" v-for="item in jobIdCol" :key="item"></notice>
    </div>
  </div>
</template>
<script>
import Dialog from '@/libs/dialog';
import DateSelect from '@/views/my-components/date-select/index.vue';
import notice from '@/views/my-components/mq-notice/mq-notice';

export default {
  mixins: [Dialog],
  components: {
    DateSelect,
    notice
  },
  data () {
    return {
      modalTitle: '选择时间',
      start_time: '',
      end_time: '',
      jobIdCol: [],
      activity_id: 0
    }
  },
  methods: {
    handleStart (date) {
      this.start_time = date;
    },
    handleEnd (date) {
      this.end_time = date;
    },
    handleExport () {
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定导出数据么',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					return this.$ajax.post(this.$api.MatrixLotteryLogDistributionExport, {
            activity_id: this.activity_id,
            start_time: this.start_time,
            end_time: this.end_time,
          }).then((response) => {
							var res = response.data;
							if (res.code) {
								var jobId = res.data;
								// 打开异步提示组件
								this.jobIdCol.push(jobId);
								this.$nextTick(() => {
									this.$refs[`notice${jobId}`][0].showNotice(jobId);
								});
                this.$Message.success(res.message);
                // 保存成功
                this.modalShow = false;
							} else {
								this.$Message.error(res.message);
							}
					});
				}
			});
    },
    confirm () {
      if (this.start_time && this.end_time) {

        this.handleExport();
      } else {
        this.$Message.error('请选择时间');
        this.showLoading();
      }
    },
    // 打开模态框
    setData (row) {
      this.activity_id = row.activity_id;
      return this;
    }
  }
}
</script>
