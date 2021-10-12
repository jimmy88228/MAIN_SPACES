<style lang="less">
body{
    font-family: '微软雅黑','宋体',Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Arial,sans-serif;
    overflow: hidden auto;
}
.article-info{
	margin:0 auto;
	width: 820px;

	.left-menu{
		background: #fff;
		border-right: 1px solid #ddd;
		overflow: hidden auto;
		width:100%;
		padding:10px;
	}
	.body-card{
		margin:5px 10px;

		.body-content{
			.meta{
				margin:10px 10px 20px 10px;
				text-align: center;
			}
			.content-box{
				padding:10px;
				overflow: hidden;
			}
		}
	}
}
</style>

<template>
	<div class="article-info">
		<!--
		<Row>
			<Col :span="4">
				<div class="left-menu" :style="'height:'+ this.menuHeight + 'px;'">
					左侧菜单
				</div>
			</Col>
			<Col :span="20">
				<Card class="body-card">
					<div slot="title">
						{{info.title}}
					</div>

					<div class="body-content">
						<div class="meta">
							<span>{{info.created_at_format}}</span>
							<span>{{info.author}}</span>
						</div>

						<div class="content-box" v-html="info.content"></div>
					</div>
				</Card>
			</Col>
		</Row>
		-->
		<Card class="body-card">
			<div slot="title">
				{{info.title}}
			</div>

			<div class="body-content" :style="'min-height:'+ (this.menuHeight-100) + 'px;'">
				<div class="meta" v-show="false">
					<span>发布时间：{{info.created_at_format}}</span>
					<span>作者：{{info.author}}</span>
				</div>

				<div class="content-box" v-html="info.content"></div>
			</div>
		</Card>

		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
	</div>
</template>

<script>
import util from '@/libs/util.js';

export default {
  components: {

  },
  data () {
    return {
        	code: '',
        	spinShow: false,
        	menuHeight: 500,

        	info: {
        		title: '',
        		content: '',
        		created_at_format: ''
        	}
    }
  },
  computed: {

  },
  methods: {
    	// 初始化方法
    init () {
        	this.code = this.$route.params.code != null && this.$route.params.code != '' ? this.$route.params.code : '';

        	this.menuHeight = document.body.clientHeight;
        	this.initData();
    },
    initData () {
        	this.spinShow = true;
      // ajax 请求获取初始化数据，然后动态更新下面数据源
        	util.ajax.post(util.apiUrl.articleInfo, {
        		code: this.code
        	})
    		.then((response) => {
    			this.spinShow = false;
    			var res = response.data;

    			if (res.code) {
    				this.info = res.data;
    			} else {
    				this.$Modal.error({
    					title: '错误提示',
    					content: res.message
    				});
    			}
        });
    }
  },
  mounted () {
    this.init();
  }
}
</script>
