<style lang="less">
.uc-sign-view{
	padding:10px;
  border-bottom: 4px solid #eee;

  &.mask{
    background: rgba(0,0,0,.2);
  }

  .sign-title{

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
  .is-hidden{
    text-align: center;
    padding:5px 10px;
    color: #fff;
  }
}
</style>

<template>
	<div class="uc-sign-view" :class="info.is_enable == false ? ' mask' : '' ">
		<template v-if="info.is_enable">
			<Row type="flex" class="sign-title">
				<Col class="left-box">
				{{info.title}}
				<span class="tips">{{info.tip}}</span>
				</Col>
				<Col class="right-box"></Col>
			</Row>
		</template>
		<template v-else>
			<div class="is-hidden">签到已经隐藏</div>
		</template>
	</div>
</template>

<script>
	/**
	 * 签到（个人中心） - 组件
	 */
	export default {
		name: 'ucSignView',
		components: {

		},
		props: {
			currIndex: {
				type: [Number, String],
				default: 0
			}
		},
		data() {
			return {
				info: {
					list: [],
				},
				dataList: []
			}
		},
		computed: {

		},
		methods: {
			init() {
				this.dataList = this.$store.state.app.pageCompList;
				this.info = this.dataList[this.currIndex].setting;
			}
		},
		mounted() {
			this.init();
		}
	}
</script>
