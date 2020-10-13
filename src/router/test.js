export default [{
  path: '/demo',
  name: 'demo',
  component: () => import('../views/Demo.vue'),
  meta: {
    title: '用例'
  }
}, {
  path: '/async',
  name: 'async',
  component: () => import('../views/Async.vue'),
  meta: {
    title: '异步处理'
  }
}]