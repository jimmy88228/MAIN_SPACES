<template>
	<Card class="msg-tempalte-list">
		<div class="page-divider">
			<div class="flex f-just-between f-align-center" style="width:100%;">
				<div>消息推送</div>
				<div class="text-r" >
					<Poptip
					transfer
					confirm
					placement="bottom-end"
					title="是否需要重置消息模板?"
					@on-ok="resetMsg">
							<Button type="primary"><Icon type="ios-refresh-circle" />&nbsp;重置消息模板</Button>
					</Poptip>
					<div class="s-notice">*公众号已经授权绑定后方可操作</div>
				</div>
			</div>
		</div>
		<div class="msg-tip">说明: 在不同的业务场景下，品牌可以通过功能向会员推送微信通知消息，同时，品牌可以通过设置通知消息的关联跳转内容，为会员提供更多的品牌资讯。实现更好的客户体验，在使用该功能前需要进行微信第三方授权以及对相应的消息模板进行配置。</div>
		<div class="template-modal-list">
			<div class="template-modal-item" v-for="(lItem, lKey) in  templateList" :key="lKey">
				<div class="template-item-name">{{lItem.name}}</div>
				<div class="template-item" v-for="(item, index) in lItem.son_list" :key="item.tpl_id">
					<Card :class="{'is-opened': item.is_open == 1}">
						<div slot="title">{{item.tpl_title}}</div>
						<div class="">
							<a v-if="item.is_open == 1">已启用</a>
							<span v-else>未启用</span>
						</div>
						<div class="set-btn">
							<Button type="primary" @click="setTemlateDetail(item.tpl_id)">设置</Button>
						</div>
					</Card>
				</div>
			</div>
		</div>
	</Card>
</template>
<script>
	export default{
		name: "",
		data(){
			return {
				templateList: {}
			}
		},
		methods:{
			loadData(){
				return this.$ajax.post(this.$api.weixinTemplateList,).then((response)=>{
					let res = response.data || {};
					if(res.code){
						this.templateList = res.data || {};
					}
				})
			},
			resetMsg(){
				return this.$ajax.post(this.$api.weixinTemplateReset,).then((response)=>{
					let res = response.data || {};
					if(res.code){
						this.$Message.success(res.message);
						this.loadData();
					} else {
						this.$Message.warning(res.message);
					}
				})
			},
			setTemlateDetail(id){
				if(id){
					this.$router.push({
						name:'msg-template-set-detail',
						query:{
							tpl_id: id
						}
					})
				}
			}
		},
		mounted(){
			this.loadData();
		}
	}
</script>
<style lang="less">
	.msg-tempalte-list{
		.msg-tip{
			font-size: 12px;
			color:#b2b2b2;
		}
		.template-modal-list{
			.template-modal-item{
				.template-item-name{
					padding: 15px 0px;
					font-weight: bold;
				}
				.template-item-name:before{
					content: "";
					width: 5px;
					height: 5px;
					-moz-border-radius: 100%;
					-webkit-border-radius: 100%;
					border-radius: 100%;
					background: #FE8337;
					display: inline-block;
					vertical-align: middle;
					margin-right: 10px;
				}
				.template-item{
					display: inline-block;
					margin-right: 10px;
					margin-bottom:10px;
					width:270px;
					.ivu-card-bordered{
						border-top-width: 5px;
					}
					.ivu-card-bordered.is-opened{
						border-top-color: #2d8cf0;
					}
					.set-btn{
						position:absolute;
						right: 10px;
						bottom: 10px;
						display: none;
					}
				}
				.template-item:hover{
					.set-btn{
						display: block;
					}
				}
			}
		}
	}
</style>