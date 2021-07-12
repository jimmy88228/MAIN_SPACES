<style lang="less">
.cs-orders-exchange-list{
	.ivu-form-item{
		margin-bottom: 0;
	}
	.ivu-cell{
		border-bottom: 1px solid #eee;
	}
	.ivu-page-simple-pager{
		input{
			font-size:12px;
			width:40px;
		}
	}
	.ivu-cell-main{
		width:100%;
	}
}	
</style>

<template>
	<div class="cs-orders-exchange-list">
		<div v-if="showOrder">

			<CellGroup >
				<div :style="{'height': dataList.length > 0 ? '300px' : '60px'}">
				<vue-scroll ref="vue-scroll" :ops="scrollOptions">
					<Cell v-for="(item, index) in dataList" :key="index"
					:label="'下单时间: '+item.created_at_format"
					@click.native="viewInfo(index,item)">
						<div>{{item.return_sn}}</div>
						<div>
							<Tag @click.native="viewInfo(index,item)">{{item.return_status_str}}</Tag>
              <Tag @click.native="viewInfo(index,item)">{{item.shipping_status_str}}</Tag>
						</div>
            <div v-if="item.store_name != null && item.store_name != '' ">{{item.store_name}}</div>
            <div style="margin:10px 0;">
            	<Row v-for="(goods,gindex) in item.return_info" :key="gindex" type="flex"
              style="position: relative;">
            		<Col style="width:40px;">
            			<Avatar shape="square" :src="goods.goods_img" />
            		</Col>
            		<Col style="width:140px;font-size:12px;line-height: 1.3;">
            			<div class="clamp">{{goods.goods_name}}</div>
            			<div>{{goods.goods_attr}}</div>
            		</Col>
            		<Col style="width:40px;">
            			<div style="font-size:12px;text-align:right;font-weight: bold;">X {{goods.goods_number}}</div>
            		</Col>
            	</Row>
            </div>
					</Cell>

					<div v-if="dataList.length ==0 " style="text-align: center;padding:10px;">暂无退货单</div>
				</vue-scroll>
				</div>
				<Cell v-if="dataList.length > 0 " class="title" style="border-bottom: 1px solid #ddd;">
					<Page :current="currPage" :total="pageTotal" :page-size="pageSize" size="small" simple
					@on-change="changePage"/>
				</Cell>
			</CellGroup>

			<!--加载提示-->
			<Spin size="large" fix v-if="spinShow"></Spin>
		</div>
	</div>
</template>

<script>
/**
 * 用户退货单列表框组件 组件
 */
export default {
	name:"csOrdersExchangeList",
    components: {
	},
	props:{

	},
	data () {
	    return {
			showOrder: false,
			spinShow: false,
			pageSize: 10,
			currPage: 1,
			pageTotal: 0,

			// 会话详情
			sessInfo:{
				get_user_info: null
			},
			dataList:[],

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
		loadData(){
			this.showOrder = true;
			this.spinShow = true;
			// ajax 请求获取数据
			this.$ajax.post( this.$api.returnOrderlist, {
				pageSize: this.pageSize,
				user_id: this.sessInfo.get_user_info.id,
			})
			.then( (response) => {
				this.spinShow = false;
				var res = response.data;
				if( res.code ){
					this.dataList = res.data.items;
					this.pageTotal = res.data.total;
				}
				else{
					// 搜索出错
				}
			});
		},
		changePage(){
			this.spinShow = true;
			// ajax 请求获取数据
			this.$ajax.post( this.$api.returnOrderlist, {
				pageSize: this.pageSize,
				user_id: this.sessInfo.get_user_info.id,
				page: this.currPage,
			})
			.then( (response) => {
				this.spinShow = false;
				var res = response.data;
				if( res.code ){
					this.dataList = res.data.items;
					this.pageTotal = res.data.total;
				}
				else{
					// 搜索出错
				}
			});
		},
		closeModal(){
			this.showOrder = false;
		},
		// 查看订单详情
		viewInfo(index, item){
			window.open('/orders/return-order-info/' + item.return_id );
		},
	},
	watch:{
		'$store.state.app.selectedCsSession' ( to ){
			this.sessInfo = to;
			this.loadData();
		}
	}
}
</script>
