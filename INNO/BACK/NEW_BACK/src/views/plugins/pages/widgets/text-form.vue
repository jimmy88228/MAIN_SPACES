<style lang="less">
.editor-text-form{
	padding:10px;
}
</style>

<template>
	<div class="editor-text-form">
		<titleBar>标题组件 设置</titleBar>
		
		<Form ref="formValidate" :model="formItem" :rules="ruleValidate" label-position="top">
			<FormItem label="标题头名称" prop="name">
				<Input v-model="formItem.name" placeholder=""></Input>
			</FormItem>
			<FormItem label="描述内容" prop="desc">
				<Input v-model="formItem.desc" placeholder="" type="textarea" :rows="3"></Input>
			</FormItem>
			<FormItem label="文字颜色( 默认随系统主题色 )">
				<ColorPicker v-model="formItem.textColor" style="margin-left:150px;" />
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

			<FormItem label="描述大小" prop="descFontSize">
				<Row type="flex">
					<Col style="width:100px;">
						<strong v-if="formItem.descFontSize==16">大(16号)</strong>
						<strong v-else-if="formItem.descFontSize==14">中(14号)</strong>
						<strong v-else-if="formItem.descFontSize==12">小(12号)</strong>
					</Col>
					<Col style="flex:1 1 0%;text-align: right;">
						<RadioGroup v-model="formItem.descFontSize" type="button">
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
						<Radio label="style1">只有文字</Radio>
						<Radio label="style2">文字和箭头</Radio>
						<Radio label="style3">只有箭头</Radio>
					</RadioGroup>
				</FormItem>
				<FormItem label="“更多”链接 :" prop="showMoreLink">
					<linkTo
						:selectLink="(typeof(formItem.showMoreLink) != 'undefined' ? formItem.showMoreLink : {})"
						@on-selected="onSelectLink">
					</linkTo>
				</FormItem>
			</div>
		</Form>
	</div>
</template>

<script>
/**
 * 标题文本小工具
 */
import linkTo from '@/views/my-components/link-to/link-to';
import titleBar from '@/views/my-components/title-bar/title-bar';

export default {
  name: 'textForm',
  components: {
    linkTo,
    titleBar,
  },
  props: {
    currIndex: {
      type: [Number, String],
      default: 0
    }
  },
  data () {
    return {
      formItem: {
        name: '标题头',
        desc: '',
        textAlign: 'left',
				textColor: '',
        nameFontSize: 16,
        descFontSize: 12,
        showMore: false,
        showMoreStyle: 'style1',
        showMoreText: '查看更多',
        showMoreLink: {}
      },

      // 表单数据规则
      ruleValidate: {}
    }
  },
  computed: {
  },
  methods: {
    init () {
      // 双向绑定store 的数据
      this.dataList = this.$store.state.app.pageCompList;
      this.formItem = this.dataList[this.currIndex].setting;

      // 对缺省内容的初始化
      if (typeof (this.formItem.textAlign) == 'undefined') {
				this.$set( this.formItem, 'name', '标题头');
				this.$set( this.formItem, 'desc', '');
				this.$set(this.formItem, 'textAlign', 'left');
				this.$set( this.formItem, 'textColor', '');
				this.$set(this.formItem, 'nameFontSize', 16);
				this.$set(this.formItem, 'descFontSize', 12);
				this.$set(this.formItem, 'showMore', false);
				this.$set(this.formItem, 'showMoreStyle', 'style1');
				this.$set(this.formItem, 'showMoreText', '查看更多');
				this.$set(this.formItem, 'showMoreLink', {});
      }
    },
    textAlignChange (val) {

    },
    // 链接到 选中后的回调
    onSelectLink (index, selectedLink) {
      this.$set(this.formItem, 'showMoreLink', selectedLink);
    }
  },
  watch: {
    'currIndex' (to) {
      this.init();
    }
  },
  mounted () {
    this.init();
  }
}
</script>
