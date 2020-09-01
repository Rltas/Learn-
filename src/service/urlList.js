export let baseUrl = '';
if (process.env.NODE_ENV == 'production') {
  //生产环境
  if (process.env.VUE_APP_NAME == "build") {
    //正式环境(build)
    baseUrl = ''
  } else {
    //测试环境(test)
    baseUrl = ''
  }
} else {
  //开发环境
  baseUrl = 'http://cs.yujiaojiaoyu.com'
}

export let httpUrl = {
  index: '/app/Index.htm', //首页数据
  demo:  '/gkzy/index.htm',
  info:  `/app/user_info.htm`, // 获取登录信息'
}