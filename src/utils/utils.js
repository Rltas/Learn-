/**
 * 兼容事件绑定程序
 */
export let EventHandler = {
  addHandler: function (ele, type, handler) {
    if (ele.addEventListener) {
      ele.addEventListener(type, handler, false);
    } else if (ele.attachEvent) {
      ele.attachEvent("on" + type, handler);
    } else {
      ele["on" + type] = handler;
    }
  },
  removeHandler: function (ele, type, handler) {
    if (ele.removeEventListener) {
      ele.removeEventListener(type, handler, false);
    } else if (ele.detachEvent) {
      ele.detachEvent("on" + type, handler);
    } else {
      ele["on" + type] = null;
    }
  },
  preventDefault: function (event) {
    event = event || window.event;
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  }
}

/**
 * 清除请求空参数
 */
export function filterEmptyData(obj) {
  for (let key in obj) {
    obj[key] ? obj[key] : delete obj[key];
  }
  return obj;
}

/**
 * 保留两位小数
 */
export function numShow(num) {
  try {
    num = Number(num);
    let num_tem = num.toFixed(2);
    let num_tem2 = Math.floor(num);
    if (num_tem > num_tem2) {
      return num_tem;
    } else {
      return num_tem2;
    }
  } catch (error) {
    return num
  }
}

/**
 * 深拷贝
 */
export function deepCopy(obj) {
  let result = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] == "object" && obj[key] != null) {
        result[key] = deepCopy(obj[key]);
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}

/**
 *  数组根据某属性排序
 */
export function sortFn(val) {
  return function (obj_1, obj_2) {
    let val_1 = obj_1[val],
      val_2 = obj_2[val];
    if (val_1 < val_2) {
      return -1;
    } else if (val_1 > val_2) {
      return 1
    } else {
      return 0
    }
  }
}

/**
 * 根据某属性筛选出相同项
 */

export function sizer(arr_1, arr_2, key) {
  return arr_1.filter(item => arr_2.some(ele => ele[key] == item[key]));
}

/**
 * ajax兼容
 */

export function ajax(url, data = {}, method, type = 'application/x-www-form-urlencoded') {
  let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Mircosoft.XMLHTTP');
  if (method == 'get') {
    xhr.open(url + '?' + joint(obj));
    xhr.send();
  } else {
    xhr.open(url);
    xhr.setRequestHeader('Content-Type', type);
    xhr.send(joint(data));
  }
  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        resolve(JSON.parse(xhr.response));
      } else {
        reject('请求失败！')
      }
    }
  })
}

/**
 * api参数整合
 */

export function joint(obj) {
  obj = filterEmptyData(obj);
  let result = [];
  for (let key in obj) {
    let str = `${key}=${obj[key]}`;
    result.push(str);
  }
  return result.join('&');
}

/***
 * 防抖
 */

 export function debounce(fnc, delay = 100) {
  let timer = null;
  return function() {
    let context = this,
        args = arguments;
    clearTimeOut(timer);
    timer = setTimeout(() => {
      fnc.apply(context, args)
    }, delay);
  }
}

/**
 * 节流
 */

  export function throttle(fn, delay = 100) {
    let prev = Date.now(),
        context = this,
        args = arguments;
    return function() {
      let now = Date.now();
      if(now - prev >= delay) {
        fn.apply(context, args);
        prev = Date.now();
      }
    }
  }