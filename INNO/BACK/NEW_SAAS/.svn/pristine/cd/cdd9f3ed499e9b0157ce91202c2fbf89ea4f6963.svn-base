<style lang="less">
.brand-plugins{
	.list-item{
		width: 100%;
		background:#f8f8f8;
		margin-bottom: 10px;

		.title{
			font-weight: bold;
			font-size:13px;
			color:#000;
		}
		.desc{
			color:#999;
			font-size:12px;
			text-overflow: ellipsis;
		    white-space: nowrap;
		    max-width: 130px;
		    overflow: hidden;
		}

		.icon-box{
    		text-align: center;
    		float: left;
    		padding:25px 10px 25px 20px;
    		cursor:pointer;

    		.icon{
    			color:#fff;
    			background: green;
			    padding: 5px;
			    border-radius: 5px;
			    font-size:30px;
    		}
		}
		.txt-box{
			float:left;
			padding:20px 20px 20px 10px;
			cursor:pointer;
			min-width:160px;
		}
		.switch-box{
			float:right;
			padding:26px 0;
			margin-right:10px;
			text-align: center;
			min-width:70px;
			
			.quan-tips{
				font-size:12px;
				margin-top:5px;
				cursor: pointer;
			}
		}
		.ivu-tooltip-inner{
			white-space:unset;
		}
	}
}
</style>

<template>
	<div>
		<Modal
	        v-model="modalShow"
	        class="brand-plugins"
	        :title="modalTitle"
	        :loading="modalLoading"
	        :width="1000"
	        :styles="{top:'20px'}"
	        :footer-hide="true">

			<Tabs value="group0" type="card">
				<TabPane v-for="(group,gi) in list" :key="gi" :label="group.name" :name="'group'+gi">
					<div :style="{height: modalHeight +'px',overflow: 'hidden auto'}">
						<Row :gutter="10">
							<Col v-for="(item,index) in group.children" :key="item.code" class="list-item" :span="8">
								<Row>
									<Col class="icon-box">
										<Icon :type="item.icon" :class="item.icon_class" :style="item.icon_color != '' ? 'background:'+item.icon_color : ''" />
									</Col>
									<Col class="txt-box">
										<Tooltip :content="item.desc" placement="bottom" theme="light">
											<div class="title">{{ item.name }}</div>
											<div class="desc">{{ item.desc }}</div>
										</Tooltip>
										<div v-if="item.is_expire == false" class="desc">到期日：{{item.expire_time}}</div>
										<div v-else style="color:red;" class="desc">已过期：{{item.expire_time}}</div>
									</Col>
									<Col class="switch-box">

										<div>
											<span v-if="item.admin_status_format == true" style="color:green;font-weight: bold;">已授权</span>
											<span v-else-if="item.plugins_status == true" style="color:green;font-weight: bold;">批量授权</span>
											<span v-else style="color:red;font-weight: bold;">未授权</span>
										</div>
										<div class="quan-tips">
											<Tooltip content="授权修改" placement="bottom" theme="light">
												<Icon type="ios-create-outline" size="20" @click="pluginsEdit(gi, index, item )" />
											</Tooltip>
											<Tooltip content="授权历史记录" placement="bottom" theme="light">
												<Icon type="ios-calendar-outline" size="20" @click="pluginsLog(item.code)" />
											</Tooltip>
										</div>

									</Col>
								</Row>
							</Col>

						</Row>
					</div>
				</TabPane>
			</Tabs>

			<!--加载提示-->
			<Spin size="large" fix v-if="spinShow"></Spin>

	    </Modal>

	    <!--组件表单-->
	    <brandPluginsForm ref="brand-plugins-form" @on-success="brandPluginsSuccess"></brandPluginsForm>

	    <!--组件日志-->
	    <brandPluginsLog ref="brand-plugins-log"></brandPluginsLog>
	</div>
</template>

<script>
import util from '@/libs/util.js';
import brandPluginsForm from './brand-plugins-form';
import brandPluginsLog from './brand-plugins-log';
/**
 * 品牌编辑 授权组件
 */
export default {
	name: 'brandPlugins',
    components: {
    	brandPluginsForm,
    	brandPluginsLog,
    },
    data () {
        return {
        	// 模态框
        	modalShow:false,
        	modalTitle:'品牌组件授权',
        	modalLoading:true,
          modalHeight: 500,

        	// 当前编辑的品牌id
        	currentBrandId: 0,
        	currIndex: 0,
        	currGroup: 0,

        	list:[],
        	spinShow: false,
        }
    },
    methods: {
    	// 初始化方法
        init () {
          this.modalHeight = document.body.clientHeight - 180;
        },
        // 提供给父组件调用
        openModal( brandId ){
        	this.modalLoading = true;
        	this.modalShow = true;
        	this.currentBrandId = brandId;

        	this.spinShow = true;
        	// ajax 获取组件列表
        	util.ajax.post( util.apiUrl.getPluginsList, {
				brand_id : this.currentBrandId,
        	})
    		.then( (response) => {
    			this.spinShow = false;
    			var res = response.data;

    			if( res.code ){
    				this.list = res.data;
    			}
    			else{
    				this.$Message.error( res.message );
    			}
    		});
        },
        pluginsEdit( gi, index, item ){
        	this.currIndex = index;
			this.currGroup = gi;
			var beginTime = typeof(item.begin_time) == 'undefined' ? '' : item.begin_time ;
        	var expireTime = typeof(item.expire_time) == 'undefined' ? '' : item.expire_time ;
        	this.$refs['brand-plugins-form'].openModal(item.code, item.admin_status_format, beginTime, expireTime, this.currentBrandId);
        },
        pluginsLog( code ){
        	this.$refs['brand-plugins-log'].openModal(code, this.currentBrandId);
        },
        // 保存成功的回调
        brandPluginsSuccess( data ){
        	this.$set( this.list[ this.currGroup ]['children'][ this.currIndex ], 'admin_status_format', data.admin_status_format);
        	this.$set( this.list[ this.currGroup ]['children'][ this.currIndex ], 'expire_time', data.expire_time);
        	this.$set( this.list[ this.currGroup ]['children'][ this.currIndex ], 'is_expire', data.is_expire);
        },
    },
    mounted () {
        this.init();
    },
}
</script>
