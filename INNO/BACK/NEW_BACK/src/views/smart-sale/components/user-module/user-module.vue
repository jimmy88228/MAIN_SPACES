<template>
	<modal>
		<div slot="action">
				<Button type="primary" @click="handleExport">导出</Button>
		</div>
		<user-list-form
		@on-searchCallback="searchReq"
		@on-sendCouponCallback="sendCouponReq"
		@on-sendWechatCallback="sendWechatReq"
		type="base"
		></user-list-form>
		<Table 
		row-key="id" 
		:height="tableHeight" 
		:columns="columns" 
		:data="tableData" 
		ref="myTable"
		>
				<template slot-scope="{ row }" slot="real_name">
						<div class="img_list_wrap">
								<div class="img_fixed">
										<img :src="row.portrait_path" v-if="row.portrait_path" :alt="row.real_name" v-viewer/>
										<img src="@rs/images/default-img.jpg" :alt="row.real_name" v-viewer v-else></img>
								</div>
						</div>
				</template>
				<template slot-scope="{ row }" slot="weixin_subscribe">
						<Icon type="ios-close-circle-outline" size="25" color="#CE3636" v-if="row.weixin_subscribe == '1'"/>
						<Icon type="ios-checkmark-circle-outline" size="25" color="#52BD80" v-else/>
				</template>
				<template slot-scope="{ row }" slot="action">
						<a @click="getUserDetail(row.user_id)">详情</a>
				</template>
		</Table>
		<div class="list_page">
		<Page
				:total="pageTotal"
				:page-size="pageSize"
				:current="currentPage"
				:page-size-opts="pageSizeOpts"
				@on-change="changePage"
				@on-page-size-change="handlePageSize"
				show-total
				show-elevator
				show-sizer></Page>
		</div>
		<!--异步处理导出excel组件-->
		<div class="col">
				<notice :ref="'notice' + item" @finish="loadData" v-for="item in jobIdCol" :key="item"></notice>
		</div>
</template>
<script>
	import PageHelper from '@/libs/page-helper.js';
	import mixin from './mixin.js';
	import notice from '@/views/my-components/mq-notice/mq-notice';
	import userListForm from '@/views/smart-sale/components/user-list-form';
	export default{
		mixins: [PageHelper, mixin],
		components:{
			notice,
			userListForm
		},
		data(){
			return {
				
			}
		}
	}
</script>
<style></style>