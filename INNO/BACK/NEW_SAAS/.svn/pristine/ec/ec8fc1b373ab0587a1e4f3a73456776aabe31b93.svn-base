<template>
	<div class="goods-tag-edit">
		<Poptip v-model="showPoptip" placement="right" transfer>
			<p class="text">{{tagName}}</p>
			<Icon type="ios-create-outline" size="16" style="margin-left: 5px;cursor:pointer"></Icon>
      <div slot="title">编辑</div>
			<div slot="content" class="content-box">
				<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
					<FormItem label="商品名称" prop="tagName">
						<Input v-model="formItem.tagName" type="textarea"/>
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
	name:'goodsTagEdit',
	props: {
		type:{
      // tag_name: 修改标签名字; 修改标签名字: 是否显示s
			type: String
		},
		tagId:{
			type: [Number, String]
    },
    tagName: {
      type: String
    }
	},
	data() {
		return {
			showPoptip: false,
			formItem:{
				tagName: 0
			},
			ruleValidate:{
				tagName:[{ required: true, message: '名称不能为空', trigger: 'blur' }]
			},
			spinShow: false,
		}
	},
  watch: {
    tagId: {
      handler () {
        this.formItem.tagName = String( this.tagName );
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
					this.$ajax.post( this.$api.goodsChangMesage, {
            type: this.type,
            tag_id: this.tagId,
            tag_name: this.formItem.tagName
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
.goods-tag-edit{
  .ivu-poptip-rel{
    display: flex;
  }
  .text{
    max-width: 240px;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: 40px;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    display: -webkit-inline-box;
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
