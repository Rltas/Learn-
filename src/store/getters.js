const getters = {
  userInfo(state){
    return JSON.parse(localStorage.getItem('userInfo'))
  },
  // token(state){
  //   return JSON.parse(localStorage.getItem('token'))
  // },
  // refreshToken(state){
  //   return JSON.parse(localStorage.getItem('refreshToken'))
  // },
}



export default getters
