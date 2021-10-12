<template>
  <div class="log-search">
    <Form ref="formSearch" :model="formSearch" inline :label-width="70">
      <FormItem label="操作时间" prop="searchTime">
        <DatePicker
          :style="dataStyle"
          v-model="formSearch.searchTime"
          type="datetimerange"
          placeholder="请输入操作时间"
          transfer></DatePicker>
      </FormItem>
      <FormItem label="管理员">
        <adminstor-select :data="adminstorData" type="checkbox" @del-tag="handleTag">
          <Button type="dashed" @click="onSelectAdmin" class="basic_select">选择管理员</Button>
        </adminstor-select>
      </FormItem>
      <FormItem :label-width="0">
        <Input
            class="search_input"
            v-model="formSearch.searchq"
            placeholder="请输入关键字"
            clearable
            search
            enter-button
            @on-search="searchPage"
            @on-clear="searchPage"
            @keydown.native.enter.prevent="searchPage">
            <Select v-model="formSearch.searchType" slot="prepend" class="search_select">
              <Option v-for="(item, key) in logTypeList" :value="key" :key="key">{{ item.name }}</Option>
            </Select>
        </Input>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import AdminstorSelect from '@/views/my-components/list-component/index-edit';

export default {
  props: {
    logTypeList: Object
  },
  components: {
    AdminstorSelect
  },
  data () {
    return {
      formSearch: {
        searchAdminIdList: [],
        searchTime: [],
        searchType: '0',
        searchq: ''
      },
      adminList: [],
      adminstorData: []
    }
  },
  computed: {
    dataStyle () {
      return {
        width: Object.values(this.formSearch.searchTime).every(item => item) ? '340px' : '140px'
      }
    }
  },
  methods: {
    searchPage () {
      this.$emit('on-search', this.formSearch);
    },
    onSelectAdmin(){
      this.$selectContent({
        mode: 'adminstor',
        type: 'checkbox',
        data: this.adminstorData,
        getList: (data) => {
          this.adminstorData = data;
          this.formSearch.searchAdminIdList = data;
        }
      })
    },
    handleTag (data) {
      this.adminstorData = data;
      this.formSearch.searchAdminIdList = data;
    },
    // 选管理员的组件的 回调
    onSelectOk(items){
      this.adminList = items.map(item => {
        return {
          value: item.user_id,
          label: item.user_name
        }
      });
      this.formSearch.searchAdminIdList = this.adminList.map(item => item.value);
    },
  }
}
</script>

<style lang="less">
.log-search{
  .search_input{
    width:320px;
    .search_select{
      width: 120px;
    }
  }
  .ivu-input-icon{
    right: 50px;
  }
  .select_admin{
    margin-left: 10px;
  }
  .ivu-form-item-content{
    display: flex;
  }
}
</style>
