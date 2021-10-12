<style lang="less">
.group_message_area{
  overflow:hidden;
  background-color:#ffffff;
  margin:10px;
  border-radius: 10px;
  .input_style{
    margin:5px;
    float:left;
  }
  .input_style_table{
    margin-top:10px;
    margin-left:20px;
    margin-right:20px;
  }
  .page_style{
    text-align:center;
    margin-bottom:20px;
  }
  
  .radio_div{
    height:200px;
    overflow:scroll;
    overflow:auto;
  }
  .colorshow{
    color:#bfc2c5;
    margin-left:3px;
    height: 20px;
  }
  .card_style{
    float:left;
    margin:20px;
    margin-right:10px;
    width: 20%;
    max-width:239px;
    .ivu-collapse{
      overflow:hidden;
    }
    .ivu-collapse-item{
      .ivu-collapse-header{
      }
      .ivu-icon{
        position:absolute;
        top:50%;
        right:10%;
        margin-top:-4px;
      }
      .ivu-collapse-content{
        padding-left:45px;
      }
    }
    .bg_28A5FF{
      .ivu-collapse-header{
        color:#fff;
      }
    }
    .content_mess{
      padding-right:10px;
      position:relative;
      .ivu-icon{
        position:absolute;
        top:50%;
        right:0px;
        margin-top:-6px;
      }
      .ivu-badge{
        position:absolute;
        top:50%;
        right:10px;
        transform:translateY(-50%);
        -ms-transform:translateY(-50%);
        -moz-transform:translateY(-50%);
        -webkit-transform:translateY(-50%);
        -o-transform:translateY(-50%);
      }
      .ivu-badge-count{
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
      }
      
    }
    
  }
  .table_tab{
    float:left;
    border-radius: 10px;
    width: 75%;
    margin:20px 1%;
  }
  .ivu-col-span-11{
    width:100%;
  }
  .ivu-card.ivu-card-bordered{
    height:150px;
  }
   .demo-badge{
          width: 100%;
          line-height: 30px;
          border-radius: 6px;
          display: inline-block;
      }
  .demo-badge-alone{
          background: #29A6FF !important;
      }
      .content_mess{
    line-height:30px;
        cursor:pointer;
      }
      .ivu-badge-count{
     background: #29A6FF;
      }
      .ivu-badge{
    float:right;
      }
  
  .grounp_tab_area{
    .ivu-tabs-bar{
      margin-bottom:0px;
      border:0 none;
    }
    .ivu-tabs-content{
      padding-top:20px;
      border:1px solid #dddee1;
      -moz-border-radius: 5px;
      -webkit-border-radius: 5px;
      border-radius: 5px;
    }
  }
  
}
.over_hidden{
  height:200px;
  overflow:scroll;
  overflow:auto;
}
.check_box_group{
  .check_box_item{
    width:210px;
    word-break:break-all;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space: nowrap; 
    -webkit-line-clamp:1;
    -webkit-box-orient:vertical;
  }
}
.has_no_data{
  text-align:center;
  margin-top:100px;
}

</style>

