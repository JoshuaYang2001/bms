// 对api接口进行统一的管理
import request  from './request'
export const reqLogin = ()=>{
  return request({url:'/login',method:'post'})
}
