<template>
    <Card class="quick-screen-card">
        <Divider class="i-flex" orientation="left">快捷筛选</Divider>
        <div>
            <div class="flex" v-for="(qItem, qIndex) in quickData" :key="qIndex">
                <div class="choose-tip">{{qItem.label}}<template v-if="qItem.label">：</template></div>
                <div >
                    <Button class="choose-btn" @click="screenSelect(qIndex, '')" :ghost="(!qItem.val || qItem.val.length == 0) ? false : true" type="primary">不限</Button>
                    <template v-if="qItem.type == 'radio'">
                        <RadioGroup v-model="qItem.val" class="choose-group flex">
                            <Radio :label="cItem.id" border v-for="(cItem, cIndex) in qItem.list" :key="cIndex">{{cItem.name}}</Radio>
                        </RadioGroup>
                    </template>
                    <template v-else-if="qItem.type == 'checkbox'">
                        <CheckboxGroup v-model="qItem.val" class="choose-group flex">
                            <Checkbox :label="cItem.id" border v-for="(cItem, cIndex) in qItem.list" :key="cIndex">{{cItem.name}}</Checkbox>
                        </CheckboxGroup>
                    </template>
                </div>
				<div>
					<a v-if="qItem.total > 5" @click="showMore(qItem, qIndex)" style="display:inline-block;line-height:32px;">更多</a>
				</div>
            </div>
        </div>
        <div class="p-15">
            <Button type="primary" :disabled="!(tableData.length > 0)" ghost @click="handleExport"><Icon type="md-cloud-upload" /> 导出</Button>
            <Button type="primary" :disabled="!(tableData.length > 0)" @click="creatTask('text')">发消息</Button>
            <Button type="primary" :disabled="!(tableData.length > 0)" @click="creatTask('coupon')">发优惠券</Button>
            <Button type="primary" @click="loadData"><Icon type="ios-search" /> 搜索</Button>
        </div>
        <div class="m-bottom-15 " style="color:#C6241D;">*搜索出来的所有会员，即为发消息/优惠券的会员</div>
        <Table :max-height="600" :loading="tableLoading" :columns="columns" height="600" :data="tableData" ref="myTable">
			<template slot-scope="{ row }" slot="real_name">
				<div class="img_list_wrap">
					<div class="img_fixed">
						<img :src="row.portrait_path" v-if="row.portrait_path" :alt="row.real_name" v-viewer/>
						<img src="@rs/images/default-img.jpg" :alt="row.real_name" v-viewer v-else></img>
					</div>
					<div>{{row.real_name}}</div>
				</div>
			</template>
			<template slot-scope="{ row }" slot="action">
				<a @click="getUserDetail(row.user_id)">详情</a>
			</template>
		</Table>
        <div v-show="pageTotal" class="list_page">
            <Page
            :total="pageTotal"
            :page-size="pageSize"
            :current="currentPage"
            :page-size-opts="pageSizeOpts"
            @on-change="e => changePage(e)"
            @on-page-size-change="ps => handlePageSize(ps)"
            show-elevator
            show-total
            show-sizer></Page>
        </div>
		<!--异步处理导出excel组件-->
		<div class="col">
			<notice :ref="'notice' + item" @finish="loadData" v-for="item in jobIdCol" :key="item"></notice>
		</div>
		<imageText ref="imageTextModel" @on-ok="sendWechatMsg"></imageText>
		<!--任务提示-->
		<Modal 
		v-model="taskModel"
		@on-ok="sendMarketing">
			<div class="flex p-15 f-align-center">
				<div class="space-nowrap">创建任务名称</div>&nbsp;&nbsp;
				<Input placeholder="填写任务名称" v-model="taskName"></Input>
			</div>
		</Modal>
		<Spin size="large" fix v-if="showSpan"></Spin>
    </Card>
