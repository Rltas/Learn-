import Vue from 'vue'
import Router from 'vue-router'
import {
  from
} from 'core-js/fn/array'
import { resolve } from 'core-js/fn/promise'
import Test from './test'
Vue.use(Router)

const router =  new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [{
    path: '/',
    name: 'home',
    component: () => import('views/Home.vue'),
    meta: {
      title: '首页'
    }
  }, {
    path: '/introduce',
    name: 'introduce',
    component: () => import('views/Introduce')
  }, {
    path: '/example',
    name: 'example',
    component: () => import('views/Example')
  }, {
    path: '/templateSyntax',
    name: 'templateSyntax',
    component: () => import('views/TemplateSyntax')
  }, {
    path: '/computedWatch',
    name: 'computedWatch',
    component: () => import('views/ComputedWatch.vue'),
    meta: {
      title: '观察页'
    }
  }, {
    path: '/classStyle',
    name: 'classStyle',
    component: () => import('views/ClassStyle.vue')
  }, {
    path: '/conditionRender',
    name: 'conditionRender',
    component: () => import('views/ConditionRender.vue')
  }, {
    path: '/listRender',
    name: 'listRender',
    component: () => import('views/ListRender.vue')
  }, {
    path: '/eventHandler',
    name: 'eventHandler',
    component: () => import('views/EventHandler.vue')
  }, {
    path: '/customEvent',
    name: 'customEvent',
    component: () => import('views/CustomEvent.vue')
  }, {
    path: '/parent',
    name: 'parent',
    component: () => import('views/Parent.vue')
  }, {
    path: '/transition',
    name: 'transition',
    component: () => import('views/Transition.vue')
  }, {
    path: '/one',
    name: 'one',
    component: () => import('views/One')
  }, {
    path: '/login',
    name: 'login',
    component: () => import('views/Login'),
    meta: {
      title: '登录页'
    }
  }, {
    path: '/dynamic/:id',
    name: 'dynamic',
    component: () => import('views/Dynamic'),
    // redirect: to => {
    //   if(to.params.id == 4) {
    //   return '/transition'
    //   } else {
    //     return '*'
    //   }
    // }
  }, {
    path: '/ele',
    name: 'ele',
    component: () => import('views/Ele')
  },{
    path: '/model',
    name: 'model',
    component: () => import('views/Model.vue')
  },{
    path: '*', //用于匹配所有路由，通常用于404页面
    // redirect: '/login' //重定向到登录页
    component: () => import('views/NotFound')
  }, {
    path: '/vuex',
    name: 'vuex',
    component: () => import('views/Vuex')
  },...Test],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop
      } else {
        return {
          x: 0,
          y: to.meta.savedPosition || 0
        }
      }
    }
  }
})



export default router
