<style lang="less">
.goods-page-template{
	.list-item{
		width: 180px;
		background:#fff;
		float:left;
		margin-right:30px;
		margin-bottom: 30px;
		cursor:pointer;
		border-radius: 5px;
		border:1px solid #ddd;
		position: relative;
		
		.icon-box{
			position: absolute;
			text-align: center;
			cursor:pointer;
			top:60px;
			left:0px;
			width:180px;
			
			.icon{
				color:#fff;
				background: green;
				padding: 5px;
				border-radius: 5px;
				font-size:40px;
			}
		}
			
		.cover-img{
			background:no-repeat center center;
			background-size: 100% auto;
			height:250px;
			border-radius: 5px 5px 0 0;

			.inner-box{
				background:rgba(0,0,0,.2);
				height:250px;
				display: none;

				.buttons{
					text-align: center;
				    position: absolute;
				    top: 160px;
				    width: 100%;
				}
			}

			&:hover .inner-box{
				display: block;
			}
		}
	}

	/* 可以设置二维码的进入和离开动画 */
    .tran-button-enter-active {
    	transition: all .3s ease;
    }
    .tran-button-leave-active {
    	transition: all 0s ease;
    }
    .tran-button-enter{
   		transform: scale(0.5);
    	opacity: 0;
    }
}
</style>

<template>
    <div>
    	<Modal
	        v-model="modalShow"
	        class="goods-page-template"
	        :title="modalTitle"
	        :loading="modalLoading"
	        :footer-hide="modalFooterHide"
	        :width="800">

	        <Tabs type="card">
		        <TabPane v-for="(tab,index) in dataList" :key="index" :name="index" :label="tab.name">
		        	<Row>

				        <!--模板列表-->
				        <Col v-for="(item,tplCode) in tab.list" :key="('k'+tplCode)" span="6" class="list-item">
				        	
				        	<div class="cover-img">
				        		
								<div class="icon-box">
									<Icon :type="item.icon" :class="item.icon_class" :style="item.icon_color != '' ? 'background:'+item.icon_color : ''" />
									<div style="margin-top:10px;">{{item.name}}</div>
								</div>
								
				        		<transition name="tran-button">
				        			<div class="inner-box">
				        				<div class="buttons">
					        				<Button type="success" @click="onCreate(tplCode)">开始编辑</Button>
					        				<!--
					        				<Button type="info">查看示例</Button>
					        				-->
				        				</div>
				        			</div>
				        		</transition>

				        	</div>

				        </Col>
				    </Row>

				    <div v-if="tab.pageTotal>0" style="margin:10px;overflow: hidden">
				        <div style="float: right;">
				            <Page :total="tab.pageTotal" :page-size="tab.pageSize" :current="1" @on-change="changePage" show-total></Page>
				        </div>
				    </div>

		        </TabPane>
		    </Tabs>

		    <!--加载提示-->
			<Spin size="large" fix v-if="spinShow"></Spin>

	    </Modal>
		
		<!--选择小程序-->
		<selectWechatApp ref="select-wechat-app" @on-success="onSuccess"></selectWechatApp>
    </div>
</template>

<script>
import selectWechatApp from './select-wechat-app.vue';

/**
 * 商品页面模板选择器
 */
export default {
  name: 'pageTemplate',
  components: {
	  selectWechatApp
  },
  data () {
    return {
		// 模态框
        	modalShow: false,
        	modalTitle: '请选择模板',
        	modalLoading: true,
        	modalEditIndex: '',
        	modalFooterHide: true,

        	dataList: [],
			
			currTplCode: '',
			isMatrix: false,
    		spinShow: false
    }
  },
  methods: {
	/**
	 * @desc 初始化方法
	 */
    init () {
        	// ajax 获取网站模板列表
        	this.$ajax.post( this.$api.goodsPageTemplateList, {

        	})
    		.then((response) => {
    			var res = response.data;

    			if (res.code) {
    				this.dataList = res.data;
					this.isMatrix = res.isMatrix;
    			}
    		});
    },
    openModal () {
        	this.modalShow = true;
    },
	onCreate( tplCode ){
		if( this.isMatrix ){
			this.currTplCode = tplCode;
			this.$refs['select-wechat-app'].showModal( null );
		}
		else{
			this.createPage (tplCode);
		}
	},
	onSuccess( appId ){
		this.createPage ( this.currTplCode , appId );
	},
    // 根据模板code，创建页面
    createPage (tplCode, appId = '') {
		
        	this.spinShow = true;

        	// ajax 获取网站模板列表
        	this.$ajax.post( this.$api.goodsPageAdd, {
				template_code: tplCode,
				app_id: appId,
        	})
    		.then((response) => {
    			this.spinShow = false;
    			var res = response.data;

    			if (res.code) {
    				this.modalLoading = false;
    				this.modalShow = false;

    				// 返回信息给父组件
    				this.$emit('on-success', res.data);
    			} 
    		});
    }
  },
  watch: {
  },
  mounted () {
    this.init();
  },
  created () {

  }
};
</script>
