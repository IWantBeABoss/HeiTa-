<script setup>
import {ref} from 'vue'
import {artGetChannelsService,artDelChannelService} from '@/api/article'
import {Edit,Delete} from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'
const channelList =ref([])

const loading=ref(false)
const dialog=ref()

const getChannelList=async ()=>{
  loading.value=true
  const res= await artGetChannelsService()
  channelList.value=res.data.data
  loading.value=false
  console.log(channelList.value);
}
getChannelList()

const onDeleteChannel= async (row)=>{
  await ElMessageBox.confirm('你确认要删除该分类吗','温馨提示',{
    type:'warning',
    confirmButtonText:'确认',
    cancelButtonText:'取消'
  })
  await artDelChannelService(row.id)
  ElMessage.success('删除成功')
  getChannelList()
}
const onEditChannel=(row)=>{
  dialog.value.open(row)
}
const onAddChannel=()=>{
  dialog.value.open({})
}
const onSuccess=()=>{
  getChannelList()
}
</script>

<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button @click="onAddChannel">添加分类</el-button>
    </template>

    <el-table v-loading="loading" :data="channelList" stripe style="width:100%">
      <!-- el-table-column 是表格的一列 label 是这一列的标题-->
      <el-table-column type="index" label="序号" width="100px"></el-table-column>
      <el-table-column prop="cate_name" label="分类名称"></el-table-column>
      <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
      <el-table-column label="操作" width="100px">
        <!-- row 就是 channelList 的一项 , $index 下标 -->
        <template #default="{row,$index}">
          <el-button
            :icon="Edit"
            type="primary"
            @click="onEditChannel(row,$index)"
            circle
            plain
          ></el-button>
          <el-button
            :icon="Delete"
            type="danger"
            @click="onDeleteChannel(row,$index)"
            circle
            plain
          ></el-button>
        </template>
      </el-table-column>

      <!-- 非空判断 -->
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
    <channel-edit @success="onSuccess" ref="dialog"></channel-edit>
  </page-container>
</template>

<style lang="scss" scoped>

</style>
