<template>
  <div>
    <Modal
      class="applet-form"
      v-model="modalShow"
      :title="modalTitle"
      :loading="modalLoading"
      :mask-closable="false"
      @on-ok="confirm">
        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="120">
          <FormItem label="小程序版本" prop="appid">
            <Select v-model="formItem.appid">
              <Option v-for="item in applet" :key="item.appid" :value="item.appid">{{item.cfg_remark}}</Option>
            </Select>
          </FormItem>
        </Form>
    </Modal>
  </div>
</template>
<script>

export default {
  props: {
    applet: Array
  },
  data () {
    return {
      modalShow: false,
      modalTitle: '选择小程序版本',
      modalLoading: true,
      formItem: {
        appid: ''
      },
      ruleValidate: {
        appid: [{
          required: true,
          message: '请选择小程序版本',
          trigger: 'change'
        }]
      },
      goods_ids: []
    }
  },
  methods: {
    confirm () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          this.$ajax.post(this.$api.goodsCreateAppletCode, {
            goods_ids: this.goods_ids,
            appid: this.formItem.appid
	        })
          .then((response) => {
            var res = response.data;
            if (res.code) {
              this.$Message.success(res.message);
              this.modalShow = false;
              this.$emit('on-success');
              } else {
              this.modalShow = true;
              this.modalLoading = false;

              setTimeout(() => {
                this.modalLoading = true;
              }, 50);
            }
          });
        } else {
          this.modalShow = true;
          this.modalLoading = false;

          setTimeout(() => {
              this.modalLoading = true;
          }, 50);
        }
      });
    },
    // 打开模态框
    openModal (data) {
      this.modalShow = true;
      this.goods_ids = [data.goods_id];
    }
  }
}
</script>

<style lang="less" scoped>
.applet-form{

}
</style>
