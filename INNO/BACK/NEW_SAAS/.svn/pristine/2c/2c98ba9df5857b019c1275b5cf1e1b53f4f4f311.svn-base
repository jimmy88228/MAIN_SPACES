<template>
  <div>
    <Poptip v-model="showPoptip" placement="right" transfer>
      <slot></slot>
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
      </div>
    </Poptip>
  </div>
</template>

<script>
export default {
  props: ['name'],
  data () {
    return {
      formItem:{
				goods_name: this.name || ''
			},
			ruleValidate:{
				goods_name:[{ required: true, message: '名称不能为空', trigger: 'blur' }]
			},
      rowSpan: 3,
      showPoptip: false
    }
  },
  methods: {
    onSave () {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          this.$emit('get-name', this.formItem.goods_name);
          this.showPoptip = false;
        }
      })
    },
    onCancel(){
			this.showPoptip = false;
		},
  }
}
</script>

<style>

</style>
