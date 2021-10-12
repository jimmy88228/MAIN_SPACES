<template>
  <div class="user-setting">
    <Card @click.native="handleGlobal">
      <div class="header">
        <Button type="primary" @click="confirm">保存</Button>
      </div>
      <titleBar>自定义个人资料</titleBar>
      <Row>
        <Col span="10">
          <Card>
            <p slot="title">可拖拽到右边,添加标签</p>
            <div class="list">
              <div
                class="item"
                :class="{'disabled': item.unUsed}"
                v-for="item in data.originData"
                :key="item.key"
                :draggable="!item.unUsed"
                @dragstart="handleDragStart($event, item)">
                <Input
                  v-show="item.edit"
                  style="width: 140px;"
                  maxlength="6"
                  show-word-limit
                  placeholder="请输入名称"
                  v-model="item.enKey"
                  @click.native.stop
                  @keydown.native.enter.prevent="handleCompelte(item.key)"/>
                <p class="title" @click.stop="handleInput(item.key)" v-show="!item.edit">{{item.enKey}}:</p>
                <RadioGroup v-model="sexModel1" v-if="item.key === 'sex'">
                  <Radio label="0">男</Radio>
                  <Radio label="1">女</Radio>
                </RadioGroup>
                <p class="value" v-else>{{item.val}}</p>
                <span class="comment" v-if="!item.readonly">{{item.title}}</span>
              </div>
            </div>
          </Card>
        </Col>
        <Col span="10" offset="2">
          <Card>
            <p slot="title">个人资料预览</p>
            <Card class="requied_card">
              <p slot="title">必填项</p>
              <div class="requied_content"
                @dragenter.prevent
                @dragover.prevent
                @drop="handleDragRequired">
                  <template v-if="data.required.length === 0">
                    <div class="empty">可拖拽左边数据至此,添加标签</div>
                  </template>
                  <div class="list">
                    <div
                      class="item item_disabled"
                      v-for="item in data.required"
                      :key="item.key">
                      <p class="title">{{item.enKey}}:</p>
                      <RadioGroup v-model="sexModel2" v-if="item.key === 'sex'">
                        <Radio label="0">男</Radio>
                        <Radio label="1">女</Radio>
                      </RadioGroup>
                      <p class="value" v-else>{{item.val}}</p>
                      <Icon type="ios-close-circle-outline" color="red" title="删除" size="24" class="close" @click="delItem('required', item.key)"/>
                    </div>
                  </div>
              </div>
            </Card>
            <Card>
              <p slot="title">选填项</p>
              <div class="optional_content"
                @dragenter.prevent
                @dragover.prevent
                @drop="handleDragOptional">
                  <template v-if="data.optional.length === 0">
                    <div class="empty">可拖拽左边数据至此,添加标签</div>
                  </template>
                  <div class="list">
                    <div
                      class="item item_disabled"
                      v-for="item in data.optional"
                      :key="item.key">
                      <p class="title">{{item.enKey}}:</p>
                      <RadioGroup v-model="sexModel3" v-if="item.key === 'sex'">
                        <Radio label="0">男</Radio>
                        <Radio label="1">女</Radio>
                      </RadioGroup>
                      <p class="value" v-else>{{item.val}}</p>
                      <Icon type="ios-close-circle-outline" color="red" title="删除" size="24" class="close" @click="delItem('optional', item.key)"/>
                    </div>
                  </div>
              </div>
            </Card>
            <div class="control">
              <div class="binding">
                <label class="title">显示默认性别</label>
                <RadioGroup v-model="showsex" class="group">
                  <Radio label="0">男</Radio>
                  <Radio label="1">女</Radio>
                </RadioGroup>
              </div>
              <div class="binding">
                <label class="title">显示绑定手机</label>
                <RadioGroup v-model="showBindingMobile" class="group">
                  <Radio label="1">显示</Radio>
                  <Radio label="0">不显示</Radio>
                </RadioGroup>
              </div>
              <div class="protocol">
                <span class="title">点击详阅</span>
                <protocol-select :data="articleList" type="checkbox">
                  <template v-slot:content="{ tagData }">
                    <div class="list_inner">
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
        </Col>
      </Row>
    </Card>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>
<script>
import titleBar from '@/views/my-components/title-bar/title-bar';
import ProtocolSelect from '@/views/my-components/list-component/index-edit';

