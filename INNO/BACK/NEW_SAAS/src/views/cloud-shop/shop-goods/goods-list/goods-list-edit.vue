<template>
	<div class="goods-list-sort">
		<Poptip v-model="showPoptip" placement="right" transfer>
			<p class="text">{{goods_name}}</p>
			<Icon type="ios-create-outline" size="16" style="margin-left: 5px;cursor:pointer"></Icon>
      <div slot="title">编辑</div>
			<div slot="content" class="content-box">
				<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
					<FormItem label="商品名称" prop="goods_name">
						<Input v-model="formItem.goods_name" type="textarea" :rows="rowSpan"/>
					</FormItem>
					<div style="text-align: center;">
            <Button size="small" @click="onCancel">取消</Button>
						<Button type="primary" size="small" @click="onSave">确定</Button>
					</div>
				</Form>
				<!--加载提示-->
				<Spin size="large" fix v-show="spinShow"></Spin>
			</div>
		</Poptip>
	</div>
</template>

<script>

export default {
	name:'goodsListSort',
	props: {
		goods_ids:{
			type: [Number, String]
		},
		goods_type:{
			type: String
    },
    goods_name:{
			type: String
    }
	},
	data() {
		return {
			showPoptip: false,
			formItem:{
				goods_name: 0
			},
			ruleValidate:{
				goods_name:[{ required: true, message: '名称不能为空', trigger: 'blur' }]
			},
      spinShow: false,
      rowSpan: 3
		}
	},
  watch: {
    goods_ids: {
      handler () {
        this.formItem.goods_name = String( this.goods_name );
      },
      immediate: true
    }
  },
	methods: {
		// 保存排序
		onSave(){
			this.$refs['formValidate'].validate((valid) => {
			    if (valid) {
					this.spinShow = true;
					this.$ajax.post( this.$api.ShopGoodsBatch, {
            goods_ids : [this.goods_ids],
            goods_type: this.goods_type,
            goods_name: this.formItem.goods_name
					})
					.then( (response) => {
						this.spinShow = false;
						var res = response.data;

						if( res.code ){
              this.showPoptip = false;
              this.$Message.success( res.message );
              this.$emit('edit-success');
						}
					});
				}
			});
		},
		onCancel(){
			this.showPoptip = false;
		}
	},
}
</script>

<style lang="less">
.goods-list-sort{
  .ivu-poptip-rel{
    display: flex;
  }
  .text{
    margin-bottom: 6px;
    max-width: 240px;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: 40px;
    line-height: 16px;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    display: -webkit-inline-box;
    word-break: break-all;
    white-space: pre-wrap;
  }
	.content-box{
		padding:10px 0;
		text-align: left;
		.desc{
			margin-left:5px;
			font-size:12px;
			margin-bottom: 5px;
			width:100%;
		}
	}
}
</style>
