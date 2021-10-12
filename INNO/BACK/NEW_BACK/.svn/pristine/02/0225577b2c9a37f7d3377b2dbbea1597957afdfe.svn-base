<template>
  <div class="contact-list-search">
    <Form ref="formSearch" :model="formSearch" inline>
      <FormItem>
        <Input
            class="brand-search_input"
            :style="{width:400+'px'}"
            v-model="formSearch.searchq"
            placeholder="请输入员工手机号/代码/备注搜索"
            clearable
            search
            enter-button
            @on-search="searchPage"
            @on-clear="searchPage"
            @keydown.native.enter.prevent="searchPage"
            >
            <Select v-model="formSearch.searchqType" slot="prepend" style="width:90px">
									  <Option value="mobile">员工手机号</Option>
										<Option value="code">员工代码</Option>
                    <Option value="staff_name">员工姓名</Option>
                    <Option value="store_code">店铺代码</Option>
                    
                    <Option value="remark">备注</Option>
						</Select>
        </Input>
      </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      formSearch: {
        searchq: ''
      }
    }
  },
  methods: {
    searchPage () {
      this.$emit('on-search', this.formSearch);
    },
    clearOptions () {
      this.formSearch = {
        searchq: '',
        searchqType: 'mobile'
      };
    }
  }
}
</script>

<style lang="less">
.contact-list-search{
    .brand-search_input{
        width:220px;
    }
    .ivu-input-icon{
        right: 50px;
    }
}
</style>
