<template>
	<Card class="red-packet-list">
		<Row type="flex">
			<Col style="flex:1 1 0%;">
				<SearchForm ref="search" @on-search="searchPage"></SearchForm>
			</Col>
			<Col style="width:90px;text-align: right;">
				<Button icon="md-refresh" @click="init" shape="circle" title="刷新列表"></Button>
			</Col>
		</Row>
		<Tabs :value="tabName" :animated="false" type="card" @on-click="onTabsClick">
			<TabPane name="redEnvelopes" label="红包列表">
				<red-envelopes ref="redEnvelopes" :search-data="searchData" />
			</TabPane>
			<TabPane name="recycle" label="回收站">
				<red-envelopes ref="recycle" :search-data="searchData" />
			</TabPane>
		</Tabs>
	</Card>
</template>

<script>
	import RedEnvelopes from './red-envelopes/red-envelopes-list';
	import TabsHelper from '@/libs/tabs-helper';
	import SearchForm from './search-form';

	export default {
		mixins: [TabsHelper],
		components: {
			RedEnvelopes,
			SearchForm
		},
		data() {
			return {
				tabName: 'redEnvelopes',
				searchData: {
					searchq: '',
					time: '',
					static_time: 0
				}
			}
		},
		methods: {
			init(){
				this.$refs[this.tabName].loadData();
			},
			searchPage(searchData) {
				this.searchData = searchData;
				this.$nextTick(() => {
					this.$refs[this.tabName].searchPage();
				});
			}
		}
	}
</script>
