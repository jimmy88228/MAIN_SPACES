<style lang="less">
.cs-orders-box{
	.ivu-form-item{
		margin-bottom: 0;
	}
}
</style>

<template>
	<div>
		<Modal v-model="showOrder" title="订单详情" class="cs-orders-box" footer-hide>
			<Form :label-width="90">
				<FormItem label="订单编号">
					<Input v-model="info.ordreMessage.order_sn" id="copy-order-sn"></Input>
					<Button type="info" size="small" @click="copyOrderSn">复制</Button>
				</FormItem>
				<FormItem label="订单状态">
					{{info.ordreMessage.status}}
				</FormItem>
				<FormItem label="下单时间">
					{{info.ordreMessage.create_time}}
				</FormItem>
				<FormItem label="收货人">
					{{info.orderAddress.consignee}}  {{info.orderAddress.mobile}}
				</FormItem>
				<FormItem label="收货地址">
					{{info.orderAddress.district}} {{info.orderAddress.address}}
				</FormItem>
				<FormItem>
					<a href="#" @click.prevent="goOrderDetail">
						订单详情
					</a>
				</FormItem>
			</Form>

			<!--加载提示-->
			<Spin size="large" fix v-if="spinShow"></Spin>
		</Modal>
	</div>
</template>

<script>
/**
 * 用户订单详情框组件 组件
 */
export default {
	name:"csOrdersBox",
    components: {
	},
	props:{

	},
	data () {
	    return {
			showOrder: false,
			spinShow: false,
			orderId: '',
			info:{
        ordreMessage:{},
        orderAddress:{},
      },
		}
	},
	methods: {
		openModal( card ){
			this.showOrder = true;

			var pathObj = this.getQueryObject( card.PagePath );
			this.orderId = pathObj.order_id;

			this.spinShow = true;
			// ajax 请求获取数据
			this.$ajax.post( this.$api.orderInfo, {
				order_id: this.orderId,
			})
			.then( (response) => {
				this.spinShow = false;
				var res = response.data;
				if( res.code ){
					this.info = res.data;
				}
				else{
					this.$Modal.error({
			            title: res.message ,
			            content: '',
			        });
				}
			});
		},
		// 解析url
		getQueryObject( url ) {
			var search = url.substring( url.lastIndexOf("?") + 1);
			var obj = {};
			var reg = /([^?&=]+)=([^?&=]*)/g;
			search.replace(reg, function (rs, $1, $2) {
				var name = decodeURIComponent($1);
				var val = decodeURIComponent($2);
				obj[name] = String(val);

			});
			return obj;
		},
		closeModal(){
			this.showOrder = false;
		},
		goOrderDetail(){
			window.open('/orders/order-info/' + this.orderId );
		},
    // 复制订单号
    copyOrderSn(){
    	document.querySelector("#copy-order-sn input").select();
    	document.execCommand("Copy");
    	this.$Message.success('复制成功');
    }
	},
	watch:{

	}
}
</script>
