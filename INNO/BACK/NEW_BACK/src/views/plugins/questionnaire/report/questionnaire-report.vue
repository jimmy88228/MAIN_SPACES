<style lang="less">
.questionnaire_page{
  position:relative;
	margin:20px 20px 20px 20px;
	
  .input_style{
    margin:10px;
    float:left;
  }
  .input_style_right{
    margin:10px;
    float:right;
  }
  .input_style_table_que{
    
    margin-top:20px;
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
  	margin-bottom:10px;
  }
 
}
 .body_one{
    overflow:hidden;
    background-color:#ffffff;
    margin:10px;
    border-radius: 10px;
  }
</style>

<template>
<div class="body_one">
        <div class="questionnaire_page">
        <Spin size="large" fix v-if="spinShow"></Spin>
         <Tabs :animated="false" v-model="this_tab" >
            <TabPane label="所有投票调查" name="tabPane1">
            <div class="oh">
             
                   <div class="input_style_right">
                  <Button type="primary" icon="ios-search" @click="searchmessage">搜索</Button>
                  </div>
                  <div  class="input_style_right">
                  <Input v-model="key"  placeholder="关键字模糊查询" clearable style="width: 200px"></Input>
                  </div>
               </div>
              <div class="input_style_table_que" id="show">
	    	   <Table border :columns="allquestion" :data="all"  size="small" ref="table"></Table>
	    	 </div>
	    	  
	    	<div class="page_style">
	    	<Page :total="allnumber" :page-size="page_size" show-total @on-change="changePage"></Page>
	    	</div>
            </TabPane>
            <TabPane label="已经结束">
             <div class="oh">
          
               </div>
              <div class="input_style_table_que">
	    	   <Table border :columns="endquestion" :data="end" size="small" ref="table"></Table>
	    	 </div>
	    	
	    	<div class="page_style">
	    	<Page :total="endnumber" :page-size="page_size" show-total @on-change="changePageend"></Page>
	    	</div>
              
            </TabPane>
            <TabPane label="正在运行">
             <div class="oh">
            
               </div>
              <div class="input_style_table_que">
	    	   <Table border :columns="startquestion" :data="start" size="small" ref="table"></Table>
	    	 </div>
	    	
	    	<div class="page_style">
	    	<Page :total="startnumber" :page-size="page_size" show-total @on-change="changePagestart"></Page>
	    	</div>
            </TabPane>
            <TabPane label="未开始">
             <div class="oh">
              </div>
              <div class="input_style_table_que">
	    	   <Table border :columns="begquestion" :data="beg" size="small" ref="table"></Table>
	    	 </div>
	    	 
	    	<div class="page_style">
	    	<Page :total="begnumber" :page-size="page_size" show-total @on-change="changePagebeg"></Page>
	    	</div>
            </TabPane>
        </Tabs>
        </div>
        <div>
        </div>
    
      
        <Spin v-if="showPageSpin" :fix="true"></Spin>
</div>

</template>


<script>
import Cookies from 'js-cookie';
import util from '@/libs/util.js';

