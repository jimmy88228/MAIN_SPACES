<style lang="less">
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
	min-height:90vh;
}
.layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
}
.layout-nav{
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
}
</style>

<template>
    <div class="layout">
        <Layout>
            <Header style="background:#fff;">
				<searchForm  style="padding-top:10px;" ref="search-form" :cat-tree="catTree" @on-search="searchPage"></searchForm>
            </Header>
            <Layout style="min-height:85vh;">
                <Sider hide-trigger :style="{background: '#fff', 'zIndex': 2}">
                    <Menu :active-name="activename" theme="light" width="auto" :open-names="opennames" @on-select="viewDoc" ref="help_menu">
                        <Submenu v-for="(item,index) in dataTree" :value="item.id" :key="index" :name="item.id" >
                            <template slot="title">{{item.name}}</template>
                            <MenuItem v-for="(item1,index1) in data[item.id]" :value="item1.id" :key="index1"  :name="item.id+'-'+index1"  >{{item1.title}}</MenuItem>
                        </Submenu>
						
                    </Menu>
                </Sider>
                <Layout v-show="catName" :style="{padding: '0 24px 24px'}">
                    <Breadcrumb :style="{margin: '24px 0',color:'black'}">
                        <BreadcrumbItem :style="{color:'#00BFFF'}">{{catName}}</BreadcrumbItem>
                        <BreadcrumbItem :style="{color:'black'}">{{title}}</BreadcrumbItem>
                    </Breadcrumb>
                    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
                       <docInfoContent ref="doc-info-content"></docInfoContent>
                    </Content>
                </Layout>
				<layout v-show="!catName">
					<p :style="{margin:'30px 30px',}">该分类暂无数据</p>
				</layout>
            </Layout>
        </Layout>
		<Spin :fix="true" v-if="showSpin"></Spin>
    </div>
	
</template>

<script>
/**
 * 文档列表
 */
import searchForm from './search-form';
import docInfoContent from './doc-info-content.vue';

export default {
    components: {
    	searchForm,
		docInfoContent,
    },
    data () {
        return {
        	data:[],
        	catTree: [],
			dataTree:[],
			catName:'',
			title:'',
			activename:'',
			opennames:[],
			showSpin: false
        }
    },
    computed: {
    },
    methods: {
    // 	/**
    // 	 * @desc 初始化方法
    // 	 */
        init () {
        	// 动态计算表高度
        	// this.tableHeight = document.body.clientHeight - 200;
        	
        	this.initData();
        },
    //     // 初始化 加载数据，（不会自动加载，而是父组件触发加载）
    	initData(){
			this.showSpin = true;
			// ajax 请求获取初始化数据，然后动态更新下面数据源
        	this.$ajax.post( this.$api.helpCenter, {
        		
        	})
    		.then( (response) => {
    			// this.tableLoading = false;
    			var res = response.data;
    			
    			if( res.code ){
    				// 初始化表数据
    				this.data = res.data.items || {};
    				this.catTree = res.data.catTree || [];
					this.dataTree = res.data.dataTree || [];
					if(Object.keys(this.data).length>0){
						let key = this.dataTree[0].id + "";
						this.$nextTick(()=>{
							this.opennames = [key];
							this.activename = key + "-0";
							this.$refs.help_menu.$children[0].opened = true;
							this.viewDoc(this.dataTree[0].id+'-0');
						})
					}else{
						this.catName ='';
						this.title ='';
					}
    			}
				this.showSpin = false;
				
			});
    	},

        // 搜索 - 回调函数
        searchPage( searchForm ){
        	
        	// this.tableLoading = true;
        	
        	// ajax 请求获取数据，然后动态更新下面数据源
			this.showSpin = true;
        	this.$ajax.post( this.$api.helpCenter, searchForm )
    		.then( (response) => {
    			var res = response.data;
    			if( res.code ){
    				// 初始化表数据
					this.data = res.data.items || {};
    				this.catTree = res.data.catTree || [];
					this.dataTree = res.data.dataTree || [];
					if(Object.keys(this.data).length>0){
						let key = this.dataTree[0].id + "";
						this.$nextTick(()=>{
							this.opennames = [key];
							this.activename = key + "-0";
							this.$refs.help_menu.$children[0].opened = true;
							this.viewDoc(this.dataTree[0].id+'-0');
						})
					}else{
						this.catName ='';
						this.title ='';
					}
    			}
    			
    			// this.tableLoading = false;
			}).finally(()=>{
				this.showSpin = false;
			});
        },
        // 预览文档
        viewDoc(key){
			let keyArr = key.split("-") || [];
			let clicItem = this.data || {};
			for(let i = 0; i < keyArr.length; i++){
				if(keyArr[i] || keyArr[i] == 0){
					clicItem = clicItem[keyArr[i]]
				}
			}
			this.catName=clicItem.get_docs_cat.name;
			this.title=clicItem.title;
			this.$refs['doc-info-content'].initData(clicItem.code);
        },
    },
    watch: {
    },
    mounted () {
        this.init();
    },
    created () {

    },
};
</script>