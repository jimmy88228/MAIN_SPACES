<style lang="less">
.page-setting-form{
	padding: 0 15px 0 10px;
}
</style>

<template>
	<div class="page-setting-form">
		<Form ref="formValidate" :model="formItem" :rules="ruleValidate" label-position="top">
			<FormItem label="页面名称" prop="name">
				<Input v-model="formItem.name" placeholder="请输入属性名称"></Input>
			</FormItem>
      <FormItem label="所属分类">
        <Select v-model="formItem.cat_id" placeholder="请选择分类..." style="width:110px">
          <Option v-for="(item, key) in catList" :value="item.id" :key="item.id">{{item.name}}</Option>
        </Select>
      </FormItem>
			<FormItem label="页面描述" prop="page_desc">
				<Input v-model="formItem.page_desc" placeholder="请输入属性名称" type="textarea" maxlength="120" show-word-limit :rows="3"></Input>
			</FormItem>
		</Form>
	</div>
</template>

<script>
/**
 * 商品小工具
 */
export default {
  name: 'pageSettingForm',
  props:{
    catList:{
      type:Array,
      default: ()=>[],
    }
  },
  data () {
    return {
      formItem: {
        name: '',
        cat_id: 0,
      },

      // 表单数据规则
      ruleValidate: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {

  },
  methods: {
    init () {
      // 和store 数据绑定和更新
      this.formItem = this.$store.state.app.pageInfo;
    }
  },
  watch: {
    // 观察 list 的变化
    '$store.state.app.pageInfo' (to) {
      this.init();
    }
  },
  mounted () {
    this.init();
  }
}
</script>
