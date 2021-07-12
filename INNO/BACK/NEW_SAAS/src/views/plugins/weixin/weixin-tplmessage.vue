<style lang="less">
.weixin-tplmessage{
	.box{
		width:350px;
		float:left;
		margin:10px;
	}
	
	.btn-box{
		text-align: right;
		margin-bottom: 10px;
	}
}	
</style>

<template>
	<div class="weixin-tplmessage">
		
		<div v-show="showList">
			<div class="btn-box">
				<Button type="info" icon="md-settings" @click="settingTpl">管理已生成的模板ID</Button>	
			</div>
			<div class="clearfix">
        <div v-for="(cat,cindex) in catList" :key="cindex" class="clearfix">
          <titleBar>{{cat.name}}</titleBar>
          
          <template v-for="(tpl,code) in tplList">
            <template v-for="catcode in cat.child" v-if="catcode == code">
          <div class="box">
            <Card>
              <p slot="title">{{tpl.name}}</p>
              <a href="#" slot="extra" @click.prevent="editMessage(code)">
                <Icon type="ios-gear"></Icon>
                  设置
              </a>
              <p>{{tpl.desc}}</p>
              <p>短信通知  <Tag v-if="tpl.child.sms.enable" color="success">已启用</Tag><Tag v-else color="error">已关闭</Tag> </p>
              <p>微信通知  <Tag v-if="tpl.child.weixin.enable" color="success">已启用</Tag><Tag v-else color="error">已关闭</Tag> </p>
            </Card>
          </div>
            </template>
          </template>
          
        </div>
			</div>
        </div>
		
		<!--表单-->
        <tplMessageForm ref="tpl-message-form"></tplMessageForm>
		
		<!--设置已经生成的模板ID-->
		<tplMessageList ref="tpl-message-list" @on-close="onClose"></tplMessageList>
	</div>
</template>

<script>
import tplMessageForm from './weixin-tplmessage-form.vue';
import tplMessageList from './weixin-tplmessage-list.vue';
import titleBar from '@/views/my-components/title-bar/title-bar';
	
export default {
	name: 'weixinTplmessage',
    components: {
        tplMessageForm,
		tplMessageList,
      titleBar,
    },
    data () {
    	return {
			showList: true,
    		tplList:[],
        catList:[],
    	}
    },
    methods: {
    	// 初始化方法
        init () {
        	// ajax 请求获取初始化数据，然后动态更新下面数据源
        	this.$ajax.post( this.$api.weixinTplmessageList, {
   				
        	})
    		.then( (response) => {
    			var res = response.data;
    			
    			if( res.code ){
                    // 初始化表单数据
                    this.tplList = res.data;
                    this.catList = res.catList;
    			}

			});
        },
        // 编辑消息
        editMessage( code ){
			this.$refs['tpl-message-form'].openModal( code, this.tplList );
		},
		// 设置已经生成的模板ID
		settingTpl(){
			this.showList = false;
			
			this.$refs['tpl-message-list'].openModal();
		},
		// 关闭的回调
		onClose(){
			this.showList = true;
		}
    },
    mounted () {
        // 放到了父组件触发 this.init();
    },
}
</script>

