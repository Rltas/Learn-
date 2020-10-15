import * as types from './mutation-types'
import { userInfo } from './getters';

const mutations = {
    [types.SET_USER_INFO](state, userInfo) {
        state.userInfo = userInfo
        var str = JSON.stringify(userInfo)
        localStorage.setItem('userInfo', str);
    },
    // [types.SET_TOKEN](state, token) {
    //     state.token = token
    //     var str = JSON.stringify(token)
    //     localStorage.setItem('token', str);
    // },
    // [types.REFRESH_TOKEN](state, refreshToken) {
    //     state.refreshToken = refreshToken
    //     var str = JSON.stringify(refreshToken)
    //     localStorage.setItem('refreshToken', refreshToken);
    // },
    changeIsVip(state,isVip){
      state.isVip = isVip
    },
    setPhoneNumber(state,phoneNumber){
      state.phoneNumber = phoneNumber
    }
}

export default mutations
