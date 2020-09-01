import { remove } from "lodash"

function defineReactive(obj, key, val) {
  if (arguments.length == 2) {
    val = obj[key]
  }
  if (typeof val === 'object') {
    new Observer(val)
  }
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      console.log(`${key}属性被读取了！`)
      return val
    },
    set(newVal) {
      if(val = newVal) {
        return 
      } else {
        console.log(`${key}属性被修改了！`)
        val = newVal
      }
    }
  })
}

export class Observer {
  constructor(val) {
    this.val = val
    if(Array.isArray(val)) {
      /**
       * 当值为数组时做的某些操作
       */
    } else {
      this.walk(val)
    }
  }
  walk(obj = Object) {
    const keys = Object.keys(obj)
    for (let key in keys) {
      defineReactive(obj, keys[key])
    }
  }
}

export class dep {
  constructor() {
    this.subs = []
  }
  addSub(sub) {
    this.subs.push(sub)
  }
  removeSub(sub) {
    remove(this.subs, sub)
  }
}