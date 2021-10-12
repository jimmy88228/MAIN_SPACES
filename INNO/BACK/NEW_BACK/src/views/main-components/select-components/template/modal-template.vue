<template>
  <div>
    <Modal
      v-model="isVisible"
      :class-name="'template-modal ' + modalClass"
      :title="title"
      :width="modalWidth"
      :mask-closable="isCloseMask"
      @on-visible-change="handleModal"
      transfer>
      <div class="container">
        <div class="left">
          <Card class="left-card">
            <div class="card_header">
              <p class="mode">已选项<span class="sign">[{{type === 'radio' ? '单选模式' : '多选模式'}}]</span></p>
              <Divider class="divider"/>
            </div>
            <div class="selected_wrapper" :style="{'height': defaultHeight + 'px'}" v-show="selectedData.length > 0">
              <!-- 已选数据 -->
              <slot name="selected" v-bind:selectedData="selectedData" v-bind:delItem="delItem">
                <span v-if="item.id" :class="{'item': true, 'larger-img-item': UIMold == 'largerImage'}" v-for="item in selectedData" :key="item.id">
									<template v-if="UIMold == 'largerImage'">
										<p class="select-view-img" :style="'background-image:url(' + item.img + ')'"></p>
									</template>
									<template v-else>
										<p class="select-view-img" :style="'background-image:url(' + item.img + ')'" v-if="item.img"></p>
										<p class="title text-clamp3">{{item.name || "&nbsp;"}}</p>
									</template>
									<Icon type="ios-close-circle-outline" class="close" title="删除" @click="delItem(item.id)"/>
                </span>
              </slot>
            </div>
            <div class="empty" v-show="selectedData.length === 0">
              暂无选中项
            </div>
          </Card>
        </div>


        <div class="right">
          <!-- 搜索 -->
          <div class="search">
            <slot name="search" v-bind:searchPage="searchPage" v-bind:data="data"></slot>
          </div>
          <div :style="'height:' + defaultHeight +'px;overflow-y:auto'">
						<slot name="select-ui">
							<template v-if="UIMold == 'largerImage'">
								<div class="larger-items">
									<div 
									:class="{'larger-item': true, 'selected': hashMap[item.id] ? true : false}"
									:title="item.name"
									v-for="(item, index) in tableData"
									:key="index"
									:style="'background-image:url(' + item.img + ')'"
									@click="handleSelect([], item)"
									>
									<Icon type="md-checkmark" color="#fff" size="22" class="select-icon" v-if="hashMap[item.id]"/>
									</div>
									<div v-if="!tableData || tableData.length == 0" class="no-data">暂无可选数据</div>
									<Spin fix v-if="tableLoading"></Spin>
								</div>
							</template>
							<template v-else>
								<Table
								:loading="tableLoading"
								:height="defaultHeight"
								row-key="id"
								:columns="tableColumn"
								:data="tableData"
								ref="myTable"
								@on-select-cancel="handleSelectCancel"
								@on-select="handleSelect"
								@on-select-all="handleSelectAll"
								@on-select-all-cancel="handleCancelAll"></Table>
							</template>
							
						</slot>
          </div>
          <div v-show="pageTotal" class="list_page" style="padding-top:10px;text-align:right;">
            <Page
              :total="pageTotal"
              :page-size="pageSize"
              :current="currentPage"
              :page-size-opts="pageSizeOpts"
              @on-change="e => changePage(e)"
              @on-page-size-change="ps => handlePageSize(ps)"
              show-total
              show-sizer></Page>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="default" @click="cancel">取消</Button>
        <Button type="primary" @click="comfirm">确定</Button>
      </div>
			<slot name="hidefooter"></slot>
    </Modal>
  </div>
</template>
<script>
import PageHelper from '@/libs/page-helper.js';

