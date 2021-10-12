<template>
  <list-component ref="listComponent" :status="currentStatus" :table-column="columns" :form-search="formSearch">
    <template v-slot:search="{ searchPage }">
      <Form inline style="display: flex;">
        <Row>
          <Col span="6">
            <span>等级</span>
            <Select v-model="formSearch.is_level" style="width:80px">
                <Option  value="0" >全部</Option>
                <Option  value="1" >等级一</Option>
                <Option  value="2" >等级二</Option>
            </Select>
          </Col>
          <Col span="6">
            <span>状态</span>
            <Select v-model="formSearch.status" style="width:80px">
                <Option  value="-1" >全部</Option>
                <Option  value="0" >离职</Option>
                <Option  value="1" >在职</Option>
                <Option  value="2" >兼职</Option>
            </Select>
          </Col>
          <Col span="8">
          <FormItem>
                <Input
                v-model="formSearch.searchq"
                style="width:300px;"
                placeholder="关键词搜索"
                clearable
                search
                enter-button
                @on-search="searchPage(formSearch)"
                @on-clear="searchPage(formSearch)"
                @keydown.native.enter.prevent>
                <Select v-model="formSearch.searchq_type" slot="prepend" style="width:120px;">
                  <Option value="dstb_staff_code">代码</Option>
                  <Option value="dstb_staff_phone">手机号</Option>
                </Select>
              </Input>
          </FormItem>
           </Col>
        </Row>
      </Form>
    </template>
  </list-component>
</template>

<script>
import ListComponent from '../template/template';
import Mixin from './mixin';
import EventMixin from '../event-mixin';

export default {
  name: 'StaffSelect',
  mixins: [Mixin, EventMixin],
  components: {
    ListComponent
  },
  data () {
    return {
      formSearch: {
        is_level: '0', //等级 0全部 1 等级一 2 等级二
        status: '-1', //分销员状态 -1全部 0 离职 1 在职 2 兼职
        searchq: '',  //搜索值
        searchq_type: 'dstb_staff_code',  //搜索类型
      }
    }
  }
}
</script>
