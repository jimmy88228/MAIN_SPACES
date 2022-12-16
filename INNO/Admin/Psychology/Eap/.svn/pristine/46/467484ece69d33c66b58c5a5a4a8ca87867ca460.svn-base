<template>
  <div class="page-top-base">
    <Card>
      <div slot="title" class="back" > 
        <div class="flex-b-c">
          <div class="back_title">
            <Tooltip content="返回" class="back" v-if="isBack">
              <slot name="back"><Icon type="ios-arrow-dropleft" @click="goBack" style="cursor: pointer;" size="28"/></slot>
            </Tooltip>
            <span>{{topTitle || '列表'}}</span>
          </div>
          <slot name="action"></slot>
        </div>
        <div v-show="isSave">
          <Button type="primary" @click="save">保存</Button>
        </div>
      </div> 
      <!-- <div slot="extra" v-show="isSave">
        <Button type="primary" @click="save">保存</Button>
      </div> -->
      <slot></slot>
      <slot name="footer">
        <div v-show="isSave">
          <Divider />
          <div class="footer">
            <Button v-if="isBack" type="default" @click="goBack">取消</Button>
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
		isBack: {
			type: Boolean,
			default: true
		},
		backEvent: {
			type: Function,
		},
    topTitle: {
      type: String,
      default: ""
    }
  },
  methods: {
    goBack () {
			if(typeof(this.backEvent) == 'function'){
				this.backEvent();
			} else {
				this.$router.go(-1);
			}
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
