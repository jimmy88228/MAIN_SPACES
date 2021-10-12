<style lang="less">
	.brand_group_area {
		overflow: hidden;
		background-color: #ffffff;
		margin: 10px;
		border-radius: 10px;
	}
</style>

<template>
	<Card class="brand_group_area">
		<div>
				<searchForm type="brand_group" @on-search="searchData"></searchForm>
		</div>
		<cardList :groupList="groupList" type="brand_group"></cardList>
	</Card>
</template>
<script>
	import searchForm from '../search-form/search-form.vue';
	import cardList from '../module/card-list.vue';
	export default {
		components: {
			searchForm,
			cardList
		},
		data() {
			return {
				groupList: [],
				formSearch: {
					key: ''
				}
			}
		},
		methods: {
			getlist() {
				this.$store.commit('setLoading', true);
				return this.$ajax.post(this.$api.BrandGroupList, {
					...this.formSearch
				}).then(response => {
				  let res = response.data;
				  if (res.code) {
						this.groupList = res.data || [];
				  }
				}).finally(()=>{
					this.$store.commit("setLoading", false);
				})
			},
			searchData(searchData){
				console.log("searchData", searchData);
				this.formSearch = searchData
				this.getlist();
			}
		},
		mounted() {
			this.getlist();
		}
	}
</script>
