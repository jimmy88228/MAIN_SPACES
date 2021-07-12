<template>
    <div class="marketing-page span-parent">
        <Card class="market-card" :dis-hover="false">
            <Divider custom orientation="left">智能营销方案</Divider>
            <div class="market-tip">请注意：智慧营销方案在生效后，将按设定的时间自动运行。</div>
            <div class="market-tip">在运算量较大的情况下，智慧营销方案的执行将需要较长时间。</div>
        </Card>
        <Card class="market-card" :dis-hover="false">
            <div class="market-operate">
                <Form ref="marketForm" inline :label-width="100" :rules="ruleValidate" :model="marketInfo">
                    <div class="flex f-just-between">
                        <div>
                            <FormItem label="方案名称" prop="plan_name">
                                <Input placeholder="请输入文案名称，12字以内" :disabled="id ? true : false" v-model="marketInfo.plan_name"/>
                            </FormItem>
                            <FormItem label="方案备注" prop="remark">
                                <Input placeholder="请输入方案备注，50字以内" :disabled="id ? true : false" style="width:250px;" v-model="marketInfo.remark"/>
                            </FormItem>
                        </div>
                        <div>
                            <FormItem>
                                <Button type="primary" @click="saveMarket" v-if="!id">保存</Button>
                            </FormItem>
                        </div>
                    </div>
                </Form>
            </div>
            <div class="label-view">
                <div class="label-view-area">
                    <div>可选流程组件</div>
                    <ul class="label-list">
                        <li 
                        v-for="(item, index) in labelList" 
                        class="label-item" 
                        :key="index" 
                        :draggable="true" 
                        @dragstart.stop="dragStart($event, item)" 
                        @dragend.stop="dragEnd($event, item)" 
                        v-if="item.type != 0">
                            <div class="item-cont">
                                <img :src="item.img" class="item-img" />
                                <span class="item-name">{{ item.name }}</span>
                                <div class="item-mark"></div>
                            </div>
                            
                        </li>
                    </ul>
                </div>
                <Card class="label-operate">
                    <div id="loopBodyArea" class="loop_body_area">
                        <loopBody
                        id="loopBody"
                        class="loop_body"
                        :labelList="labelList"
                        :tagsData="tagsData"
                        level=""
                        @createBranch="createBranch"
                        @checkSaveMsg="checkSaveMsg"
                        @removeBranch="removeBranch"
                        @labelEnter="labelEnter"
                        @labelOut="labelOut"
                        ></loopBody>
                        <div id="line_view" class="line_view" v-html="lineViewHtml"></div>
                    </div>
                </Card>
                <div class="drag_tip">
                    <p>*请拖动组件到右侧来添加步骤</p>
                    <p>双击编辑节点内容</p>
                </div>
            </div>
        </Card>
        <!--开始-->
        <startSave ref="startSave" :createType="createType" @saveMsg="saveMsg"></startSave>
        <!--会员筛选-->
        <screenSave ref="screenSave" :createType="createType" @saveMsg="saveMsg"></screenSave>
        <!--延时-->
        <delaySave ref="delaySave" :createType="createType" @saveMsg="saveMsg"></delaySave>
        <!--消息 图文 小程序卡片-->
        <imageTextSave ref="imageTextSave" :createType="createType" @saveMsg="saveMsg"></imageTextSave>
        <!--spin-->
        <Spin :fix="true" v-if="showSpan"></Spin>
    </div>
