<template>
  <div class="staff-service">
    <Card>
      <div slot="title" class="staff_title">
        <Button type="primary" @click="save">保存</Button>
      </div>
      <RadioGroup v-model="serviceType">
        <Radio label="1">
          <span>自定义回复</span>
        </Radio>
        <Radio label="2">
          <span>默认回复</span>
        </Radio>
        <Radio label="3">
          <span>不回复</span>
        </Radio>
      </RadioGroup>
      <div v-show="serviceType == 2" class="default_text">
        <p>成功绑定店铺: [xxxx]</p>
        <p>店员: [xxxx]</p>
      </div>
      <template v-if="serviceType == 1">
        <div><Input placeholder="请输入微信回复文字消息" v-model="content" class="basic_input"/></div>
      </template>
    </Card>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
export default {
  data () {
    return {
      serviceType: '1',
      content: '',
      spinShow: false
    }
  },
  methods: {
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.staffCodeList)
      .then(response => {
        const res = response.data;
        if (res.code) {
          const data = res.data.reply_message;
          this.serviceType = data && data.staff_type;
          this.content = data && data.staff_title;
        }
        this.spinShow = false;
      });
    },
    save () {
      if (this.serviceType === '1') {
        if (!this.content.trim()) {
          this.$Message.error('请填写回复的内容');
          return false;
        }
      }
      this.spinShow = true;
      return this.$ajax.post(this.$api.staffReply, {
        staff_type: this.serviceType,
        staff_title: this.content
      })
      .then((response) => {
        var res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
        }
        this.spinShow = false;
      });
    }
  }
}
</script>

<style lang="less" scoped>
.staff-service{
  .default_text{
    margin-top: 10px;
  }
  .staff_title{
    text-align: right;
  }
  .basic_input{
    width: 200px;
    margin-top: 10px;
  }
}
</style>
