<template>
  <div class="user-service">
    <div v-for="item in serviceList" :key="item.code" class="flex-b-c service-item" :class="{'isInvalide': item.is_enable != 1}">
      <div class="item-left flex-s-c">
        <div class="item-icon"><img :src="item.icon" /></div>
        <div class="item-name">{{item.name}}</div>
      </div>
      <Icon type="ios-arrow-forward" class="item-arrow" />
    </div>
  </div>
</template>

<script>
export default {
  name: "userCenterService",
  props: {
    compInfo: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    newCompInfo() {
      // 转换一层，避免watch浅拷贝
      return JSON.parse(JSON.stringify(this.compInfo)) || {};
    },
  },
  data() {
    return {
      serviceList: [],
    };
  },
  methods: {
    initData(data) {
      let module_data = data.module_data || {};
      this.serviceList = module_data.serviceList || [];
    },
  },
  watch: {
    newCompInfo: {
      handler(nV, oV) {
        if (nV instanceof Object) {
          this.initData(nV);
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style lang="less" scoped>
.user-service {
  .service-item {
    height: 70px;
    padding-left: 33px;
    padding-right: 20px;
    margin-bottom: 10px;
    background-color:#fff;
    .item-left {
      .item-icon{
        width:30px;
        height:30px;
        position:relative;
        margin-right:20px;
        background-color:#efefef;
        img{
          width:100%;
          position:absolute;
          top:50%;
          left:50%;
          transform: translate(-50%, -50%);
        }
      }
      .item-name{
        font-size: 17px;
        color:#333;
      }
    }
    .item-arrow {
      font-size: 20px;
      opacity: 0.3;
    }
  }
  .service-item.isInvalide{
    opacity: 0.4;
  }
}
</style>