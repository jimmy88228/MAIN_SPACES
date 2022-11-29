class dateHandle {
	static getInstance(){
		if (!dateHandle.instance) {
		  dateHandle.instance = new dateHandle();
		}
		return dateHandle.instance;
	}
	constructor() {
		this.Hours = 24; // 0 ~ 23
		this.Minutes = 60; // 0 ~ 59
		this.Seconds = 60; // 0 ~ 59
		this.nowDay = 24 * 60 * 60 * 1000;
	}
	getDisabledHour(currDateStr, type){
		let currDate = (currDateStr && new Date(currDateStr)) || new Date();
		let currTime = currDate && currDate.getTime();
		let nowDate = new Date();
		let nowTime = nowDate.getTime();
		let disabledHours = [];
		let hour = 0;
		// if(!currDate) return this.setDisabledHour(nowDate, type);
		if((currTime - nowTime) < this.nowDay){ // 选择时间相隔1天内
			if(currDate.getDate() == nowDate.getDate()){ // 同一天
				disabledHours = this.setDisabledHour(nowDate, type);
			} else {
				disabledHours = [];
			}
		} else{
			disabledHours = []
		}
		return disabledHours
	}
	
	getDisabledMin(currDateStr, type){
		let currDate = (currDateStr && new Date(currDateStr)) || new Date();
		let currTime = currDate && currDate.getTime();
		let nowDate = new Date();
		let nowTime = nowDate.getTime();
		let min = 0;
		let disabledMins = [];
		// if(!currDate) return this.setDisabledMin(nowDate, type);
		if((currTime - nowTime) < this.nowDay){ 
			console.log("currDate.getDate()", currDate.getDate(),"nowDate.getDate()", nowDate.getDate())
			console.log("currDate.getHours()", currDate.getHours(),"nowDate.getHours()", nowDate.getHours())
			if(currDate.getDate() == nowDate.getDate() && currDate.getHours() == nowDate.getHours()){ // 同一天
				disabledMins = this.setDisabledMin(nowDate, type)
			} else {
				disabledMins = [];
			}
		} else {
			disabledMins = [];
		}
		
		return disabledMins
	}
	setDisabledHour(date, type){
		let hour = date.getHours();
		let disHours = [];
		for(let i = 0; i < this.Hours; i++){
			if(type == "before"){
				if(i > hour){
					disHours.push(i);
				} else {
					break;
				}
			} else {
				if(i < hour){
					disHours.push(i);
				} else {
					break;
				}
			}
			
		}
		return disHours || [];
	}
	setDisabledMin(date, type){
		let min = date.getMinutes();
		let disMins = [];
		for(let i = 0; i < this.Minutes; i++){
			if(type == "before"){
				if(i > min){
					disMins.push(i);
				} else {
					break;
				}
			} else {
				if(i < min){
					disMins.push(i);
				} else {
					break;
				}
			}
		}
		return disMins || [];
	}
}
export default dateHandle.getInstance();