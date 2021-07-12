<style lang="less">
.message-list{
	.ivu-tabs-tab{
		font-size:12px;
		line-height:23px;
	}
	.ivu-badge{
		margin-left:5px;
	}
}
</style>

<template>
	<Card class="message-list">

		<Tabs :value="tabsName" :animated="false" type="card" @on-click="onTabsClick">

	        <TabPane name="notifications" :label="label1">
	        	<messageListTable ref="list-notifications"></messageListTable>
	        </TabPane>
	       
	        <TabPane name="system_notices" :label="label2">
	        	<messageListTable ref="list-system_notices"></messageListTable>
	        </TabPane>
	        <TabPane name="private_messages" :label="label3">
	        	<messageListTable ref="list-private_messages"></messageListTable>
	        </TabPane>

	        <Button  size="small" slot="extra" icon="md-refresh" style="margin-right:10px;" @click="reloadList">刷新列表</Button>
	    </Tabs>

	</Card>
</template>

<script>
/**
 * 消息列表
 */
import util from '@/libs/util.js';
import messageListTable from './message-list-table';

export default {
  components: {
    messageListTable
  },
  props: {
  },
  data () {
    	return {
      tabsName: 'notifications',

      label1: (h) => {
        return h('div', [
          h('span', '通知'),
          h('Badge', {
            props: {
              count: 0
            }
          })
        ])
      },

      label2: (h) => {
        return h('div', [
          h('span', '系统公告'),
          h('Badge', {
            props: {
              count: 6
            }
          })
        ])
      },

      label3: (h) => {
        return h('div', [
          h('span', '私信'),
          h('Badge', {
            props: {
              count: 0
            }
          })
        ])
      }
    	}
   	},
   	methods: {
    	// 初始化
    	init () {
    		// 初始化，选中tabs
    		var tname = this.$route.hash.replace('#','');
    		if( ['private_messages','notifications', 'system_notices'].indexOf( tname ) !== -1 ){
    			this.tabsName = tname;
    		}

    		// 选中的tabs 加载数据
    		this.$refs['list-' + this.tabsName].initData(this.tabsName);

    		// 初始化label 统计数字
    		this.setLabel();
    	},
    	// tabs 点击事件
    	onTabsClick (name) {
    		this.$router.push('/settings/message#' + name);
    		// 动态加载列表数据
    		this.$refs['list-' + name].initData(name);
    		this.tabsName = name;
    	},
    	// 刷新列表
    	reloadList () {
    		this.$refs['list-' + this.tabsName].initData(this.tabsName);
    	},
    	// 设置label 统计数字
    	setLabel () {
    		this.label1 = (h) => {
        return h('div', [
          h('span', '通知'),
          h('Badge', {
            props: {
              count: this.$store.state.app.messageItemCount.notifications
            }
          })
        ])
          	};

           	this.label2 = (h) => {
        return h('div', [
          h('span', '系统公告'),
          h('Badge', {
            props: {
              count: this.$store.state.app.messageItemCount.notices
            }
          })
        ])
           	};

           	this.label3 = (h) => {
        return h('div', [
          h('span', '私信'),
          h('Badge', {
            props: {
              count: this.$store.state.app.messageItemCount.messages
            }
          })
        ])
           	};
    	}
  },
  watch: {
    '$store.state.app.messageItem' (to) {
      this.setLabel();
    }
  },
  mounted () {
    	this.init();
  }
}
</script>
