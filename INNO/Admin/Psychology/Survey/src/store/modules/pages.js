const pages = {
	state: {
		compPageInfo : {},
		compList: [],
		pageCompList: [],
		selectCompIndex: -1,
	},
	mutations: {
		setCompList(state, val) {
			state.compList = val;
		},
		setPageCompList(state, val) {
			state.pageCompList = val;
		},
		setCompPageInfo(state, val){
			state.compPageInfo = val;
		},
		setSelectCompIndex(state, val){
			state.selectCompIndex = val;
		}
	}
};

export default pages;
