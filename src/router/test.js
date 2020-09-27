export default [{
  path: '/demo',
  name: 'demo',
  component: () => import('../views/Demo.vue'),
  meta: {
    title: '用例'
  }
}]