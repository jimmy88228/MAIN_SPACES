<template>
  <PageTopBase class="send-envelops">
    <Card class="red-packet-list">
      <Tabs :value="tabName" :animated="false" type="card">
        <TabPane name="redEnvelopes" label="指定用户发放">
          <div class="user u_content">
            <Form ref="formItem" :model="formItem" :label-width="150">
              <FormItem label="发放备注">
                <Input
                        class="basic_input"
                        v-model="formItem.note"
                        placeholder="请输入发放备注"
                        clearable/>
              </FormItem>
              <FormItem label="发放数量">
                <Input
                        class="basic_input"
                        v-model="formItem.number"
                        placeholder="请输入发放数量"
                        clearable/>
              </FormItem>
              <FormItem label="选择会员">
                <user-select :data="formItem.userData" type="checkbox" @del-tag="handleTag">
                  <Button type="dashed" @click="handleSelect" class="basic_select">选择会员</Button>
                </user-select>
              </FormItem>
              <FormItem>
                <Button type="primary" @click="handleSend(0)">发放红包</Button>
              </FormItem>
            </Form>
          </div>
        </TabPane>

        <TabPane name="recycle" label="按标签发放">
          <div class="u_content">
            <Form ref="formValidateLabel" :model="formValidateLabel" :label-width="150">
              <FormItem label="发放备注">
                <Input
                        class="basic_input"
                        v-model="formValidateLabel.note"
                        placeholder="请输入发放备注"
                        clearable/>
              </FormItem>

              <FormItem label="发放数量">
                <Input
                        class="basic_input"
                        v-model="formValidateLabel.number"
                        placeholder="请输入发放数量"
                        clearable/>
              </FormItem>

              <FormItem label="按标手动签发放" prop="amount">
                <Button type="primary" style="margin-right: 15px;" :autoLabel="autoLabel" @click="editLabelBtn()">选择手动标签</Button>
                <span>{{ labelTagTip }}</span>
              </FormItem>

              <FormItem>
                <Button type="primary" @click="handleSend(1)">发放红包</Button>
              </FormItem>
            </Form>
          </div>
        </TabPane>
      </Tabs>

      <Modal v-model="autoLabel" @on-ok="makesureLabel" title="选中手动标签" width="850">
          <div class="title" style="margin: 10px auto 20px;">
            <Checkbox :true-value="1" @on-change="showSelectedLabel" :false-value="0" v-model="isSelectedLabel">只显示已选</Checkbox>
            <Input v-model="labelKeywork" clearable placeholder="标签名称" style="width: 250px" />
            <Button type="primary" icon="ios-search" @click="searchTagName">搜索</Button>
          </div>

          <div id="tag-list">
            <li v-for="item in renderData" @click="checkTag(item.id,$event)" :class="{'tagSelected': item['selected']}">{{item.tag_name}}</li>
          </div>
      </Modal>
    </Card>
  </PageTopBase>
</template>

<script>
import UserSelect from '@/views/my-components/list-component/index-edit';
import PageTopBase from '@/views/my-components/page-top-base/index';

