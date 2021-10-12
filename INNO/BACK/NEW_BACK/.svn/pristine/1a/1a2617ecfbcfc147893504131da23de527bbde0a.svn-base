export default {
	methods: {
		onTabsClick(name) {
			this.addAct(name);
		},
		addAct(name) {
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
			this.$refs[tabName].loadData();
		},
		searchPage(data) {
			this.$refs[this.$route.query.act].searchPage(data);
		}
	},
	mounted() {
		this.addAct();
	}
}
