<template>
  <div>
    <Modal
      class="kan-form"
      v-model="modalShow"
      :title="modalTitle"
      :loading="modalLoading"
      :mask-closable="maskClose"
      @on-ok="confirm">
        <page-select :data="pageData" type="radio" @del-tag="handlePageClose">
          <Button type="dashed" @click="handlePageSelected" class="basic_select">选择活动页</Button>
        </page-select>
    </Modal>
  </div>
</template>
<script>
import Dialog from '@/libs/dialog';
import PageSelect from '@/views/my-components/list-component/index-edit';

export default {
  mixins: [Dialog],
  components: {
    PageSelect
  },
  data () {
    return {
      pageData: []
    }
  },
  methods: {
    handlePageSelected  () {
      this.$selectContent({
        mode: 'pages',
        type: 'radio',
        data: this.pageData,
        getList: (data) => {
          this.pageData = data;
        }
      })
    },
    handlePageClose (data) {
      this.pageData = data;
    },
    confirm () {
      if (this.pageData.length) {
          // ajax 保存数据，头像是通过字符串的形式上传的
          this.$ajax.post(this.$api.bargainActivitySet, {
            page_id: this.pageData.map(item => item.id).join()
	          })
		    		.then((response) => {
		    			var res = response.data;

		    			if (res.code) {
		    				// 保存成功
                this.$Message.success(res.message);
                this.modalShow = false;
	              } else {
		    				this.showLoading();
		    			}
		    		});
        } else {
          this.$Message.error('请选择内容！')
          // 验证失败，不关闭模态框
          this.showLoading();
        }
    },
    // 打开模态框
    setData (data) {
      this.pageData = data;
      return this;
    }
  }
}
</script>
