<template>
	<pageTopBase :isSave="true" @save="saveQuestionnaire">
		<div class="questionnaire_edit clearfix">
			<div class="mobile_questionnaire">
				<div class="add_item_header" id="add_item_header" @click="showSidebarCallBack('-1')">
					<!-- <img src="../../../static/images/setbar.png" class=""/> -->
					<div class="add_item_header_img"></div>
					<div class="add_item_header_txt">{{headerData.activityName}}</div>
				</div>
				<div class="add_item_view" id="add_item_view">
					<draggable v-model="jsonData" :options="{animation:150,opacity:0.4}" @update="draggableUpdate">
						<transition-group>
							<!--add item-->
							<div class="add_item_view_stay" v-if="jsonData.length > 0 || a_item.voteTypeCode != 'page'"
								:class="editAreaId == a_index ? 'active': '' " v-for="(a_item , a_index) in jsonData"
								:id="'add_item'+a_index" :key="'add_item'+a_index">
								<!--富文本-->
								<div class="add_item" v-if="a_item.voteTypeCode == 'html'">
									<div class="a_item_c" v-show="a_item.txtHtml">
										<div class="ueditor_view" v-html="a_item.txtHtml"></div>
									</div>
									<div class="rich_text_stay" v-show="!a_item.txtHtml">
										<div class="custom-richtext custom-richtext-fullscreen">
											<p>点此编辑『富文本』内容 ——&gt;</p>
											<p>你可以对文字进行<strong>加粗</strong>、<em>斜体</em>、<span
													style="text-decoration: underline;">下划线</span>、<span
													style="text-decoration: line-through;">删除线</span>、文字<span
													style="color: rgb(0, 176, 240);">颜色</span>、<span
													style="background-color: rgb(255, 192, 0); color: rgb(255, 255, 255);">背景色</span>、以及字号<span
													style="font-size: 20px;">大</span><span
													style="font-size: 14px;">小</span>等简单排版操作。</p>
											<p>还可以在这里加入表格了</p>
											<table>
												<tbody>
													<tr>
														<td width="93" valign="top" style="word-break: break-all;">中奖客户
														</td>
														<td width="93" valign="top" style="word-break: break-all;">发放奖品
														</td>
														<td width="93" valign="top" style="word-break: break-all;">备注
														</td>
													</tr>
													<tr>
														<td width="93" valign="top" style="word-break: break-all;">猪猪
														</td>
														<td width="93" valign="top" style="word-break: break-all;">内测码
														</td>
														<td width="93" valign="top" style="word-break: break-all;">
															<em><span style="color: rgb(255, 0, 0);">已经发放</span></em>
														</td>
													</tr>
													<tr>
														<td width="93" valign="top" style="word-break: break-all;">大麦
														</td>
														<td width="93" valign="top" style="word-break: break-all;">积分
														</td>
														<td width="93" valign="top" style="word-break: break-all;"><a
																href="javascript: void(0);" target="_blank">领取地址</a>
														</td>
													</tr>
												</tbody>
											</table>
											<p style="text-align: left;"><span
													style="text-align: left;">也可在这里插入图片、并对图片加上超级链接，方便用户点击。</span></p>
										</div>
									</div>
								</div>
								<!--分页-->
								<!-- <div class="add_item" v-else-if="a_item.voteTypeCode == 'page'">
								<div class="a_item_c">
									<Row class="item_page">
												<i-col span="6">
													<Button type="success" class="item_page_btn prev_btn">
														<Icon type="ios-arrow-back"></Icon>
													</Button>
												</i-col>
												<i-col span="18">
											<Button type="success" class="item_page_btn next_btn">
												<span>下一页</span>
														<Icon type="ios-arrow-forward"></Icon>
													</Button>
													
												</i-col>
										</Row>
									</div>
							</div> -->
								<!--日期-->
								<div class="add_item" v-else-if="a_item.voteTypeCode == 'date'">
									<div class="a_item_c">
										<div class="a_item_c_tit " :class="a_item.isRequired ? 'required':''">
											{{jumpTitle[a_index] ? jumpTitle[a_index].sub_i : ''}}{{a_item.title}}
										</div>
										<div class="a_item_c_tip">{{a_item.childTitle}}</div>
										<div class="a_item_c_info">
											<Input :readonly="true"></Input>
										</div>
									</div>
								</div>
								<!--文字调查-->
								<div class="add_item" v-else-if="a_item.voteTypeCode == 'text'">
									<div class="a_item_c">
										<div class="a_item_c_tit" :class="a_item.isRequired ? 'required':''">
											{{jumpTitle[a_index] ? jumpTitle[a_index].sub_i : ''}}{{a_item.title}}
										</div>
										<div class="a_item_c_tip">{{a_item.childTitle}}</div>
										<div class="a_item_c_info">
											<Input :readonly="true" v-if="a_item.textareaRow == 1"></Input>
											<Input type="textarea" :readonly="true"
												v-else-if="a_item.textareaRow == 2"></Input>
										</div>
									</div>
								</div>
								<!--手机号码-->
								<div class="add_item" v-else-if="a_item.voteTypeCode == 'phone'">
									<div class="a_item_c">
										<div class="a_item_c_tit" :class="a_item.isRequired ? 'required':''">
											{{jumpTitle[a_index] ? jumpTitle[a_index].sub_i : ''}}{{a_item.title}}
										</div>
										<div class="a_item_c_tip">{{a_item.childTitle}}</div>
										<div class="a_item_c_info">
											<Input :readonly="true"></Input>
										</div>
									</div>
								</div>
								<!--邮箱-->
								<div class="add_item" v-else-if="a_item.voteTypeCode == 'email'">
									<div class="a_item_c">
										<div class="a_item_c_tit" :class="a_item.isRequired ? 'required':''">
											{{jumpTitle[a_index] ? jumpTitle[a_index].sub_i : ''}}{{a_item.title}}
										</div>
										<div class="a_item_c_tip">{{a_item.childTitle}}</div>
										<div class="a_item_c_info">
											<Input :readonly="true"></Input>
										</div>
									</div>
								</div>
								<!--文本投票-->
								<div class="add_item" v-else-if="a_item.voteTypeCode == 'vote_text'">
									<div class="a_item_c">
										<div class="a_item_c_tit" :class="a_item.isRequired ? 'required':''">
											{{jumpTitle[a_index] ? jumpTitle[a_index].sub_i : ''}}{{a_item.title}}
										</div>
										<div class="a_item_c_tip">{{a_item.childTitle}}</div>
										<div class="a_item_c_info">
											<div class="radio_checkbox_group">
												<template v-for="(c_item,c_index) in a_item.childOptions">
													<!--其他-->
													<Row class="radio_row" align="middle"
														v-if="c_item.isOtherOption == 1">
														<i-col span="4" class="">其他</i-col>
														<i-col span="20" class=""><Input></Input></i-col>
													</Row>
													<div v-else>
														<div class="radio_row" v-if="a_item.selectionType == 1">
															<Radio value="1">
																{{c_item.optionName ? c_item.optionName : '选项名称'}}
															</Radio>
														</div>
														<div class="radio_row" v-else-if="a_item.selectionType == 2">
															<Checkbox value="1">
																{{c_item.optionName ? c_item.optionName : '选项名称'}}
															</Checkbox>
														</div>
													</div>

												</template>

											</div>
										</div>
									</div>
								</div>
								<!--图片投票-->
								<div class="add_item" v-else-if="a_item.voteTypeCode == 'vote_image'">
									<div class="a_item_c">
										<div class="a_item_c_tit" :class="a_item.isRequired ? 'required':''">
											{{jumpTitle[a_index] ? jumpTitle[a_index].sub_i : ''}}{{a_item.title}}
										</div>
										<div class="a_item_c_tip">{{a_item.childTitle}}</div>
										<div class="a_item_c_info">
											<div class="pic_vote_item" v-for="(pic ,p_index) in a_item.childOptions"
												:key="p_index" :class="a_item.imageShowStyle == 2 ? 'multi_col' : ''">
												<div class="vote_item_p">
													<template v-if="pic.uploadImg && pic.uploadImg.length > 0">
														<img :src="cdnHost+'/'+pic.uploadImg[0].url" />
													</template>
													<div class="vote_item_operate">
														<Radio value="" v-if="a_item.selectionType == 1">选这个</Radio>
														<Checkbox value="" v-else-if="a_item.selectionType == 2">选这个
														</Checkbox>
													</div>
												</div>
												<p class="vote_item_t">{{pic.optionName}}</p>
											</div>
										</div>
									</div>
								</div>
								<!--图片-->
								<div class="add_item" v-else-if="a_item.voteTypeCode == 'image'">
									<div class="a_item_c">
										<div class="a_item_c_tit" :class="a_item.isRequired ? 'required':''">
											{{jumpTitle[a_index] ? jumpTitle[a_index].sub_i : ''}}{{a_item.title}}
										</div>
										<div class="a_item_c_tip">{{a_item.childTitle}}</div>
										<div class="a_item_c_info">
											<div class="upload_img">
												<span class="upload_img_icon">+</span>
											</div>
										</div>
									</div>
								</div>
								<!--地域调查-->
								<div class="add_item" v-else-if="a_item.voteTypeCode == 'location'">
									<div class="a_item_c">
										<div class="a_item_c_tit" :class="a_item.isRequired ? 'required':''">
											{{jumpTitle[a_index] ? jumpTitle[a_index].sub_i : ''}}{{a_item.title}}
										</div>
										<div class="a_item_c_tip">{{a_item.childTitle}}</div>
										<div class="a_item_c_info">
											<Row>
												<i-col span="8">
													<Select>
														<Option disabled value="请选择">请选择</Option>
													</Select>
												</i-col>
												<i-col span="8">
													<Select>
														<Option disabled value="请选择">请选择</Option>
													</Select>
												</i-col>
												<i-col span="8">
													<Select>
														<Option disabled value="请选择">请选择</Option>
													</Select>
												</i-col>
											</Row>
										</div>
									</div>
								</div>
								<div class="actions" @click="showSidebarCallBack(a_index)">
									<div class="actions_stay">
										<Button type="primary">编辑</Button>
										<Button type="primary" @click="addContent(a_index)">加内容</Button>
										<Button type="primary" @click="CopyVoteItem(a_index)">复制</Button>
										<Button type="primary" @click="showDelVoteAlert = true ">删除</Button>
										<div class="action_del_tip" v-if="editAreaId == a_index && showDelVoteAlert">
											<span class="del_tip_txt">确定删除？</span>
											<Button type="primary" @click="delVoteItem(a_index)">确定</Button>
											<Button @click="showDelVoteAlert =!showDelVoteAlert">取消</Button>
										</div>
									</div>
								</div>
							</div>
							<!--add item-->
						</transition-group>
					</draggable>
				</div>
				<div class="add_operate_list">
					<div class="add_operate_tit">添加内容</div>
					<div class="add_operate_cont oh">
						<div class="add_operate_item" v-for="(a_item,a_index) in defaultTypeStr" :key="a_index"
							v-if="a_index != '-1'">
							<Button class="add_cont_operate" type="ghost"
								@click="addLabelItem(a_index)">{{a_item}}</Button>
						</div>
					</div>
				</div>
			</div>





			<!--右边设置框-->
			<div class="questionnaire_setup">
				<div class="app_sidebar" id="app_sidebar">
					<div class="app_sidebar_inner ">
						<!--↓-->
						<!--设置编辑头-->
						<template v-if="!isAddContent">
							<div class="controls_area" v-if="editAreaId == '-1'">
								<div class="control_group">
									<label class="ctrl_label v_m required">标题:</label>
									<div class="controls v_m"><Input v-model="headerData.activityName"></Input></div>
								</div>
								<div class="control_group">
									<label class="ctrl_label v_m required">有效期:</label>
									<div class="controls v_m">
										<Date-picker class="" type="datetime" :options="dataOption0"
											v-model="headerData.fromDate" :editable="false" placement="bottom-end"
											placeholder="开始日期" format="yyyy-MM-dd HH:mm:ss"></Date-picker>
										<span class="v_m">~</span>
										<Date-picker class="" type="datetime" :options="dataOption1"
											v-model="headerData.toDate" :editable="false" placement="bottom-end"
											placeholder="结束日期" format="yyyy-MM-dd HH:mm:ss"></Date-picker>
									</div>
								</div>
								<div class="control_group">
									<label class="ctrl_label v_t">登录状态:</label>
									<div class="controls v_t">
										<RadioGroup v-model="headerData.isMustLogin" vertical>
											<Radio :label="0">
												<span>允许匿名参与</span>
											</Radio>
											<Radio :label="1">
												<span>必须登录参与</span>
											</Radio>
										</RadioGroup>
									</div>
								</div>
								<div class="control_group">
									<label class="ctrl_label v_m">查看结果:</label>
									<div class="controls v_m">
										<Checkbox :true-value="1" :false-value="0" v-model="headerData.isShowResult">
											调查结果后显示结果</Checkbox>
									</div>
								</div>
								<div class="control_group">
									<label class="ctrl_label v_m">参与次数:</label>
									<div class="controls v_m">
										<Input number v-model="headerData.joinTimes" class="number_input"></Input>
										<span>次</span>
										<!-- <RadioGroup >
											<div class="radio_row">
														<Radio :value="1">
																<span>只能参与一次</span>
														</Radio>
													</div>
													<div class="radio_row">
														<Radio :value="2">
																<span>可参与多次(取最后一次为结果)</span>
														</Radio>
													</div>
													<div class="radio_row">
														<Radio value="3">
																<span>可参与多次(每天最多可投10次，投票结果可以累加；参与调查的优惠积分只发放一次)</span>
														</Radio>
													</div>
											</RadioGroup > -->
									</div>
								</div>
								<div class="control_group">
									<label class="ctrl_label v_m">奖励次数:</label>
									<div class="controls v_m">
										<Input number v-model="headerData.benefitTimes" class="number_input"></Input>
										<span>次</span>
									</div>
								</div>
								<div class="control_group">
									<label class="ctrl_label v_t">结果查看:</label>
									<div class="controls v_t">
										<Checkbox :true-value="1" :false-value="0" v-model="headerData.checkResult">
											可以重复查看投票结果（投票结束后，可重复查看投票结果）</Checkbox>
									</div>
								</div>
								<div class="control_group">
									<label class="ctrl_label v_t">微信推送图:</label>
									<div class="controls v_t">
										<div class="header_upload_area">
											<Upload class="weixin_upload_img v_m" ref='activity_upload'
												:show-upload-list="false" :format="['jpg','jpeg','png']"
												:on-success="uploadWeixinImg" :max-size="2048"
												:on-exceeded-size="overflowUploadSize" type="drag"
												:action="serverUrl.up_image_url">

												<div class="upload_activity_img" v-if="headerData.activityImage">
													<img :src="cdnHost+'/'+headerData.activityImage">
												</div>
												<div class="upload_icon" v-else>
													<Icon type="plus-round" size="20"></Icon>
												</div>
											</Upload>
											<div class="upload_tip">
												<p>1.图片大小最佳是640*400，格式为 jpg 或 png</p>
												<p>2.图片用于扫码后微信回复</p>
											</div>
										</div>
									</div>
								</div>
								<div class="controls_list">
									<div class="controls_list_tit">参加调查的奖励</div>
									<div class="controls_list_cont">
										<div class="control_group">
											<label class="ctrl_label">参与送积分:</label>
											<div class="controls">
												<Input number v-model="headerData.benefitPoints"
													class="number_input"></Input>
												<span>积分</span>
												<!-- <Checkbox v-model="">送了优惠也能送积分</Checkbox> -->
											</div>
										</div>
										<div class="control_group">
											<label class="ctrl_label">优惠券:</label>
											<div class="controls">
												<Select filterable multiple class="input_select"
													v-model="headerData.benefitCouponsArr">
													<Option :value="b_item.type_id" :key="b_item.type_id"
														v-for="(b_item,b_index) in bonusList">{{b_item.type_name }}
													</Option>
												</Select>
												<div class="give_operate">
													<!-- <span class="operate_point">刷新</span>
																<span class="operate_v_line">|</span>
																<span class="operate_point">新建</span> -->
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<!--分页-->
							<!-- <div class="controls_area" v-else-if="jsonData[editAreaId].voteTypeCode == 'page'">
								<div class="set_page_tip">
									<div>调查项多可以使用此分页控件。</div>
									<div>提示：切勿添加多个『连续』的分页控件，用户将会看到空白的表单。</div>
								</div>
							</div> -->
							<!--日期,文字调查,手机号码,邮箱,图片,地域调查-->
							<div class="controls_area" v-else-if="jsonData[editAreaId].voteTypeCode == 'date' || 
							jsonData[editAreaId].voteTypeCode == 'text' ||
							jsonData[editAreaId].voteTypeCode == 'phone' ||
							jsonData[editAreaId].voteTypeCode == 'email' ||
							jsonData[editAreaId].voteTypeCode == 'image' ||
							jsonData[editAreaId].voteTypeCode == 'location'">
								<div class="control_group">
									<label class="ctrl_label v_m required">标题:</label>
									<div class="controls v_m"><Input v-model="jsonData[editAreaId].title"></Input></div>
								</div>
								<div class="control_group">
									<label class="ctrl_label v_m">副标题:</label>
									<div class="controls v_m"><Input v-model="jsonData[editAreaId].childTitle"></Input>
									</div>
								</div>
								<!--文字独有模块 ↓-->
								<div class="control_group" v-if="jsonData[editAreaId].voteTypeCode == 'text'">
									<label class="ctrl_label v_m">文本框高度:</label>
									<div class="controls v_m">
										<RadioGroup v-model="jsonData[editAreaId].textareaRow">

											<Radio :label="1">
												<span>单行</span>
											</Radio>
											<Radio :label="2">
												<span>多行</span>
											</Radio>
										</RadioGroup>
									</div>
								</div>
								<!--文字独有模块 ↑-->
								<!-- <div class="control_group">
									<label class="ctrl_label v_m">同步资料:</label>
									<div class="controls v_m">
										<RadioGroup >
													<Radio value="1">
															<span>不同步</span>
													</Radio>
													<Radio value="2">
															<span>同步标签</span>
													</Radio>
											</RadioGroup >
									</div>
								</div> -->
								<div class="control_group">
									<label class="ctrl_label v_m">同步标签:</label>
									<div class="controls v_m">
										<Select filterable multiple class="input_select"
											v-model="jsonData[editAreaId].printLableArr">
											<Option :value="t_item.id" v-for="(t_item,t_index) in tagList"
												:key="t_index">{{t_item.tag_name }}</Option>
										</Select>
										<div class="give_operate">
											<!-- <span class="operate_point">刷新</span>
														<span class="operate_v_line">|</span>
														<span class="operate_point">新建</span> -->
										</div>
									</div>
								</div>
								<div class="control_group">
									<label class="ctrl_label v_m">是否必填:</label>
									<div class="controls v_m">
										<Checkbox :true-value="1" :false-value="0"
											v-model="jsonData[editAreaId].isRequired">必须填写</Checkbox>
									</div>
								</div>
								<!--日期独有模块 ↓-->
								<template v-if="jsonData[editAreaId].voteTypeCode == 'date'">
									<div class="control_group">
										<label class="ctrl_label v_m">默认时间:</label>
										<div class="controls v_m">
											<Date-picker type="datetime" v-model="jsonData[editAreaId].defaultTime"
												:editable="false" placement="bottom-end" placeholder="选择日期"
												format="yyyy-MM-dd HH:mm:ss"></Date-picker>
										</div>
									</div>
									<div class="control_group">
										<label class="ctrl_label v_m required">时间范围:</label>
										<div class="controls v_m">
											<Date-picker type="datetime" v-model="jsonData[editAreaId].fromTime"
												:editable="false" placement="bottom-end" placeholder="开始日期"
												format="yyyy-MM-dd HH:mm:ss"></Date-picker>
											<span>~</span>
											<Date-picker type="datetime" :options="dataOption2"
												v-model="jsonData[editAreaId].toTime" :editable="false"
												placement="bottom-end" placeholder="结束日期" format="yyyy-MM-dd HH:mm:ss">
											</Date-picker>
										</div>
									</div>
								</template>
								<!--日期独有模块 ↑-->
								<!-- <div class="control_group">
									<label class="ctrl_label v_t">跳题设置:</label>
									<div class="controls v_t">
													无条件跳题，填写此题后跳转到第
													<Select class="input_select" filterable v-model="jsonData[editAreaId].goOption">
																<Option :value="0">不跳转</Option>
																<Option 
																:value="jt_item.sort" 
																v-for="(jt_item,jt_index) in jumpTitle"
																:key="jt_index"
																v-if="jumpTitle[editAreaId].sub_i < jt_item.sub_i">{{jt_item.sub_i}},{{jt_item.title}}</Option>
														</Select>题
									</div>
								</div> -->
							</div>
							<!--文本投票-->
							<div class="controls_area"
								v-else-if="jsonData[editAreaId].voteTypeCode == 'vote_image' || jsonData[editAreaId].voteTypeCode == 'vote_text' ">
								<div class="control_group">
									<label class="ctrl_label v_m">标题:</label>
									<div class="controls v_m"><Input v-model="jsonData[editAreaId].title"></Input></div>
								</div>
								<div class="control_group">
									<label class="ctrl_label v_m">副标题:</label>
									<div class="controls v_m"><Input v-model="jsonData[editAreaId].childTitle"></Input>
									</div>
								</div>
								<div class="control_group">
									<label class="ctrl_label v_m">单选/多选:</label>
									<div class="controls v_m">
										<RadioGroup v-model="jsonData[editAreaId].selectionType">
											<Radio :label="1">
												<span>单选</span>
											</Radio>
											<Radio :label="2">
												<span>多选</span>
											</Radio>
										</RadioGroup>
									</div>
								</div>
								<!-- <template v-if="jsonData[editAreaId].selectionType == 2">
									<div class="control_group">
										<div class="ctrl_label">最少可选:</div>
										<div class="controls">
											<Input number v-model="headerData.benefitPoints" class="number_input v_m" ></Input>
											<span class="v_m">个</span>
											<span class="v_m">(为0表示可不选)</span>
										</div>
									</div>
									<div class="control_group">
										<div class="ctrl_label">最多可选:</div>
										<div class="controls">
											<Input number v-model="headerData.benefitPoints" class="number_input v_m" ></Input>
											<span class="v_m">个</span>
											<span class="v_m">(为0表示可不选)</span>
										</div>
									</div>
								</template> -->
								<template v-if="jsonData[editAreaId].voteTypeCode == 'vote_image'">
									<div class="control_group">
										<label class="ctrl_label v_m">单选/多选:</label>
										<div class="controls v_m">
											<RadioGroup v-model="jsonData[editAreaId].imageShowStyle">
												<Radio :label="1">
													<span>单列</span>
												</Radio>
												<Radio :label="2">
													<span>多列</span>
												</Radio>
											</RadioGroup>
										</div>
									</div>
								</template>
								<!-- <div class="control_group">
									<label class="ctrl_label v_m">同步资料:</label>
									<div class="controls v_m">
										<RadioGroup v-model="">
													<Radio value="1">
															<span>不同步</span>
													</Radio>
													<Radio value="2">
															<span>同步标签</span>
													</Radio>
											</RadioGroup >
									</div>
								</div> -->
								<div class="control_group">
									<label class="ctrl_label v_t">同步标签:</label>
									<div class="controls v_t">
										<Select filterable multiple class="input_select"
											v-model="jsonData[editAreaId].printLableArr">
											<Option :value="t_item.id" v-for="(t_item,t_index) in tagList"
												:key="t_index">{{t_item.tag_name }}</Option>
										</Select>
										<div class="give_operate">
											<!-- <span class="operate_point">刷新</span>
														<span class="operate_v_line">|</span>
														<span class="operate_point">新建</span> -->
										</div>
									</div>
								</div>
								<div class="control_group">
									<label class="ctrl_label v_m">是否必填:</label>
									<div class="controls v_m">
										<Checkbox :true-value="1" :false-value="0"
											v-model="jsonData[editAreaId].isRequired">必须填写</Checkbox>
									</div>
								</div>
								<!-- <div class="control_group">
									<label class="ctrl_label v_t">跳题设置:</label>
									<div class="controls v_t">
													无条件跳题，填写此题后跳转到第
														<Select class="input_select" filterable v-model="jsonData[editAreaId].goOption">
																<Option :value="0">不跳转</Option>
																<Option 
																:value="jt_item.sort" 
																v-for="(jt_item,jt_index) in jumpTitle"
																:key="jt_index"
																v-if="jumpTitle[editAreaId].sub_i < jt_item.sub_i">{{jt_item.sub_i}},{{jt_item.title}}</Option>
														</Select>题
									</div>
								</div> -->
								<div class="controls_list">
									<div class="controls_list_tit">选项</div>
									<div class="controls_list_cont">
										<!--文本投票-->
										<template v-if="jsonData[editAreaId].voteTypeCode == 'vote_text'">
											<div class="controls_cont_item"
												v-for="(c_item , c_index) in jsonData[editAreaId].childOptions"
												:key="c_index" @click="beforeUploadCallback(c_index)">
												<div class="control_group">
													<label
														class="ctrl_label v_t required">{{c_item.isOtherOption ? '其他:' : '选项:'}}</label>
													<div class="controls v_t" v-if="!c_item.isOtherOption">
														<Input placeholder="标题" @on-focus="inputWarn(c_index)"
															:class="c_item.name_is_empty ? 'warn_tip': '' "
															v-model="c_item.optionName"></Input>
													</div>
												</div>
												<!-- <div class="control_group">
													<label class="ctrl_label v_m">同步资料:</label>
													<div class="controls v_m">
														<RadioGroup >
																	<Radio value="1">
																			<span>不同步</span>
																	</Radio>
																	<Radio value="2">
																			<span>同步打标签</span>
																	</Radio>
															</RadioGroup >
													</div>
												</div> -->
												<div class="control_group">
													<label class="ctrl_label v_m">同步标签:</label>
													<div class="controls v_m">
														<Select filterable multiple class="input_select"
															v-model="c_item.printLableArr">
															<Option :value="t_item.id"
																v-for="(t_item,t_index) in tagList" :key="t_index">
																{{t_item.tag_name }}</Option>
														</Select>
														<div class="give_operate">
															<!-- <span class="operate_point">刷新</span>
																		<span class="operate_v_line">|</span>
																		<span class="operate_point">新建</span> -->
														</div>
													</div>
												</div>
												<!-- <div class="control_group" v-if="!c_item.isOtherOption">
													<label class="ctrl_label v_m">跳题设置:</label>
													<div class="controls v_m">
																	无条件跳题,填写此题后可以跳转到
																	<Select class="input_select" filterable v-model="c_item.goOption">
																				<Option :value="0">不跳转</Option>
																				<Option 
																				:value="jt_item.sort" 
																				v-for="(jt_item,jt_index) in jumpTitle"
																				:key="jt_index"
																				v-if="jumpTitle[editAreaId].sub_i < jt_item.sub_i">{{jt_item.sub_i}},{{jt_item.title}}</Option>
																		</Select>题
													</div>
												</div> -->
												<div class="controls_cont_item_operate">
													<div class="inline_b" @click="addChildItem(c_index)"
														v-if="!c_item.isOtherOption">
														<Icon type="ios-plus" size="24" class="add_controls_cont_item">
														</Icon>
													</div>
													<div class="inline_b" @click="removeChildItem(c_index)">
														<Icon type="ios-close" size="24" class="del_controls_cont_item">
														</Icon>
													</div>
												</div>
											</div>
										</template>
										<!--图片投票-->
										<template v-if="jsonData[editAreaId].voteTypeCode == 'vote_image'">
											<draggable v-model="jsonData[editAreaId].childOptions"
												:options="{animation:150,opacity:0.4}" @update="childDragableUpdate">
												<div class="controls_cont_item vote_image_ctrl_item"
													v-for="(c_item , c_index) in jsonData[editAreaId].childOptions"
													:key="c_index">
													<div class="control_group">
														<label class="ctrl_label v_t required">选项:</label>
														<div class="controls v_t">
															<div class="ctrl_input_row">
																<div class="inline_b show_upload_view v_m">
																	<draggable v-model="c_item.uploadImg"
																		:options="{animation:150,opacity:0.4}"
																		@update="UploadImgDraggableUpdate">
																		<div class="upload_view_item_stay"
																			v-for="(p_item,p_index) in c_item.uploadImg"
																			:key="p_index">
																			<div class="upload_view_item inline_b">
																				<img :src="cdnHost+'/'+p_item.url" />
																			</div>
																			<div class="upload_del">
																				<Icon type="ios-close"
																					@click.native="delUploadImg(c_index,p_item)"
																					size="24"
																					class="del_controls_cont_item">
																				</Icon>
																			</div>
																		</div>
																	</draggable>
																</div>
																<div class="inline_b v_m"
																	@click="beforeUploadCallback(c_index)">
																	<Upload class="upload_area v_m"
																		:ref="'upload'+c_index"
																		:show-upload-list="false"
																		:default-file-list="c_item.defaultImg"
																		:format="['jpg','jpeg','png']"
																		:on-success="uploadSuccessCallback"
																		:on-error="uploadErrorCallback" multiple
																		type="drag" :action="serverUrl.up_image_url">
																		<div>
																			<Icon type="plus-round" size="20"></Icon>
																		</div>
																	</Upload>
																</div>
															</div>
															<div class="ctrl_input_row">
																<Input placeholder="标题" @on-focus="inputWarn(c_index)"
																	:class="c_item.name_is_empty ? 'warn_tip': '' "
																	v-model="c_item.optionName"></Input>
															</div>
														</div>
													</div>
													<!-- <div class="control_group">
														<label class="ctrl_label v_m">同步资料:</label>
														<div class="controls v_m">
															<RadioGroup >
																		<Radio value="1">
																				<span>不同步</span>
																		</Radio>
																		<Radio value="2">
																				<span>同步打标签</span>
																		</Radio>
																</RadioGroup >
														</div>
													</div> -->
													<div class="control_group">
														<label class="ctrl_label v_m">同步标签:</label>
														<div class="controls v_m">
															<Select filterable multiple class="input_select"
																v-model="c_item.printLableArr">
																<Option :value="t_item.id"
																	v-for="(t_item,t_index) in tagList" :key="t_index">
																	{{t_item.tag_name }}</Option>
															</Select>
															<div class="give_operate">
																<!-- <span class="operate_point">刷新</span>
																			<span class="operate_v_line">|</span>
																			<span class="operate_point">新建</span> -->
															</div>
														</div>
													</div>
													<div class="controls_cont_item_operate">
														<div class="inline_b" @click="addChildItem(c_index)">
															<Icon type="ios-plus" size="24"
																class="add_controls_cont_item"></Icon>
														</div>
														<div class="inline_b" @click="removeChildItem(c_index)">
															<Icon type="ios-close" size="24"
																class="del_controls_cont_item"></Icon>
														</div>
													</div>
												</div>
											</draggable>
										</template>

										<!--新增-->
										<div class="add_controls_item">
											<label class="inline_b" @click="addChildItem">
												<Icon type="plus-circled" class="v_m" color="#2DA6FA" size="20"></Icon>
												<span class="operate_point v_m">增加一个选项</span>
											</label>
											<div class="inline_b v_m"
												v-if="jsonData[editAreaId].voteTypeCode == 'vote_text' && !jsonData[editAreaId].hasOtherOption">
												<span class="operate_v_line v_m">|</span>
												<span class="operate_point v_m"
													@click="addChildItem(null,true)">其他</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</template>
						<template v-else>
							<!--添加内容-->
							<div class="add_operate_list">
								<div class="add_operate_tit">添加内容</div>
								<div class="add_operate_cont oh">
									<div class="add_operate_item" v-for="(a_item,a_index) in defaultTypeStr"
										:key="a_index" v-if="a_index != '-1'">
										<Button class="add_cont_operate" type="ghost"
											@click="addLabelItem(a_index,editAreaId)">{{a_item}}</Button>
									</div>
								</div>
							</div>
						</template>
						<!--富文本-->
						<div class="controls_area"
							v-show="jsonData[editAreaId] && jsonData[editAreaId].voteTypeCode == 'html' && !isAddContent">
							<div class="control_group">
								<!-- <UEditor ref="ueditor" ></UEditor> -->
							</div>
						</div>

						<!--↑-->
					</div>
				</div>
			</div>
			<!--
			<div class="questionnaire_operate_area">
				<Button type="primary" class="save_questionnaire" @click="saveQuestionnaire" >保存</Button>
			</div> -->
			<Spin v-if="showQSpin" :fix="true"></Spin>
		</div>
	</pageTopBase>
