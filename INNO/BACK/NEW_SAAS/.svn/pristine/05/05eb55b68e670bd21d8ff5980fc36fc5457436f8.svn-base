<template>
  <div class="agreement">
    <Card>
      <div class="agreement_header">
        <Button type="primary" @click="confirm">保存</Button>
      </div>
      <Row>
        <Col span="10">
          <titleBar>会员协议设置</titleBar>
          <div class="ui_setting">
            <div>
              <label>是否开启： </label>
              <i-switch size="large" v-model="openSetting" true-value="1" false-value="0">
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
              </i-switch>
            </div>
            <div class="proto_setting">
              <Card style="width: 360px;" bordered>
                <div class="card">
                  <Input type="text" placeholder="请输入协议标题" class="basic_input" clearable v-model="protoTitle"/>
                  <Input type="textarea" placeholder="请输入协议说明" :rows="14" class="desc" v-model="protoDesc"/>
                  <div class="proto_list">
                    <Checkbox v-model="allowProto" class="check">同意</Checkbox>
                    <protocol-select :data="articleList" type="checkbox">
                      <template v-slot:content="{ tagData }">
                        <div class="list">
                          <span v-for="(item, index) in tagData" :key="item.id" class="item">
                            《{{item.article_title}}》<span>{{index === tagData.length - 1 ? '' : '、'}}</span>
                          </span>
                        </div>
                      </template>
                      <Button type="dashed" @click="handleSelected" class="basic_select">选择协议文章</Button>
                    </protocol-select>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Col>
        <Col span="10" offset="2">
          <titleBar>会员注册设置</titleBar>
          <div class="regis_setting">
            <Form ref="formValidate" :model="formItem" :label-width="120" label-colon>
              <FormItem label="强制开启">
                <i-switch size="large" v-model="formItem.openUserRegister" true-value="1" false-value="0" disabled>
                  <span slot="open">开启</span>
                  <span slot="close">关闭</span>
                </i-switch>
              </FormItem>
              <FormItem label="是否强制注册">
                <Select v-model="formItem.forceType" >
                  <Option value="0">不做限制</Option>
                  <Option value="1">不同意授权允许继续浏览小程序</Option>
                  <Option value="2">不同意授权无法继续浏览小程序</Option>
                </Select>
              </FormItem>
              <FormItem label="注册方式设置">
                <Select v-model="formItem.registerType"  >
                  <Option value="0">注册时只需授权</Option>
                  <Option value="1">注册时授权并且绑定手机</Option>
                  <Option value="2">注册时只需授权，加入购物车，立即购买需绑定手机</Option>
                  <Option value="3">注册时授权并且完善资料</Option>
                  <Option value="4">注册时只需授权，加入购物车，立即购买需完善资料</Option>
                  <Option value="5">注册时授权并且绑定手机，加入购物车，立即购买需要完善资料</Option>
                </Select>
              </FormItem>
            </Form>
            <div class="tip">
              <p>注：</p>
              <p>1.强制注册为要求会员必须先完成注册才可浏览商城，默认不限制</p>
              <p>2.注册方式为会员进入个人中心自主授权需要完成的步骤，结算可单独配置要求绑定手机和完善资料。默认只要微信授权</p>
              <p>3.如使用积分商城必须授权并完成绑卡操作。默认为绑定手机，开启完善资料的情况下请开启:【个人资料自定义】-【开启绑定手机】</p>
            </div>
          </div>
          <titleBar>会员扫码/绑卡归属设置</titleBar>
          <div class="card_setting">
            <Form ref="formValidate" :model="formCardItem" :label-width="120" label-colon>
              <FormItem label="归属店铺逻辑">
                <Select v-model="formCardItem.storeType" >
                 <Option value="1">默认店铺则覆盖为扫码店铺，绑旧卡以ERP归属为准</Option>
                 <Option value="2">都以最后一次扫码为准，绑旧卡以线上归属为准</Option>
                 <Option value="3">扫码不做处理，绑旧卡以ERP归属为准</Option>
                </Select>
              </FormItem>
              <FormItem label="归属店员逻辑">
                <Select v-model="formCardItem.staffType" >
                  <Option value="1">无归属店员扫码覆盖，绑旧卡以ERP归属为准</Option>
                  <Option value="2">都以最后一次扫码为准，绑旧卡以线上归属为准</Option>
                  <Option value="3">扫码不处理，绑旧卡以ERP归属为准</Option>
                </Select>
              </FormItem>
            </Form>
          </div>
          <titleBar>退货协议设置</titleBar>
          <div class="refund_setting">
            <Form ref="formValidate" :model="formRefundItem" :label-width="120" label-colon>
              <FormItem label="是否开启">
                <i-switch size="large" v-model="formRefundItem.openRefundSetting" true-value="1" false-value="0">
                  <span slot="open">开启</span>
                  <span slot="close">关闭</span>
                </i-switch>
              </FormItem>
              <div class="proto_list proto_list_fixed">
                <label class="title">退款协议文章:</label>
                <protocol-select :data="returnArticleList" type="checkbox">
                  <template v-slot:content="{ tagData }">
                    <div class="list">
                      <span v-for="(item, index) in tagData" :key="item.id" class="item">
                        《{{item.article_title}}》<span>{{index === tagData.length - 1 ? '' : '、'}}</span>
                      </span>
                    </div>
                  </template>
                  <Button type="dashed" @click="handleReturnSelected" class="basic_select">选择协议文章</Button>
                </protocol-select>
              </div>
            </Form>
          </div>

          <titleBar>会员权益设置</titleBar>
          <div class="refund_setting">
            <Form ref="formValidate"  :label-width="120" label-colon>
              <div class="proto_list proto_list_fixed">
                <label class="title">会员权益文章:</label>
               <protocol-select :data="RightArticleList" type="radio">
                  <template v-slot:content="{ tagData }">
                    <div class="list">
                      <span v-for="(item, index) in tagData" :key="item.id" class="item">
                        《{{item.article_title}}》<span>{{index === tagData.length - 1 ? '' : '、'}}</span>
                      </span>
                    </div>
                  </template>
                  <Button type="dashed" @click="handleRightSelected" class="basic_select">选择协议文章</Button>
                </protocol-select>
              </div>
            </Form>
          </div>

        </Col>
      </Row>
    </Card>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import ProtocolSelect from '@/views/my-components/list-component/index-edit';
