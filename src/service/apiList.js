import * as httpHelper from './httpHelper'
/**
 * 获取首页数据
 */
export function getIndexInfo(params) {
  return httpHelper.get('index', params)
}

/**
 * 获取用户登录信息
 */
export function getLoginState(params) {
  return httpHelper.get('info', params)
}

export function getDemo() {
  return httpHelper.get('demo')
}