</template>
<script>
    import util from '@/libs/util.js';
    import loopBody from "./component/loopBody";
    import startSave from "./component/startSave";
    import screenSave from "./component/screenSave";
    import delaySave from "./component/delaySave";
    import labelView from "./mixins/label-view.js";
    import imageTextSave from "./component/imageTextSave";
    export default {
        name:"",
        mixins: [labelView],
        components: {
            loopBody,
            startSave,
            screenSave,
            delaySave,
            imageTextSave
        },
        data(){
            return {
                showSpan: false,
                createType: "", // multi = 周期
                marketInfo: {},
								ruleValidate: {
									plan_name: { required: true, message: '请完善方案名称', trigger: 'blur' },
									remark: { required: true, message: '请完善方案备注', trigger: 'blur' }
								},
                tagsList: [],
                tagsData: [
                    {
                        tagType: 0,
                        type:"",
												id: 0,
												parent_id: -1,
												screen_name:"开始",
												children: [
																		{
																				tagType: 1,
																				type:"",
																				id: 1,
																				parent_id: 0,
																				screen_name:"会员筛选",
																				children: []
																		}
																]
                    }
                ],
                loopBodyArea: null,
                loopBody: null,
                nTop: 0,
                nLeft: 0,
                lineView: null,
                lineViewHtml: "",
                dragItem: null,
                isDraging: false,
							id: 0
            }
        },
        mounted(){
            this.init();
        },
        methods: {
            checkSaveMsg(detail){
                let tagType = detail.tagType + "";
                let setting = detail.setting || {};
								let name = detail.name;
								let level = detail.level;
								let vals = [], eidtItem = null;
								let config = {level: level, tip: name, type: tagType};
								eidtItem = getLevel.call(this, level);
                switch(tagType){
                    case "0":
                        this.$refs["startSave"].show(config,setting);
                        break;
                    case "1":
                        this.$refs["screenSave"].show(config, setting);
                        break;
                    case "2":
                        this.$refs["delaySave"].show(config, setting);
                        break;
                    case "4":
												console.log("setting", setting);
												for(let i in setting){
													vals.push({
														id: 'manual' + setting[i],
														tabType: 'manual'
													})
												}
                        this.$selectContent({
                            mode: 'labels',
                            type: 'checkbox',
														modeStyle: 'tab',
														showTab: 'manual',
														reqConfig: 'labels',
                            data: vals,
                            getList: (data) => {
															console.log("data", data);
														let ids = [];
														for(let i = 0; i < data.length; i++){
															let tabType = data[i].tabType || "";
															let id = data[i].id;
															id = id.replace(new RegExp(tabType,'gm'),'');
															ids.push(id);
														}
														this.$set(eidtItem,"chart_setting",ids)
                                console.log("选择数据", data)
                            }
                        });
                        break;
                    case "5":
											console.log("setting", setting);
												for(let i in setting){
													vals.push({
														id: 'manual' + setting[i],
														tabType: 'manual'
													})
												}
                        this.$selectContent({
                            mode: 'labels',
                            type: 'checkbox',
														modeStyle: 'tab',
														showTab: 'manual',
														reqConfig: 'labels',
                            data: vals,
                            getList: (data) => {
															console.log("data", data);
                                let ids = [];
                                for(let i = 0; i < data.length; i++){
                                	let tabType = data[i].tabType || "";
                                	let id = data[i].id;
                                	id = id.replace(new RegExp(tabType,'gm'),'');
																	ids.push(id);
                                	// ids[tabType] = ids[tabType] ? (ids[tabType] + ',' + id) : id
                                }
                                this.$set(eidtItem,"chart_setting",ids)
                            }
                        });
                        break;
                    case "3":
												vals = getDataIdByKey(setting);
                        this.$selectContent({
                            mode: 'coupon',
                            type: 'checkbox',
                            data: vals,
                            getList: (data) => {
														data = data || [];
														let ids = {}
														for(let i = 0; i < data.length; i++){
															ids[data[i].id] = data[i].id;
														}
												this.$set(eidtItem,"chart_setting",ids)
                                console.log("选择数据", data)
                            }
                        });
                        break;
                    case "13":
											vals = getDataIdByKey(setting);
                        this.$selectContent({
                            mode: 'redPacket',
                            type: 'checkbox',
                            data: vals,
                            getList: (data) => {
														data = data || [];
														let ids = {}
														for(let i = 0; i < data.length; i++){
															ids[data[i].id] = data[i].id;
														}
														this.$set(eidtItem,"chart_setting",ids)
                                console.log("选择数据", data)
                            }
                        });
                        break;
                    case "6":
                        this.$refs["imageTextSave"].showModal({
													...config,
													hideTab: ['APPLET']
												}, setting);
                        break;
                    case "11":
                        this.$refs["imageTextSave"].showModal({
													...config,
													hideTab: ['IMAGE','IMAGE-TEXT','APPLET']
												}, setting);
                        break;
                    case "12":
                        this.$refs["imageTextSave"].showModal(config, setting);
                        break;
                }
            },
						saveMsg(detail){
							let level = detail.level;
							let setting = detail.setting;
							let eidtItem = getLevel.call(this, level);
							let _params = detail._params || {};
							this.$set(eidtItem,"chart_setting",setting);
							this.$set(eidtItem,"_params",_params);
							console.log("tagsData", this.tagsData);
						},
            dragStart(e, dragItem){
                this.dragItem = dragItem;
                this.isDraging = true
            },
            dragEnd(e, dragItem){
                this.isDraging = false;
                if(this.dragItem){
                    setTimeout(()=>{
                        this.dragItem = null;
                    }, 500)
                }
            },
            labelEnter(detail){
                if(this.isDraging) return;
                let dragItem = JSON.parse(JSON.stringify(this.dragItem));
                if(dragItem){
                    this.dragItem = null;
                    if(detail.level == "0" || detail.level == "0_0") return; //不允许修改开始 和 首次会员筛选
                    let eidtItem = getLevel.call(this, detail.level);
                    eidtItem.tagType = dragItem.type;
										eidtItem.screen_name = dragItem.name;
                }
            },
            labelOut(){},
            createBranch(detail){ // 添加
                console.log("createBranch", detail);
                let eidtItem = getLevel.call(this, detail.level);
								let id = eidtItem.id;
								let len = this.loopBody.getElementsByClassName("label-item").length;
                eidtItem.children.push({
                    tagType: "",
										id: len,
										parent_id: id,
                    type: detail.type || ""
                })
                this.setNode();
            },
            removeBranch(detail){ // 删除
                getLevel.call(this, detail.level, "remove");
                this.setNode();
            },
            // 初始化方法
            init () {
                let query = this.$route.query || {};
                this.createType = query.type || "";
                this.id = query.id;
                this.getMarketInfo().finally(()=>{
                    this.setNode();
                })
            },
            getMarketInfo(){
                if(!this.id) return Promise.resolve();
                this.showSpin = true;
                return util.ajax.post(util.apiUrl.OnceMarketingInfo,{
                    id: this.id
                }).then(e =>{
                    let res = e.data || {};
                    if(res.code) {
                        let data = res.data || {};
                        this.marketInfo = data.info || {};
                        this.tagsList = data.list_arr || [];
                        this.tagsDataHandle(this.tagsList);
                        return Promise.resolve();
                    }
                    return Promise.reject();
                }).finally(()=>{
                    this.showSpin = false
                })
            },
            tagsDataHandle(list){
               let data =  this.tagsListLoop(list, 0, []);
               this.tagsData = data || [];
            },
            tagsListLoop(list, p_id, result){
                for(let i in list){
                    let parent_id = list[i].parent_id || 0;
                    let branch_type = (list[i].branch_type == "yes_branch") ? "yes" : (list[i].branch_type == "no_branch") ? "no" : ""
                    if(parent_id == p_id){
                        result.push({
                            ...list[i],
                            tagType: list[i].chart_type,
                            type: branch_type
                        });
                        result[(result.length - 1)].children = []
                        this.tagsListLoop(list, list[i].id, result[(result.length - 1)].children);
                    }
                }
                return result;
            },
            setNode(){
                let level = "";
                this.loopBody = this.loopBody || document.getElementById("loopBody");
                this.lineView = this.lineView || document.getElementById("line_view");
                this.$nextTick(()=>{
                    let nodeClient = this.loopBody.getBoundingClientRect();
                    this.nTop = nodeClient.top || 0;
                    this.nLeft = nodeClient.left || 0;
                    let tagsData = this.tagsData || [];
                    this.loopNode(tagsData, level, null, "");
                })
            },
            loopNode(data, level, pClient, html){
                if(!(level + "")) this.lineViewHtml = "";
                for(let i = 0;i < data.length; i++){
                    let _level = level + "" ? level + '_' + i : i;
                    let name = "label" + _level;
                    let type = data[i].type;
                    let label = this.loopBody.getElementsByClassName(name)[0];
                    let client = label.getBoundingClientRect() || {};
                    let top = client.top - (this.nTop || 0) + (client.height / 2);
                    let left  = client.left - (this.nLeft || 0) + (client.width / 2);
                    if(pClient){
                        let _html = this.getSvgHtml(pClient.top, pClient.left, top, left, client.width, client.height, type);
                        html += _html
                        this.lineViewHtml += _html;
                    }
                    if(data[i].children && data[i].children.length > 0){
                        this.loopNode(data[i].children, _level, {
                            top,
                            left
                        }, html);
                    } else if(i == 0 && this.lineView){
                        console.log("888");
                    }
                }
            },
            getSvgHtml(A_t, A_l, B_t, B_l, w, h, type){
                let line_c = type == 'no' ? "#F85D67" : "#000";
                let svg_w = 90, svg_h= 6, html = "";
                if(A_t > B_t){//上分支
                    svg_w = B_l - A_l;
                    svg_h = Math.abs(A_t - B_t);
                    html = '<svg width="'+svg_w+'px" height="'+svg_h+'px" style="position:absolute;top:'+B_t+'px;left:'+A_l+'px;" version="1.1" xmlns="http://www.w3.org/2000/svg">\
                                <path d="M0 '+svg_h+' L0 0 L'+svg_w+' 0" fill="none" stroke="'+line_c+'" stroke-width="3" />\
                            </svg><div class="indent '+type+'_indent" style="top:'+B_t+'px;left:'+(A_l+30)+'px" ></div>'
                }else if(A_t == B_t){//中分支
                    if(A_l != B_l) {
                        svg_w = Math.abs(B_l - A_l);
                    }
                    html='<svg width="'+svg_w+'px" height="'+svg_h+'px" style="position:absolute;top:'+A_t+'px;left:'+A_l+'px;" version="1.1" xmlns="http://www.w3.org/2000/svg">\
                                <path d="M0 0 L'+(B_l-A_l)+' 0" fill="none" stroke="'+line_c+'" stroke-width="3"/>\
                            </svg><div class="indent '+type+'_indent" style="top:'+B_t+'px;left:'+(A_l+30)+'px" ></div>'
                }else{//下分支
                    svg_w = B_l - A_l;
                    svg_h = Math.abs(B_t - A_t);
                    html = '<svg width="'+svg_w+'px" height="'+svg_h+'px" style="position:absolute;top:'+A_t+'px;left:'+A_l+'px;" version="1.1" xmlns="http://www.w3.org/2000/svg">\
                                <path d="M0 0 L0 '+svg_h+' L'+svg_w+' '+svg_h+'" fill="none" stroke="'+line_c+'" stroke-width="3"/>\
                            </svg><div class="indent '+type+'_indent" style="top:'+B_t+'px;left:'+(A_l+30)+'px" ></div>'
                }
                return html;
            },
			saveMarket(){
				this.$refs["marketForm"].validate((valid)=>{
					if (valid) {
						let tagsData = this.tagsData;
						let checkResult = this.checkSaveTagData(tagsData)
						if(checkResult){
							this.$Message.warning(checkResult);
							return;
						} else {
							console.log("成功输出tagsList", this.tagsList);
							// return;
							this.saveMarketReq(this.marketInfo, this.tagsList);
						}
					} else {
						this.$Message.error('请完善必填信息！');
					}
				})
			},
			checkSaveTagData(data, tagsList = [], hasEnd = false){
				let checkResult = "";
				let hasAddTag = false;
				for(let i = 0; i < data.length; i++){
					if(data[i].tagType == 8 && !hasEnd) hasEnd = true; 
					if(!data[i].chart_setting && data[i].tagType != 8){
						checkResult = "请设置" + data[i].screen_name + "节点的参数";
						break;
					} else{
						let addItem = JSON.parse(JSON.stringify(data[i]));
						//减少字段的差异性
						delete addItem.children;
						addItem.branch_type = addItem.type == "yes" ? "yes_branch" : addItem.type == "no" ? "no_branch" : "";
						addItem.chart_type = addItem.tagType;
						if(addItem.tagType == 1){
							addItem.params = addItem._params;
						} else {
							addItem.params = addItem.chart_setting;
						}
						addItem.label = addItem.tagType;
						tagsList.push(addItem);
						if(data[i].children.length > 0 && !checkResult){
							checkResult = this.checkSaveTagData(data[i].children, tagsList, hasEnd);
						}
					}
				}
				if(checkResult){
					return checkResult;
				} else{
					this.tagsList = tagsList;
					return "";
				}
			},
			saveMarketReq(marketInfo, tagsList = []){
				let reqName = this.createType == "multi" ? "CycleMarketingAdd" : "OnceMarketingAdd"; 
				return util.ajax.post(util.apiUrl[reqName],{
				    ...marketInfo,
					item_arr: tagsList
				}).then(e =>{
				    let res = e.data || {};
				    if(res.code) {
						this.$Message.success(res.message);
						this.$router.go(-1);
				        return Promise.resolve();
				    }
				    return Promise.reject();
				}).finally(()=>{
				    this.showSpin = false
				})
			}
        }
    }
    function getLevel(level, type){
        let tagsData = this.tagsData || [];
        let data = tagsData, removeIndex = null;
        if(level){
            let levelArr = level.split("_");
            for(let i = 0; i < levelArr.length; i++){
                if(type == "remove" && i == (levelArr.length - 1)){
                    removeIndex = levelArr[i] + "";
                    break;
                }
                data = data[levelArr[i]] || data.children[levelArr[i]];
            }
            if(type == "remove" && removeIndex){
                data.children.splice(removeIndex, 1);
            }
            if(!data.children) data.children = []
            return data;
        }
        return tagsData[0];
    }
	function getDataIdByKey(data){
		var list = []
		if(data instanceof Array){
			for(let i = 0; i < data.length; i++){
				list.push({
					id: data[i].id
				})
			}
		} else if(data instanceof Object){
			for(let i in data){
				list.push({
					id: i
				})
			}
		}
		return list;
	}