export default {
  components: {
    titleBar,
    ProtocolSelect
  },
  data () {
    return {
      data: {
        originData: [],
        required: [],
        optional: []
      },
      tempOriginData: [],
      showBindingMobile: '1',
      showsex: '0',
      sexModel1: '0',
      sexModel2: '0',
      sexModel3: '0',
      articleList: [],
      spinShow: false
    }
  },
  methods: {
    loadData (page, data) {
      this.spinShow = true;
      return this.$ajax.post(this.$api.editInfoPage)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.tempOriginData = res.data && res.data.originData;
          this.data.originData = res.data && res.data.originData.map(item => {
            return Object.assign({}, item, {
              edit: false
            })
          });
          this.articleList = res.data && res.data.article_list.map(item => Object.assign({}, item, {
            name: item.article_title
          }));
          this.showBindingMobile = res.data && String(res.data.show_mobile);
          this.showsex = res.data && String(res.data.sex_default);
        }
        this.spinShow = false;
      });
    },
    confirm () {
      const tempCustom = this.tempOriginData.filter(item => !item.readonly);
      const custom = this.data.originData.filter(item => !item.readonly);
      const result = [];
      tempCustom.forEach(tempItem => {
        custom.forEach(item => {
          if (tempItem.key === item.key && tempItem.enKey !== item.enKey) {
            result.push(item);
          }
        })
      });
      this.spinShow = true;
      return this.$ajax.post(this.$api.personalPagesave, {
        originData: result.length === 0 ? null : result,
        required: this.data.required.length === 0 ? null : this.data.required,
        optional: this.data.optional.length === 0 ? null : this.data.optional,
        article_list: this.articleList.map(item => item.id),
        show_mobile: this.showBindingMobile,
        sex_default: this.showsex
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
        }
        this.spinShow = false;
      });
    },
    handleDragStart (e, item) {
      // 拖拽时转为文本
      this.handleGlobal();
      const stringifyItem = JSON.stringify(item);
      e.dataTransfer.setData('getItem', stringifyItem);
    },
    handleDragRequired (e) {
      const parseItem = JSON.parse(e.dataTransfer.getData('getItem'));
      this.data.required.push(parseItem);
      const disableIndex = this.data.originData.findIndex(item => item.key === parseItem.key);
      this.data.originData[disableIndex].unUsed = true;
    },
    handleDragOptional (e) {
      const parseItem = JSON.parse(e.dataTransfer.getData('getItem'));
      this.data.optional.push(parseItem);
      const disableIndex = this.data.originData.findIndex(item => item.key === parseItem.key);
      this.data.originData[disableIndex].unUsed = true;
    },
    delItem (type, key) {
      const index = this.data.originData.findIndex(item => item.key === key);
      this.data.originData[index].unUsed = false;
      const curIndex = this.data[type].findIndex(item => item.key === key);
      this.data[type].splice(curIndex, 1);
    },
    handleSelected () {
      this.$selectContent({
        mode: 'protocol',
        type: 'checkbox',
        data: this.articleList,
        getList: (data) => {
          this.articleList = data;
        }
      });
    },
    handleInput (key) {
      const index = this.data.originData.findIndex(item => item.key === key);
      if (this.data.originData[index].readonly) {
        this.$Message.error('不可编辑');
        return;
      } else if (this.data.originData[index].unUsed) {
        return;
      }
      this.data.originData[index].edit = true;
    },
    handleGlobal () {
      this.data.originData.forEach(item => item.edit = false);
    },
    handleCompelte (key) {
      const index = this.data.originData.findIndex(item => item.key === key);
      this.data.originData[index].edit = false;
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.user-setting{
  .header{
    text-align: right;
  }
  .list{
    .item{
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      border: 1px solid #efefef;
      margin-bottom: 20px;
      cursor: move;
      .title{
        flex-basis: 120px;
        text-align: right;
        padding: 10px 12px 10px 12px;
      }
      &:last-child{
        margin: 0;
      }
      &.disabled{
        cursor: not-allowed;
        color: #efefef;
      }
      &.item_disabled{
        cursor: default;
      }
      .close{
        display: none;
        position: absolute;
        right: -12px;
        top: -12px;
        cursor: pointer;
      }
      &:hover .close{
        display: block;
      }
      .comment{
        position: absolute;
        right: 10px;
        top: -16px;
        background: #fff;
        padding: 4px 10px;
      }
    }
  }
  .requied_content, .optional_content{
    width: 100%;
    min-height: 100px;
    .empty{
      width: 100%;
      height: 100px;
      line-height: 100px;
      text-align: center;
      vertical-align: middle;
      border: 1px dashed #efefef;
    }
  }
  .requied_card{
    margin-bottom: 20px;
  }
  .control{
    margin-top: 10px;
    .binding{
      margin: 10px 0;
      .title, .group{
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
  .protocol{
    display: flex;
    align-items: flex-start;
    .title{
      flex-shrink: 0;
      flex-basis: 84px;
      text-align: right;
    }
    .list_inner{
      word-break: break-all;
      margin-bottom: 10px;
      .item{
        color: rgb(209, 197, 164);
      }
    }
  }
}
</style>
