<style lang="less">
.cs-user-list-left-box{

	.header-box{
		padding:3px 5px;
		background: #eee;
		border-bottom: 1px solid #ddd;
	}

	.cell-avatar-box{
		width:45px;
		position: relative;

		.badge{
			position: absolute;
			top: -5px;
			left: -12px;
		}
	}
	.cell-history-content-box{
		width:118px;
		font-size:12px;
		line-height: 1.6;
	}

	.ivu-cell{
		border-bottom: 1px solid #eee;
	}
	.worker-name{
		font-size:13px;
	}
	.worker-status{
		font-size:10px;
	}
	.ivu-cell-group .title{
		color:#515a6e;
		background: #f8f8f9;
	}

	.ivu-input-icon-clear{
		right:50px;
	}
}
</style>

<template>
	<div class="cs-user-list-left-box" :style="{height: boxHeight -48 +'px'}">
		<div class="header-box">
			<Input v-model="formSearch.searchq" placeholder="用户搜索..." clearable search enter-button
			    @on-search="searchPage"
			    @on-clear="searchPage"
			    @keydown.native.enter.prevent ="searchPage">
				<Select v-model="formSearch.searchqType" slot="prepend" style="width:68px">
			        <Option value="nickName">昵称</Option>
					<Option value="mobile">手机</Option>
					<Option value="cardNum">卡号</Option>
			    </Select>
			</Input>
		</div>

		<CellGroup :style="{height: (boxHeight-45-48 ) +'px'}">
			<vue-scroll ref="vue-scroll" :ops="scrollOptions">
				<template v-if="userList.length > 0">
				<Cell v-for="(item,index) in userList" :key="index"
				:selected="item.id == currSessionId "
				@click.native="selectSession(item)">
					<div class="uflex">
						<div class="cell-avatar-box">
							<Avatar icon="ios-person" size="large" :src="item.get_user_info != null && typeof(item.get_user_info) != 'undefined' ? item.get_user_info.wx_avatar : '' "/>
							<Badge class="badge" />
						</div>
						<div class="cell-history-content-box">
							<div class="clamp">{{item.session_from}}{{item.get_user_info != null ? item.get_user_info.wx_nick_name : ''}}</div>
							<div class="clamp">{{item.get_user_content_once != null ? item.get_user_content_once.content_search : '' }}</div>
						</div>
					</div>
					<div slot="extra">
						<div style="font-size:10px;text-align: right;">{{item.get_user_content_once != null ? item.get_user_content_once.created_at_format : ''}}</div>
						<div class="clamp" style="font-size:13px;max-width:50px;">
							<span v-if="item.get_session_info.status == 0" style="color:#2db7f5;">待接入</span>
							<span v-else-if="item.get_session_info.status == 1 && item.get_session_info.worker_id == workerId " style="color:#19be6b;">已接入</span>
							<span v-else-if="item.get_session_info.status == 1 && item.get_session_info.worker_id != workerId " style="color:#f90;">
                ({{item.get_session_info.get_worker_info.nick_name}})接入
              </span>
							<span v-else-if="item.get_session_info.status == 2 && item.over48hours == false && item.get_session_info.openid_type != 'APP' " style="color:#f90;">已结束</span>
							<span v-else-if="item.get_session_info.status == 2 && item.over48hours == true && item.get_session_info.openid_type != 'APP' " style="color:#ed4014;">已超时</span>
							<span v-else-if="item.get_session_info.status == 2 && item.get_session_info.openid_type == 'APP' " style="color:#2db7f5;">待接入</span>
						</div>
					</div>
				</Cell>
				</template>
				<template v-else>
				  <div style="text-align: center;padding-top:20px;">暂无结果</div>
				</template>
				<!--加载提示-->
				<Spin size="large" fix v-if="spinShow" style="z-index:1000"></Spin>
			</vue-scroll>

		</CellGroup>
	</div>
</template>

<script>
/**
 * 接入用户历史列表 组件
 */
export default {
	name:"csUserHistory",
    components: {

	},
	props:{
		boxHeight:{
			type:Number,
			default: 500,
		},
	},
	data () {
	    return {
			userList: [],
			currSessionId: 0,
			// 搜索表单
			formSearch:{
				searchq:'',
				searchqType: 'nickName',
			},

			spinShow: false,
			workerId: 0,

			// 虚拟滚动条
			scrollOptions:{
				mode: 'native',
				bar:{
					keepShow: true,
					background: '#c8c8c8',
					size:'3px',
				},
				// 滚动轨道
				rail:{
					size:'3px',
				},
				scrollPanel:{
					scrollingX:false,
				}
			},
		}
	},
	methods: {
		initData(){
			this.spinShow = true;

			this.workerId = this.$util.cache.get('cs_worker_id');

			// ajax 请求获取数据，
			this.$ajax.post( this.$api.csHistoryUserList, {

			})
			.then( (response) => {
				this.spinShow = false;
				var res = response.data;
				if( res.code ){
					// 初始化表数据
					this.userList = res.data.items;
				}
			});
		},
		// 搜索
		searchPage(){
			this.spinShow = true;
			// ajax 请求获取数据，
			this.$ajax.post( this.$api.csHistoryUserList, {
				searchq: this.formSearch.searchq,
				searchqType: this.formSearch.searchqType,
			})
			.then( (response) => {
				this.spinShow = false;
				var res = response.data;
				if( res.code ){
					// 初始化表数据
					this.userList = res.data.items;
				}
			});
		},
		// 选中历史用户
		selectSession( item ){
			switch( item.get_session_info.status ){
				// 待接入
				case 0:
					this.$store.commit('setCsMaskCode', 1);

					this.currSessionId = item.id;

					// 把内容参数传递到对话框组件
					this.$store.commit('setSelectedCsSession', item);
					break;

				// 已接入
				case 1:
					// 如果接入的人是自己
					if( item.get_session_info.worker_id == this.workerId ){
						item.in_history = false;
						this.$emit('on-show-joined', item);
					}
					// 接入的人是别人，只能查看
					else{
						this.$store.commit('setCsMaskCode', 3);

						this.currSessionId = item.id;

						// 把内容参数传递到对话框组件
						this.$store.commit('setSelectedCsSession', item);
					}
					break;

				// 已结束
				case 2:
					if( item.get_session_info.openid_type != 'APP' ){
						if( item.over48hours ){
							// 超过 48 小时
							this.$store.commit('setCsMaskCode', 4);
						}
						else{
							this.$store.commit('setCsMaskCode', 2);
						}
					}
					else{
						// app 没有超时48 小时的概念,可以随时接入
						this.$store.commit('setCsMaskCode', 2);
					}
					this.currSessionId = item.id;

					// 把内容参数传递到对话框组件
					this.$store.commit('setSelectedCsSession', item);
					break;
			}


		}
	},
}
</script>
