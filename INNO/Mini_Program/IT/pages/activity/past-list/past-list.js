import MyDate from "../../../common/support/utils/date-util";
let app = getApp();
Page.PagingPage({
	data: {
		mainList: []
	},
	onReady() {
		this.setData({ isAttached: true, showRefresh: true });
		this.refresh();
	},
	onPullDownRefresh() {
		this.refresh();
	},
	refresh() {
		this.checkLoginChange();
		return this.loadData(true)
			.finally(() => {
				wx.stopPullDownRefresh();
				this.setData({ showRefresh: false });
			});
	},
	onReachBottom() {
		this.setData({ showLoadMore: true })
		this.loadData()
			.finally(() => this.setData({ showLoadMore: false }));
	},
	loadData(refresh = false) {
		if (this.isLoading || (!refresh && this.data.isEnd)) {
			return Promise.reject();
		}
		this.isLoading = true;
		return getPastActivityMonthPage(this.nextDataIndex(refresh))
			.then(data => this.setDataList(refresh, data))
			.finally(() => this.isLoading = false).showError();
	},
	setDataList(refresh, data) {//重写
		if (refresh) {
			let pageData = this.getPageData(true);
			if (data && data.length > 0) {
				pageData.index = 1;//必须这么写,与基类对应
			} else {
				pageData.index = 0;//必须这么写,与基类对应
			}
			pageData.list && delete pageData.list;
			pageData.map && delete pageData.map;
			pageData.count = 0;
			transformData(pageData, data);
			this.setData({ list: pageData.list, count: pageData.count, isEnd: false });
		} else if (data && data.length > 0) {
			let pageData = this.getPageData();
			pageData.index = pageData.index + 1;//必须这么写
			transformData(pageData, data);
			this.setData({ list: pageData.list, count: pageData.count, isEnd: false });
		} else {
			this.setData({ isEnd: true });
		}
	}
})

const MonthNames = ["", "Jan.", "FEB.", "Mar.", "Apr.", "May.", "Jun.", "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec.",]

function transformData(hold, data) {
	let { list, map, count } = hold;
	list || (list = []);
	map || (map = { years: {}, });
	count || (count = 0);
	let nowYear = new Date().getFullYear();
	data.forEach(item => {
		let acts = item.activitys || [];
		acts.forEach(act =>
			act.date = MyDate.format(MyDate.parse(act.startTime), "MM/dd")
		);
		count = count + acts.length;
		let monthData = {
			count: item.count,
			month: item.month,
			monthStr: (MonthNames[item.month]),
			acts: acts
		};

		if (item.year in map) {
			let yearData = map[item.year];
			yearData.months.push(monthData)
		} else {
			let yearData = {
				year: item.year,
				showYear: item.year != nowYear,
				months: [monthData]
			};
			map[item.year] = yearData;
			list.push(yearData);
		}
	});
	hold.list = list;
	hold.map = map;
	hold.count = count;
}

function getPastActivityMonthPage(pageIndex) {
	const brandCode = app.Conf.BRAND_CODE;
	return app.DrawApi.getPastActivityMonthPage({
		params: {
			brandCode, pageIndex,
			pageSize: 8
		}
	}).netData();
}