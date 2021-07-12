<template>
  <Card class="setting">
    <div class="header">
      <Button type="primary">重置消息模板</Button>
    </div>
    <p class="strong_tips tip">说明: 在不同的业务场景下，品牌可以通过功能向会员推送微信通知消息， 同时，品牌可以通过设置通知消息的关联跳转内容， 为会员提供更多的品牌资讯。实现更好的客户体验， 在使用该功能前需要进行微信第三方授权以及对相应的消息模板进行配置。</p>
    <Card style="width:350px">
        <p slot="title">
            新任务提醒
        </p>
        <p>未启用</p>
        <Button type="primary" @click="openModal">设置</Button>
    </Card>
    <BrandForm ref="brandForm"></BrandForm>
  </Card>
</template>

<script>
import BrandForm from './setting-form';

export default {
  components: {
    BrandForm
  },
  methods: {
    openModal () {
      this.$refs.brandForm.setData({}).show();
    }
  }
}
</script>

<style lang="less" scoped>
.setting{
  .tip{
    margin: 24px 0;
  }
}
</style>
