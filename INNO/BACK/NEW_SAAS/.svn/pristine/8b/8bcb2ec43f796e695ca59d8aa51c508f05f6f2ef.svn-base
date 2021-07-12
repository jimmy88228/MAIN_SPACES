<style lang="less">
.staff-service-view{
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
  
  .ivu-cell{
    padding: 5px 0;
    border-top: 1px solid #eee;
  }
}
</style>

<template>
	<div class="staff-service-view" :class="info.is_enable == false ? ' mask' : '' ">
    <template v-if="info.is_enable">
      <Row type="flex" class="order-title">
        <Col class="left-box">
          {{info.title}}
          <span class="tips">{{info.tip}}</span>
        </Col>
      </Row>
      
      <CellGroup v-if="info.display_format == 'list' " style="margin-top:10px;">
        <Cell v-for="(item,index) in info.list" :key="index"
        v-if="item.is_enable">
          <Avatar :src="item.icon" />
          <span>{{item.name}}</span>
          <div slot="extra" style="color:#bbb">{{item.tip}} <Icon type="ios-arrow-forward" /></div>
        </Cell>
      </CellGroup>
      <Row v-else type="flex">
        <Col v-for="(item,index) in info.list" :key="index" :span="( info.row==3 ? 8 : 6 )" class="icon-body"
          v-if="item.is_enable">
          <div class="icon-box" :style="'background-image:url('+item.icon+');'"></div>
          <div>{{item.name}}</div>
          <div class="tips">{{item.tip}}</div>
        </Col>
      </Row>
    </template>
    <template v-else>
      <div class="is-hidden">导购服务已经隐藏</div>
    </template>
	</div>
</template>

<script>
/**
 * 导购服务（个人中心） - 组件
 */
export default {
  name: 'staffServiceView',
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
