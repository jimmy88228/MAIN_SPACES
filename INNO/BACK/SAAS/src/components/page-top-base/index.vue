<template>
  <div class="page-top-base">
    <Card>
      <div slot="title" class="back">
        <template v-if="isHead">
          <div class="back_title">
            <Tooltip content="返回" class="back">
              <slot name="back"><Icon type="ios-arrow-dropleft" @click="goBack" style="cursor: pointer;" size="28"/></slot>
            </Tooltip>
            <span>{{topTitle || '列表'}}</span>
          </div>
          <slot name="action"></slot>
        </template>
      </div>
      <div slot="extra" v-if="isSave">
        <Button type="primary" @click="save">保存</Button>
      </div>
      <slot></slot>
      <slot name="footer">
        <div v-if="isSave">
          <Divider />
          <div class="footer">
            <Button type="default" @click="goBack">取消</Button>&nbsp;&nbsp;&nbsp;
            <Button type="primary" @click="save">保存</Button>
          </div>
        </div>
      </slot>
    </Card>
  </div>
</template>

<script>
export default {
  props: {
    isSave: {
      type: Boolean,
      default: false
    },
    topTitle: {
      type: String,
      default: ""
    },
    isHead:{
      type: Boolean,
      default: true
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1);
    },
    save () {
      this.$emit('save');
    }
  }
}
</script>

<style lang="less" scoped>
.page-top-base{
  .back{
    min-height:28px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .back_title {
      display: flex;
      align-items: center;
      .back {
        margin-right: 20px;
      }
    }
  }
  .footer{
    text-align: center;
  }
}
</style>
