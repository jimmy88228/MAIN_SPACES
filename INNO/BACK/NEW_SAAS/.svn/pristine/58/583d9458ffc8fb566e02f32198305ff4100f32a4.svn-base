<template>
	<Card class="brand-extra-action" v-if="modalShow">
		<div slot="title" class="icard-header">
			<Tooltip content="返回" placement="bottom-start">
				<Icon type="ios-arrow-dropleft" @click="goBack" class="card-back"/>
			</Tooltip>
			{{brandInfo.name}} - 品牌权限微调
		</div>
		
		<Alert type="warning" show-icon>注意：微调最多只能调整叶子节点的权限，更大的权限控制请用“组件权限”！</Alert>
		
		<Tree :data="menuTree" :render="renderContent" show-checkbox multiple @on-check-change="onTreeCheck"></Tree>
		
		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
	</Card>
</template>

<script>
	/**
	 * 品牌权限微调组件
	 */
	export default {
		name: 'brandExtraAction',
	    components: {
	    },
	    data () {
	        return {
				modalShow: false,
				spinShow: false,
				brandInfo:{},
				
				// 后台菜单树数据
				menuTree:[{
				    title: '',
				    expand: true,
				    // 子数据
				    children: []
				}],
				actionList: [],
				extraList: [],
			}
		},
		methods: {
			openModal( row ){
				this.modalShow = true;
				this.brandInfo = row;
				
				this.spinShow = true;
				this.$ajax.post(this.$api.brandExtraActionList,{
					bid: this.brandInfo.id
				})
				.then( (response) => {
					this.spinShow = false;
					const res = response.data;
					
					if( res.code ){
						// 初始化后台菜单树
						this.menuTree[0].title = res.data.tree.rootName;
						this.menuTree[0].children = res.data.tree.children;
						
						this.actionList = res.data.action_list;
						this.extraListAdd = res.data.extra_list_add;
						this.extraListRemove = res.data.extra_list_remove;
						
						// 初始化后台权限树
						this.setMenuTree( this.menuTree[0].children, true );
			
						this.menuTree[0].checked = false;
					}	
				});
			},
			// 递归设置 tree
			setMenuTree( arrTree, isAdd ){
				for(let i in arrTree ){
					this.$set( arrTree[i], 'expand', true );
					if( typeof( arrTree[i].children ) != 'undefined' ){
						// 递归设置
						this.setMenuTree( arrTree[i].children, isAdd );
					}
					
					if( this.actionList.indexOf( arrTree[i].actionCode ) !== -1 ){
						this.$set( arrTree[i], 'checked', true);
					}
					else{
						this.$set( arrTree[i], 'checked', false);
						this.$set( arrTree[i], 'disabled', true);
					}
					
					// 额外添加的只针对到叶子节点
					if( typeof( arrTree[i].children ) == 'undefined' ){
						// 额外 添加
						if( this.extraListAdd.indexOf( arrTree[i].actionCode ) !== -1 && arrTree[i].checked == false ){
							this.$set( arrTree[i], 'checked', true);
							this.$set( arrTree[i], 'extraType', 'add' );
							this.$set( arrTree[i], 'title', arrTree[i].title + ' (额外添加)' );
						}
						
						// 额外 移除
						if( this.extraListRemove.indexOf( arrTree[i].actionCode ) !== -1 && arrTree[i].checked == true ){
							this.$set( arrTree[i], 'checked', false);
							this.$set( arrTree[i], 'extraType', 'remove' );
							this.$set( arrTree[i], 'title', arrTree[i].title + ' (额外剔除)' );
						}
					}
					else{
						let allnotcheck = true;
						let allcheck = true;
						arrTree[i].children.forEach( (item)=>{
							if( item.checked == true ){
								allnotcheck = false;
							}
							if( item.checked == false ){
								allcheck = false;
							}
						} );
						if( allnotcheck ){
							this.$set( arrTree[i], 'checked', false);
						}
						else if( allnotcheck == false && allcheck == false ){
							this.$delete(arrTree[i], 'checked' );
						}
					}
				}
			},
			// 树状组件的样式渲染
			renderContent (h, { root, node, data }) {
				return h('span', {
					style:{
						fontWeight: ( data.extraType != null ? 'bold' : 'normal' ),
						color: (data.extraType != null && data.extraType == 'add') ? 'green' : 
							( (data.extraType != null && data.extraType == 'remove') ? 'red' : 'auto' )
					}
				}, data.title);
			},
			// 点击事件处理
			onTreeCheck( all, curr ){
				if( curr.children == null || curr.children.length == 0   ){
					this.spinShow = true;
					if( curr.checked == true && curr.extraType == 'remove' ){
						this.removeItem( curr.actionCode );
						// 刷新一下
						this.openModal( this.brandInfo );
					}
					else if( curr.checked == false && curr.extraType == null ){
						// 取消打勾
						this.addItem( curr.actionCode, 2);
						// 刷新一下
						this.openModal( this.brandInfo );
					}
					else{
						this.$Message.error("只能取消");
					}
				}
				else{
					this.$Message.error("只能微调叶子节点，上级节点权限请在组件进行控制。");
				}
			},
			addItem( code, type ){
				// 添加状态
				this.$ajax.post(this.$api.brandExtraActionAdd,{
					bid: this.brandInfo.id,
					action_code: code,
					extra_type: type
				})
				.then( (response) => {
					const res = response.data;
					this.$Message.success( res.message );
				});
			},
			removeItem( code ){
				// 删除状态
				this.$ajax.post(this.$api.brandExtraActionRemove,{
					bid: this.brandInfo.id,
					action_code: code
				})
				.then( (response) => {
					const res = response.data;
					this.$Message.success( res.message );
				});
			},
			goBack(){
				this.modalShow = false;
				this.$emit("on-close");
			}
		}	
	}
</script>

<style lang="less">
	.brand-extra-action{
		
	}
</style>	