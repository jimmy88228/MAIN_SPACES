<template>
  <div class="user">
    <p>注意：24小时内，同一类型的优惠券，同一个会员可以发多张。</p>
    <Form ref="formItem" :model="formItem" :label-width="80">
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
          v-model="formItem.number"
          placeholder="请输入发放数量"
          clearable/>
        <p class="strong_tips">*范围1-50，预生成的券请检查数量是否充足;同一会员会重复收到N张券，N条推送消息;谨慎使用！</p>
      </FormItem>
      <FormItem label="选择会员">
        <user-select :data="formItem.userData" type="checkbox" @del-tag="handleTag">
          <Button type="dashed" @click="handleSelect" class="basic_select">选择会员</Button>
        </user-select>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSend">发放优惠券</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import UserSelect from '@/views/my-components/list-component/index-edit';

export default {
  props: ['id'],
  data () {
    return {
      formItem: {
        note: '',
        number: 1,
        userData: []
      }
    }
  },
  components: {
    UserSelect
  },
  methods: {
    loadData () {},
    handleSelect () {
      this.$selectContent({
        mode: 'user',
        type: 'checkbox',
        data: this.formItem.userData,
        getList: (data) => {
          this.formItem.userData = data;
        }
      })
    },
    handleTag (data) {
      this.formItem.userData = data;
    },
    handleSend () {
      if (this.formItem.number < 1) {
        this.$Message.error('请填写发放数量');
        return false;
      }
      if (this.formItem.userData.length === 0) {
        this.$Message.error('请选择会员');
        return false;
      }
      this.spinShow = true;
      return this.$ajax.post(this.$api.couponsSend, {
        type_id: this.id,
        show_type: 3,
        message: this.formItem.note,
        send_num: this.formItem.number,
        user: this.formItem.userData.map(item => item.id)
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
