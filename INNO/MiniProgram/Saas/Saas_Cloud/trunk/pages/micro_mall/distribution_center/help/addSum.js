export class AddSum {
    constructor(value, num, interval, times, sendPage = false) {
        this.value = value;
        this.num = num;
        this.interval = interval;
        this.times = times;
        this.valueTemp = 0;
        this.numTemp = 0;
        this.middle = parseFloat((this.value / this.times).toFixed(2));
        if (this.middle == 0 && Math.abs(value) > 0.01) {
            this.middle = 0.01
        }
        this.label = '';
        this.sendPage = sendPage;
    }
    init(module) {
        this.page = getCurrentPages().pop();
        if (!this.sendPage && module) { //组件
            this.component = this.page.selectComponent(module);
        } else {
            this.component = this.page //页面
        }
        if (Math.abs(this.value) > 0) {
            this.run();
        }
    }
    run() {
        this.label = setTimeout(() => {
            clearTimeout(this.label);
            this.valueTemp = parseFloat(this.middle + this.valueTemp);
            this.numTemp += 1;
            if (Math.abs(this.valueTemp) >= Math.abs(this.value) || (this.numTemp > this.times)) {
                  if (this.label) {
                      console.log('结束', this.value)
                      this.setValue(this.value);
                      clearTimeout(this.label)
                      delete this.label
                      return
                  }
              } else {
                  this.setValue(this.valueTemp);
                  this.run();
              }
        }, this.interval)
    }
    end() {
        if (this.label) {
            clearTimeout(this.label);
            delete this.label
        }
    }
    setValue(value) {
        if (this.component && this.label) {
            this.component.setData({
                [`_value[${this.num}]`]: value.toFixed(2),
            })
        }
    }
}