export default {
 
    data () {
    	return {
   		spinShow:false,
        this_tab:"tabPane1",
        showPageSpin:false,
      	activitymesage:[],
      	modalcopy: false, 
      	imageViewUrl:'', 	
        key:'',  
       	allquestion:[],
      	all:[],
      	startquestion:[],
      	start:[],
      	endquestion:[],
      	end:[],
      	begquestion:[],
      	beg:[],
      	allnumber:0,
      	startnumber:0,
      	endnumber:0,
      	begnumber:0,
        page_size:15,
        allbao:[],
        groupheader:[],
      }
    },
    
    methods: {
        //初始化
        getlist(){
        	this.spinShow=true;
       	 util.ajax.post(util.apiUrl.activityQusetionReport, {
      		page: 1,
      		pageSize:this.page_size,
      		key:this.key,
      	})
      	.then((response) => {
                 var res= response.data;
                 this.allquestion= res.tablehead;
                 this.all=res.dateall.data;
                 this.edittype(this.allquestion,this.allquestion.length,this.all);
                 this.allnumber= Number(res.dateall.count);
                 this.startquestion= res.tableheadone;
                 this.start=res.datestart.data;
                 this.edittype(this.startquestion,this.startquestion.length,this.start);
                 this.startnumber= Number(res.datestart.count);
                 this.endquestion= res.tableheadtwo;
                 this.end=res.dateend.data;
                 this.edittype(this.endquestion,this.endquestion.length,this.end);
                 this.endnumber= Number(res.dateend.count);
                 this.begquestion= res.tableheadthree;
                 this.beg=res.datebeg.data;
                 this.edittype(this.begquestion,this.begquestion.length,this.beg);
                 this.begnumber= Number(res.datebeg.count);
                 this.spinShow=false;
          	}); 
            },
    	changePage(page){//分页
            	util.ajax.post(util.apiUrl.activityGetMore, {
        			page: page,
        			pageSize:this.page_size,
        			key:this.key,
        			type:'all',
        			log_message:1,
            	})
                 .then((response)=>{
                    var res=response.data;
                 	this.all=res.data.data;
                    this.allquestion= res.tablehead;
                    this.edittype(this.allquestion,this.allquestion.length,this.all);
                    this.allnumber= Number(res.data.count);
                     }); 
        	},
        	changePagestart(page){//分页
            	util.ajax.post(util.apiUrl.activityGetMore, {
        			page: page,
        			pageSize:this.page_size,
        			log_message:1,
        			type:'start',
            	})
                 .then((response)=>{
                    var res=response.data;
                 	this.start=res.data.data;
                    this.startquestion= res.tablehead;
                    this.edittype(this.startquestion,this.startquestion.length,this.start);
                    this.startnumber= Number(res.data.count);
                     }); 
        	},
        	changePageend(page){//分页
            	util.ajax.post(util.apiUrl.activityGetMore, {
        			page: page,
        			pageSize:this.page_size,
        			log_message:1,
        			type:'end',
            	})
                 .then((response)=>{
                    var res=response.data;
                 	this.end=res.data.data;
                    this.endquestion= res.tablehead;
                    this.edittype(this.endquestion,this.endquestion.length,this.end);
                    this.endnumber= Number(res.data.count);
                     }); 
        	},
        	changePagebeg(page){//分页
            	util.ajax.post(util.apiUrl.activityGetMore, {
        			page: page,
        			pageSize:this.page_size,
        			log_message:1,
        			type:'beg',
            	})
                 .then((response)=>{
                    var res=response.data;
                 	this.beg=res.data.data;
                    this.begquestion= res.tablehead;
                    this.edittype(this.begquestion,this.begquestion.length,this.beg);
                    this.begnumber= Number(res.data.count);
                     }); 
        	},
        	edittype(name,length,type){
       		 name[(length-1) ]['render'] =(h, params) => {
                 return h('div', [
                     h('span', {
                         props: {
                             type: 'primary',
                             size: 'small'
                         },
                         style: {
                             marginRight: '5px',
                             color:'#2cb7ef',
                             cursor:'pointer'
                         },
                         on: {
                             click: () => {
                            	 var id=type[params.index]['id'];
                                 // alert( this.$route.params.token);
                               this.$router.push('/question/questionnaire-report-det/'+id+'/'+Cookies.get('accessToken'));
                             }
                         }
                     }, '查看-'),
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
                            	 var id=type[params.index]['id'];
                            	// window.open(util.apiHost+'/VoteActivity/Export?access-token='+Cookies.get('accessToken')+'&activity_id='+id,'_blank');

                            	 util.ajax.post(util.apiUrl.activityExporttwo, {
                                		activity_id:id,
                                	})
                                	.then((response) => { 
                                    var res=response.data;
                                        this.$refs.table.exportCsv({
                                            filename: '问卷报表',
                                            columns:res.header,
                                            data:res.list
                                        });
                                	
                                    	 });
                             }
                         }
                     }, '导出-'),
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
                                 this.remove( type[params.index]['id'])
                             }
                         }
                     }, '删除')
                 ]);
             };
            	},
            	//复制
            	copy(index){
           		 if (confirm("确定要复制该调查吗？")) {   
            			
           			 util.ajax.post(util.apiUrl.activityCopy, {
                  		activity_id:index,
                  	})
                  	.then((response) => { 
                      var res=response.data;
                  		if(res.code.code==1){
                  			this.getlist(); 
                      		}else{
                      			this.$Message.info(res.code.msg);
                          		}
                  	
                      	 });
                 }
                	},
            	//删除
            	remove (index) {
                    	 if (confirm("确定要删除该调查吗？")) {   
                          //activityDelActivity
                    		 util.ajax.post(util.apiUrl.activityDelActivity, {
                          		activity_id:index,
                          	})
                          	.then((response) => { 
                          		var res=response.data;
                          		if(res.code==1){
                          			  this.getlist();
                         			 this.$Message.info('删除成功');
                              		}else{
                             			 this.$Message.info(res.msg);
                                  		}
                         		
                              	 });
                        } 
                },
                
         
                  searchmessage(){//搜索
                      util.ajax.post(util.apiUrl. activitySearch, {
                      		key:this.key,
                      	}).then((response) => { 
                           var res=response.data;
                           this.all=res.data.data;
                           this.allquestion= res.tablehead;
                           this.edittype(this.allquestion,this.allquestion.length,this.all);
                           this.allnumber= Number(res.data.count);
                      	 });            	   
                       },
             
                            
    },
    mounted () {   
    this.getlist();
},
    
}//结尾
  
</script>
