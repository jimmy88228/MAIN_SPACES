export default {
	methods: {
		onTabsClick(name) {
			this.addAct(name);
		},
		addAct(name, extraData = {}) {
			console.log("extraData", extraData);
			let tabName;
			if (name) {
				tabName = name;
			} else {
				tabName = this.$route.query.act ? this.$route.query.act : this.tabName;
			}
			this.$router.push({
				name: this.$route.name,
				query: {
					...this.$route.query,
					act: tabName
				}
			});
			this.tabName = tabName;
			if(extraData.page){
				this.$refs[tabName].loadData(parseInt(extraData.page));
			} else {
				this.$refs[tabName].loadData();
			}
		},
		searchPage(data) {
			this.$refs[this.$route.query.act].searchPage(data);
		}
	},
	mounted() {
		if(typeof(this._AddAct) == 'function'){
			this._AddAct();
		} else {
			this.addAct();
		}
		
	}
}
