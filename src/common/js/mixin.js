// 判断数据是否为空
var haveData = data => {
    if(!data.obj.goodsList) {
        return false
    }
    return true
}


export { haveData }