import axios from 'axios'
import store from 'store/store'
axios.defaults.timeout = 5000//网络请求超时时间
axios.defaults.withCredentials = true//保持会话一致
// axios.defaults.baseURL = process.env.ADMIN_SERVER,
axios.defaults.headers.common['Authorization'] = store.state.token
/**
 * 响应拦截 不允许游客模式
 */
// axios.interceptors.response.use(res => {
//   if (res.data.code == 406) {
//     console.log('未登录！');
//   } else {
//     return res
//   }
// })
export default axios