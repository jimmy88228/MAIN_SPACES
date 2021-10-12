<template>
  <div>
    <Modal
      class="red-envelopes-form"
      v-model="modalShow"
      :title="modalTitle"
      :loading="modalLoading"
      :mask-closable="maskClose"
      @on-ok="confirm">
        <Form ref="formValidate" :model="formItem"  :rules="ruleValidate" :label-width="120">
          <FormItem label="红包规则" prop="selectedArticleId">
            <Select v-model="formItem.selectedArticleId" style="width:200px;">
              <Option v-for="(item, key) in formItem.act_rule" :key="key" :value="item.id">{{ item.article_title }}</Option>
            </Select>
          </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import Dialog from '@/libs/dialog';

export default {
  mixins: [Dialog],
  data () {
    return {
      formItem: {
        selectedArticleId: 0,
        act_rule: []
      },
      // 表单数据规则
      ruleValidate: {
      }
    }
  },
  methods: {
    confirm () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          this.$ajax.post( this.$api.redPacketRuleEdit , {
            id: this.formItem.selectedArticleId
	        })
            .then((response) => {
                var res = response.data;
                if (res.code) {
                    // 保存成功
                  this.$Message.success(res.message);
                  this.modalShow = false;
                  this.$emit('on-success', {
                    type: 'add',
                    data: res.data
                  });
                } else {
                    this.showLoading();
                }
            })
        } else {
          // 验证失败，不关闭模态框
          this.showLoading();
        }
      })
    },
    // 打开模态框
    setData (selectedArticleId) {
      // 重置表单
      this.$refs.formValidate.resetFields();
      // 这里是因为v-if进行控制,Form渲染时候并没有把这些字段添加到组件内的已选数组，导致resetFields不起作用，只能手动进行初始化
        this.formItem.selectedArticleId = Number(selectedArticleId);
        this.modalTitle = '设置红包规则';
        //AgreementArticle
        this.$ajax.post(this.$api.redAgreementArticle, {
        })
        .then((response) => {
            var res = response.data;
            if (res.code) {
                this.formItem.act_rule = res.data;
            } else {
                this.showLoading();
            }
        });
      return this;
    }
  }
}
</script>
