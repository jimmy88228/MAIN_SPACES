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
                </div>
                
                
                <div style="margin:0 auto;margin-left:30px;margin-right:30px;">
                  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="0">
                   <FormItem label="" prop="title">
                           <div class="page_style">
                                           <h2>{{title.activity_name}}</h2>
                                           </div>
                    </FormItem>
                
                   <FormItem label="" prop="name"  v-for="(item,c_index) in count"  :key="item.voteOptionId" :name="item.voteOptionId">
                                   <div class="input_style_table_que">
                                     <h3>{{item.title}} <span>[{{item.childTitle}}]</span></h3>
                                     <Button type="success" long>本题填写总票数：{{item.totalCount}}</Button><br>
                                    
                    	    	  <Table :row-class-name="rowClassName"  :columns="groupheader" :data="item.optionDetails"></Table> 
                    	    	
                    	    	 </div>
                                </FormItem>
                   </Form>
                </div>
               
	    	 
    	    	

</div>

</template>

<script>
import Cookies from 'js-cookie';
import util from '@/libs/util.js';

export default {

	data () {
		 return{
			 title:'',
			 count:'',
			 groupheader:[],
			 formValidate:{
				 title:'',
				 name: '',  
				 },
				 ruleValidate: {},
			 }
		 },
		 methods:{
            	 getlist(){
        			 util.ajax.post(util.apiUrl.activityQusetionMessage, {
        		      		activity_id:this.$route.params.id
        		      	})
        		      	.then((response) => {
        		                 var res=response.data;
        		                 this.groupheader= res.header;
        		                 this.title=res.name;
        		                 this.count=res.list;
        		                 this.groupheader[(2)]['render'] =(h, params) => {
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
      		                	                            	var id=this.$route.params.id;
      		                	                            	//console.log(params);
    		                	                               this.$router.push('/question/questionuserlist/'+id+'/'+params.row.voteOptionId+'/'+params.row.voteOptionChildId+'/'+Cookies.get('accessToken'));
     		                	                                 //alert( '/question/questionmessage/'+id+'/'+params.row.voteOptionId+'/'+params.row.voteOptionChildId+'/'+Cookies.get('accessToken'));
     		                	                             }
     		                	                         }
     		                	                     }, params.row.totalCount)
     		                	                 ]);
            		                 },
        		                  this.groupheader[(1)]['render'] =(h, params) => {
										 var arrH=[];
										
         		                	if(params.row.imgUrls!=''){
        		                		 for(var x in params.row.imgUrls){
        		                			 arrH[x] = h('Avatar', {
        		                                 props: {
        		                                   shape:'square',
        		                                     size:'large',
        		                                 },
        		                                 style:{
            		                                 float:'left',
        		                                	 margin: '5px 5px 5px 5px',
     		                                	     color:'#ffffff',
 				                                     width:'60px',
 					                                 height:'60px',
 					                                 textAlign: 'center',
 				                                    // border:'1px solid #ccc',
 				                                     background: 'url("'+params.row.imgUrls[x]+'")',
 				                                     backgroundSize:'contain',
 				                                     backgroundRepeat:'no-repeat',
  				                                    backgroundPosition:'center center',
        		                                 },
        		                            });
        		                		 }
             		                	}else{
                 		                	//alert(2)
             		                		arrH[0]= h('div', {
          		                                 props: {
          		                                   shape:'square',
          		                                     size:'large',
          		                                 },
          		                                 style:{
              		                                 marginRight: '5px',
   				                                     color:'#ffffff',
   				                                     width:'10px',
   					                                 height:'10px',
   					                                 textAlign: 'center',
   				                                     //border:'0px solid #fff',
   				                                     background: 'url()',
   				                                     backgroundSize:'contain',
   				                                     backgroundRepeat:'no-repeat',
          		                                 },
          		                            });
                 		                	}
          		                		 
			                         return h('div',arrH);
			                     }; 
        		          	}); //
            	 }, 
                goback(){
                         
                		 this.$router.push('/question/questionnaire/'+Cookies.get('accessToken'));
                         },

            	 rowClassName (row, index) {
                     /*  if (index === 1) {
                         return 'demo-table-info-row';
                     } else if (index === 3) {
                         return 'demo-table-info-row';
                     }   */
                     return ''; 
                            // push
                 }
         },
	 mounted () {   
		    this.getlist();
		   
		},
}
</script>