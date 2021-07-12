<template>
	<Card class="_card">
		<p slot="title" class="card-title">
		    <Icon type="android-map"></Icon>
		    {{title}}
		</p>
		<div class="dd_cont">
			<template v-if="data.length > 0">
				<div v-for="(item, index) in data" class="flex dd_cont_item f-align-center">
					<span class="rank_num f-shrink0 text-c">{{index + 1}}</span>
					<div class="item_cont">
						<div class="flex f-just-between">
							<p>{{item[dataKey]}}</p>
							<p class="cont_val">{{item[dataVal]}}</p>
						</div>
						<div class="range_bg"><p class="range_val" :style="{width: ((item[dataVal] / maxTop) * 100) + '%'}"></p></div>
					</div>
				</div>
			</template>
			<template v-else>
				<div class="empty_area">
					<Icon type="ios-filing" size="30" color="#b2b2b2"/>
					<p>无此相关数据</p>
				</div>
			</template>
		</div>
	</Card>
</template>
<script>
	export default{
		props:{
			title: {
				type: String
			},
			data: {
				type: Array,
				default: []
			},
			dataKey: '',
			dataVal: ''
		},
		data(){
			return {
				
			}
		},
		computed:{
			maxTop(){
				let max = 0;
				let data = this.data || [];
				let dataVal = this.dataVal;
				if(dataVal){
					for(let i = 0; i < data.length; i++){
						let val = data[i][dataVal];
						max = val > max ? val : max;
					}
				}
				return max;
			}
		},
		methods:{
			
		}
	}
</script>
<style lang="less" scoped="scoped">
	._card{
		.dd_cont{
			overflow: hidden;
			min-height:590px;
			.dd_cont_item{
				padding-top:5px;
				padding-bottom:10px;
				border-bottom:1px solid #e8eaec;
				.rank_num{
					width:60px;
				}
				.item_cont{
					width:100%;
					.cont_val{
						color: #4A93E7;
					}
					.range_bg{
						width: 100%;
						height: 10px;
						background: #F6F6F6;
						margin-top: 10px;
						border-radius:100px;
						overflow: hidden;
						.range_val{
							width:0%;
							height: 100%;
							transition: all .5s 2s;
							background-color: #4A93E7;
							border-radius:100px;
						}
					}
				}
			}
			.empty_area{
				width:100%;
				margin-top:200px;
				text-align:center;
				color:#b2b2b2;
			}
		}
	}
</style>