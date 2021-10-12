<template>
	<Card class="brand-extra-action" v-if="modalShow">
		<div slot="title" class="icard-header">
			<Tooltip content="返回" placement="bottom-start">
				<Icon type="ios-arrow-dropleft" @click="goBack" class="card-back"/>
			</Tooltip>
			{{brandInfo.name}} - 品牌权限微调
		</div>
		
		<Alert type="warning" show-icon>注意：微调最多只能调整叶子节点的权限，更大的权限控制请用“组件权限”！只能额外移除，额外添加只能授权大组件，在去除，只对二级管理员有效</Alert>
		<Row>
		<Col span="6">
			<Menu  theme="light"  :active-name="activename"  width="auto" :open-names="opennames" ref="group_menu"  accordion @on-select="onChange">
				<Submenu  v-for="(item,index) in menuGroup" :key="index" :name="index">
					<template slot="title">
						{{item.title}}
					</template>
					<MenuItem v-for="(item1,index1) in item.children" :key="index1" :name="index+'-'+index1">
						{{item1.title}}
					</MenuItem>
				</Submenu >
			</Menu>
		</Col> 
		 <Col span="18">
		 	<Tree :data="menuData" :render="renderContent" show-checkbox multiple ref="group_tree" @on-check-change="onTreeCheck"></Tree> 
		</Col>
		
		</Row>
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
				menuGroup:[],
				menuData:[],
				actionList: [],
				extraList: [],
				selectName:'0-0',
				activename:'0-0',
				opennames:[0],
			}
		},
		methods: {
			openModal( row ){
				this.modalShow = true;
				this.brandInfo = row;
				
				this.spinShow = true;
				return this.$ajax.post(this.$api.brandExtraActionList,{
					bid: this.brandInfo.id
				})
				.then( (response) => {
					
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
						this.menuGroup=this.menuTree[0].children;

					}	
				}).finally(()=>{
					this.onChange(this.selectName);
					this.spinShow = false;
					this.$nextTick(()=>{
						this.$refs.group_menu.updateOpened();
						this.$refs.group_menu.updateActiveName();
					})
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
					
					//判断是否在权限列表
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
						//只能操作最下面一层
						this.$set( arrTree[i], 'disabled', true);
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
			//显示的权限
			onChange(data){
				if(data==''){
					return;
				}
				this.selectName=data;
				let arr=data.split('-') || [];
				if(arr.length<1){
					return;
				}
				this.menuData=[];
				this.menuData.push(this.menuGroup[arr[0]].children[arr[1]]);
				// console.log('arr',this.menuGroup[arr[0]]);
			},
			// 点击事件处理
			onTreeCheck( all, curr ){
				let arr=this.selectName.split('-') || [];
				let item_arr=[];
				let action_codes=[];
				let act_code=this.menuGroup[arr[0]].children[arr[1]].actionCode;
				this.menuGroup[arr[0]].children[arr[1]].children.forEach( (item)=>{
					let itemCode=item.actionCode;
					//第三层
					if(typeof( item.children ) == 'undefined'){
						//最底层了
						//验证操作的节点
						if(item.actionCode ==curr.actionCode){
							//把节点的actionCode都存储
							item_arr.push(item.actionCode);
							action_codes[act_code]=item_arr;
						}
					}else{
						//第四层
						item.children.forEach( (itemcs)=>{
							//验证操作的节点
							if(itemcs.actionCode ==curr.actionCode){
								//把节点的actionCode都存储
								item.children.forEach((itemarr)=>{
									item_arr.push(itemarr.actionCode);
								});
								action_codes[itemCode]=item_arr;
							}
						})
					}
				} );
				if( curr.children == null || curr.children.length == 0   ){
					this.spinShow = true;
					if( curr.checked == true ){
						//打勾创建权限(移除记录)
						this.removeItem( curr.actionCode,action_codes );
					}
					else if( curr.checked == false ){
						// 取消打勾（创建记录）
						this.addItem( curr.actionCode,2,action_codes);
					}
					else{
						this.$Message.error("只能取消");
						this.spinShow = false;
					}
				}
				else{
					this.$Message.error("只能微调叶子节点，上级节点权限请在组件进行控制。");
				}
			},
			addItem( code, type,all_action_codes){
				// 添加状态
				return this.$ajax.post(this.$api.brandExtraActionAdd,{
					bid: this.brandInfo.id,
					action_code: code,
					extra_type: type,
					all_action_codes:all_action_codes
				})
				.then( (response) => {
					const res = response.data;
					this.$Message.success( res.message );
				}).finally(()=>{
					// 刷新一下
				 	this.openModal( this.brandInfo );
				});
			},
			removeItem( code,all_action_codes ){
				// 删除状态
				return this.$ajax.post(this.$api.brandExtraActionRemove,{
					bid: this.brandInfo.id,
					action_code: code,
					all_action_codes:all_action_codes
				})
				.then( (response) => {
					const res = response.data;
					this.$Message.success( res.message );
				}).finally(()=>{
					// 刷新一下
				 	this.openModal( this.brandInfo );
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

</style>	