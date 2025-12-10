<script setup>
import { ref } from 'vue'
import { defineExpose } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import {Plus} from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { artPublishService ,artGetDetailService,artEditService } from '@/api/article'
import { ElMessage } from 'element-plus'
import { baseURL } from '@/utils/request.js'
import axios from 'axios'
//控制抽屉的显示和隐藏
const visibleDrawer = ref(false)

//默认数据
const defaultForm = {
  title: '', // 标题
  cate_id: '', // 分类
  cover_img: '',// 封面图片 file对象
  content: '', // string 内容
  state: ''// 状态
}

// 准备数据
const formModel = ref({ ...defaultForm })
const mimeType='image/png'

//图片上传相关逻辑
const imgUrl=ref('')
const onSelectFile=(uploadFile)=>{
  imgUrl.value=URL.createObjectURL(uploadFile.raw)  //预览图片
  //立即将图片对象,存入 formModel.value.cover_img 中来用于提交
  formModel.value.cover_img=uploadFile.raw
  //console.log(uploadFile)
}

//组件对外暴露一个方法 open , 基于 open 传来的参数 , 区分添加还是编辑
//open({}) => 表单无需渲染, 说明是 添加
//open({id:,...,...}) => 表单需要渲染,说明是编辑
//open调用后,可以打开弹窗
const editorRef=ref()
const open = async (row) => {
  visibleDrawer.value = true  //显示抽屉
  if (row.id) {
    //若存在,则需要基于 row.id 来发送请求，获取编辑需要对应的详情数据,进行回显
    const res=await artGetDetailService(row.id)
    formModel.value=res.data.data
    //图片需要单独处理回显
    imgUrl.value=baseURL + formModel.value.cover_img
    //注意:提交给后台,需要的格式是file对象格式
    //需要将网络图片地址 => 转换成 file 对象 ,存储起来
    const file=await urlToFile(imgUrl.value,formModel.value.cover_img,mimeType)
    formModel.value.cover_img=file
  } else {
    formModel.value = { ...defaultForm } //基于默认的数据，重置form数据
    //这里重置了表单的数据,但是 图片上传的img地址 和 富文本编辑器内容 => 需要手动重置
    imgUrl.value=''
    editorRef.value.setHTML('')  //注意:这个富文本编辑器的内容重置,要用它官网的 setHTML() 方法 ,自己重置容易出问题的。
  }
  console.log(row)
}

//提交
const emit=defineEmits(['success'])
const onPublish= async (state)=>{
  //将 “已发布” 或 “草稿” 状态存入 formModel
  formModel.value.state=state

  //注意:当前接口需要的是 formData 对象
  //所以,我们需要将当前 formModel 对象 转换成 formData 对象
  const fd=new FormData()
  for(let key in formModel.value){
    fd.append(key,formModel.value[key])
  }

  //发请求
  if(formModel.value.id){  //注意:这里不是 cate_id ,而是表格中每一行的 序号id
    //编辑操作
    await artEditService(fd)
    ElMessage.success('修改成功')
    visibleDrawer.value=false
    emit('success','edit')
  }else{
    //添加操作
    await artPublishService(fd)
    ElMessage.success('添加成功')
    visibleDrawer.value=false
    //通知父组件,添加成功了
    emit('success','add')
  }
}

async function urlToFile(url, filename, mimeType) {
  try {
    // 1. 获取图片数据
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'blob' // 重要：指定响应类型为 blob
    });

    // 2. 将 Blob 转换为 File
    const blob = response.data;
    const file = new File([blob], filename, { type: mimeType });

    return file;
  } catch (error) {
    console.error('转换失败:', error);
    throw error;
  }
}

defineExpose({
  open
})
</script>
<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
    >

    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select v-model="formModel.cate_id" width="100%"></channel-select>
      </el-form-item>
      <!--
          此处需要关闭 element-plus 的自动上传,不需要配置 action 等参数
          只需要做前端的本地预览图片即可, 无需在提交前上传图片
          语法: URL.createObjectURL(...) 创建本地预览的地址,从而来预览
      -->
      <el-form-item label="文章封面" prop="cover_img">
        <el-upload
          :auto-upload="false"
          class="avatar-uploader"
          :show-file-list="false"
          :on-change="onSelectFile"
          >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor
            theme="snow"
            v-model:content="formModel.content"
            content-type="html"
            ref="editorRef"
          >
          </quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
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
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