<template>
<div class="body_one group_message_area">
        <Spin size="large" fix v-if="spinShow"></Spin>
        <div style=" overflow:hidden;margin-top:20px;">
        <div class="oh" style="margin:10px;border-radius: 10px;background-color:#efefef;line-height: 60px;">
                   <div  class="input_style inline_b" style="margin-left:20px;">
                     <Button @click="goback">返回</Button>
                   <!--   <Button type="primary" @click="allmessage">重置</Button> -->
                        <Button type="primary" @click="allmessage">保存</Button>
                        </div>
                       
                        <div  class="input_style inline_b" style="float:right;margin-right:20px;">
                              
                               <Button type="primary" @click="gotoactivity">创建活动</Button>
                              </div>
                </div>
               <div class="oh">
                    <div  class="input_style inline_b" style="margin-left:20px;">
                                 分组名称 <Input v-model="group_name"  placeholder="分组名" clearable style="width: 200px"></Input>
                                </div>
                   </div>   
            </div>
            
       
            <div class="card_style">
                 <Collapse v-model="tag_list">
                    <Panel   :name="item.id"   v-for="(item,c_index)  in taglist" :label="item.id" :key="item.title">
                         {{item.title}}
                        <p  class="content_mess" slot="content"  v-for="(sonitem,s_index)  in item.son" :label="sonitem.son_id" :key="sonitem.son_title" :name="sonitem.son_title" @click="showmessage(item.id,sonitem.son_id,c_index,s_index,sonitem.select_have,sonitem.type)">
                        {{sonitem.son_title}}
                        <Badge :count="sonitem.select"></Badge>
                        <Icon type="chevron-right"></Icon>
                        </p>
                    </Panel>
                    
                   
                </Collapse>
           </div>
           
           <div class="table_tab grounp_tab_area">
               <Tabs type="card">
                    <TabPane label="会员360">
                      <dataView :grounpId="groudId"></dataView>
                    </TabPane>
                    <TabPane label="会员列表">
                      <div class="input_style_table">
                         <Table border :columns="header" :data="data"  width="100%"  ref="table"></Table>
                        </div>
                        <br>
                        <div class="page_style">
            	    	<Page :total="number" :page-size="page_size" show-total @on-change="changePage"></Page>
            	    	</div>
                    
                    </TabPane>
                  
                </Tabs>
           </div>
           
            <Modal v-model="seart_modal" @on-ok="asyncOK(typenum,one_index,two_index)" @on-cancel="oncancel">
               <div class="oh" >
               <div  class="input_style inline_b">
                      <Input v-model="key"  placeholder="关键字模糊查询" clearable style="width: 200px"></Input>
                      </div>
                <div class="input_style inline_b">
                      <Button type="primary" icon="ios-search" @click="searttab">搜索</Button>
                       <Button type="primary"  @click="tagcreate(typenum,one_index,two_index)">重置</Button>
                       <Button type="primary" icon="ios-search" @click="searttabshow(usertag)">显示已选择</Button>
                      </div>
                 </div>
                <div class="over_hidden">
                  <CheckboxGroup v-model="usertag" size="large">
                    <Checkbox style="margin-right:50px;margin-top:10px;" v-for="item in usertag_list"  :label="item.id" :key="item.id">{{item.tag_name}}</Checkbox>
                  </CheckboxGroup>
                </div>
                
            </Modal>   
         <Modal v-model="one_modal" @on-ok="asyncOK(typenum,one_index,two_index)" @on-cancel="oncancel">
               <div class="oh" >
              
                <div class="input_style inline_b">
                       <Button type="primary"  @click="tagcreate(typenum,one_index,two_index)">重置</Button>
                      </div>
                 </div>
                <div class="over_hidden">
                      <CheckboxGroup v-model="useright" size="large">
                        <Checkbox style="margin-right:50px;margin-top:10px;" v-for="item in useright_list"  :label="item.id" :key="item.id">{{item.name}}</Checkbox>
                      </CheckboxGroup>
                      </div>
            </Modal>   
             <Modal v-model="onecheck_modal" @on-ok="asyncOK(typenum,one_index,two_index)" @on-cancel="oncancel" width="300px;" :title="title_show">
               <div class="oh" style="margin-bottom:20px;" >
               <!-- <div class="input_style inline_b">
                       <Button type="primary"  @click="tagcreate">重置</Button>
                      </div> -->
                 </div>
                <RadioGroup v-model="radio_type" size="large">
                    <Radio label="-1">不限</Radio>
                    <Radio label="0" >{{radio_one}}</Radio>
                    <Radio label="1" >{{radio_two}}</Radio>
               
                </RadioGroup>
            </Modal> 
            <!--城市选择  -->
            <Modal v-model="seart_city"  width="740"><!--@on-ok="asyncOK(typenum,one_index,two_index)" @on-cancel="oncancel"-->
               <Spin size="large" fix v-if="spinShow"></Spin>
               <div class="oh" >
                  <div  class="input_style inline_b">
                    <Input v-model="key_city"  placeholder="关键字模糊查询，可以搜索多个,以英文逗号隔开" clearable style="width: 200px"></Input>
                  </div>
                  <Select v-model="searchAgentId" clearable class="input_style" style="width:200px">
										<Option value="0">全部</Option>
										<Option :value="item.agent_id" v-for="(item,index) in agentList" :key="index" :name="index">
											<span v-for="i in item.level">&nbsp; &nbsp;</span>
											{{item.agent_name}}
											<span style="float:right;color:#ccc;" v-if="item.agent_type==1">自营</span>
											<span style="float:right;color:#ccc;" v-if="item.agent_type==2">加盟</span>
											<span style="float:right;color:#ccc;" v-if="item.agent_type==3">代理</span>
										</Option>
									</Select>
                  <div class="input_style inline_b">
                    <Button type="primary" icon="ios-search" @click="seartcity(city_val,one_index,two_index,value_type)">搜索</Button>
                    <Button type="primary"  @click="tagcreate(typenum,one_index,two_index)">重置</Button>
                    <Button type="primary"  @click="seartcityshow(city_val,value_type)">显示已选择</Button>
                  </div>
                </div>
                <div class="over_hidden">
                  <CheckboxGroup v-model="city_val" size="large" class="check_box_group" v-if="city_list.length > 0">
                    <Checkbox class="check_box_item" style="margin-right:18px;margin-top:10px;" v-for="item in city_list"  :label="item.id" :key="item.id">{{item.tag_name}}</Checkbox>
                  </CheckboxGroup>
                  <div class="has_no_data" v-else>没有数据</div>
                </div>
                <div slot="footer">
                  <Button type="primary" @click="switchCheckAllStore('select')">全选</Button>
                  <Button type="primary" @click="switchCheckAllStore('noSelect')">取消全选</Button>
                  <Button @click="seart_city = false">取消</Button>
                  <Button type="primary" @click="asyncOK(typenum,one_index,two_index)">确定</Button>
                </div>
            </Modal>  
