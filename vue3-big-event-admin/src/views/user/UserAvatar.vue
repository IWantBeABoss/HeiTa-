<script setup>
  import {ref} from 'vue'
  import {Plus,Upload} from '@element-plus/icons-vue'
  import {useUserStore} from '@/stores'
  import { userUploadAvatarService } from '@/api/user'
  import { ElMessage } from 'element-plus'
  //基于store的数据,初始化imageUrl的初始值
  const userStore=useUserStore()
  const imageUrl=ref(userStore.user.user_pic)
  const uploadRef=ref()
  const onSelectFile=(uploadFile)=>{
    //基于 FileReader 读取图片做预览
    const file=uploadFile.raw
    const reader=new FileReader()
    reader.readAsDataURL(file)
    reader.onload=()=>{
      imageUrl.value=reader.result
      // console.log(imageUrl.value)
    }
  }
  const onUpdataAvatar= async ()=>{
    //发送请求更新头像
    await userUploadAvatarService(imageUrl.value)
    // userStore 重新渲染
    await userStore.getUser()
    ElMessage.success('更换图像成功')
  }
</script>

<template>
  <page-container title="更换头像">
    <el-upload
    ref="uploadRef"
    :auto-upload="false"
    class="avatar-uploader"
    :show-file-list="false"
    :on-change="onSelectFile"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
  <br>
  <el-button @click="uploadRef.$el.querySelector('input').click()"
    type="primary"
    :icon="Plus"
    size="large"
    >选择图片</el-button>
  <el-button @click="onUpdataAvatar" type="success" :icon="Upload" size="large">上传图像</el-button>
  </page-container>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>
