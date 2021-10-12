export default {
	data(){
		return {
			tableHeight: 500,
		}
	},
	mounted(){
		this.getHeight();
	},
	methods:{
		getDomProperty(dom, property) {
		  if (!dom) return 0;
		  const domHeight = Math.ceil(window.getComputedStyle(dom)[property].replace('px', ''));
		  return domHeight;
		},
		getDom(className) {
		  const dom = document.getElementsByClassName(className)[0];
		  return dom;
		},
		getHeight(){
			this.$nextTick(()=>{
				const singlePageMargin = this.getDomProperty(this.getDom('single-page'), 'marginTop') || 0;
				const cardBodyPadding = this.getDomProperty(this.getDom('ivu-card-body'), 'paddingTop') || 0;
				let tBody = document.getElementsByClassName("ivu-table-body")[0];
				let tBodyClient = (tBody && tBody.getBoundingClientRect()) || {};
				let footerPage = document.getElementsByClassName("list_page")[0];
				let fPClient = (footerPage && footerPage.getBoundingClientRect()) || {};
				let pageH = document.body.offsetHeight;
				this.tableHeight = pageH - (tBodyClient.top || 0) - (fPClient.height || 0) - singlePageMargin - cardBodyPadding + 25;
			})
		}
	},
	watch:{
		// tableData :{
		// 	handler(){
		// 		this.$nextTick(()=>{
		// 			const singlePageMargin = this.getDomProperty(this.getDom('single-page'), 'marginTop') || 0;
		// 			const cardBodyPadding = this.getDomProperty(this.getDom('ivu-card-body'), 'paddingTop') || 0;
		// 			let tBody = document.getElementsByClassName("ivu-table-body")[0];
		// 			let tBodyClient = (tBody && tBody.getBoundingClientRect()) || {};
		// 			let footerPage = document.getElementsByClassName("list_page")[0];
		// 			let fPClient = (footerPage && footerPage.getBoundingClientRect()) || {};
		// 			let pageH = document.body.offsetHeight;
		// 			this.tableHeight = pageH - (tBodyClient.top || 0) - (fPClient.height || 0) - singlePageMargin - cardBodyPadding + 25;
		// 		})
		// 	},
		// 	immediate:true
		// }
	}
}