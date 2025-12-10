import request from '@/utils/request'

//注册接口,这个是省略了“{}”和“return”了的
export const userRegisterService=({username,password,repassword})=>
  request.post('/api/reg',{username,password,repassword})

//登录接口
export const userLoginService=({username,password})=>
  request.post('/api/login',{username,password})

//获取用户的基本信息
export const userGetInfoService=()=>
  request.get('/my/userInfo')

//更新用户的基本信息
export const userUpdataInfoService=({id,nickname,email})=>
  request.put('/my/userInfo',{id,nickname,email})

//更新用户头像
export const userUploadAvatarService=(avatar)=>
  request.patch('/my/update/avatar',{avatar})

//更新用户密码
export const userUpdataPasswordService=({old_pwd,new_pwd,re_pwd})=>
  request.patch('/my/updatepwd',{old_pwd,new_pwd,re_pwd})
