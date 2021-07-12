<template>
  <div class="adminstor-select">
    <list-component ref="listComponent" :status="currentStatus" :table-column="columns" :form-search="formSearch">
      <template v-slot:selected="{ selectedData, delItem }">
        <span class="item adminstor_item" v-for="item in selectedData" :key="item.id">
          <div class="img_wrapper">
            <Avatar :src="item.wx_avatar" v-if="item.wx_avatar"/>
            <Avatar :src="require('@rs/images/default-img.jpg')" v-else/>
          </div>
          <p class="title">{{item.name}}</p>
          <Icon type="ios-close-circle-outline" class="close" title="删除" @click="delItem(item.id)"/>
        </span>
      </template>
      <template v-slot:search="{ searchPage, data }">
        <Form ref="formSearch" :model="formSearch" inline>
          <FormItem>
            <Select v-model="formSearch.status" placeholder="状态" style="width:110px" clearable>
              <Option value="-1">全部状态</Option>
              <Option v-for="(item, key) in data.statusList" :value="key" :key="key">{{item}}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Input
              v-model="formSearch.searchq"
              style="width:320px;"
              placeholder="请输入关键字"
              clearable
              search
              enter-button
              @on-search="searchPage(formSearch)"
              @on-clear="searchPage(formSearch)"
              @keydown.native.enter.prevent>
              <Select v-model="formSearch.searchqType" slot="prepend" style="width:100px">
                <Option value="userName">用户名</Option>
                <Option value="nickName">昵称</Option>
                <Option value="mobile">手机号</Option>
                <Option value="email">Email</Option>
              </Select>
            </Input>
          </FormItem>
        </Form>
      </template>
    </list-component>
  </div>
</template>

<script>
import ListComponent from '../template/template';
import Mixin from './mixin';
import EventMixin from '../event-mixin';

export default {
  name: 'AdminstorSelect',
  mixins: [Mixin, EventMixin],
  components: {
    ListComponent
  },
  data () {
    return {
      formSearch: {
        isInit: 2,
        searchq: '',
        status: '-1',
        searchqType: 'userName'
      }
    }
  }
}
</script>

<style lang="less">
.template-modal{
  .adminstor_item{
    display: flex;
    align-items: center;
    flex-direction: column;
    .img_wrapper{
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid #efefef;
      overflow: hidden;
      margin-bottom: 4px;
    }
  }
}
</style>
