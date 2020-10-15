import { Toast } from 'vant';

export let toastLoading = (time = 0, msg = '正在加载') => {
  Toast.loading({
    duration: time,
    forbidClick: true,
    message: msg,
    overlay: true
  })
}