</div>
</template>
<script>
import Cookies from 'js-cookie';	
import util from '@/libs/util.js';
import dataView from '../data_view'
    export default {
        components:{
          dataView
        },
        data () {
            return {
              groudId:0,
              	value_type:'',
            	spinShow:false,
            	group_name:'',
            	seartcat_id:'',
            	searttable:'',
                one_index:'',
                two_index:'',
            	title_show:'',
                radio_one:'',
                radio_two:'',
            	radio_type:'',
            	key_city:'',
            	seart_city:false,
            	city_list:[],
              city_val:[],
              searchAgentId:0,
              agentList:[],
            	one_modal:false,
            	useright_list:[],
            	useright:[],
            	onecheck_modal:false,
                one_model:false,
                typeshow:'',
                typenum:'',
                activity_message:[],
            	usertag_list:[],
                usertag:[],
            	seart_modal:false,
                header:[],
                data:[],
                number:0,
                page_size:15,
            	datetime:'',
            	key:'',
            	tag_list:'base',
            	taglist:[],
            	formvalue:{
            		sex:'',
            		user_ranks:'',
            		star_sign:'',
            		areas:'',
           		 	birth_month:'',
              		is_bind_mobile:'',
              		is_weixin_subscribe:'',
              		usertag_basic:'',
              		usertag_buy:'',
              		usertag_goods:'',
              		smart_mkt_tagids:'',
              		visit_tagids:'',
              		manual_tagids:'',
              		r_ids:'',
              		f_ids:'',
              		m_ids:'',
                	},
          }
        },
        methods: {
            getGrounpId(){
              this.groudId = this.$route.params.id;
            },
            leftmess(){//获取左边信息
              this.spinShow=true;
              util.ajax.post(util.apiUrl.MemberGroupUserlist, {
              id:this.$route.params.id,
              }).then((response)=>{
                var res=response.data;
                this.taglist=res.lefttag;
                this.header=res.header;
                this.formvalue.sex=res.activity_message.sex;
                this.formvalue.is_bind_mobile=res.activity_message.is_bind_mobile;
                this.formvalue. is_weixin_subscribe=res.activity_message. is_weixin_subscribe;
                this.group_name=res.activity_message.group_name;
                this.header[(this.header.length-1) ]['render'] =(h, params) => {
                  const row = params.row;
                  var color = row.weixinSubscribe == 1 ? 'success' : 'error';
                  var text = row.weixinSubscribe == 1 ? '是' : '否';
                  return h('div', [
                          h('Button', {
                          props: {
                              type: color,
                              size: 'small'
                          },
                          style: {
                              marginRight: '5px'
                          },
                          on: {
                          
                          }
                      }, text),
                  ]);
                };
                this.spinShow=false;
              }); 
            },
            gettablelist(){
              util.ajax.post(util.apiUrl.MemberGroupGetmessageurl, {
              id:this.$route.params.id,
              }).then((response)=>{
                var res=response.data;
                this.data=res.message;
                this.number=res.count;
              }); 
            },
            allmessage(){//保存
              if(this.group_name=='' || !this.group_name){
                this.$Notice.error({
                  title: '错误提示！',
                  desc: '分组名字不能为空！'
                });
                return false;
              }
              if(!this.checkedTag()){
                this.$Notice.error({
                  title: '错误提示！',
                  desc: '请至少设置一个分组条件！'
                });
                return false;
                console.log(this.taglist);return false;
              }
              this.spinShow = true;
              util.ajax.post(util.apiUrl.MemberGroupSavemessage, {
                id:this.$route.params.id,
                type:this.$route.params.type,
                from_value:this.taglist,
                group_name:this.group_name,
              }).then((response)=>{
                this.spinShow = false;
                var res=response.data;
                if(this.$route.params.id=='0'){
                  this.$route.params.id=res.id;
                }
                this.$Message.info(res.message);
              });
            },
            changePage(page){
              util.ajax.post(util.apiUrl.MemberGroupGetmessageurl, {
                id:this.$route.params.id,
                page:page,
              }).then((response)=>{
                var res=response.data;
                this.data=res.message;       
              });
            },
            showmessage(table,cat,c_index,s_index,select_have,type){
              //获取对应的标签
              if(type=='one'){
                this.getrightmessage(table,cat,select_have,c_index,s_index);
                this.one_modal=true;
              }
              if(type=='more'){
                this.searttable=table;
                this.seartcat_id=cat;
                this.key='';
                this.getusertag(table,cat,c_index,s_index,select_have);
                this.seart_modal=true;
              }
              if(type=='one_check'){
                this.checkedone(cat,select_have,c_index,s_index);
                this.onecheck_modal=true;
              }
              if(type=='more_city'){
                if(cat=='11'){
                  this.value_type='store';
                }else{
                  this.value_type='';
                }
                this.key_city='';
                this.seartcity(select_have,c_index,s_index,this.value_type);
                this.seart_city=true;
              }
            },
            checkedone(show,select_have,c_index,s_index){//单项选择
              if(show=='1'){//性别
                this.typenum='radio_type';
                this.one_index=c_index;
                this.two_index=s_index;
              
                this.title_show='性别';
                this.radio_one='男';
                this.radio_two='女';
                this.radio_type=select_have;
              }
              if(show=='6'){//手机
                this.typenum='radio_type';
                this.one_index=c_index;
                this.two_index=s_index;
                    
                this.title_show='是否绑定手机';
                this.radio_one='未绑定';
                this.radio_two='已绑定';
                this.radio_type=select_have;
              }
              if(show=='7'){//微信公众号
                this.typenum='radio_type';
                this.one_index=c_index;
                this.two_index=s_index;
                    
                this.title_show='否关注公众号';
                this.radio_one='未关注';
                this.radio_two='已关注';
                this.radio_type=select_have;
              }
            },
            seartcity(select_have,c_index,s_index,value_type){//搜索城市
              this.spinShow=true;
              this.typenum='city_val';
              this.one_index=c_index;
              this.two_index=s_index;
              util.ajax.post(util.apiUrl.MemberGroupGetcity, {
                key:this.key_city || "",
                value_type:value_type || "",
                agentId:this.searchAgentId || 0
              }).then((response)=>{
                var res=response.data || {};
                this.city_list=res.message;
                this.city_val=select_have;
                this.spinShow=false;
                this.agentList=res.agentList || [];
              }); 
            },
            seartcityshow(value,value_type){
              util.ajax.post(util.apiUrl.MemberGroupGetcity, {
                show:1,
                value:value || "",
                value_type:value_type || "",
                agentId:this.searchAgentId || 0
              }).then((response)=>{
                var res=response.data || {};
                this.city_list=res.message;
                //this.agentList=res.agentList || [];
              });
            },
            getusertag(table,cat,c_index,s_index,select_have){//获取标签数据
              this.typenum='usertag';
              this.one_index=c_index;
              this.two_index=s_index;
              console.log("table",table);
              util.ajax.post(util.apiUrl.MemberGroupGettagmessage, {
                table:table,
                cat_id:cat,
              }).then((response)=>{
                var res=response.data;
                this.usertag_list=res.message;
                this.usertag=select_have;
              }); 
            },
            getrightmessage(table,type,select_have,c_index,s_index){//获取其他杂项数据
              if(table=='1' && type=='2'){//会员等级
                this.typenum='useright';
                this.one_index=c_index;
                this.two_index=s_index;
              }
              if(table=='1' && type=='3'){//星座
                this.typenum='useright';
                this.one_index=c_index;
                this.two_index=s_index;
              }
              if(table=='1' && type=='5'){//生日
                this.typenum='useright';
                this.one_index=c_index;
                this.two_index=s_index;
              }
              if(table=='1' && type=='8'){//年龄
                this.typenum='useright';
                this.one_index=c_index;
                this.two_index=s_index;
              }
              if(table=='1' && type=='9'){//会龄
                this.typenum='useright';
                this.one_index=c_index;
                this.two_index=s_index;
              }
              if(table=='1' && type=='10'){//会员来源
                this.typenum='useright';
                this.one_index=c_index;
                this.two_index=s_index;
              }
              if(table=='rfm' && type=='r'){//r
                this.typenum='useright';
                this.one_index=c_index;
                this.two_index=s_index;
              }
              if(table=='rfm' && type=='f'){//f
                this.typenum='useright';
                this.one_index=c_index;
                this.two_index=s_index;
              }
              if(table=='rfm' && type=='m'){//m
                this.typenum='useright';
                this.one_index=c_index;
                this.two_index=s_index;
              }
              util.ajax.post(util.apiUrl.MemberGroupGetRightmessage, {
                type:type,
              }).then((response)=>{
                var res=response.data;
                this.useright_list=res.message;
                this.useright=select_have;
              }); 
            },
            tagcreate(num,one,two){//重置
              if(num=='useright'){
                this.useright=[];
                this.taglist[one].son[two].select_have=[];
                this.taglist[one].son[two].select=0;
              }
              if(num=='radio_type'){
                this.radio_type='-1';
                this.taglist[one].son[two].select_have=-1;
                this.taglist[one].son[two].select=0;
              }
              if(num=='city_val'){
                this.city_val=[];
                this.searchAgentId = 0;
                this.taglist[one].son[two].select_have=[];
                this.taglist[one].son[two].select=0;
              }
              if(num=='usertag'){
                this.usertag=[];
                this.taglist[one].son[two].select_have=[];
                this.taglist[one].son[two].select=0;
              }
            },
            searttabshow(value){//显示已选择
              util.ajax.post(util.apiUrl.MemberGroupGetsearttag, {
                show:1,
                value:value,
                table:this.searttable,
                cat_id:this.seartcat_id,
              }).then((response)=>{
                var res=response.data;
                this.usertag_list=res.message;
              });  
            },
            searttab(){//搜索标签
              util.ajax.post(util.apiUrl.MemberGroupGetsearttag, {
                key:this.key,
                table:this.searttable,
                cat_id:this.seartcat_id,
              }).then((response)=>{
                var res=response.data;
                this.usertag_list=res.message;
              });  
            },
            asyncOK (num,one,two) {//type:要选择的选项，num:选择后的内容，one:键值，two:健值
              this.seart_modal = false;
              if(num=='useright'){
                this.taglist[one].son[two].select_have=this.useright;
                this.taglist[one].son[two].select=this.useright.length;
              }
              if(num=='radio_type'){
                var num=0;
                if(this.radio_type>-1){num=1;}else{num=0;}
                  this.taglist[one].son[two].select_have=this.radio_type;
                  this.taglist[one].son[two].select=num;
              }
              if(num=='city_val'){
                this.seart_city = false;
                this.taglist[one].son[two].select_have=this.city_val;
                this.taglist[one].son[two].select=this.city_val.length;
              }
              if(num=='usertag'){ 
                this.taglist[one].son[two].select_have=this.usertag;
                this.taglist[one].son[two].select=this.usertag.length;
              }
              console.log(this.taglist);
            }, 
            oncancel(){},
            sumnum(){//计算选着的标签
            },
            gotomessage(id){
              this.$router.push('/member-group/brand-group-message/'+id+'/'+Cookies.get('accessToken'));
            },
            goback(){//返回
              var type=this.$route.params.type;   
              if(type=='brand_group'){
                this.$router.push('/member-group/brand-group/'+Cookies.get('accessToken'));
              }  
              if(type=='system_group'){
                this.$router.push('/member-group/system-group/'+Cookies.get('accessToken'));
              }
              if(type=='all_group'){
                this.$router.push('/member-group/all-group/'+Cookies.get('accessToken'));
              }  
            },
            gotoactivity(){
              var type=this.$route.params.type;
              var id=this.$route.params.id; 
              if(type=='brand_group'){
                window.location.href='http://'+window.location.hostname+'/inno/label_voluntary.php?act=voluntary_user&id='+id+'&type='+type+'&showtype=member_group&t='+Date.parse(new Date());
              }  
              if(type=='system_group'){
                window.location.href='http://'+window.location.hostname+'/inno/label_voluntary.php?act=voluntary_user&id='+id+'&type='+type+'&showtype=member_group&t='+Date.parse(new Date());
              }
              if(type=='all_group'){
                window.location.href='http://'+window.location.hostname+'/inno/label_voluntary.php?act=voluntary_user&id='+id+'&type='+type+'&showtype=member_group&t='+Date.parse(new Date());
              }            
            },   
            // 检测分组是否已经选择条件
            checkedTag(){
              var is_ok = false;
              for(var k in this.taglist){
                for(var i in this.taglist[k]['son']){
                  if(this.taglist[k]['son'][i]['select']>0){
                    is_ok = true;
                    return is_ok
                  }
                }
              }
              return is_ok;
            },
            switchCheckAllStore(type){
              let city_list = this.city_list || [];
              if(type == "select"){
                let city_list = this.city_list || [];
                let city_val = this.city_val || [];
                let city_val_str = "," + city_val.join(",") + ",";
                for(let i = 0; i < city_list.length; i++){
                  if(city_val_str.indexOf("," + city_list[i].id + ",") == -1){
                    city_val.push(city_list[i].id);
                  }
                }
                this.city_val = city_val;
              }else if(type == "noSelect"){
                this.city_val = [];
              }
            }	             	      
          },
          mounted () {
            this.getGrounpId();
            this.leftmess();
            this.gettablelist();
          }
    }
</script>