</template>
<script>
	// import UEditor from '../my-components/ueditor/ueditor.vue';
	import pageTopBase from '@/views/my-components/page-top-base/index';
	import util from '@/libs/util.js';
	import draggable from 'vuedraggable'
	export default {
		name: "edit-questionnaire",
		components: {
			// UEditor,
			draggable,
			pageTopBase
		},
		props: {
			serverUrl: {
				type: Object,
				default () {
					return {}
				}
			},
			voteData: {
				type: Object,
				default () {
					return {}
				}
			},
		},
		data() {
			return {
				jsonData: [],
				headerData: {},
				editAreaId: '-1', //默认-1，默认为头部信息
				editChildId: "",
				isAddContent: false, //是否加入内容
				showDelVoteAlert: false,
				ueditorConfig: {
					initialFrameWidth: 398,
					initialFrameHeight: 400,
					// 图片上传接口(必须初始会的)
					serverUrl: '',
				},

				cdnHost: util.cdnHost,
				jumpTitle: [], //跳转题目
				tagList: [],
				tagKeyword: "",
				bonusList: [],
				bonusKeyWord: "",
				//
				tempData: true,
				dataOption0: {
					disabledDate: date => {
						const disabledDay = date.getTime();
						var fromDateTime = new Date().getTime();
						return !(disabledDay > fromDateTime);
					}
				},
				dataOption1: {
					disabledDate: date => {
						const disabledDay = date.getTime();
						var fromDate = JSON.parse(JSON.stringify(this.headerData)).fromDate;
						var fromDateTime = new Date(fromDate).getTime();
						return disabledDay < fromDateTime;
					}
				},
				dataOption2: {
					disabledDate: date => {
						const disabledDay = date.getTime();
						var editAreaId = this.editAreaId;
						if (editAreaId != "-1") {
							var fromDate = JSON.parse(JSON.stringify(this.jsonData[editAreaId])).fromTime;
							var fromDateTime = new Date(fromDate).getTime();
							return disabledDay < fromDateTime;
						}
						return true;
					}
				},
				showQSpin: false,
				//默认
				defaultVoteData: { //默认的jsonData
					title: "",
					childTitle: "",
					createTime: "",
					defaultTime: "",
					fromTime: "",
					goOption: 0,
					imageShowStyle: 1,
					isRequired: 0,
					printLable: "",
					printLableArr: [],
					selectionType: 1,
					sort: 0,
					textareaRow: 1,
					toTime: "",
					txtHtml: "",
					childOptions: [],
					voteOptionId: 0,
					voteTypeCode: "",
					voteTypeName: ""
				},
				defaultHeaderData: { //默认的headerData
					voteActivityId: 0,
					activityImage: "",
					activityName: "活动名称",
					fromDate: new Date(),
					toDate: new Date(new Date().getTime() + 86400000),
					isMustLogin: 0,
					isShowResult: 0,
					joinTimes: 0,
					getResultKind: 0,
					benefitTimes: 0,
					benefitPoints: 0,
					benefitCoupons: "",
					userRank: "",
					remark: "",
					checkResult: 0,
					brandId: 0,
					benefitCouponsArr: []
				},
				defaultTypeStr: {
					"-1": "头部信息",
					"html": "富文本",
					// "page":"分页",
					"date": "日期",
					"text": "文字调查",
					"phone": "手机号码",
					"email": "邮箱",
					"vote_text": "文字投票",
					"vote_image": "图片投票",
					"image": "图片",
					"location": "地域",
				},
				addVoteChildStr: {
					goOption: 0,
					imgUrl: "",
					isOtherOption: 0,
					optionName: "",
					parentOptionSort: 0, //需根据父对象设置
					printLable: "",
					printLableArr: [],
					uploadImg: [],
					name_is_empty: 0,
					sort: 1,
					voteOptionChildId: 0,
					voteResultId: "",
					voteTypeCode: ""
				},
				startDate: new Date()
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				this.getActivityGettag();
				this.getActivityGetbonus();
				this.newData();
			},
			initData(data) {
				var newVoteData = JSON.parse(JSON.stringify(data));
				//问卷数组数据
				var jsonData = newVoteData.jsonData;
				this.jsonData = jsonData;
				delete newVoteData.jsonData;
				//头部数据
				this.headerData = newVoteData;
				var that = this;
				//初始化数据
				that.loadSetInitData(jsonData);
				//默认选中问卷标题
				that.showSidebarCallBack("-1");
				//初始化富文本
				that.ueditorEvent();
			},
			ueditorEvent() {
				var that = this;
				var serverUrl = this.serverUrl;
				var ueditorConfig = this.ueditorConfig;
				ueditorConfig.serverUrl = serverUrl.edit_image_url;
				this.$refs.ueditor.init(ueditorConfig);
				var ue = this.$refs.ueditor.getUE();
				var jsonData = this.jsonData;
				ue.addListener('contentChange', function(type, data) {
					var editAreaId = that.editAreaId;
					var activeData = jsonData[editAreaId];
					if (activeData) {
						var goodsDesc = ue.getContent();
						activeData.txtHtml = goodsDesc;
					}
				});
			},
			newData() {
				var defaultData = {};
				var defaultHeaderData = JSON.parse(JSON.stringify(this.defaultHeaderData));
				defaultData = defaultHeaderData;
				defaultData.jsonData = [];
				this.initData(defaultData);
			},
			setJumpTitle() {
				//设置可跳转题目
				var sub_i = 0;
				var jsonData = JSON.parse(JSON.stringify(this.jsonData));
				for (let i in jsonData) {
					var voteTypeCode = jsonData[i].voteTypeCode;
					if (voteTypeCode != 'html' && voteTypeCode != 'page') {
						sub_i++;
						jsonData[i].sub_i = sub_i;
					}
				}
				this.jumpTitle = jsonData;
			},
			//页面加载时初始化数据
			loadSetInitData(jsonData) {
				for (let i in jsonData) {
					var activeData = jsonData[i];
					var voteTypeCode = activeData.voteTypeCode;
					switch (voteTypeCode) {
						case 'html':
							//初始化富文本编辑器

							break;
						case 'page':
							break;
						case 'date':
							break;
						case 'text':
							break;
						case 'phone':
							break;
						case 'email':
							break;
						case 'vote_text':
							var child = activeData.childOptions;
							var hasOtherOption = 0;
							for (let j in child) {
								if (child[j].isOtherOption) {
									hasOtherOption = 1;
									break;
								}
								//适配select v-model数组
								if (child[j].printLable) {
									var printLableArr = child[j].printLable.split(",");
									child[j].printLableArr = printLableArr;
								} else {
									child[j].printLableArr = [];
								}
								//用于检测
								child[j].name_is_empty = 0;
							}
							activeData.hasOtherOption = hasOtherOption;

							break;
						case 'vote_image':
							var child = activeData.childOptions;
							for (let j in child) {
								var imgUrl = child[j].imgUrl;
								var uploadImg = [],
									defaultImg = [];
								if (imgUrl.indexOf("$$")) {
									var imgUrlArr = imgUrl.split("$$");
									for (let j in imgUrlArr) {
										var data = {
											url: imgUrlArr[j]
										}
										defaultImg.push(data);
									}
								}

								child[j].defaultImg = defaultImg;
								child[j].uploadImg = defaultImg;
								//适配select v-model数组
								if (child[j].printLable) {
									var printLableArr = child[j].printLable.split(",");
									child[j].printLableArr = printLableArr;
								} else {
									child[j].printLableArr = [];
								}
								//用于检测
								child[j].name_is_empty = 0;
							}
							break;
						case 'image':
							break;
						case 'location':
							break;
					}
					//适配selet v-model的数组
					if (activeData.printLable) {
						var printLableArr = activeData.printLable.split(",");
						activeData.printLableArr = printLableArr;
					} else {
						activeData.printLableArr = [];
					}
				}
				//初始化头部信息
				var headerData = this.headerData;
				if (headerData.benefitCoupons) {
					var benefitCouponsArr = headerData.benefitCoupons.split(",");
					headerData.benefitCouponsArr = benefitCouponsArr;
				} else {
					headerData.benefitCouponsArr = [];
				}
				if (!headerData.activityImage) {
					headerData.activityImage = ""
				}
			},
			//点击初始化数据展示
			showSidebarCallBack(index) {
				var that = this;
				var edit_type = "";
				var jsonData = this.jsonData;
				var headerData = this.headerData;
				var activeData = {};
				if (index != '-1') {
					activeData = jsonData[index];
					if (!activeData) {
						return;
					}
					edit_type = activeData.voteTypeCode;
				}
				var that = this;
				var type = "";
				if (edit_type) {
					type = edit_type;
				} else {
					type = index;
				}
				switch (type) { //对每个数组特定的UI初始化
					case '-1':
						//选择的优惠券转化成数组
						if (headerData.benefitCoupons) {
							var couponArr = headerData.benefitCoupons.split(",");
							headerData.benefitCouponsArr = couponArr;
						} else if (!headerData.benefitCouponsArr) {
							headerData.benefitCouponsArr = [];
						}
						break;
					case 'html':
						//初始化富文本编辑器
						break;
					case 'page':
						break;
					case 'date':
						break;
					case 'text':
						break;
					case 'phone':
						break;
					case 'email':
						break;
					case 'vote_text':
						var child = activeData.childOptions;
						var hasOtherOption = 0;
						for (let j in child) {
							if (child[j].isOtherOption) {
								hasOtherOption = 1;
								break;
							}
							//适配select v-model数组
							if (child[j].printLable) {
								var printLableArr = child[j].printLable.split(",");
								child[j].printLableArr = printLableArr;
							} else if (!child[j].printLableArr) {
								child[j].printLableArr = [];
							}

						}
						activeData.hasOtherOption = hasOtherOption;

						break;
					case 'vote_image':
						var child = activeData.childOptions;
						for (let j in child) {
							var imgUrl = child[j].imgUrl;
							var uploadImg = [],
								defaultImg = [];
							if (imgUrl.indexOf("$$")) {
								var imgUrlArr = imgUrl.split("$$");
								for (let j in imgUrlArr) {
									var data = {
										url: imgUrlArr[j]
									}
									defaultImg.push(data);
								}
							}
							child[j].defaultImg = defaultImg;
							if (!child[j].uploadImg) {
								child[j].uploadImg = defaultImg;
							}
							//适配select v-model数组
							if (child[j].printLable) {
								var printLableArr = child[j].printLable.split(",");
								child[j].printLableArr = printLableArr;
							} else if (!child[j].printLableArr) {
								child[j].printLableArr = [];
							}
						}
						break;
					case 'image':
						break;
					case 'location':
						break;
				}
				//适配selet v-model的数组
				if (index && index != "-1") {
					if (activeData.printLable) {
						var printLableArr = activeData.printLable.split(",");
						activeData.printLableArr = printLableArr;
					} else if (!activeData.printLableArr) {
						activeData.printLableArr = [];
					}
				}
				//延时
				setTimeout(function() {
					that.editAreaId = index;
					that.setJumpTitle();
					that.setBarTop(index);
				});
			},
			addLabelItem(type, index) {
				var that = this;
				var addDataStr = JSON.stringify(this.defaultVoteData);
				var addData = JSON.parse(addDataStr);
				var jsonData = this.jsonData;
				var defaultTypeStr = this.defaultTypeStr;
				switch (type) {
					case 'html':
						break;
					case 'page':
						break;
					case 'date':
						break;
					case 'text':
						break;
					case 'phone':
						break;
					case 'email':
						break;
					case 'vote_text':

						for (let i = 1; i < 3; i++) {
							var addVoteChildStr = JSON.parse(JSON.stringify(this.addVoteChildStr));
							addVoteChildStr.voteTypeCode = type;
							addVoteChildStr.sort = i;
							addData.childOptions.push(addVoteChildStr);
						}
						break;
					case 'vote_image':
						for (let i = 1; i < 3; i++) {
							var addVoteChildStr = JSON.parse(JSON.stringify(this.addVoteChildStr));
							addVoteChildStr.voteTypeCode = type;
							addVoteChildStr.sort = i;
							addData.childOptions.push(addVoteChildStr);
						}
						break;
					case 'image':
						break;
					case 'location':
						break;
				}
				var type_str = defaultTypeStr[type];
				addData.voteTypeCode = type;
				addData.voteTypeName = type_str;
				addData.sort = 0;
				addData.title = "未命名的" + type_str;
				var data_l = 0;
				//插入位置
				if (index) {
					var index = index + 1;
					this.jsonData.splice(index, 0, addData);
					data_l = index;
				} else {
					this.jsonData.push(addData);
					data_l = this.jsonData.length - 1;
				}
				//排序
				// for(let s in this.jsonData){
				// 	this.jsonData[s].sort = parseInt(s)+1;
				// }
				setTimeout(function() {
					that.setJumpTitle();
					that.editAreaId = data_l;
					that.setBarTop(data_l);
				})

			},
			setBarTop(index) {
				var m_t = 0;
				var app_sidebar = document.getElementById("app_sidebar");
				if (index == "-1") {
					m_t = 0;
				} else {
					var edit_item = document.getElementById("add_item" + index);
					var add_item_view = document.getElementById("add_item_view");
					var add_item_header = document.getElementById("add_item_header");
					var edit_item_t = parseFloat(edit_item.offsetTop);
					var item_view_t = parseFloat(add_item_view.offsetTop);
					var item_header_h = parseFloat(add_item_header.offsetHeight);
					m_t = edit_item_t - item_view_t + item_header_h;
				}
				app_sidebar.style.marginTop = m_t + "px";
			},
			//问卷展示浮动操作事件，编辑，加内容，复制，删除 ↓
			addContent(index) {
				var that = this;
				setTimeout(function() {
					that.isAddContent = true;
				}, 30);
			},
			CopyVoteItem(index) {
				var that = this;
				var jsonData = this.jsonData;
				var copeItemStr = JSON.stringify(jsonData[index]);
				var copeItem = JSON.parse(copeItemStr);
				var c_index = index + 1;
				this.jsonData.splice(c_index, 0, copeItem);
				var data_l = c_index;
				setTimeout(function() {
					that.editAreaId = data_l;
					that.setBarTop(data_l);
				}, 10);

			},
			delVoteItem(index) {
				var length = this.jsonData.length;
				if ((length - 1) == index) { //当删除最后一个数据
					this.editAreaId = index - 1;
				}
				this.jsonData.splice(index, 1);
				this.setBarTop(this.editAreaId);
				this.showDelVoteAlert = false;
			},
			//问卷展示浮动操作事件，编辑，加内容，复制，删除 ↑
			addChildItem(index, isOther) {
				var jsonData = this.jsonData;
				var editAreaId = this.editAreaId;
				var activeData = jsonData[editAreaId];
				var voteTypeCode = activeData.voteTypeCode;
				var sort = activeData.sort;
				var addItemStr = JSON.parse(JSON.stringify(this.addVoteChildStr));
				addItemStr.parentOptionSort = sort;
				addItemStr.voteTypeCode = voteTypeCode;
				var add_index = index + 1;
				if (index == 0 || index > 0) { //
					activeData.childOptions.splice(add_index, 0, addItemStr);
					for (let i in activeData.childOptions) {
						activeData.childOptions[i].sort = i + 1;
					}
				} else { //默认从后面插入
					if (isOther) {
						addItemStr.isOtherOption = 1;
						addItemStr.isOtherOption = 1;
						activeData.hasOtherOption = 1;
					}
					addItemStr.sort = parseInt(activeData.childOptions.length) + 1;
					activeData.childOptions.push(addItemStr);
				}
			},
			removeChildItem(index) {
				var jsonData = this.jsonData;
				var editAreaId = this.editAreaId;
				var activeData = jsonData[editAreaId];
				var isOtherOption = activeData.childOptions[index].isOtherOption;
				if (isOtherOption) {
					activeData.hasOtherOption = 0;
				}
				activeData.childOptions.splice(index, 1);
			},
			getActivityGettag() {
				var tagKeyword = this.tagKeyword;
				util.ajax.post(util.apiUrl.activityGettag, {
					keyword: tagKeyword,
				}).then((response) => {
					var data = response.data;
					if (data.code == 1) {
						var listData = data.data;
						this.tagList = listData;
					}

				});
			},
			getActivityGetbonus() {
				var bonusKeyWord = this.bonusKeyWord;
				util.ajax.post(util.apiUrl.activityGetbonus, {
					keyword: bonusKeyWord,
				}).then((response) => {
					var data = response.data;
					if (data.code == 1) {
						var listData = data.data;
						this.bonusList = listData;
					}
				});
			},
			//上传事件
			delUploadImg(child_id, file) {
				var jsonData = this.jsonData;
				var editAreaId = this.editAreaId;
				var fileList = this.$refs["upload" + child_id][0].fileList;
				//循环删除
				for (let j in fileList) {
					if (fileList[j].uid == file.uid) {
						this.$refs["upload" + child_id][0].fileList.splice(j, 1);
						break;
					}
				}
				var imgArr = [];
				for (let i in fileList) {
					var fileItem = {
						status: fileList[i].status,
						uid: fileList[i].uid,
						url: fileList[i].response.data.imageUrl,
						size: fileList[i].size
					}
					imgArr.push(fileItem);
				}
				this.jsonData[editAreaId].childOptions[child_id].uploadImg = imgArr;
			},
			uploadWeixinImg(res, file, fileList) {
				var headerData = this.headerData;
				if (res.code) {
					var image = res.data.imageUrl;
					headerData.activityImage = image;
				}
			},
			overflowUploadSize(file, fileList) {
				this.$Message.error('超出限制大小！');
			},
			beforeUploadCallback(index) {
				this.editChildId = index;
			},
			uploadSuccessCallback(res, file, fileList) {
				var jsonData = this.jsonData;
				var tempJsonData = jsonData;
				var editAreaId = this.editAreaId;
				var activeData = jsonData[editAreaId];
				var childOptions = activeData.childOptions;
				var editChildId = this.editChildId;
				var fileItem = {
					status: file.status,
					uid: file.uid,
					url: file.response.data.imageUrl,
					size: file.size
				}
				this.jsonData[editAreaId].childOptions[editChildId].uploadImg.push(fileItem);
			},
			uploadErrorCallback(error, file, fileList) {

			},
			UploadImgDraggableUpdate() {},
			draggableUpdate(data) {
				var newIndex = data.newIndex;
				var oldIndex = data.oldIndex;
				var newSort = this.jsonData[newIndex].sort;
				var oldSort = this.jsonData[oldIndex].sort;
				this.jsonData[newIndex].sort = oldSort;
				this.jsonData[oldIndex].sort = newSort;
				//调整位置
				this.editAreaId = newIndex;
				this.setBarTop(newIndex);

			},
			childDragableUpdate(data) {
				var newIndex = data.newIndex;
				var oldIndex = data.oldIndex;
				var editAreaId = this.editAreaId;
				var newSort = this.jsonData[editAreaId].childOptions[newIndex].sort;
				var oldSort = this.jsonData[editAreaId].childOptions[oldIndex].sort;
				this.jsonData[editAreaId].childOptions[newIndex].sort = oldSort;
				this.jsonData[editAreaId].childOptions[oldIndex].sort = newSort;
			},
			inputWarn(index) {
				var editAreaId = this.editAreaId;
				var activeData = this.jsonData[editAreaId];
				activeData.childOptions[index].name_is_empty = 0;
			},
			saveQuestionnaire() {
				var jsonData = this.jsonData;
				var headerData = this.headerData;
				var editAreaId = this.editAreaId;
				//数据处理上传
				var benefitCouponsArr = headerData.benefitCouponsArr;
				if (benefitCouponsArr && benefitCouponsArr.length > 0) {
					headerData.benefitCoupons = benefitCouponsArr.join(",");
				}
				var is_empty = "";

				for (let i in jsonData) {
					var type = jsonData[i].voteTypeCode;
					//
					var printLableArr = jsonData[i].printLableArr;
					if (printLableArr && printLableArr.length > 0) {
						jsonData[i].printLable = printLableArr.join(",");
					}
					//设置sort
					jsonData[i].sort = parseInt(i);
					//
					var childs = jsonData[i].childOptions;
					for (let j in childs) {
						childs[j].parentOptionSort = parseInt(i);
						var uploadImg = childs[j].uploadImg;
						if (uploadImg && uploadImg.length > 0) {
							childs[j].imgUrl = "";
							for (let k in uploadImg) {
								var url = uploadImg[k].url;
								if (k != (uploadImg.length - 1)) {
									childs[j].imgUrl += url + "$$";
								} else {
									childs[j].imgUrl += url;
								}

							}
						}
						//其他
						if (childs[j].isOtherOption == 1) {
							childs[j].optionName = "其他";
						}
						//检测是否输入名称
						if (!childs[j].optionName) {
							childs[j].name_is_empty = 1;
							is_empty = "名称不能为空";
							break;
						}

					}
					if (is_empty) {
						this.editAreaId = i;
						this.setBarTop(i);
						break;
					}
				}
				if (is_empty) return;
				//
				if (editAreaId != "-1") {
					if (jsonData[editAreaId].voteTypeCode == "html") {
						var ueditorTxt = this.$refs.ueditor.getUEContent();
						jsonData[editAreaId].txtHtml = ueditorTxt;
					}
				}
				console.log(headerData, "headerData");
				console.log(jsonData, "jsonData");
				if (jsonData instanceof Array && jsonData.length == 0) {
					this.$Message.success('问卷内容不能为空！');
					return;
				}

				headerData = JSON.parse(JSON.stringify(headerData));

				jsonData = JSON.parse(JSON.stringify(jsonData));
				headerData.jsonData = jsonData;
				var headerDataStr = JSON.stringify(headerData);

				//
				this.showQSpin = true;
				util.ajax.post(util.apiUrl.activityInsert, {
					fromdata: headerDataStr //数据结构
				}).then((response) => {
					var res = response.data;
					var voteActivityId = headerData.voteActivityId;
					if (res.code == '1') { //成功
						if (voteActivityId) {
							this.$Message.success('修改成功！');
						} else {
							this.$Message.success('新增成功！');
						}

						this.saveCallBack();
						this.showQSpin = false;
					} else { //失败
						if (voteActivityId) {
							this.$Message.error('修改失败！');
						} else {
							this.$Message.error('新增失败！');
						}
						this.showQSpin = false;
					}
				});
			},
			saveCallBack() {
				this.$emit('editQuestionnaireCallback', {});
			},
		},
		watch: {
			voteData: {
				handler(n, o) {
					this.initData(n);
				},
				// immediate:true,
				// deep:true,
			},
			'editAreaId': function(n, o) {
				this.showDelVoteAlert = false; //删除tip
				this.isAddContent = false; //插入内
				if (o == 0 || o != "-1") {
					var o_activeData = this.jsonData[o];
					if (o_activeData) {
						var o_voteTypeCode = o_activeData.voteTypeCode;
						if (o_voteTypeCode == "html") { //切换前为富文本时,保存富文本数据
							if (this.$refs.ueditor.getUEContent()) {
								o_activeData.txtHtml = this.$refs.ueditor.getUEContent();
							}

						}
					}
				}
				if (n == 0 || n != "-1") {
					var n_activeData = this.jsonData[n];
					if (n_activeData) {
						var n_voteTypeCode = n_activeData.voteTypeCode;
						if (n_voteTypeCode == "html") {
							var ue = this.$refs.ueditor.getUE();
							if (n_activeData.txtHtml) {
								ue.setContent(n_activeData.txtHtml);
							} else {
								ue.setContent("");
							}
						}
					}

				}
			}
		}
	}
</script>
<style lang="less">
	@import "./questionnaire.less";
</style>