import titleBar from '@/views/my-components/title-bar/title-bar';

export default {
  components: {
    titleBar,
    ProtocolSelect
  },
  data () {
    return {
      id: 0,
      spinShow: false,
      openSetting: '0',
      protoTitle: '',
      protoDesc: '',
      allowProto: false,
      formItem: {
        openUserRegister: '1',
        forceType: 1,
        registerType: 1
      },
      formCardItem: {
        storeType: 1,
        staffType: 1
      },
      formRefundItem: {
        openRefundSetting: '0'
      },
      articleList: [],
      returnArticleList: [],
      RightArticleList: []
    }
  },
  methods: {
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.agreementList)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.id = res.data && res.data.items.id;
          this.openSetting = res.data && res.data.items.is_enabled;
          this.protoTitle = res.data && res.data.items.agreement_title;
          this.protoDesc = res.data && res.data.items.agreement_content;
          this.formRefundItem.openRefundSetting = res.data && res.data.return.is_enabled;
          this.articleList = res.data && res.data.items.article_list.map(item => Object.assign({}, item, {
            name: item.article_title
          }));
          this.returnArticleList = res.data && res.data.return.article_list.map(item => Object.assign({}, item, {
            name: item.article_title
          }));
          this.RightArticleList = res.data && res.data.right.article_list.map(item => Object.assign({}, item, {
            name: item.article_title
          }));
          this.formItem.forceType = res.data && res.data.items.applet_force_auth;
          this.formItem.registerType = res.data && res.data.items.applet_auth_required;
          this.formCardItem.storeType = res.data && res.data.items.store_cover_rule;
          this.formCardItem.staffType = res.data && res.data.items.staff_cover_rule;
        }
        this.spinShow = false;
      });
    },
    handleSelected (selected) {
      this.$selectContent({
        mode: 'protocol',
        type: 'checkbox',
        data: this.articleList,
        getList: (data) => {
          this.articleList = data;
        }
      });
    },
    handleReturnSelected (selected) {
      this.$selectContent({
        mode: 'protocol',
        type: 'checkbox',
        data: this.returnArticleList,
        getList: (data) => {
          this.returnArticleList = data;
        }
      });
    },
    handleRightSelected (selected) {
      this.$selectContent({
        mode: 'protocol',
        type: 'radio',
        data: this.RightArticleList,
        getList: (data) => {
          this.RightArticleList = data;
        }
      });
    },
    confirm () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.agreementsave, {
        id: this.id,
        is_enabled: this.openSetting,
        agreement_title: this.protoTitle,
        agreement_content: this.protoDesc,
        article_ids: this.articleList,
        agreement_type: 'USER',
        applet_auth_required: this.formItem.registerType,
        applet_force_auth: this.formItem.forceType,
        store_cover_rule: this.formCardItem.storeType,
        staff_cover_rule: this.formCardItem.staffType,
        return: {
          is_enabled: this.formRefundItem.openRefundSetting,
          article_ids: this.returnArticleList,
          agreement_type: 'RETURN'
        },
        right:{
          is_enabled:1,
          article_ids: this.RightArticleList[0].id ? this.RightArticleList[0].id:0,
          agreement_type: 'USER_RIGHT'
        }
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success(res.message)
        }
        this.spinShow = false;
      });
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.agreement{
  .proto_list{
    display: flex;
    width: 300px;
    align-items: flex-start;
    .check, .title{
      flex-shrink: 0;
    }
    .list{
      word-break: break-all;
      .item{
        color: rgb(209, 197, 164);
      }
    }
    .title{
      text-align: right;
      flex-basis: 120px;
      padding: 0 12px 10px 0;
    }
    &.proto_list_fixed{
      width: 100%;
    }
  }
  .agreement_header{
    text-align: right;
  }
  .ui_setting{
    margin: 0 20px;
  }
  .proto_setting{
    margin-top: 10px;
    .card{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .desc{
        width: 300px;
        margin: 10px 0;
      }
    }
  }
  .regis_setting{
    .tip{
      color: red;
      margin-left: 20px;
    }
  }
  .refund_setting{
    .ivu-form-item{
      margin-bottom: 0;
    }
  }
}
</style>
