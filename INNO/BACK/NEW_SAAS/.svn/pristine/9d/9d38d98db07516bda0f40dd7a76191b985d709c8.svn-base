<template>
  <div>
    <div class="image-box" @click="handleSelect" @mouseover="handleOver" @mouseout="handleOut">
      <img :src="img" class="img" v-viewer v-show="img"/>
      <Icon type="md-add" size="40" v-show="(img === '' ? true : false)"></Icon>
      <transition name="fade">
        <div class="mask" v-show="showAction">
          <Icon type="ios-eye-outline" size="30" color="#fff" @click.stop="viewInfo"/>
          <Icon type="ios-create-outline" size="30" color="#fff" @click.stop="handleSelect"/>
          <Icon type="ios-trash" size="30" color="#fff" @click.stop="handleDel"/>
        </div>
      </transition>
    </div>
    <div class="small_font"><slot></slot></div>
  </div>
</template>

<script>
export default {
  props: {
    img: [String, Number]
  },
  data () {
    return {
      showAction: false
    }
  },
  methods: {
    handleSelect () {
      this.$emit('selectImg');
    },
    handleDel () {
      this.$emit('delImg');
    },
    handleOver () {
      this.showAction = (this.img !== '');
    },
    handleOut () {
      this.showAction = false;
    },
    viewInfo () {
      const viewer = this.$el.querySelector('.img').$viewer;
      viewer.show();
    }
  },
  watch: {
    img (nV) {
      if (nV === '') this.showAction = false;
    }
  }
}
</script>

<style lang="less" scoped>
// 添加图片默认占位符
.image-box {
  position: relative;
  width: 80px;
  height: 80px;
  line-height: 80px;
  border: 1px solid #eee;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
  background: center center no-repeat;
  background-size: contain;
  .img{
    display: block;
    width: 80px;
    height: 80px;
    border-radius: 5px;
    object-fit: contain;
  }
  .ivu-icon {
    line-height: 80px;
  }
  .mask{
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 0;
    top: 0;
    width: 80px;
    height: 80px;
    background: rgba(0, 0, 0, .4);
    border-radius: 5px;
  }
}
</style>
