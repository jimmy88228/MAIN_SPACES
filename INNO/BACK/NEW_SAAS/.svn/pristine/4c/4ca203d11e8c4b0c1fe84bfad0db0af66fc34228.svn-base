<style lang="less">
.editor-rich-text-view{
	.rich-text-box{
		padding:10px;
		word-break: break-all;
	}

	.empty{
		text-align: center;
		padding:50px 20px;
		color:#515a6e;
	}
}
</style>

<template>
	<div class="editor-rich-text-view">

		<template v-if=" typeof(info.content) != 'undefined' && info.content !='' ">
			<div v-html="info.content" class="rich-text-box"></div>
		</template>

		<!--空白的情况-->
		<div v-else class="empty">
			<Icon type="ios-paper-outline" size="60" color="#2d8cf0"></Icon>
			<div>请点击在右侧编辑</div>
		</div>
	</div>
</template>

<script>
/**
 * 富文本渲染组件
 */
export default {
  name: 'richTextView',
  components: {

  },
  props: {
    currIndex: {
      type: [Number, String],
      default: 0
    },
	// 是否使用用在 tab 导航页面内
		inTab:{
			type: Boolean,
			default: false,
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
      this.dataList = this.inTab ? this.$store.state.app.tabPageCompList : this.$store.state.app.pageCompList;
      this.info = this.dataList[this.currIndex].setting;
    }
  },
  watch:{
  	'currIndex' (to){
  		this.init();
  	},
    // 观察 list 的变化
    '$store.state.app.pageCompList' (to) {
      this.init();
    },
  },
  mounted () {
	    this.init();
  }
}
</script>
