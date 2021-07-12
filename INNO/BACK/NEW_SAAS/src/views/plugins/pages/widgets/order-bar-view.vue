<style lang="less">
.order-bar-view{
	padding:10px;
  border-bottom: 4px solid #eee;

  &.mask{
    background: rgba(0,0,0,.2);
  }

  .order-title{

    .left-box{
      flex:1 1 0%;
      font-size:14px;

      .tips{
        font-size: 12px;
        margin-left: 10px;
        color:#bbb;
      }
      &::before{
        content: "";
        width: 0px;
        height: 12px;
        display: inline-block;
        vertical-align: middle;
        border-left: 3px solid #E38A18;
        margin-right: 8px;
        margin-top: -3px;
      }
    }
    .right-box{
      width:80px;
      text-align: right;
      font-size: 12px;
    }
  }
  .icon-body{
    text-align: center;
    margin-top: 5px;
    flex:1 1 0%;

    .icon-box{
      width:40px;
      height:40px;
      margin:0 auto;
      background: center center no-repeat;
      background-size: auto 100%;
    }
    .tips{
      font-size:12px;
      color:#bbb;
    }
  }
  .is-hidden{
    text-align: center;
    padding:5px 10px;
    color: #fff;
  }
}
</style>

<template>
	<div class="order-bar-view" :class="info.is_enable == false ? ' mask' : '' ">
    <template v-if="info.is_enable">
      <Row type="flex" class="order-title">
        <Col class="left-box">
          {{info.title}}
          <span class="tips">{{info.tip}}</span>
        </Col>
        <Col class="right-box">查看全部 <icon type="ios-arrow-forward"></icon></Col>
      </Row>

      <Row type="flex">
        <Col v-for="(item,index) in info.list" :key="index"
        v-if="item.is_enable"
        class="icon-body">
          <div class="icon-box" :style="'background-image:url('+item.icon+');'"></div>
          <div>{{item.name}}</div>
          <div class="tips">{{item.tip}}</div>
        </Col>
      </Row>
    </template>
    <template v-else>
      <div class="is-hidden">我的订单已经隐藏</div>
    </template>
	</div>
</template>

<script>
/**
 * 订单条（个人中心） - 组件
 */
export default {
  name: 'orderBarView',
  components: {

  },
  props: {
    currIndex: {
      type: [Number, String],
      default: 0
    }
  },
  data () {
	    return {
      info: {},
      dataList: []
    }
  },
  computed: {

  },
  methods: {
    init () {
      this.dataList = this.$store.state.app.pageCompList;
      this.info = this.dataList[this.currIndex].setting;
    }
  },
  mounted () {
	    this.init();
  }
}
</script>
