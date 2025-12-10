<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import  PageContainer  from '@/components/PageContainer.vue'
import {userUpdataPasswordService} from '@/api/user'
import { useUserStore} from '@/stores'
import { useRouter } from 'vue-router'
// 表单引用
const formRef = ref()

// 表单数据
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})

// 基础校验规则 - 6-15位非空
const baseRule = [
  { required: true, message: '密码不能为空', trigger: 'blur' },
  { min: 6, max: 15, message: '密码长度为6-15位', trigger: 'blur' }
]

// 自定义校验 - 原密码和新密码不能相同
const validateOldNewPwd = (rule, value, callback) => {
  if (pwdForm.value.old_pwd && pwdForm.value.new_pwd &&
      pwdForm.value.old_pwd === pwdForm.value.new_pwd) {
    callback(new Error('新密码不能与原密码相同'))
  } else {
    callback()
  }
}

// 自定义校验 - 确认密码必须和新密码相同
const validateConfirmPwd = (rule, value, callback) => {
  if (value !== pwdForm.value.new_pwd) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 表单验证规则
const rules = ref({
  old_pwd: baseRule,
  new_pwd: [
    ...baseRule,
    { validator: validateOldNewPwd, trigger: 'blur' }
  ],
  re_pwd: [
    ...baseRule,
    { validator: validateConfirmPwd, trigger: 'blur' }
  ]
})

const userStore=useUserStore()
const router=useRouter()
// 提交表单
const handleSubmit = async () => {
  await formRef.value.validate()
  await userUpdataPasswordService(pwdForm.value)
  ElMessage.success('密码修改成功')

  //密码修改成功后，退出重新登录
  // 1. 清空本地存储的 token 和 个人信息
  userStore.setToken('')
  userStore.setUser({})

  //拦截登录
  router.push('/login')
}

// 重置表单
const handleReset = () => {
  formRef.value.resetFields()
}

</script>

<template>
  <page-container title="修改密码">
    <el-row>
      <el-col :span="12">
        <div>
    <el-form
      ref="formRef"
      :model="pwdForm"
      :rules="rules"
      label-width="120px"
      @submit.prevent="handleSubmit"
    >
      <!-- 原密码 -->
      <el-form-item label="原密码" prop="old_pwd">
        <el-input
          v-model="pwdForm.old_pwd"
          type="password"
          placeholder="请输入6-15位原密码"
          show-password
          clearable
        />
      </el-form-item>

      <!-- 新密码 -->
      <el-form-item label="新密码" prop="new_pwd">
        <el-input
          v-model="pwdForm.new_pwd"
          type="password"
          placeholder="请输入6-15位新密码"
          show-password
          clearable
        />
      </el-form-item>

      <!-- 确认密码 -->
      <el-form-item label="确认密码" prop="re_pwd">
        <el-input
          v-model="pwdForm.re_pwd"
          type="password"
          placeholder="请再次输入新密码"
          show-password
          clearable
        />
      </el-form-item>

      <!-- 按钮行 -->
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">修改密码</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
      </el-col>
    </el-row>
  </page-container>
</template>
