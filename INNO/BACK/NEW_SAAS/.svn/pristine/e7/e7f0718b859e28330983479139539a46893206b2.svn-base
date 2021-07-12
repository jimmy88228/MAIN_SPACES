<style lang="less">
.release-notes{
	.title{
		font-weight: bold;
		font-size: 14px;
	}
	.date{
		font-size: 12px;
	}
	.content{
		ul{
			margin:10px 0 10px 20px;
			line-height: 1.8;
			font-size: 12px;
		}
	}
}
</style>

<template>
	<div class="release-notes">
		<Card>
			<div slot="title">历史更新说明</div>
			
			<Timeline pending>
				<TimelineItem v-for="(item,index) in data" :key="index" :color="index==0 ? 'green' : '' ">
					<Icon v-if=" index==0 " type="md-checkmark-circle" size="20" slot="dot"></Icon>
					<Icon v-else type="md-radio-button-off" size="18" slot="dot" color="#2d8cf0"></Icon>
					
					<p class="title">{{item.name}} {{item.alias_name}}</p>
					<p class="date">发布于：{{item.release_date_format}}</p>
					<p class="content">
						<ul>
							<li v-for="(citem,cindex) in item.get_items" :key="cindex">
								<tag :color="citem.type_color" size="small">{{citem.type_name}}</tag>
								{{citem.notes}}
                
                <span v-if="showAuthor"> [ {{citem.author}} ]</span>
							</li>
						</ul>
					</p>
				</TimelineItem>

			</Timeline>
		</Card>
		
		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
	</div>
</template>	

<script>
/**
 * 历史更新说明
 */

export default {
    components: {
	},
	data () {
	    return {
			data:[],
			pageTotal: 0,
			pageSize: 20,
			showAuthor: 0,
      
			// 加载提示
			spinShow: false,
		}
	},
	methods: {
		init () {
			this.initData();
		},	
		initData(){
			this.spinShow = true;
			// ajax 请求获取初始化数据(最多显示20 调大版本历史，这个已经足够了)
			this.$ajax.post( this.$api.releaseList, {
				status: 1,
			})
			.then( (response) => {
				this.spinShow = false;
				var res = response.data;
				
				if( res.code ){
					// 初始化表数据
					this.data = res.data.items;
          this.showAuthor = res.data.showAuthor;
          
					this.pageTotal = Number( res.data.total );
					this.pageSize = Number( res.data.pageSize );
				}
				
			});
		}
	},
	mounted () {
	    this.init();
	},
}
</script>