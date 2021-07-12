<template>
  <div class="user-select">
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
        <Form ref="formSearch" :model="formSearch" inline class="user_search">
          <!-- <FormItem>
            <Select v-model="formSearch.status" placeholder="状态" style="width:110px" clearable>
              <Option value="-1">全部状态</Option>
              <Option v-for="(item, key) in data.statusList" :value="key" :key="key">{{item}}</Option>
            </Select>
          </FormItem> -->
          <FormItem :label-width="0" class="search_wrapper">
            <Input
                class="user-search_input"
                v-model="formSearch.search"
                placeholder="请输入关键字"
                clearable
                search
                enter-button
                @on-search="searchPage(formSearch)"
                @on-clear="searchPage(formSearch)"
                @keydown.native.enter.prevent>
                <Select v-model="formSearch.type" slot="prepend" class="user-search_select">
                  <Option :value="3">手机号</Option>
                  <Option :value="4">卡号</Option>
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
  name: 'UserSelect',
  mixins: [Mixin, EventMixin],
  components: {
    ListComponent
  },
  data () {
    return {
      formSearch: {
        isInit: 2,
        search: '',
        status: '-1',
        type: 4
      }
    }
  },
  watch: {
    extraAddtion: {
      handler (nV) {
        this.formSearch = Object.assign({}, this.formSearch, this.extraAddtion);
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style lang="less">
.template-modal{
  .user_search{
    .user-search_input{
      width:320px;
      .user-search_select{
        width: 100px;
      }
    }
  }
  .adminstor_item{
    display: flex;
    align-items: center;
    flex-direction: column;
    .img_wrapper{
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
