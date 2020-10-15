// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import FastClick from 'fastclick'
import router from 'router/index'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import VueLazyload from 'vue-lazyload'
import util from 'js/util'
import Vant from 'vant'
import 'vant/lib/index.css'
import {
	baseUrl,
	yjBaseUrl
} from "api/config"
import store from './store'
import './common/css/iconfont.css'

//dialog阻止 body 滚动

router.beforeEach((to, from, next) => {
	/* 路由发生变化修改页面title */
	if (to.meta.title) {
		document.title = to.meta.title
	}
	next()
})
// es6兼容问题
require('es6-promise').polyfill()

FastClick.attach(document.body)
Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueLazyload)
// Vue.use(PulseLoader)
Vue.use(util)
Vue.use(Vant)
// Vue.use(VueAwesomeSwiper)
// 解决四舍五入问题
Number.prototype.toFixed = function (s) {
	var changenum = (parseInt(this * Math.pow(10, s) + 0.5) / Math.pow(10, s)).toString()
	var index = changenum.indexOf(".")
	if (index < 0 && s > 0) {
		changenum = changenum + "."
		for (var i = 0; i < s; i++) {
			changenum = changenum + "0"
		}
	} else {
		index = changenum.length - index
		for (var i = 0; i < (s - index) + 1; i++) {
			changenum = changenum + "0"
		}
	}
	return changenum
}

// 配置懒加载图片
Vue.use(VueLazyload, {
	preLoad: 1.3,
	error: 'common/images/images-1.jpg',
	loading: 'common/images/images.png',
	attempt: 1
})

// api
global.COURSES = baseUrl
global.YJ_COURSES = yjBaseUrl

// 发现地址
global.FIND = yjBaseUrl

// 客服电话 68829928
global.PHONE = '023-68829928'

// request payload  => form data
Vue.http.options.emulateJSON = true;

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app-box')
