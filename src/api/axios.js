import axios from 'axios'

var instance = axios.create({
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// axios.defaults.headers.common['token'] = localStorage.getItem("token") || ''

const qs = require('qs')

axios.interceptors.request.use((config) => {
  if(config.method  === 'post'){
    config.data = qs.stringify(config.data);
  }
  return config;
},(error) =>{
  alert("错误的传参");
  return Promise.reject(error);
});

export default axios