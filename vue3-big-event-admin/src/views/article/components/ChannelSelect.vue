<script setup>
import { artGetChannelsService } from '@/api/article';
import {ref} from 'vue'

//这个在vue3中没必要用const props来接收这个defineProps
defineProps({
  modelValue:{
    type:[Number,String],
  },
  width:{
    type:String
  }
})

const emit = defineEmits(['update:modelValue'])

const channelList=ref([])
const getCannelList= async ()=>{
  const res =await artGetChannelsService()
  channelList.value=res.data.data
}
getCannelList()
</script>

<template>
  <!-- el-select是下拉菜单,label是给用户看的,value是收集起来提交给后台的,一般这里的value是id -->
  <!-- 注意这里的 :modelValue="modelValue", 前面第一个modelValue可以随便改的，如：“ :data='modelValue' ”-->
  <!-- 同理这个 @update:modelValue="emit('update:modelValue',$event)" 中的第一个“@update:modelValue”也可以随便改 -->
  <el-select
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue',$event)"
    :style="{width}"
    >
    <el-option
      v-for="channel in channelList"
      :key="channel.id"
      :label="channel.cate_name"
      :value="channel.id"
      ></el-option>
  </el-select>
</template>

<style></style>