export default {
  name: 'modalTemplate',
  props: {
		loadParentData: {
			type: Function,
			default: null
		},
		tableColumn: {
			type: Array,
			default(){
				return []
			}
		},
		status: {
			type:Object,
			default(){
				return {}
			}
		},
		UIMold: {
			type: String,
			default(){
				return ""
			}
		},
		modalClass: {
			type: String,
			default(){
				return ''
			}
		},
		modalWidth: {
			type: Number,
			default(){
				return 800
			}
		}
	},
  mixins: [PageHelper],
  data () {
    return {
      isVisible: false,
      isCloseMask: false,
      selectedData: [],
      // 存储已选ID
      hashMap: {},
      defaultHeight: 450,
      title: '',
      mode: 'store',
      type: 'radio',
      extraParam: {},
			serverData: []
    }
  },
  computed: {},
  methods: {
    showModal () {
      this.isVisible = true;
			this.loadData();
			this.setSelectAll();
    },
    hideModal () {
      this.isVisible = false;
    },
		setSelectAll(){
			if(!this.UIMold){
				this.$nextTick(()=>{
					const dom = this.$refs.myTable.$el.querySelector('.ivu-table-header').querySelector('.ivu-table-cell-with-selection');
					if (this.type === 'radio') dom.style.display = 'none';
				})
			}
		},
    comfirm () {
      if (this.selectedData.length === 0) {
        this.$Message.error('请选择内容!');
        return false;
      }
      this.hideModal();
      this.$parent.handleData(this.selectedData);
    },
    cancel () {
      this.hideModal();
    },
    handleModal (bool) {
      if (!bool) {
        this.hideModal();
        setTimeout(() => {
          this.$parent.handleDestroy();
        }, 1000);
      }
    },
    onLoadData (page, data) {
			if(this.loadParentData){
				return this.loadParentData(page, data).then(result=>{
					this.data = {
						items: result.items || [],
						total: result.total || 0
					}
					this.initTableData('init');
				}).finally(()=>{
					this.tableLoading = false
				})
			} else {
				return new Promise((rs,rj)=>{ rj(); });
			}
    },
		initTableData(type){
			if(this.tableData instanceof Array){
				this.tableData.forEach(item => {
					let _id = item.id;
					if(_id){
						const index = this.selectedData.findIndex(sItem => sItem.id == _id);
						if(index == 0 || (index && index != -1)){
							let _item = JSON.parse(JSON.stringify(item));
							let sItem = this.selectedData[index] || {};
							this.$set(this.selectedData, index, {
								...sItem,
								..._item,
							})
						}
					}
				});
				if(type == 'init'){
					this.setCheckStatus();
				}
			}
		},
    searchPage (searchData) {
      this.loadData();
    },
    // 选中项逻辑
    handleSelect (selected, latest) {
      if (this.type === 'radio') {
        this.selectedData = [];
        this.hashMap = {};
        this.selectedData.push(latest);
				this.hashMap[latest.id] = true;
      } else {
				console.log("selected", selected);
        selected.forEach(item => {
					let id = item.id;
          if (!(item.id in this.hashMap)) {
            this.selectedData.push(item);
            this.hashMap[item.id] = true;
          }
        });
      }
      // 进行样式赋值
      this.setCheckStatus();
    },
    handleSelectCancel (selected, cancelItem) {
      this.delItem(cancelItem.id);
    },
    handleSelectAll (selected) {
      // 多选可见
      this.handleSelect(selected);
    },
    handleCancelAll (selected) {
      this.tableData.forEach(item => this.delItem(item.id));
    },
    delItem (id) {
      if (id in this.hashMap) {
        delete this.hashMap[id];
        const index = this.selectedData.findIndex(item => item.id === id);
        this.selectedData.splice(index, 1);
        this.setCheckStatus();
      }
    },
    setCheckStatus () {
      this.setStatusLoop(this.tableData);
    },
    setStatusLoop(data){
      for(let i = 0; i < data.length; i++){
        let item  = data[i];
				let id = item.id;
        if (id in this.hashMap) {
          item._checked = true;
        } else {
          item._checked = false;
        }
        if(item.children && item.children.length > 0){
          this.setStatusLoop(item.children);
        }
      }
      return data;
    },
  },
  watch: {
    serverData (nV) {
      this.selectedData = [...nV];
      this.selectedData.forEach(item => {
        this.hashMap[item.id] = true;
      });
    },
    status: {
      handler ({mode, type, extraParam, title, data}){
				console.log("title", title);
				this.title = title;
        this.mode = mode;
        this.type = type;
        this.extraParam = extraParam;
				this.serverData = data || [];
      },
      deep: true,
			immediate: true
    },
		tableData: {
			handler (nV, oV){
				this.initTableData();
			},
			deep: true,
			immediate: true
		}
  }
}
</script>

<style lang="less">
.template-modal{
  display: flex;
  align-items: center;
  justify-content: center;
	.larger-items{
		width:620px;
		display:flex;
		flex-wrap: wrap;
		position:relative;
		.larger-item{
			cursor: pointer;
			margin: 10px;
			width: 130px;
			height: 231px;
			background-repeat: no-repeat;
			background-size: 100% auto;
			background-position: center center;
			background-color:#efefef;
			position:relative;
			overflow: hidden;
			.select-icon{
				position: absolute;
				right:0px;
				bottom:0px;
				background-color:#FF1C1F;
				border-radius: 3px;
			}
		}
		.larger-item:hover{
			opacity: 0.9;
		}
		.larger-item.selected::after{
			content: "";
			position:absolute;
			display: block;
			top:0px;
			left:0px;
			width: 100%;
			height:100%;
			border:2px solid #FF1C1F;
			box-sizing: border-box;
		}
		
	}
  .ivu-modal{
    top: 0;
  }
  .search_input{
    width: 200px;
  }
  .ivu-input-icon{
    right: 50px;
  }
  .container{
    display: flex;
    // align-items: flex-start;
    .left{
      flex:1 0 200px;
      margin-right: 20px;
			.left-card{
				height:100%;
			}
      .card_header{
        font-size: 16px;
        text-align: center;
        .sign{
          color: red;
        }
        .divider{
          margin: 18px 0;
        }
      }
      .selected_wrapper{
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow-y: auto;
        align-items: center;
        padding: 6px 0;
        .item{
          position: relative;
          width: 134px;
          padding: 4px 4px;
          border-radius: 4px;
          border: 1px solid #efefef;
          text-align: center;
          margin-bottom: 10px;
          .close{
            color:#ED4014;
            font-size:18px;
            position: absolute;
            right: -8px;
            top: -8px;
            cursor: pointer;
            font-weight: bold;
          }
					.select-view-img{
						width:60px;
						height:60px;
						margin:0 auto;
						background-size:100% auto;
					}
        }
				.larger-img-item{
					width: 80px;
				}
      }
      .empty{
        text-align: center;
      }
    }
    .right{
      flex: 1 1 auto;
    }
  }
}
</style>
