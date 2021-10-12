<style lang="less">
.cs-orders-exchange-box{
	.ivu-form-item{
		margin-bottom: 0;
	}
}
</style>

<template>
	<div>
		<Modal v-model="showOrder" title="退单详情" class="cs-orders-exchange-box" style="border-top:5px solid #eee;" footer-hide>
			<Form :label-width="90">
				<FormItem label="退单编号">
					<Input v-model="info.orderMessage.return_sn" id="copy-exchange-order-sn"></Input>
					<Button type="info" size="small" @click="copyOrderSn">复制</Button>
				</FormItem>
				<FormItem label="退单状态">
					{{info.orderMessage.return_status_str}} {{info.orderMessage.shipping_status_str}}
				</FormItem>
				<FormItem label="退单时间">
					{{info.orderMessage.add_time}}
				</FormItem>
				<FormItem label="退款金额">
					{{info.orderGoodsTotal.return_totalamount}}
				</FormItem>
			</Form>

			<!--加载提示-->
			<Spin size="large" fix v-if="spinShow"></Spin>
		</Modal>
	</div>
</template>

<script>
import util from '@/libs/util.js';

/**
 * 用户详情框组件 组件
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
        orderMessage:{},
        orderGoodsTotal:{},
      },
		}
	},
	methods: {
		openModal( card ){
			this.showOrder = true;

			var pathObj = this.getQueryObject( card.PagePath );
			this.orderId = pathObj.return_id;

			this.spinShow = true;
			// ajax 请求获取数据
			util.ajax.post( util.apiUrl.returnOrderInfo, {
				return_id: this.orderId,
			})
			.then( (response) => {
				this.spinShow = false;
				var res = response.data;
				if( res.code ){
					this.info = res.data;
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
			window.open('/orders/return-order-info/' + this.orderId );
		},
    // 复制订单号
    copyOrderSn(){
    	document.querySelector("#copy-exchange-order-sn input").select();
    	document.execCommand("Copy");
    	this.$Message.success('复制成功');
    }
	},
	watch:{

	}
}
</script>
