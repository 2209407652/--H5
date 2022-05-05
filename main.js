import App from './App'
import Vue from 'vue'
import store from 'store/index.js'

Vue.config.productionTip = false

App.mpType = 'app'

Vue.filter('formatCount', function(num) {
	if (num >= 10000 && num <= 10000000) {
		num /= 1000;
		return num.toFixed(1).toString() + '万'
	} else if (num > 10000000) {
		num /= 10000000
		return num.toFixed(1).toString() + '亿'
	} else {
		return num
	}
})

Vue.filter('formatDate', function(date) {
	const nowDate = new Date(date)
	const YYYY = nowDate.getFullYear()
	const MM = addZero(nowDate.getMonth() + 1)
	const DD = addZero(nowDate.getDate())
	return YYYY + '年' + MM + '月' + DD + '日'
})
// 补零
function addZero(num) {
	if (num < 10) return '0' + num
	else return num
}

const app = new Vue({
	...App,
	store
})

app.$mount()
