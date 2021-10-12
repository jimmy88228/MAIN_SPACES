<style lang="less">
	.input_style {
		margin: 20px;
		float: left;
	}

	.input_style_right {
		margin: 10px;
		float: right;
	}

	.input_style_table_que {

		margin-bottom: 20px;
		margin-left: 10px;
		margin-right: 10px;
		overflow: hidden;
	}

	.input_style_table_que table {
		width: 100%;
	}

	.page_style {
		text-align: center;
		margin: 0 auto;
		margin-top: 10px;
		margin-bottom: 20px;
	}

	.body_one {
		overflow: hidden;
		background-color: #ffffff;
		margin: 10px 10px 10px 10px;
		border-radius: 10px;
	}

	.ivu-select-dropdown {
		max-height: 200px;
	}

	.ivu-table .demo-table-info-row td {
		background-color: #2db7f5;
		color: #fff;
	}

	.ivu-table .demo-table-error-row td {
		background-color: #ff6600;
		color: #fff;
	}

	.ivu-table td.demo-table-info-column {
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

		<div class="oh">
			<div class="input_style">
				<Button type="primary" @click="goback()">返回</Button>
			</div>
		</div>


		<div class="input_style_table_que">

			<Table border :columns="groupheader" :data="all" size="small" ref="table"></Table>
		</div>

		<div class="page_style">
			<Page :total="allnumber" :page-size="page_size" show-total @on-change="changePage"></Page>
		</div>




	</div>

</template>

<script>
	import Cookies from 'js-cookie';
	import util from '@/libs/util.js';

	export default {

		data() {
			return {
				title: '',
				count: '',
				all: [],
				groupheader: [],
				allnumber: '',
				page_size: 15,
			}
		},
		methods: {
			getlist() {
				util.ajax.post(util.apiUrl.activityUserlist, {
						activity_id: this.$route.params.id,
						voteOptionId: this.$route.params.voteOptionId,
						voteOptionChildId: this.$route.params.voteOptionChildId,
					})
					.then((response) => {
						var res = response.data;
						this.groupheader = res.header;
						this.all = res.list.data;
						this.allnumber = Number(res.count);

						this.groupheader[(0)]['render'] = (h, params) => {
							return h('div', [
								h('div', {
									props: {
										type: 'error',
										size: 'small'
									},
									style: {
										float: 'left',
										margin: '5px 5px 5px 5px',
										color: '#ffffff',
										width: '60px',
										height: '60px',
										textAlign: 'center',
										// border:'1px solid #ccc',
										background: 'url("' + params.row.portraitPath + '")',
										backgroundSize: 'contain',
										backgroundRepeat: 'no-repeat',
										backgroundPosition: 'center center',
									},
									on: {
										click: () => {

										}
									}
								}, params.row.totalCount)
							]);
						};
					});
			},
			changePage(page) { //分页
				util.ajax.post(util.apiUrl.activityGetMore, {
						page: page,
						activity_id: this.$route.params.id,
						voteOptionId: this.$route.params.voteOptionId,
						voteOptionChildId: this.$route.params.voteOptionChildId,
					})
					.then((response) => {
						var res = response.data;
						this.groupheader = res.header;
						this.all = res.list.data;
						this.allnumber = Number(res.count);
						this.groupheader[(0)]['render'] = (h, params) => {
							return h('div', [
								h('div', {
									props: {
										type: 'error',
										size: 'small'
									},
									style: {
										float: 'left',
										margin: '5px 5px 5px 5px',
										color: '#ffffff',
										width: '60px',
										height: '60px',
										textAlign: 'center',
										// border:'1px solid #ccc',
										background: 'url("' + params.row.portraitPath + '")',
										backgroundSize: 'contain',
										backgroundRepeat: 'no-repeat',
										backgroundPosition: 'center center',
									},
									on: {
										click: () => {

										}
									}
								}, params.row.totalCount)
							]);
						};
					});
			},
			goback() {
				this.$router.push('/question/questionmessage/' + this.$route.params.id + '/' + Cookies.get('accessToken'));
			}


		},
		mounted() {
			this.getlist();
		},
	}
</script>