export default {
  props: ['id'],
  data () {
    return {
        tabName: 'redEnvelopes',
        autoLabel: false,
        spinShow:false,
        labelTagTip: '',
        isSelectedLabel: false,
        labelKeywork: '',
        check: false,
        userLabelTag:[],
        userLabelTagSelectd: [],
        labelTagSelectTemp: [],
        isSearchTags: false,
        searchTags: [],
        formValidateLabel:{
            note: '',
            number: 1,
            userData: []
        },

        formItem: {
          note: '',
          number: 1,
          userData: []
        }
    }
  },
  components: {
    UserSelect,
    PageTopBase
  },
  methods: {
    loadData () {},
    handleSelect () {
      this.$selectContent({
        mode: 'user',
        type: 'checkbox',
        data: this.formItem.userData,
        getList: (data) => {
          this.formItem.userData = data;
        }
      })
    },
    handleTag (data) {
      this.formItem.userData = data;
    },
    handleSend (type) {
       if (type == 1) {
           //按标签发放表单
           if(this.formValidateLabel.number <= 0){
               this.$Message.error('发放数量不能少于0！');
               return;
           }

           if (this.userLabelTagSelectd.length <= 0 ){
               this.$Message.error('请选择手动标签！');return;
           }
           var selectedLabel = this.userLabelTagSelectd;
           var tagArr = [];
           for (var i in this.userLabelTagSelectd){
               tagArr.push(this.userLabelTagSelectd[i]['id']);
           }

           return this.$ajax.post(this.$api.redpackSendTag, {
               activity_id : this.$route.params.id,
               amount: this.formValidateLabel.number,
               remark: this.formValidateLabel.note,
               tag_ids: tagArr
           }).then((response)=>{
               var res=response.data;
               if(res.code){
                   this.userLabelTag = [];
                   this.userLabelTagSelectd = [];
                   this.formValidateLabel.number = 0,
                       this.formValidateLabel.note = '',
                       this.labelTagTip = '';
                   this.$Message.success('操作成功！');
                   this.spinShow = false;
               }else{
                   this.$Message.error(res.message);
                   this.spinShow = false;
               }
           })
       } else {
           if (this.formItem.number < 1) {
               this.$Message.error('请填写发放数量');
               return false;
           }
           if (this.formItem.userData.length === 0) {
               this.$Message.error('请选择会员');
               return false;
           }
           this.spinShow = true;
           return this.$ajax.post(this.$api.redPacketSend, {
               id: this.id,
               remark: this.formItem.note,
               amount: this.formItem.number,
               send_user: this.formItem.userData.map(item => item.id)
           })
               .then(response => {
                   const res = response.data;
                   if (res.code) {
                       this.$Message.success(res.message);
                   }
                   this.spinShow = false;
               });
       }
    },

    //按标手动签发放
    searchTagName(){
        var keyword = this.labelKeywork.trim(),tags = this.userLabelTag,searchTags = [];
        if (keyword != ''){
            var reg = new RegExp(keyword);
            for (var i in tags){
                if (tags[i]['tag_name'].match(reg)){
                    searchTags.push(tags[i]);
                }
            }
        }
        if (searchTags.length == 0) {
            this.$Message.warning('暂无搜索的标签！');
        }
        this.searchTags = searchTags;
    },
    checkTag(tag_id, event){
        //点击选择标签时触发
        let ids = this.userLabelTagSelectd.map(item => item.id);
        let curItem = this.userLabelTag.find(item => item.id == tag_id);
        let curIndex = this.userLabelTag.findIndex(item => item.id == tag_id);
        this.userLabelTag[curIndex].selected = !curItem.selected;
        if (!ids.includes(tag_id)) {
            this.userLabelTagSelectd.push(curItem);
        } else {
            let curIndex = this.userLabelTagSelectd.findIndex(item => item.id == tag_id);
            this.userLabelTagSelectd.splice(curIndex, 1);
        }
    },
    //点击选中手动标签按钮
    editLabelBtn() {
        this.spinShow = true;
        this.autoLabel = true;
        var selectedValue = this.userLabelTagSelectd;
        return this.$ajax.post(this.$api.usertagManualList, {id: this.$route.params.id})
          .then(response => {
              var res = response.data,
                  tagList = res.tag_list;
              console.log(res.tag_list,selectedValue);
              this.spinShow=false;

              if (selectedValue.length){
                  let selectedIds = selectedValue.map(item => item.id);console.log('xxx: ',selectedIds);
                  if (tagList.length){
                      tagList.forEach(function (value, index) {
                          tagList[index]['selected'] = !selectedIds.includes(value['id']) ? false : true;
                      });
                      this.userLabelTag = tagList;
                      this.userLabelTagSelectd = selectedValue;
                  }

              }else {
                  var tempTagList = [];
                  if (tagList.length){
                      tagList.forEach(function (value, index) {
                          value['selected'] = false;
                          tempTagList.push(value);
                      });
                  }
                  this.userLabelTag = tempTagList;
                  this.userLabelTagSelectd = [];
              }
          });
    },
    scelectedLabel () {
        this.$Message.info('Clicked ok');
    },
    cancel () {},
    makesureLabel () {
        var count = 0, data = this.userLabelTagSelectd;
        for (var i in this.userLabelTagSelectd){
            count += 1;
        }
        this.labelTagTip = '已选中'+count+'个标签';
    },
    showSelectedLabel (value) {
        this.check = value;
    },
  },
  watch: {
      renderData(nV) {
          //console.log('wacth: ',nV)
      }
  },
  computed: {
      renderData () {
          var data = [];
          if (this.searchTags.length){
              data = this.searchTags;
          } else {
              data = this.check ? this.userLabelTagSelectd : this.userLabelTag
          }
          return data;
      }
  }
}
</script>
<style type="less">
  .send-envelops {
    .u_content Form { margin: 20px auto; }
  }
  #tag-list {
    height: 450px;
    overflow-y: scroll;
    padding: 10px;
    border: 1px solid silver;
    border-radius: 10px;
  }
  #tag-list li {
    display: inline-block;
    padding: 1px 10px;
    border: 1px solid #515a6e;
    color: #515a6e;
    text-align: center;
    float: left;
    margin: 5px;
    border-radius: 10px;
    cursor: pointer;
  }
  .tagSelected {
    border: 1px solid #28a5ff !important;
    color: #28a5ff !important;
  }
</style>
