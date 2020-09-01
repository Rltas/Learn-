import axios from './axios'
import {
  httpUrl
} from './urlList'
import {
  filterEmptyData
} from 'utils/utils'

const qs = require('qs')

/***
 * 封装get请求
 */
export function get(apiName, data = {}) {
  axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
  return new Promise((resolve, reject) => {
    axios.get(httpUrl[apiName], {
      params: filterEmptyData(data)
    }).then(response => {
      resolve(response.data);
    }).catch((value) => {
      reject(value);
    })
  })
}

/***
 * 封装post请求
 */
export function post(apiName, data = {}) {
  axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
  return new Promise((resolve, reject) => {
    axios.post(httpUrl[apiName], qs.stringify(filterEmptyData(data))).then(response => {
      resolve(response.data);
    }).catch((value) => {
      reject(value);
    })
  })
}