</template>
<script>
import PageHelper from '@/libs/page-helper.js';
import mixins from "./mixins.js";
import imageText from '@/views/my-components/image-text/image-text';
import notice from '@/views/my-components/mq-notice/mq-notice';
const ARRAY_KEY = ['rank','manual','basic','buy','goods','mkt','visit','storestaff_tag','erp_tag','R','F','M'];
export default {
    name:"quickCheck",
		components:{imageText, notice},
    mixins: [ PageHelper, mixins],
    data(){
   
        return {
            quickData: [
                {
                    key: "sex",
                    label: "性别",
                    type: "radio",
                    total:2,
                    val:"",
                    list: [
                        {name: "男", id: "1"},
                        {name: "女", id: "2"}
                    ]
                },
                {
                    key: "weixin",
                    label: "关注微信",
                    type: "radio",
                    total:2,
                    val:"",
                    list: [
                        {name: "未关注", id: "1"},
                        {name: "已关注", id: "2"}
                    ]
                },
                {
                    key: "mobile",
                    label: "绑定手机",
                    type: "radio",
                    total:2,
                    val:"",
                    list: [
                        {name: "未绑定", id: "1"},
                        {name: "已绑定", id: "2"}
                    ]
                },
                {
                    key: "rank",
                    label: "会员等级",
                    type: "checkbox",
                    total:0,
                    val:[],
                    list:[]
                },
                {
                    key: "manual",
                    label: "手动标签",
                    type: "checkbox",
                    total:0,
                    val:[],
                    list:[]
                },
                {
                    key: "basic",
                    label: "基础标签",
                    type: "checkbox",
                    total:0,
                    val:[],
                    list:[]
                },
                {
                    key: "buy",
                    label: "消费统计标签",
                    type: "checkbox",
                    total:0,
                    val:[],
                    list:[]
                },
                {
                    key: "goods",
                    label: "商品销售标签",
                    type: "checkbox",
                    total:0,
                    val:[],
                    list:[]
                },
                {
                    key: "mkt",
                    label: "营销标签",
                    type: "checkbox",
                    total:0,
                    val:[],
                    list:[]
                },
                {
                    key: "visit",
                    label: "访问标签",
                    type: "checkbox",
                    total:0,
                    val:[],
                    list:[]
                },
                {
                    key: "storestaff_tag",
                    label: "导购标签",
                    type: "checkbox",
                    total:0,
                    val:[],
                    list:[]
                },
                {
                    key: "erp_tag",
                    label: "ERP标签",
                    type: "checkbox",
                    total:0,
                    val:[],
                    list:[]
                },
                {
                    key: "R",
                    label: "R值",
                    type: "checkbox",
                    total:0,
                    val:[],
                    list:[]
                },
                {
                    key: "F",
                    label: "F值",
                    type: "checkbox",
                    total:0,
                    val:[],
                    list:[]
                },
                {
                    key: "M",
                    label: "M值",
                    type: "checkbox",
                    total:0,
                    val:[],
                    list:[]
                }
            ],
			taskName: "",
			taskModel: false,
			showSpan:true,
			taskType: "",
			jobIdCol: []
        }
    },
		computed:{
			quickReqData(){
				let quickData = this.quickData || [];
				let quickJson  = {};
				for(let i = 0; i < quickData.length; i++){
					let key = quickData[i].key;
					let val = quickData[i].val;
					if(val instanceof Array){
						val = val.join(",")
					}
					quickJson[key] = val;
				}
				return quickJson;
			}
		},
    mounted(){
        this.searchqData();
		// this.loadData();
    },
    methods:{
        screenSelect(qIndex, val){
            let quickData = this.quickData || [];
            let quickItem = quickData[qIndex];
            quickItem.val = quickItem.type == 'radio' ? (val || "") : (val || [])
        },
        searchqData(){
			return this.$ajax.post(this.$api.QuickFiltrateSearchq).then(response=>{
					const res= response.data;
					if(res.code){
						for(let i=0;i<this.quickData.length;i++){
								if(ARRAY_KEY.indexOf(this.quickData[i].key) != -1){
										this.quickData[i].list=res.data[this.quickData[i].key]['list'];
										this.quickData[i].total=res.data[this.quickData[i].key]['total'];
								} 
						}
					}
					this.showSpan=false;
			})  
        },
		onLoadData(page, data){
			console.log("触发");
			this.showSpan = true;
			return this.$ajax.post(this.$api.QuickFiltrateList, {
				...data,
				...this.quickReqData
			}).then(e =>{
				let res = e.data || {};
				if(res.code) {
					let data = res.data || {};
					this.data = data;
				}
			}).catch(e=>{
				this.$Message.warning("请求出错");
			}).finally(()=>{
				this.showSpan = false
			})
		},
		showMore(editRow, index){
			let key = editRow.key || "";
			let type = key;
			let val = editRow.val;
			let list = editRow.list || [];
			let showLimit = 5;
			switch(key){
				case "manual":
				case "basic":
				case "buy":
				case "goods":
				case "mkt":
				case "visit":
				case "storestaff_tag":
				case "erp_tag":
					if(type == "basic") type = "auto";
					if(type == "storestaff_tag") type = "storestaff";
					if(type == "erp_tag") type = "erp";
					if(!(val instanceof Array)) val = [];
					let vals = [];
					for(let i = 0; i < val.length; i++){
						vals.push({
							id: type + val[i],
							tabType: type
						})
					}
					this.$selectContent({
						mode: 'labels',
						type: 'checkbox',
							modeStyle: 'tab',
							showTab: type,
							reqConfig: 'labels',
						data: vals,
						getList: (data) => {
								console.log("data", data);
							let ids = [];
									let viewList = list.slice(0, 5);
									let count = JSON.parse(JSON.stringify(viewList.length));
							for(let i = 0; i < data.length; i++){
								let tabType = data[i].tabType || "";
								let id = data[i].id;
								let name = data[i].name;
								id = id.replace(new RegExp(tabType,'gm'),'');
								id = parseInt(id);
								ids.push(id);
								let hasId = true;
								for(let j = 0; j < count; j++){
									if(id == viewList[j].id){
										hasId = false;
									} 
								}
								if(hasId){
									viewList.push({id, name})
								}
							}
							editRow.val = ids;
							editRow.list = viewList || [];
							console.log("editRow", editRow)
							this.$set(this.quickData, index, editRow);
						}
					});
					break;
			}
		},
		creatTask(type){
			this.taskType = type;
			this.taskModel = true;
		},
		sendMarketing(){
			console.log("任务名称", this.taskName);
			if(!this.taskName) {
				this.$Message.warning({
					content: "请输入任务名称"
				});
				return;
			}
			this.taskModel = false;
			if(this.taskType == 'text'){
				this.$refs["imageTextModel"].showModal();
			} else if(this.taskType == 'coupon'){
				this.$selectContent({
					mode: 'coupon',
					type: 'checkbox',
					data: [],
					getList: (data) => {
						let dataStr = ""
						for(let i = 0; i < data.length; i++){
							dataStr = dataStr ? dataStr + "," + data[i].id : data[i].id;
						}
						this.userSend({
							fast_name: this.taskName,
							fast_type: this.taskType,
							fast_content: dataStr,
							...this.quickReqData,
						})
					}
				});
			}
		},
		sendWechatMsg(data){
				this.userSend({
					fast_name: this.taskName,
					fast_type: this.taskType,
					fast_content: data.data,
					...this.quickReqData,
				})
		},
		userSend(data){
			this.showSpan = true;
			let reqStr = data.fast_type == "text" ? "QuickFiltrateSendNews" : "QuickFiltrateSendBouns"
			return this.$ajax.post(this.$api[reqStr], data).then(e =>{
				let res = e.data || {};
				if(res.code) {
					let jobId = res.data || "";
					// 打开异步提示组件
					this.jobIdCol.push(jobId);
					this.$nextTick(() => {
						this.$refs[`notice${jobId}`][0].showNotice(jobId, "");
					});
				}
				this.$Message.success(res.message);
				// this.loadData();
			}).catch(e=>{
				this.$Message.warning("请求出错");
			}).finally(()=>{
				this.showSpan = false
			})
		},
		handleExport () {
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定导出数据么',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					let formSearch = this.formSearch;
					return this.$ajax.post(this.$api.QuickFiltrateExport,{
						...this.quickReqData
					}).then((response) => {
							var res = response.data;
							if (res.code) {
								var jobId = res.data;
								// 打开异步提示组件
								this.jobIdCol.push(jobId);
								this.$nextTick(() => {
									this.$refs[`notice${jobId}`][0].showNotice(jobId);
								});
								this.$Message.success(res.message);
							} else {
								this.$Message.error(res.message);
							}
					});
				}
			});
		},
		getUserDetail(userId){
			userId = parseInt(userId);
			this.$router.push({
				name: "user-view",
				params: { id: userId}
			})
		},
    }
}
</script>
<style lang="less">
.quick-screen-card{
    .choose-tip{
        line-height:30px;
        width:100px;
        text-align: right;
        margin-right:5px;
    }
    .choose-btn{
        border-radius: 5px;
        line-height:30px;
        height:30px;
        padding:0px 8px;
        margin-right:8px;
        margin-bottom:10px;
    }
    .choose-group{
        display:inline-block;
        vertical-align: top;
        .ivu-radio-default{
            line-height:30px;
            height:30px;
            padding:0px 8px;
            .ivu-radio{
                display: none;
            }
        }
        .ivu-radio-wrapper-checked{
            background-color:#2D8CF0;
            color:#fff;
        }
        .ivu-checkbox-default{
            .ivu-checkbox{
                display:none;
            }
        }
        .ivu-checkbox-wrapper-checked{
            background-color:#2D8CF0;
            color:#fff;
        }
    }
}
</style>