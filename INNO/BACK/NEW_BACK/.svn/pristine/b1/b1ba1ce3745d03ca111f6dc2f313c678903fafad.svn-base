<script src="store-mixin.js"></script>
<style lang="less" scoped>
	.store-group{
		background-color: #fff;
		padding: 1rem;
	}
</style>
<template>
	<PageTopBase>
		<div class="store-group">
			<div>
				<div class="table-topbar flex f-just-between m-bottom-10">
					<SearchForm ref="search" @on-search="searchPage"></SearchForm>
				</div>
				<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="tableData" ref="myTable" >
					<template slot-scope="{ row, index }" slot="action">
						<div class="v-lines">
							<template v-if="row.handle.remove">
								<Poptip
										transfer
										confirm
										title="确定删除该分组？"
										@on-ok="removeGroup(index, row)">
									<a>删除</a>
								</Poptip>
								<span class="v-line"> | </span>
							</template>
						</div>
					</template>
				</Table>
				<div v-show="pageTotal" class="list_page">
					<div style="padding-left:12px; float: left;">
						<Checkbox v-model="isCheckAll" @on-change="handleCheck">当页全选</Checkbox>
						<ButtonGroup>
							<Button @click="delGoodsMore()">批量删除</Button>
						</ButtonGroup>
					</div>

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
			</div>
		</div>
	</PageTopBase>
</template>

<script type="text/javascript">
    import SearchForm from './goods-search-form';
    import Cookies from 'js-cookie';
    import util from '@/libs/util.js';
    import PageHelper from '@/libs/page-helper.js';
    import Mixin from './goods-mixin.js';
    import PageTopBase from '@/views/my-components/page-top-base/index';

    export default {
        components:{
            SearchForm,
            PageTopBase
        },
        mixins: [PageHelper, Mixin],
        data(){
            return {
                group_id: 0,
                condition: {
                    searchq: '',
                    type: 0
                },
                spinShow:false,
                tabIndex: 0,
                editIndex:-1,
                distanceInfo: {
                    showshop_dist: 0,
                    isforgotdstbysearch: 0
                },
                upLoadPayLoad: {},
                canCreate: {},
                isCheckAll: false,
                selectGoods: []
            }
        },
        methods:{
            // 批量删除商品
            delGoodsMore() {
                if (this.selectGoods.length === 0) {
                    this.$Message.error('请勾选商品');
                    return false;
                }
                this.removeGoods(this.selectGoods.map(item => item.id), 'remove');
            },
            removeGoods(value, type) {
                this.$Modal.confirm({
                    title: '操作提示',
                    content: `确定删除商品吗`,
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        this.spinShow = true;
                        return this.$ajax.post(this.$api.groupGoodsRemove, {
                            // 数组代表批量
                            group_id: this.group_id,
                            id: typeof value === 'object' ? value : [value]
                        })
                            .then((response) => {
                                const res = response.data;
                                if (res.code) {
                                    this.$Message.success(res.message);
                                    this.spinShow = false;
                                    this.selectStore = [];
                                    return this.loadData();
                                }
                            });
                    }
                });
            },
            handleCheck() {
                this.tableData.forEach((item, index) => {
                    if ('_checked' in item) {
                        item._checked = this.isCheckAll;
                    } else {
                        this.$set(this.tableData[index], '_checked', this.isCheckAll);
                    }
                });
                this.selectGoods = [...this.tableData].filter(item => item._checked);
            },
            searchPage (searchData) {
                this.condition = searchData;
                this.loadData();
            },
            onLoadData(page, extraData){
                return this.$ajax.post(this.$api.groupGoodsList, {
                    ...extraData,
                    ...this.condition,
                    'group_id': this.group_id
                }).then((response)=>{
                    console.log("response", response);
                    let res = response.data || {};
                    if(res.code){
                        let data = res.data || {};
                        this.data = data;
                        this.canCreate = data.canCreate || {};
                    }
                })
            },
            //单条删除
            removeGroup(index,item){
                this.tableLoading = true;
                this.$ajax.post(this.$api.groupGoodsRemove,{
                    id: parseInt(item.id),
                    group_id: this.group_id
                }).then( (response)=>{
                    let res = response.data || {};
                    if (res.code) {
                        this.$delete(this.tableData,index);
                        this.$Message.success(res.message);
                    }else{
                        this.$Message.error(res.message);
                    }
                }).finally(()=>{
                    this.tableLoading = false;
                })
            },
            initParams(){
                var query = this.$route.query || {};
                this.group_id = query.group_id;
            },
        },
        mounted(){
            this.initParams();
            this.loadData();
        }
    }

</script>