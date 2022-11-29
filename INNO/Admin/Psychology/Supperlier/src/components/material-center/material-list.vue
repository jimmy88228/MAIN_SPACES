<template>
  <div class="material-list">
    <div class="material-header flex f-just-between">
			<div class="flex">
				<material-upload
					v-if="rootControl.canUpload"
					:selected-cat-id="selectedCatId"
					:tabType="tabType"
					ref="material-upload"
					:maxSize="maxSize"
					:format="format"
					@getUploadProgress="handleUploadProgress"
					@uploadSuccess="handleUploadSuccess"/>
					&nbsp;&nbsp;
				<!--添加分类气泡-->
				<Poptip v-model="showAddCatPop" placement="bottom-start" width="220" transfer v-if="rootControl.canAddCat">
					<Button type="primary" class="create-cat">
						<Icon type="md-add"></Icon>
						<span>创建分类</span>
					</Button>
					<div slot="content" class="create-cat-content">
						<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="60">
							<FormItem prop="name" label="分类名">
								<Input v-model="formItem.name" size="small" placeholder="请输入分类名称" @keydown.native.enter.prevent ="handleCreate"></Input>
							</FormItem>
							</Form>
							<div style="text-align: center;">
								<Button type="default" size="small" @click="handleCancelCreate">取消</Button>
								<Button type="primary" size="small" @click="handleCreate">保存</Button>
							</div>
					</div>
				</Poptip>
			</div>
			<div>
				<Input
					class="search"
					v-model="searchq"
					search
					enter-button
					clearable
					:placeholder="searchPlaceHolder"
					@on-search="goSearch"
					@on-clear="goSearch"
					@keydown.native.enter.prevent ="goSearch"/>
			</div>
    </div>
    <Divider class="common_divider"></Divider>
    <div class="material-content">
      <Row>
        <Col span="5">
          <div class="material-sort" :style="getCenterStyle">
						<div  v-for="(item, index) in catList" :key="item.id">
							<div class="material-sort_item" :class="{'current': selectedCatId === item.id}" @click="selectCat(item)">
								{{item.name}}
								<span class="edit-box" v-show="item.id !== 0">
									<Icon class="edit-cat-icon" type="md-settings" v-if="rootControl.canEditCat" size="16" title="编辑分类" @click.stop="openCatModal(index, null, item)"></Icon>
									<Icon class="add-cat-icon" type="md-add-circle" v-if="rootControl.canAddCat" size="16" title="增加二级分类" @click.stop="openSecondCatModal(item)"></Icon>
									<Icon class="remove-cat-icon" v-if="rootControl.canRemoveCat" type="md-trash" size="16" title="删除分类" @click.stop="onRemoveCat(index, null, item)"></Icon>
								</span>
							</div>
							<div v-for="(sItem, sIndex) in item.get_self" :class="{'current': selectedCatId === sItem.id}" class="sub-sort-item" @click="selectCat(sItem)">
								{{sItem.name}}
								<span class="edit-box" v-show="sItem.id !== 0">
									<Icon class="edit-cat-icon" type="md-settings" v-if="rootControl.canEditCat" size="16" title="编辑分类" @click.stop="openCatModal(index, sIndex, sItem)"></Icon>
									<Icon class="remove-cat-icon" v-if="rootControl.canRemoveCat" type="md-trash" size="16" title="删除分类" @click.stop="onRemoveCat(index, sIndex,sItem)"></Icon>
								</span>
							</div>
						</div>
          </div>
        </Col>
        <Col span="19">
          <div class="material-details" :style="getCenterStyle">
            <div class="material-inner">
              <div class="list">
                <template v-if="uploadSign">
                  <div v-for="item in uploadList" :key="item.uid" class="progress-bg">
                    <template v-if="item.status !== 'finished'">
                        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                    </template>
                  </div>
                </template>
                <div v-for="item in list" :key="item.id">
                  <MaterialDetails
                    :cur-item="item"
                    :selected-list="selectedList"
                    :tabType="tabType"
                    :can-edit="rootControl.canEdit"
                    :can-remove="rootControl.canRemove"
										:maxSize="maxSize"
										:format="format"
                    @handleSingle="handleSingle"
                    @handleMulti="handleMulti"
                    @editRemarkSuccess="handleRemark"
                    @reloadData="handleReload"></MaterialDetails>
                </div>
								<div class="no-data" style="padding-top:150px;" v-if="list.length == 0">暂无数据，可点击上传数据</div>
              </div>
            </div>
          </div>
          <div v-show="pageTotal" class="list_page">
            <Page
              :total="pageTotal"
              :page-size="pageSize"
              :current="currentPage"
              :page-size-opts="pageSizeOpts"
              @on-change="changePage"
              @on-page-size-change="handlePageSize"
              show-elevator
              show-total
              show-sizer></Page>
          </div>
        </Col>
      </Row>
    </div>
		<!--编辑分类-->
    <Modal
      v-model="showEditCat"
      title="编辑分类名称"
      :loading="loading"
      @on-ok="saveEditCat">
      <div>
				<Form :label-width="80">
					<FormItem label="分类名:">
						<div class="">
							<Input v-model="catValue" style="height: 32px;" placeholder="请输入分类名称" @on-change="handleCatText"></Input>
						</div>
					</FormItem>
				</Form>
      </div>
		</Modal>
		<!--增加二级分类-->
		<Modal
		  v-model="showAddSecondCat"
		  title="增加二级分类">
		  <div>
				<Form>
					<FormItem :label-width="0">
						<div class="flex f-align-center">
							<Input v-model="addSecondCatValue" style="height: 32px;" placeholder="请输入二级分类名称"></Input>
							&nbsp;&nbsp;
							<Icon type="md-add-circle" color="#2F8CEE" style="cursor: pointer;" size="30" @click="saveAddSecondCat"/>
						</div>
					</FormItem>
				</Form>
		  </div>
			<div slot="footer"></div>
		</Modal>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import MaterialDetails from './material-details';
