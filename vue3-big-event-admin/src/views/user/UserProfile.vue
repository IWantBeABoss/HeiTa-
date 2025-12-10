<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { userUpdataInfoService } from '@/api/user'
import {ElMessage} from 'element-plus'
const formRef=ref()
// 这里是在使用仓库中的数据的初始值(无需响应式),所以解构无问题
const {
  user: {email,id,nickname,username},
  getUser
 }=useUserStore()

const form = ref({
  id,
  username,
  nickname,
  email,
});

const rules = {
  nickname: [
    { required: true, message: '昵称不能为空', trigger: 'blur' },
    { pattern:/^\S{2,10}$/, message: '昵称必须在2-10个非空字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: ['blur', 'change'] },
  ],
};

const submitForm = async () => {
  // 等待校验结果
  await formRef.value.validate();
  // 发送请求
  await userUpdataInfoService(form.value)
  // 通知 user 模块,进行数据的更新
  getUser()
  //提示用户
  ElMessage.success('修改成功')
};

</script>

<template>
  <page-container title="基本资料">
    <!-- 表单部分 -->
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <!-- 第一行：登录名称 -->
        <el-form-item label="登录名称">
          <el-input v-model="form.username" disabled></el-input>
        </el-form-item>

        <!-- 第二行：用户昵称 -->
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入用户昵称"></el-input>
        </el-form-item>

        <!-- 第三行：用户邮箱 -->
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入用户邮箱"></el-input>
        </el-form-item>

        <!-- 第四行：提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交修改</el-button>
        </el-form-item>
      </el-form>
  </page-container>
</template>