</script>
<style lang="less">
    .marketing-page{
        .market-card{
            border-radius:15px;
            margin-bottom:15px;
        }
        .market-tip{
            padding-left:100px;
            // margin-bottom:10px;
        }
        .market-operate{
            padding-top:10px;
        }
        .label-view{
            position: relative;
            border-top: 1px solid #efefef;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            background: #f7f7f7;
            padding:0px 15px;
            padding-top:20px;
            .label-view-area{
                position:sticky;
                top:0px;
                z-index:10;
                background-color:#f7f7f7;
                padding:15px;
                margin-left:-15px;
            }
            .label-list{
                margin-top:10px;
                padding:10px 0px;
                .label-item{
                    display:inline-block;
                    margin:8px 20px;
                    // margin-right:20px;
                    position:relative;
                    .item-cont{
                        display:flex;
                        align-items: center;
                        border-radius:5px;
                        // overflow:hidden;
                        background-color:#fff;
                        box-shadow: 0px 0px 5px #ccc;
                        position:relative;
                        cursor: move;
                        .item-img{
                            width:35px;
                            height:35px;
                            display:block;
                            margin-left:-20px;
                        }
                        .item-name{
                            padding:0px 10px;
                        }
                        .item-mark{
                            position: absolute;
                            top:0px;
                            right:0px;
                            padding-left:20px;
                            width:100%;
                            height:100%;
                            display:block;
                            opacity: 0;
                            box-sizing: unset;
                            cursor: move !important;
                        }
                        .item-mark:link{
                            cursor: move !important;
                        }
                    }
                    
                }
            }
            .label-operate{
                padding-top:20px;
                min-height:500px;
                position:relative;
                .loop_body_area{
                    display: block;
                    width:100%;
                    height:100%;
                    position: relative;
                    overflow-x: auto;
                }
                .loop_body{
                    position:relative;
                    z-index:2;
                }
                .line_view{
                    position:absolute;
                    top:0px;
                    left:0px;
                    width:100%;
                    height:100%;
                    .indent{
                        width: 30px;
                        height: 30px;
                        position: absolute;
                        margin-top: -15px;
                        margin-left: 15px;
                    }
                    .yes_indent{
                        background:url("/static/images/marketing/yes_branch.png") no-repeat center center;
                        background-size: 100% auto;
                    }
                    .no_indent{
                        background:url("/static/images/marketing/no_branch.png") no-repeat center center;
                        background-size: 100% auto;
                    }
                }
            }
            .drag_tip{
                text-align: center;
                padding: 20px 0px;
                font-size: 12px;
            }
        }
        
    }
</style>
