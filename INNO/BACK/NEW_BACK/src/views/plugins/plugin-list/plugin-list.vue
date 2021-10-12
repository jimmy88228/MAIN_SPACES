<style lang="less">
	.plugin-list {

		.ivu-card-body {
			padding: 0;
		}

		.group-box {
			padding: 16px;
			border-bottom: 8px solid #f0f0f0;

			.list-item {
				width: 300px;
				background: #f8f8f8;
				float: left;
				margin-right: 10px;
				margin-bottom: 10px;

				.title {
					font-weight: bold;
					font-size: 13px;
					color: #000;
				}

				.desc {
					color: #999;
					font-size: 12px;
					text-overflow: ellipsis;
					white-space: nowrap;
					max-width: 130px;
					overflow: hidden;
				}

				.icon-box {
					text-align: center;
					float: left;
					padding: 20px 10px 20px 20px;
					cursor: pointer;

					.icon {
						color: #fff;
						background: green;
						padding: 5px;
						border-radius: 5px;
						font-size: 30px;
					}
				}

				.txt-box {
					float: left;
					padding: 20px 20px 20px 10px;
					cursor: pointer;
				}

				.switch-box {
					float: right;
					padding: 16px 0;
					margin-right: 10px;

					.quan-tips {
						font-size: 12px;
						margin-top: 5px;
						cursor: pointer;
					}

					.none-quan-tips {
						color: red;
						font-size: 13px;
						line-height: 48px;
					}
				}

				.ivu-tooltip-inner {
					white-space: unset;
				}
			}
		}

		.ivu-form-item {
			margin: 10px 0 0 18px;
		}
		
		.search-none-box{
			margin:18px;
			padding:10px;
			border: 1px solid #eee;
			text-align: center;
		}
	}
</style>

<template>
	<div class="plugin-list">
		<Card>
			<p slot="title">
				<span>组件列表</span>
			</p>

			<Form ref="formSearch" :model="formSearch" inline>
				<FormItem>
					<Input v-model="formSearch.searchq" :style="{width:240 +'px'}" placeholder="请输入组件名称进行搜索" clearable
						search enter-button 
						@on-search="searchPlugin" 
						@on-clear="searchPlugin"
						@keydown.native.enter.prevent="searchPlugin">
					</Input>
				</FormItem>
			</Form>

			<div v-for="(group,gi) in list" :key="gi" v-if="group.children.length > 0" class="group-box">
				<titleBar>{{group.name}}</titleBar>

				<Row>
					<Col v-for="(item,index) in group.children" :key="item.code" class="list-item">
					<Row>
						<Col class="icon-box" @click.native="goPlugins(item)">
						<Icon :type="item.icon" :class="item.icon_class"
							:style="item.icon_color != '' ? 'background:'+item.icon_color : ''" />
						</Col>
						<Col class="txt-box" @click.native="goPlugins(item)">
						<Tooltip :content="item.desc" placement="bottom" theme="light">
							<div class="title">{{ item.name }}</div>
							<div class="desc">{{ item.desc }}</div>
						</Tooltip>
						</Col>
						<Col v-if="canOpen" class="switch-box">
						<template v-if="item.admin_status == 1 || item.plugins_status">
							<!--不打算给用户开启和关闭组件功能了
									<i-switch v-model="item.plugins_status" size="large" @on-change="pluginSwitchChange" @click.native="pluginSwitchClick(item.code)">
										<span slot="open">开启</span>
										<span slot="close">关闭</span>
									</i-switch>-->
							<span style="font-size:13px;color:#008200;">已授权</span>
							<div class="quan-tips">
								<Poptip trigger="hover" placement="bottom-end">
									<span v-if="item.is_expire == false">授权情况</span>
									<span v-else style="color:red;">授权已过期</span>
									<div slot="content">
										<span>授权到期时间：
											<strong
												v-if="item.expire_time != '' && item.expire_time != null ">{{item.expire_time}}</strong>
											<span v-else>未限制</span>
										</span>
									</div>
								</Poptip>
							</div>
						</template>
						<template v-else>
							<div class="none-quan-tips">未授权</div>
						</template>
						</Col>
					</Row>
					</Col>
				</Row>
			</div>

			<div v-if="hasSearchResult == false" class="group-box search-none-box">
				无搜索结果
			</div>
			
			<!--加载提示-->
			<Spin size="large" fix v-if="spinShow"></Spin>

		</Card>

	</div>
