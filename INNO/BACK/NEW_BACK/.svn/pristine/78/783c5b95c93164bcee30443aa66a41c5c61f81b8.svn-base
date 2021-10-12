<template>
	<Poptip popper-class="select-send" placement="left" transfer>
		<slot></slot>
		<div slot="title">选择发放类型</div>
		<div slot="content" class="send">
			<div v-for="item in list" :key="item.pid" class="send_item">
				<p class="name">{{item.name}}</p>
				<Poptip popper-class="select-send" placement="bottom" trigger="hover" transfer>
					<Button type="info">优惠券类型</Button>
					<div slot="title">选择优惠券类型</div>
					<div slot="content" class="send">
						<div v-for="child in item.children" :key="child.id" class="send_item">
							<p class="name">{{child.name}}</p>
							<Button type="primary" @click="handleCreate(item.pid, child.id)">立即创建</Button>
						</div>
					</div>
				</Poptip>
			</div>
		</div>
	</Poptip>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						pid: 0,
						name: '微商城优惠券',
						children: [{
								id: 1,
								name: '满减券',
								relatePid: 0
							},
							{
								id: 4,
								name: '折扣优惠券',
								relatePid: 0
							}
						]
					},
					// {
					// 	pid: 3,
					// 	name: '扫码支付优惠券',
					// 	children: [{
					// 		id: 1,
					// 		name: '满减券',
					// 		relatePid: 3
					// 	}]
					// },
					{
						pid: 4,
						name: 'ERP券',
						children: [{
								id: 1,
								name: '满减券',
								relatePid: 4
							},
							{
								id: 4,
								name: '折扣优惠券',
								relatePid: 4
							},
							{
								id: 5,
								name: '实物券',
								relatePid: 4
							}
						]
					},
					{
						pid: 5,
						name: '通用券',
						children: [{
								id: 1,
								name: '满减券',
								relatePid: 5
							},
							{
								id: 4,
								name: '折扣优惠券',
								relatePid: 5
							}
						]
					}
				]
			}
		},
		methods: {
			handleCreate(pid, id) {
				this.$router.push({
					name: 'coupon-details',
					query: {
						pid,
						id
					}
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.select-send {
		.send {
			display: flex;
			align-items: center;

			.send_item {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				width: 200px;
				height: 100px;
				background: #efefef;
				margin-right: 10px;
				border-radius: 6px;

				.name {
					margin-bottom: 10px;
				}
			}
		}
	}
</style>
