<template>
	<Card class="reset-user">
    <Alert show-icon>
      <Icon type="ios-bulb-outline" slot="icon"></Icon>
      <template slot="desc">
        <p> 备注：重置为ERP会员后，相当于释放当前微信的绑定，用户在使用新微信加此会员手机号重新授权注册登录时候会触发会员合并机制，将之前会员中的资产转移到新微信注册的会员上</p>
        <p> 注意：重置会员操作后，使用新微信登录会触发新会员注册营销逻辑</p>
      </template>
    </Alert>
    <Input
      class="basic_input"
      v-model="searchq"
      placeholder="会员卡号"
      clearable
      search
      enter-button
      @on-search="searchPage"
      @on-clear="searchPage"
      @keydown.native.enter.prevent="searchPage"/>
      <template v-if="userInfo.user_id">
    <div class="img_list_wrap img_list_wrap_fixed">
      <div class="img_fixed">
        <img :src="userInfo.portrait_path" v-if="userInfo.portrait_path" :alt="userInfo.real_name"/>
        <img src="@rs/images/default-img.jpg" :alt="userInfo.real_name" v-else></img>
      </div>
      <div class="user_info">
        <p class="clamp2">昵称：{{userInfo.real_name}}</p>
        <p class="clamp2">卡号：{{userInfo.card_num}}</p>
        <p v-if="userInfo.mobile_phone">手机：{{userInfo.mobile_phone}}</p>
        <p>等级：{{userInfo.rank_name}}</p>
      </div>
    </div>
    <Input
        class="basic_input reset_input"
        v-model="remark"
        placeholder="重置会员原因"
        clearable
        search
        enter-button="重置"
        @on-search="reset"
        @on-clear="reset"
        @keydown.native.enter.prevent="reset"/>
    </template>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </Card>
</template>

<script>

export default {
  data () {
    return {
      userInfo: {},
      searchq: '',
      remark: '',
      spinShow: false
    }
  },
  methods: {
      searchPage () {
        this.spinShow = true;
        return this.$ajax.post(this.$api.resetMember, {
          card_num: this.searchq
        })
        .then(response => {
          const res = response.data;
          if (res.code) {
            this.userInfo = res.data;
          }
          this.spinShow = false;
        });
      },
      reset () {
        if (!this.remark) {
          this.$Message.error('请填写重置会员原因');
          return false;
        }
        this.$Modal.confirm({
          title: '操作提示',
          content: '确认要重置该会员吗？',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            this.spinShow = true;
            return this.$ajax.post(this.$api.resetsave, {
              user_id: this.userInfo.user_id,
              remark: this.remark
            })
            .then(response => {
              const res = response.data;
              if (res.code) {
                this.$Message.success(res.message);
              }
              this.spinShow = false;
            });
          }
        });
      }
  }
}
</script>
<style lang="less">
.reset-user{
  .ivu-input-icon{
    right: 50px;
  }
  .img_list_wrap_fixed{
    margin: 20px 0;
  }
  .reset_input{
    .ivu-input-icon{
      right: 60px;
    }
  }
}
</style>
