const app = {
	state: {
		openPageTags: false,
		isEnterSider: false,
		pageLoading: false,
		pageScrollTop: 0,
	},
	mutations: {
		setOpenPageTags(state, val) {
			state.openPageTags = val;
		},
		setIsEnterSiders(state, val) {
			state.isEnterSider = val;
		},
		setPageLoading(state, val) {
			state.pageLoading = val;
		},
		setPageScrollTop(state, val) {
			state.pageScrollTop = val;
		},
	}
};

export default app;
