<style lang="less">
.input_style{
	margin:20px;
	float:left;
}
.input_style_right{
	margin:10px;
	float:right;
}
.input_style_table_que{
	
	margin-bottom:20px;
	margin-left:10px;
	margin-right:10px;
	overflow:hidden;
}
.input_style_table_que table{
	width:100%;
}
.page_style{
	text-align:center;
	margin:0 auto;
	margin-top:10px;
	margin-bottom:20px;
}
.body_one{
	overflow:hidden;
	background-color:#ffffff;
	margin:10px 10px 10px 10px;
	border-radius: 10px;
}
.ivu-select-dropdown{
	max-height: 200px;
}

 .ivu-table .demo-table-info-row td{
        background-color: #2db7f5;
        color: #fff;
    }
    .ivu-table .demo-table-error-row td{
        background-color: #ff6600;
        color: #fff;
    }
    .ivu-table td.demo-table-info-column{
        background-color: #2db7f5;
        color: #fff;
    }
    .ivu-table .demo-table-info-cell-name {
        background-color: #2db7f5;
        color: #fff;
    }
    .ivu-table .demo-table-info-cell-age {
        background-color: #ff6600;
        color: #fff;
    }
    .ivu-table .demo-table-info-cell-address {
        background-color: #187;
        color: #fff;
    }

</style>

<template>

<div class="body_one">
 
                <div class="oh" >
                <div  class="input_style">
                <Button type="primary" @click="goback()">返回</Button>
                </div>
                <div  class="input_style">
                <Button type="primary" @click="goexplode()">导出</Button>
                </div>
                 <div class="input_style">
             <DatePicker v-model="datetime" type="datetimerange" placeholder="" style="width: 300px"></DatePicker>
             </div>
                       <div class="input_style">
                               <Select v-model="seart_type" style="width:100px" placeholder="条件">
                                     <Option  value="1" key="insert">卡号</Option>
                                     <Option  value="2" key="del">手机号</Option>
                                </Select>
                    </div>
                        
                  <div  class="input_style">
                  <Input v-model="key"  placeholder="关键字模糊查询" clearable style="width: 200px"></Input>
                  </div>
                   <div class="input_style">
                  <Button type="primary" icon="ios-search" @click="searchmessage">搜索</Button>
                  </div>
                </div>
                
                  
                <div class="input_style_table_que" >
                <Spin size="large" fix v-if="spinShow"></Spin>
                    	    	 <Table border  :columns="groupheader" :data="all"   width="100%"  height="500" size="small" ref="table"></Table>
                    	    	 </div>
               
	    <div>
           <Modal 
            title="图片"
            v-model="modalcopy"
            @on-ok="ok2()">
            
           
             <div style="margin:0 auto;margin-left:30px;margin-right:30px;">
                  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="0">
                   
                   <FormItem label="" prop="name"  v-for="(item,c_index) in imageViewUrl"  :key="item.voteOptionId" :name="item.voteOptionId">
                                   <div class="input_style_table_que">
                                   <h5>{{item.name}}</h5>
                                   <div v-for="(itemss,c_index) in item.array">
                                     <img :src="itemss"  style="width: 30%">
                                     </div>
                                       </div>
                                       
                                </FormItem>
                   </Form>
                </div>
            </Modal>
        </div>	
    	    	

</div>
    
</template>

<script>
import Cookies from 'js-cookie';
import util from '@/libs/util.js';

export default {

	data () {
		 return{
			 key:'',
			 timeshow:'',
			 datetime:'',
			 seart_type:'',
			 spinShow:false,
			 people:'',
			 groupheader:[],
			 all:[],
			 modalcopy: false, 
		     imageViewUrl:[],
		     formValidate:{
				 title:'',
				 name: '',  
				 },
				 ruleValidate:{},
		 }
	},
		 methods:{
            	 getlist(){
            		 this.spinShow=true;
            		 util.ajax.post(util.apiUrl.activityQuestionReportdet, {
         				activity_id:this.$route.params.id,
      		      		key:this.key,
          		      	datetime:this.datetime,
            		    seart_type:this.seart_type,
      		      	})
      		      	.then((response) => {
      		                 var res=response.data;
      		                 this.groupheader= res.header;
        		             this.datetime=res.timeshow;
      		                 this.all=res.list;
        		             this.spinShow=false;
        		             var reg = RegExp(/_IMAGE/);
        		             var numb=0;
        		             var type='';
        		             var str0 = '';
      		                  for(var x in res.header){
        		                 var str = res.header[x].key;
                                        if(str.match(reg)){
											this.groupheader[(numb)]['render'] =(h, params) => {
                                        		 return h('div', [
                   		                	                     h('span', {
                   		                	                         props: {
                   		                	                             type: 'error',
                   		                	                             size: 'small'
                   		                	                         },
                   		                	                         style:{
                   		                	                        	 marginRight: '5px',
                   		                	                             color:'#2cb7ef',
                   		                	                             cursor:'pointer'
                   		                	                                 },
                   		                	                         on: {
                   		                	                             click: () => {
                       		                	                             //alert(1);
                    		                	                            	this.imageViewUrl=[];
                   		                	                            	 this.weixincode(params.index)
                   		                	                             }
                   		                	                         }
                   		                	                     }, '图片')
                   		                	                 ]);
    			                     }; 
    			                     //break;
    			                    // continue;
                                         }
      								     numb++;
      		                  }
      		          	}); 
            		
            	 }, 
                goback(){
                          this.$router.push('/question/questionnaire-report/'+Cookies.get('accessToken'));
                         },
               goexplode(){
                        	 var id=this.$route.params.id;
                        	 var key=this.key;
                        	 var datetime=this.datetime;
                        	 var seart_type=this.seart_type; 
                        	 
                        	//window.open(util.apiHost+'/VoteActivity/Export?access-token='+Cookies.get('accessToken')+'&activity_id='+id+'&key='+key+'&datetime='+datetime+'&seart_type='+seart_type,'_blank');
                        	 util.ajax.post(util.apiUrl.activityExporttwo, {
                          		activity_id:id,
                          		key:key,
                          		datetime:datetime,
                          		seart_type:seart_type,
                          		
                          	})
                          	.then((response) => { 
                              var res=response.data;
                                  this.$refs.table.exportCsv({
                                      filename: '问卷报表',
                                      columns:res.header,
                                      data:res.list
                                  });
                          	
                              	 });
                             },
                             weixincode(index){
                               	 this.modalcopy=true;
                               	 var reg = RegExp(/_IMAGE/);
                               	 for(var x in this.all[index]){
                                		var str = x;
                                        if(str.match(reg)){
                                            for(var y in this.groupheader){
                                            	   if(this.groupheader[y].key==x){
                                                	   	var item= {
																"name": this.groupheader[y].title,
																"array": this.all[index][x]
                                                        	   	}
//                                                 	   alert(this.groupheader[y].title);
                                                	   this.imageViewUrl.push(item);
                                                	   }
                                                }
//                                         	 this.imageViewUrl.push(this.all[index][x]);
                                       	    
                                            } 
                                     
                                   	 }
                               
                                	console.log(this.imageViewUrl);
                                  },
                                  ok2(){
                                      },
                                      searchmessage(){//搜索
                                    	  this.getlist();   
                                           },
         },
	 mounted () {   
		    this.getlist();
		   
		},
}
</script>