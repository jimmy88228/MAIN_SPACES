<style lang="less">
.editor-text-form{
	padding:10px;
}
</style>

<template>
	<div class="editor-text-form">
		<Divider>标题设置</Divider>

		<Form ref="formValidate" :model="formItem" :rules="ruleValidate" label-position="top">
			<FormItem label="是否显示顶部标题">
				<i-switch v-model="formItem.openHeader" size="large">
					<span slot="open">显示</span>
					<span slot="close">隐藏</span>
				</i-switch>
			</FormItem>	
			<FormItem label="标题名称" prop="headerTitle">
				<Input v-model="formItem.headerTitle" placeholder=""></Input>
			</FormItem>
			<FormItem label="文字颜色( 默认随系统主题色 )">
				<ColorPicker v-model="formItem.textColor" style="margin-left:150px;" />
			</FormItem>
			<FormItem label="标题头背景颜色">
				<ColorPicker v-model="formItem.bgColor" style="margin-left:150px;" />
			</FormItem>
		</Form>
		<Divider />
		<Form ref="formValidate2" :model="formItem" label-position="left">
			<FormItem label="显示位置" prop="textAlign">
				<Row type="flex">
					<Col style="width:100px;">
						<strong v-if="formItem.textAlign=='left'">左对齐</strong>
						<strong v-else-if="formItem.textAlign=='center'">居中对齐</strong>
					</Col>
					<Col style="flex:1 1 0%;text-align: right;">
						<RadioGroup v-model="formItem.textAlign" type="button" @on-change="textAlignChange">
							<Radio label="left">
								<Icon type="md-list" />
							</Radio>
							<Radio label="center">
								<Icon type="md-funnel" />
							</Radio>
						</RadioGroup>
					</Col>
				</Row>
			</FormItem>

			<FormItem label="标题大小" prop="nameFontSize">
				<Row type="flex">
					<Col style="width:100px;">
						<strong v-if="formItem.nameFontSize==16">大(16号)</strong>
						<strong v-else-if="formItem.nameFontSize==14">中(14号)</strong>
						<strong v-else-if="formItem.nameFontSize==12">小(12号)</strong>
					</Col>
					<Col style="flex:1 1 0%;text-align: right;">
						<RadioGroup v-model="formItem.nameFontSize" type="button">
							<Radio :label="16">大</Radio>
							<Radio :label="14">中</Radio>
							<Radio :label="12">小</Radio>
						</RadioGroup>
					</Col>
				</Row>
			</FormItem>

			<FormItem label="显示“更多” " prop="showMore">
				<div style="text-align: right;">
					<i-switch v-model="formItem.showMore" size="large">
						<span slot="open">开启</span>
						<span slot="close">关闭</span>
					</i-switch>
				</div>
			</FormItem>
			<div v-if="formItem.showMore" style="background: #eee;padding:10px 0;">
				<FormItem label="“更多”文本 :" prop="showMoreText">
					<Input v-model="formItem.showMoreText" style="width:150px;"></Input>
				</FormItem>
				<FormItem label="“更多”样式 :" prop="showMoreStyle">
					<RadioGroup v-model="formItem.showMoreStyle">
						<Radio label="style1">样式1</Radio>
						<Radio label="style2">样式2</Radio>
						<Radio label="style3">样式3</Radio>
					</RadioGroup>
				</FormItem>
			</div>
		</Form>
	</div>
</template>

<script>
/**
 * 标题文本小工具
 */

export default {
	name: 'textForm',
	components:{

	},
	props:{
		currIndex:{
			type: [Number,String],
			default: 0,
		},
    headerTitle:{
    	type:String,
    	default: ''
    }
	},
    data () {
        return {
			formItem:{
				openHeader: true,
				headerTitle: '',
				textAlign:'left',
				textColor: '',
				bgColor: '',
				nameFontSize: 16,
				showMore: false,
				showMoreStyle: 'style1',
				showMoreText: '查看更多',
			},

			// 表单数据规则
			ruleValidate:{},
        }
    },
    computed: {
	},
	methods: {
		init(){
			// 双向绑定store 的数据
			this.dataList = this.$store.state.app.pageCompList;
			this.formItem = this.dataList[ this.currIndex ].setting;

			// 对缺省内容的初始化
			if( typeof( this.formItem.textAlign ) == 'undefined'){
				this.$set( this.formItem, 'openHeader', true );
				this.$set( this.formItem, 'headerTitle', this.headerTitle );
				this.$set( this.formItem, 'textAlign', 'left');
				this.$set( this.formItem, 'textColor', '');
				this.$set( this.formItem, 'bgColor', '');
				this.$set( this.formItem, 'nameFontSize', 16 );
				this.$set( this.formItem, 'showMore', false );
				this.$set( this.formItem, 'showMoreStyle', 'style1' );
				this.$set( this.formItem, 'showMoreText', '查看更多' );
			}
			
			if( typeof( this.formItem.openHeader ) == 'undefined' ){
				this.$set( this.formItem, 'openHeader', true );
			}
		},
		textAlignChange( val ){

		},
	},
	watch:{
		'currIndex' (to){
			this.init();
		}
	},
	mounted () {
		this.init();
	},
}
</script>