import Conf from '@/config/index';
import MaterialUpload from './upload';

export default {
  name: 'materialList',
  components: {
    MaterialDetails,
    MaterialUpload
  },
  inject: ['multi', 'selectedData', 'isPopup'], // , 'maxSize', 'format'
  props: {
    tabType: {
      // 图片还是视频类型
      required: true
    },
		height: {
			type: Number
		},
		maxSize: {
			type: Number
		},
		format:{
			type: Array
		}
  },
  data () {
    return {
      searchq: '',
      catList: [],
      catIndex: 0,
      showAddCatPop: false,
      formItem: {
        name: ''
      },
      ruleValidate: {
        name: [{ required: true, message: '分类名称不能为空', trigger: 'blur', max: 40 }]
      },
      showEditCat: false,
      catValue: '',
      catId: 0,
      selectedCatId: 0,
      list: [],
      // 存储选中的数据
      selectedList: [],
      loading: true,
      spinShow: false,
      pageTotal: 0,
      currentPage: Conf.PAGE_START,
      pageSize: Conf.PAGE_SIZE_DEF,
      pageSizeOpts: Conf.PAGE_SIZE_OPTS,
      uploadList: [],
      // 是否显示上传进度
      uploadSign: true,
      // 权限控制
      rootControl: {
        canUpload: true,
        // 素材备注信息修改
        canEdit: true,
        // 素材删除
        canRemove: true,
        // 分类添加
        canAddCat: true,
        // 分类编辑
        canEditCat: true,
        // 分类删除
        canRemoveCat: true,
      },
			// 二级分类
			addSecondCatValue: "",
			showAddSecondCat: false,
			editPindex: null,
			editIndex: null
    }
  },
  computed: {
    isImageType () {
      return this.tabType === 'image';
    },
    searchPlaceHolder () {
      return this.isImageType ? '搜索图片备注关键词' : '搜索视频备注关键词'
    },
		getCenterStyle(){
			let height = this.height || 0;
			if(height){
				height = parseFloat(height) -  160;
				return `height: ${height}px`
			} else {
				return ''
			}
		}
  },
  methods: {
    handleReload () {
      return this.loadData();
    },
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.userMaterialList, {
        type: this.tabType, // image/video
        isInit: 1,
        cat_id: this.selectedCatId,
        page: this.currentPage,
        pageSize: this.pageSize
       })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.catList = res.data && res.data.userCats;
          this.list = res.data && res.data.items;
          this.pageTotal = res.data && res.data.total;
          this.rootControl = res.data && res.data.can;
          const all = {
            id: 0,
            name: '全部'
          };
          this.catList.unshift(all);
          // 处理已选择的数据,单选多选结果都为数组
          this.handleSelectedData();
        } else {
          this.$Notice.warning({
            title: this.isImageType ? '获取图片列表失败' : '获取视频列表失败',
            desc: res.message
          });
        }
      }).finally(()=>{
				this.spinShow = false;
			})
    },
    handleSelectedData () {
			if(!this.isPopup) return;
      if (this.multi === 0) {
				if(typeof this.selectedData == 'string'){
					// 单选
					this.list.forEach(item => {
					  if (item.img_src_format === this.selectedData) {
					    this.selectedList.push({
					      src: this.selectedData,
					      id: item.id,
								width: item.width,
								height: item.height
					    });
					  }
					});
				}
      } else if (this.multi === 1) {
        // 多选
				if(this.selectedData instanceof Array){
					this.list.forEach(item => {
					  this.selectedData.forEach(selectItem => {
					    if (item.img_src_format === selectItem) {
					      this.selectedList.push({
					        src: selectItem,
					        id: item.id,
									width: item.width,
									height: item.height
					      });
					    }
					  })
					});
				}
      }
    },
    sortData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.userMaterialList, {
        type: this.tabType, // image/video
        page: this.currentPage,
        pageSize: this.pageSize,
        cat_id: this.selectedCatId,
        searchq: this.searchq
       })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.list = res.data && res.data.items;
          this.pageTotal = res.data && res.data.total;
          // 处理已选择的数据,单选多选结果都为数组
          this.handleSelectedData();
        } else {
          this.$Notice.warning({
            title: this.isImageType ? '获取图片列表失败' : '获取视频列表失败',
            desc: res.message
          });
        }
      }).finally(()=>{
				this.spinShow = false;
			})
    },
    changePage (page) {
      this.currentPage = page;
      this.sortData();
    },
    handlePageSize (pageSize) {
      this.pageSize = pageSize;
      this.sortData();
    },
    goSearch () {
      this.currentPage = 1;
      this.sortData();
    },
    selectCat (item) {
      // 再次选中，不请求数据
      if (item.id === this.selectedCatId) return false;
      // this.catIndex = index;
      this.selectedCatId = item.id;
      this.currentPage = 1;
      this.sortData();
    },
    // 创建分类
    handleCreate () {
      if (!this.formItem.name.trim()) {
        this.$Message.error('请输入分类名称');
        this.showAddCatPop = true;
        return false;
      } else {
        this.showAddCatPop = false;
      }
      this.spinShow = true;
      return this.$ajax.post(this.$api.userAddCat, {
        name: this.formItem.name,
		    type: this.tabType, // image/video
       })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
          // this.catList.push({
          //   name: res.data.name,
          //   id: res.data.id,
          // });
          // 重置
          this.formItem.name = '';
          // this.catIndex = this.catList.length - 1;
          this.selectedCatId = res.data.id;
          this.loadData();
        }
        this.spinShow = false;
      });
    },
    handleCancelCreate () {
      this.showAddCatPop = false;
    },
    // 编辑分类
    saveEditCat () {
      if (!this.catValue.trim()) {
        this.$Message.error('请输入内容');
        this.loading = true;
        this.showEditCat = true;
        return false;
      } else {
        this.loading = false;
        this.showEditCat = false;
      }
      this.spinShow = true;
      return this.$ajax.post(this.$api.userUpdateCat, {
        name: this.catValue,
        id: this.catId,
        type: this.tabType, // image/video
       })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
					let editItem = {};
					if((this.editPindex || this.editPindex == 0)){
						editItem = this.catList[this.editPindex] || {};
					}
					if(this.editIndex || this.editIndex == 0){
						let get_self = editItem.get_self || []
						editItem = get_self[this.editIndex] || {};
					}
					this.$set(editItem, 'name', res.data.name);
        } else {
          this.showEditCat = true;
        }
        this.spinShow = false;
      });
    },
    handleCatText (e) {
      let value = e.target.value;
      if (value.trim()) {
        this.loading = false;
      } else {
        this.loading = true;
      }
    },
    openCatModal (pIndex, index, item) {
			this.editPindex = pIndex;
			this.editIndex = index;
      this.showEditCat = true;
      this.catValue = item.name;
      this.catId = item.id;
    },
    // 删除分类
    onRemoveCat (pIndex, index, item) {
      const id = item.id;
      this.$Modal.confirm({
        title: '删除提示',
        content: this.isImageType ? '确定删除素材分类吗？无图片的分类才能删除成功。' : '确定删除素材分类吗？无视频的分类才能删除成功。',
        okText: '确定删除',
        cancelText: '取消',
        onOk: () => {
          this.spinShow = true;
          this.$ajax.post(this.$api.userRemoveCat, {id})
          .then((response) => {
            var res = response.data;
            if (res.code) {
              this.$Message.success(res.message);
							if(pIndex || pIndex == 0){
								if(index || index == 0){
									this.catList[pIndex].get_self.splice(index, 1);
								} else {
									this.catList.splice(pIndex, 1);
								}
							}
              // const index = this.catList.findIndex(item => item.id === id);
              // this.catList.splice(index, 1);
              this.loadData();
            }
            this.spinShow = false;
          });
        },
        onCancel () {
          this.spinShow = false;
        }
      });
    },
		openSecondCatModal(item){
			this.catValue = item.name;
			this.catId = item.id;
			this.showAddSecondCat = true;
		},
		//创建二级分类
		saveAddSecondCat(){
			if (!this.addSecondCatValue.trim()) {
			  this.$Message.error('请输入二级分类名称');
			  this.showAddSecondCat = true;
			  return false;
			} else {
			  this.showAddSecondCat = false;
			}
			this.spinShow = true;
			return this.$ajax.post(this.$api.userAddCat, {
				cat_id: parseInt(this.catId) || 0,
			  name: this.addSecondCatValue,
			  type: this.tabType, // image/video
			 })
			.then(response => {
			  const res = response.data;
			  if (res.code) {
			    this.$Message.success(res.message);
			    // 重置
					this.addSecondCatValue = '';
			    this.formItem.name = '';
			    this.selectedCatId = res.data.id;
			    this.loadData();
			  }
			}).finally(()=>{
				 this.spinShow = false;
			})
		},
    handleSingle (item) {
      this.selectedList = [];
      this.selectedList.push({
        src: item.img_src_format,
        id: item.id,
				width: item.width,
				height: item.height
      });
    },
    handleMulti (curItem) {
      let delIndex;
      if (this.selectedList.findIndex((item, index) => {
        if (curItem.id === item.id) delIndex = index;
        return curItem.id === item.id;
      }) !== -1) {
        this.selectedList.splice(delIndex, 1);
      } else {
        this.selectedList.push({
          src: curItem.img_src_format,
          id: curItem.id,
					width: curItem.width,
					height: curItem.height
        });
      }
    },
    handleRemark (remarkItem, remark) {
      const index = this.list.findIndex(item => remarkItem.id === item.id);
      this.list[index].img_remark = remark;
    },
    handleUploadProgress (uploadList) {
      this.uploadList = uploadList;
    },
    handleUploadSuccess (payLoad) {
      this.uploadSign = false;
			if(this.uploadTimer){
				clearTimeout(this.uploadTimer);
				this.uploadTimer = null;
			}
			this.uploadTimer = setTimeout(()=>{
				this.handleReload().then(() => { // 上传成功后默认按照顺序选中；
					let uploadSort = this.$refs['material-upload'].uploadSort || [];
					let selectData = [];
					if(Number(this.multi)){
						if(!this.isPopup) return;
						for(let i = 0; i < uploadSort.length; i++){
							let sItem = uploadSort[i] || '';
							if(!sItem) continue;
							for(let j = 0; j < this.list.length; j++){
								let lItem = this.list[j] || {};
								if(sItem == lItem.img_remark){
									selectData.push({
									  src: lItem.img_src_format,
									  id: lItem.id,
										width: lItem.width,
										height: lItem.height
									});
									break;
								}
							}
						}
						this.selectedList.push(...selectData);// 
					} else {
						if(!this.isPopup) return;
						let lastKey = '';
						for(let i = uploadSort.length; i > 0; i--){
							if(!lastKey){
								lastKey = uploadSort[i];
							} else {
								break;
							}
						}
						if(lastKey){
							for(let j = 0; j < this.list.length; j++){
								let lItem = this.list[j] || {};
								if(lastKey == lItem.img_remark){
									this.selectedList = [
										{
										  src: lItem.img_src_format,
										  id: lItem.id,
											width: lItem.width,
											height: lItem.height
										}
									];
									break;
								}
							}
						}
					}
					this.$refs['material-upload'].uploadOrder = [];
				});
			}, 300);
    },
  },
  watch: {
    selectedList (list) {
      this.$emit('getSeletedList', this.multi === 0 ? list[0] : list);
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.material-list{
  .material-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    .search{
      width: 200px;
    }
  }
  .common_divider{
    margin: 10px 0;
  }
  .material-content{
    .material-sort{
      text-align: left;
      height: 380px;
      overflow-y: auto;
      overflow-x: hidden;
      .material-sort_item, .create-cat{
        position: relative;
        font-size:14px;
    		margin: 10px 10px 5px 0;
		    padding: 8px 20px 8px 10px;
		    cursor: pointer;
		    border-radius: 5px;
		    position: relative;
        background: #efefef;
        &.current{
          color:#fff;
    		  background: #2d8cf0;
        }
        .edit-box{
          display: none;
          position: absolute;
          right: 0px;
          top: 0px;
          transform: translateY(-50%);
          flex-direction: column;
					.ivu-icon{
						border: 1px solid #fff;
						border-radius: 100%;
						background-color:#fff;
					}
        }
				.edit-cat-icon{
					margin: 1px 0px;
				}
				.remove-cat-icon{
					margin: 1px 0px;
				}
				.add-cat-icon{
					margin: 1px 0px;
				}
      }
			.material-sort_item:hover{
				box-shadow: 2px 2px 5px #ccc;
				.edit-box{
				  display: block;
					color: #50596D;
					.ivu-icon{
						box-shadow: 0px 0px 3px #ccc;
					}
				}
			}
			.sub-sort-item{
				position: relative;
				font-size:14px;
				margin: 10px 10px 5px 0;
				margin-left: 20px;
				padding: 8px 20px 8px 10px;
				cursor: pointer;
				border-radius: 5px;
				position: relative;
				background: #efefef;
				&.current{
				  color:#fff;
				  background: #2d8cf0;
				}
				.edit-box{
				  display: none;
				  position: absolute;
				  right: 0px;
				  top: 0px;
				  transform: translateY(-50%);
				  flex-direction: column;
					.ivu-icon{
						background-color:#fff;
					}
				}
				.edit-cat-icon{
					margin: 1px 0px;
				}
				.remove-cat-icon{
					margin: 1px 0px;
				}
				.add-cat-icon{
					margin: 1px 0px;
				}
			}
      .sub-sort-item:hover{
				box-shadow: 2px 2px 5px #ccc;
				.edit-box{
				  display: block;
					color: #50596D;
					.ivu-icon{
						background-color:#fff;
					}
				}
			}
			.sub-sort-item:before{
				content: '';
				display: block;
				border:1px solid #ccc;
				position:absolute;
				top:-5px;
				left:-10px;
				width:100%;
				height:calc(100% + 10px);
				border-top: 0 none;
				border-right: 0 none;
				transform: translateY(-50%);
				z-index:-1;
			}
      .create-cat{
        background:#2d8cf0;
        color:#fff;
        font-size:12px;
        padding:4px 10px;
      }
      .create-cat-content{
        padding: 5px;
      }
    }
    .material-details{
      height: 380px;
      overflow-y: auto;
      overflow-x: hidden;
      width:100%;
      border: 1px solid #eee;
      .material-inner{
        .list{
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex-wrap: wrap;
          .progress-bg{
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 5px;
            border: 2px solid rgba(0, 0, 0, 0.04);
            width: 120px;
            height: 160px;
            margin: 10px;
            border-radius: 3px;
            background: #fff;
            cursor: pointer;
          }
        }
      }
    }
    @media screen and (max-width: 1400px) {
      .material-sort {
        height: 300px;
      }
      .material-details {
        height: 300px;
      }
    }
  }
}
.cat-tree-area{
	.ivu-tree-title{
		width:100%;
		padding: 5px 10px;
		background-color: #efefef;
	}
	.ivu-tree-title-selected{
		background-color:#2F8CEE;
	}
}
</style>
<style lang="less">
.material-list{
  .ivu-input-icon{
      right: 50px;
  }
}
</style>
