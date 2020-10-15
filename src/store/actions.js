import * as types from './mutation-types'
import { saveUserInfo } from 'common/js/cache'

const actions = {
  saveUserInfoData({ commit }, data) {
      commit(types.SET_USER_INFO, saveUserInfo(data))
  },
  changeIsVip(ctx,isVip){
    ctx.commit('changeIsVip',isVip)
  },
  setPhoneNumber(ctx,phoneNumber){
    ctx.commit('setPhoneNumber',phoneNumber)
  }
}
export default actions