</template>

<script>
	/**
	 * 组件列表
	 */
	import titleBar from '@/views/my-components/title-bar/title-bar.vue';

	export default {
		name: 'pluginList',
		components: {
			titleBar,
		},
		data() {
			return {
				list: [],
				backList: [],
				// 是否允许启用组件功能
				canOpen: false,

				currVal: '',
				formSearch: {
					searchq: '',
				},
				hasSearchResult: true,
				spinShow: false,
			}
		},
		props: {
			// 显示的分类，如果数组为空=全部显示，数字有值的，显示指定分类
			cats: {
				type: Array,
				default: () => [],
			}
		},
		methods: {
			// 初始化
			init() {
				this.spinShow = true;
				// ajax 获取组件列表
				this.$ajax.post(this.$api.getPluginsList, {

				})
				.then((response) => {
					this.spinShow = false;
					const res = response.data;

					if (res.code) {
						if (this.cats.length > 0) {
							var listData = [];
							for (var i in res.data) {
								if (this.cats.indexOf(res.data[i].code) !== -1) {
									var children = [];
									for (var j in res.data[i].children) {
										if (res.data[i].children[j].admin_status == 1 || res.data[i].children[j]
											.plugins_status == true) {
											children.push(res.data[i].children[j]);
										}
									}
									res.data[i].children = children;
									listData.push(res.data[i]);
								}
							}
							this.list = listData;
							this.backList = listData;
							this.canOpen = false;
						} else {
							this.list = res.data;
							this.canOpen = (res.canOpen == 1 ? true : false);
						}
					}
				});
			},
			// 跳转到组件设置页
			goPlugins(row) {
				if (row.plugins_status == true || this.canOpen == false) {
					this.$router.push(row.vue_path);
				} else {
					this.$Message.info('组件未开启！');
				}
			},
			// 启用 开关触发
			pluginSwitchChange(val) {
				this.currVal = val;
			},
			// 触发plugins 的开启记录入库
			pluginSwitchClick(code) {
				this.spinShow = true;

				window.setTimeout(() => {

					// ajax 获取场景列表
					this.$ajax.post(this.$api.updateUserPlugin, {
							code: code,
							status: this.currVal,
						})
						.then((response) => {
							const res = response.data;
							this.spinShow = false;

							if (res.code) {
								this.$Message.success(res.message);

								// 删除菜单缓存,重新加载
								this.$util.cache.remove('mainFrameData');

								// ajax 请求获取初始化数据，然后动态更新下面数据源
								this.$ajax.get(this.$api.consoleInit, {
										params: {}
									})
									.then((response) => {
										// 用ajax 返回的参数替换组件的默认数据
										var res = response.data;
										if (res.code) {
											util.cache.set('mainFrameData', JSON.stringify(res));

											// 刷新页面，让菜单重新生效
											window.location.reload();
										}
									});

							}
						});

				}, 500);
			},
			// 搜索组件
			searchPlugin() {
				this.hasSearchResult = false;
				if( this.formSearch.searchq.trim() != '' ){
					let searchList = [];
					this.backList.forEach((items,index)=>{
						searchList.push({
							children:[],
							name: items.name,
							code: items.code,
						});
						items.children.forEach( (item) =>{
							if( item.name.indexOf( this.formSearch.searchq ) !== -1 ){
								searchList[index].children.push( item );
								this.hasSearchResult = true;
							}
						});
					})
					searchList.filter( (group) => {
						if( group.children.length == 0){
							return false;
						}
						return true;
					});
					this.list = searchList;
				}
				else{
					this.list = this.backList;
				}
			}
		},
		watch:{
			'formSearch.searchq' ( to ){
				if( to.trim() == '' ){
					this.searchPlugin();
				}
			}
		},
		mounted() {
			this.init();
		},
	}
</script>
