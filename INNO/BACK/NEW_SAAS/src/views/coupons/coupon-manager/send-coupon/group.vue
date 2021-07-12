<template>
  <div class="group">
    <p>注意：24小时内，同一类型的优惠券，同一个会员只会发放一次。</p>
    <Form ref="formItem" :model="formItem" :label-width="160">
      <FormItem label="发放备注">
        <Input
          class="basic_input"
          v-model="formItem.note"
          placeholder="请输入发放备注"
          clearable/>
      </FormItem>

      <FormItem label="发放数量">
        <Input
          class="basic_input"
          v-model="formItem.send_num"
          placeholder="只可输入1到10的数字"
          clearable/>
        <span style="color: red;">*范围1-10，预生成的券请检查数量是否充足; 同一会员会重复收到N张券，N条推送消息；请谨慎使用！</span>
      </FormItem>
      <FormItem label="按用户分组发放">
        <Select v-model="formItem.group" class="basic_select" transfer>
          <Option :value="-1">选择分组</Option>
          <Option v-for="(item, key) in user_group_list" :value="item.id" :key="key">{{item.group_name}}</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSend">发放优惠券</Button>
      </FormItem>
    </Form>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
export default {
  props: ['id'],
  data () {
    return {
      formItem: {
        note: '',
        send_num: '1',
        group: -1
      },
      user_group_list: [],
      spinShow: false
    }
  },
  methods: {
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.couponsSendInfo, {
        type_id: this.id,
        show_type: 2
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.user_group_list = res.data && res.data.user_group_list;
        }
        this.spinShow = false;
      });
    },
    handleSend () {
      var sendNum = Number(this.formItem.send_num);
      if (sendNum > 10 || sendNum < 1) {
        this.$Message.error('发放数量值为1到10之间！');
        return false;
      }
      if (this.formItem.group === -1) {
        this.$Message.error('按用户分组发放');
        return false;
      }
      this.spinShow = true;
      return this.$ajax.post(this.$api.couponsSend, {
        type_id: this.id,
        show_type: 2,
        message: this.formItem.note,
        user_group_id: this.formItem.group,
        send_num: sendNum
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
        }
        this.spinShow = false;
      });
    }
  }
}
</script>
