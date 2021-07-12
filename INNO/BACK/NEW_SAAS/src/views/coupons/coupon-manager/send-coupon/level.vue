<template>
  <div class="level">
    <p>注意：24小时内，同一类型的优惠券，同一个会员只会发放一次。</p>
    <Form ref="formItem" :model="formItem" :label-width="160">
      <FormItem label="发放备注">
        <Input
          class="basic_input"
          v-model="formItem.note"
          placeholder="请输入发放备注"
          clearable/>
      </FormItem>
      <FormItem label="按用户等级发放优惠券">
        <Select v-model="formItem.level" class="basic_select" transfer>
          <Option :value="-1">选择会员等级</Option>
          <Option v-for="(item, key) in rank_list" :value="key" :key="key">{{item}}</Option>
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
        level: -1
      },
      rank_list: [],
      spinShow: false
    }
  },
  methods: {
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.couponsSendInfo, {
        type_id: this.id,
        show_type: 1
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.rank_list = res.data && res.data.rank_list;
        }
        this.spinShow = false;
      });
    },
    handleSend () {
      if (this.formItem.level === -1) {
        this.$Message.error('请选择会员等级');
        return false;
      }
      this.spinShow = true;
      return this.$ajax.post(this.$api.couponsSend, {
        type_id: this.id,
        show_type: 1,
        message: this.formItem.note,
        rank_id: this.formItem.level,
        send_num: 1
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
