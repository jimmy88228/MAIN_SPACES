export default{
	data(){
		return {
			designW: 750,
		}
	},
	methods:{
		getDom (className) {
		  const dom = document.getElementsByClassName(className)[0];
		  return dom;
		},
		getImgStyle(data){
			let style = "";
			if(data.mix){
				style = `width:${data.mix}%;`;
			} else if(data.width){
				let body_view = this.getDom("view-body");
				let tBodyClient = (body_view && body_view.getBoundingClientRect()) || {};
				let tBodyW = tBodyClient.width || 375;
				let width = (tBodyW * data.width) / this.designW;
				style = `width:${width}px;`;
			}
			return style;
		}
	}
}