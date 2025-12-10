import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia=createPinia()
pinia.use(persist)

export default pinia

// import { useUserStore } from './modules/user'
// export {useUserStore}

// import {useCountStore} from './modules/counter'
// export {useCountStore}

//对仓库进行统一的导出 export是用来暴露的
export * from './modules/user'   //对modules文件夹下的user全部进行按需导出
export * from './modules/counter' //对modules文件下的counter全部进行按需导出
