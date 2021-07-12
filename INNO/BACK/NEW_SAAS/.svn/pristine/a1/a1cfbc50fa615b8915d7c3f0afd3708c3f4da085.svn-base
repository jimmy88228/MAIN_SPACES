<style lang="less" scoped>
.goods-editor-left-menu{
	.panel-title{
		font-size:15px;
		font-weight: bold;
	}
	.com-item{
		cursor: move;
		background: #fff;
		width:50%;
		float:left;
		text-align: center;
		padding:12px 0px;

		&:hover{
			background: #eee;
		}

		.title{
			font-size:12px;
		}
	}
  .empty-tip{
    padding:10px;
    text-align: center;
  }
	.ghost-left {
		opacity: 0.5;
		background: #c8ebfb;
	}
}
</style>

<template>
    <div class="goods-editor-left-menu" :style="getPanelStyle">
      <vue-scroll ref="vue-scroll" :ops="scrollOptions">
        <Collapse simple v-model="panelShow">

          <Panel name="panel1">
            <span class="panel-title">基础组件</span>
            <p slot="content">

              <draggable
                class="clearfix"
                ghost-class="ghost-list"
                :clone="cloneItem"
                :list="dataList"
                :group="{name:'itemBox', pull:'clone', put:false }">

                <div v-for="(item,index) in dataList" :key="index" class="com-item"
                v-if="item.show_in_toolbar && item.cat == 'basic'">
                  <div class="left-com-item">
                    <Icon :type="item.icon" :class="item.icon_class" size="30"></Icon>
                    <div class="title">{{ item.name }}</div>
                  </div>
                </div>

                <div v-if="basicComp == 0 " class="empty-tip">暂无可用基础组件</div>
              </draggable>

            </p>
          </Panel>

          <Panel name="panel2">
            <span class="panel-title">活动组件</span>
            <p slot="content">
              <draggable
                class="clearfix"
                ghost-class="ghost-list"
                :clone="cloneItem"
                :list="dataList"
                :group="{name:'itemBox', pull:'clone', put:false }">

                <div v-for="(item,index) in dataList" :key="index" class="com-item"
                  v-if="item.show_in_toolbar && item.cat == 'activity' ">
                  <div class="left-com-item">
                    <Icon :type="item.icon" :class="item.icon_class" size="30"></Icon>
                    <div class="title">{{ item.name }}</div>
                  </div>
                </div>

                <div v-if="activityComp == 0 " class="empty-tip">暂无可用活动组件</div>
              </draggable>
            </p>
          </Panel>
					<!--测试数据-->
					<!-- <Panel name="panel3">
					  <span class="panel-title">营销组件</span>
					  <p slot="content">
					    <draggable
					      class="clearfix"
					      ghost-class="ghost-list"
					      :clone="cloneItem"
					      :list="lotteryList"
					      :group="{name:'itemBox', pull:'clone', put:false }">
					      <div v-for="(item,index) in lotteryList" :key="index" class="com-item"
					        v-if="item.show_in_toolbar && item.cat == 'lottery' ">
					        <div class="left-com-item">
					          <Icon :type="item.icon" :class="item.icon_class" size="30"></Icon>
					          <div class="title">{{ item.name }}</div>
					        </div>
					      </div>
					
					      <div v-if="lotteryList.length == 0 " class="empty-tip">暂无可用活动组件</div>
					    </draggable>
					  </p>
					</Panel> -->
        </Collapse>
      </vue-scroll>
    </div>
</template>

<script>
/**
 * 商品页面编辑器 - 左侧菜单
 */
import draggable from 'vuedraggable';

export default {
  name: 'editorLeftMenu',
  components: {
    draggable
  },
  props:{
  	height:{
  		type:Number,
  		default: 500,
  	},
  	// 当前编辑器是否作为内嵌编辑器使用
  	pageType: {
  		type: String,
  		default: 'page'
  	},
  },
  data () {
    return {
      // 默认展开的panel
      panelShow: ['panel1', 'panel2'],

      dataList: [],
      basicComp: 0,
      activityComp: 0 ,
      // 虚拟滚动条
      scrollOptions:{
      	mode: 'native',
      	bar:{
      		keepShow: false,
      		background: '#c8c8c8',
      		size:'3px',
      	},
      	// 滚动轨道
      	rail:{
      		size:'3px',
      	},
      	scrollPanel:{
      		scrollingX:false,
      	}
      },
			// lotteryList: []

    }
  },
  computed: {
    getPanelStyle(){
    	return {
    		height: ( this.height )+'px',
    		overflow: 'hidden auto',
    	};
    },
  },
  methods: {
    	/**
    	 * @desc 初始化方法
    	 */
    init () {

    },
    // 克隆的内容
    cloneItem ({ name, code }) {
      // 这个返回很重要，这里返回可以解除双向绑定
      return {
        name: `${name}`,
        code: `${code}`,
        setting: {} // setting 是组件的json 数据，创建的时候留空即可
      };
    },
    initData (list) {
      this.dataList = list;

      for(var i in this.dataList ){
      	if( this.dataList[i].cat == 'basic'){
      		this.basicComp ++;
      	}
      	else if( this.dataList[i].cat == 'activity' ){
      		this.activityComp ++;
      	}
      }
    }
  },
  watch: {
  },
  mounted () {
    this.init();
  },
  created () {

  }
};
</script>
