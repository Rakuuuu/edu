<template>
  <el-form :model="formDataViewShow" class="search-cont" :label-col="labelCol">
      <div v-for="(item, index) in listForm" :key="index" class="search-item">
        <!-- 自定义插槽 -->
        <template v-if="item.slotName">
          <slot :name="item.keyName" :row="formDataViewShow"></slot>
        </template>
        <el-form-item :label="item.label || ''" v-if="item.type === 'input'">
          <el-input v-model="formDataViewShow[item.keyName]" clearable
                   :placeholder="item.placeholder || '请输入'" />
        </el-form-item>
        <!-- 下拉框 -->
        <el-form-item :label="item.label || ''" v-if="item.type === 'select'">
          <el-select v-model="formDataViewShow[item.keyName]"
                     clearable
                    :placeholder="item.placeholder || '请输入'"
                    @change="changeHandler">
            <el-option :value="selectCont.value" :label="selectCont.label"
                             v-for="(selectCont, selectIndex) in item.options"
                             :key="selectIndex">
              {{ selectCont.label }}
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 日期选择器
         valueFormat="YYYY-MM-DD" 表示得到年月日
          format="YYYY-MM-DD" 数据展示年月日
        -->
        <el-form-item :label="item.label || ''" v-if="item.type === 'date'">
          <el-date-picker clearable v-model="formDataViewShow[item.keyName]" valueFormat="YYYY-MM-DD"
                         format="YYYY-MM-DD" class="setdate-width" />
        </el-form-item>
        <!-- 时间段 -->
        <el-form-item :label="item.label || ''" v-if="item.type === 'daterange'">
          <el-date-picker clearable v-model="formDataViewShow[item.keyName]" valueFormat="YYYY-MM-DD"
                          type="daterange" format="YYYY-MM-DD" class="setdate-width" />
        </el-form-item>
        <!-- 数字输入框 -->
        <el-form-item :label="item.label || ''" v-if="item.type === 'number'">
          <el-input-number clearable id="inputNumber" v-model="formDataViewShow[item.keyName]" :min="1" :max="10" />
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" @click="searchHandler">搜索</el-button>
        <el-button style="margin-left: 10px" @click="resetHandler">重置</el-button>
      </el-form-item>
  </el-form>
</template>
<script setup>
import { defineProps, defineEmits, ref } from 'vue'
const props = defineProps({
  listForm: {
    type: Array,
    required: true,
    default: () => []
  },
})
const emit = defineEmits(['resetHandler', 'searchHandler'])
// 获取视图上需要展示的格式，
// 如果是下拉框的话，没有值需要处理成为undefined
// 该方法是在 1.视图初始化的时候 2.重置表单的时候调用
const getFormData = () => {
  const result = {}
  props.listForm.map(item => {
    // item.default  可以直接去解决下拉框没有值，显示不出来placeholder
    if (item.type == 'select') {
      result[item.keyName] = item.default || undefined
    } else {
      result[item.keyName] = item.default || ''
    }
  })
  return result
}
// 给视图
const formDataViewShow = ref(getFormData())
// 重置表单清除视图上的数据，需要注意点是 下拉框的值应为undefined
const clearDealBack = () => {
  // 清除视图上的值
  formDataViewShow.value = getFormData()
  // 将视图上的数据恢复最初, 下拉框仍然是undefined
  let obj = getFormData()
  //如果返回去的数据有值，你可以返回默认值.没有默认值返回空
  let newobj = {}
  for (let keysName in obj) {
    // obj[keysName] 返回的是回填的值，因此有 ||这个运算
    newobj[keysName] = obj[keysName] || ''
  }
  return newobj
}
// 搜索的时候，如果是undefined,将值进行处理
const searchDealBack = () => {
  // 将undefined转为空
  let obj = formDataViewShow.value
  let newobj = {}
  for (let keysName in obj) {
    // 因此值是undefined,说明是下拉框或者是其他，直接重置为 ''
    if (obj[keysName] === undefined) {
      newobj[keysName] = ''
    } else {
      newobj[keysName] = obj[keysName]
    }
  }
  return newobj
}
// 重置表单事件，向上抛出去的数据
const resetHandler = () => {
  emit('resetHandler', clearDealBack())
}
// 搜索事件，向上抛出去的数据
const searchHandler = () => {
  // 获取插槽中的值
  emit('searchHandler', searchDealBack())
}
const changeHandler = () => {
  // emit('searchHandler', searchDealBack())
}
let labelCol = { style: { width: '75px' } }
</script>
<style scoped>
.search-cont {
  width: 100%;
  display: flex;
}
.search-item {
  margin-right: 12px;
}
.setdate-width {
  width: 100%;
}
.btnflex {
  text-align: right;
}
:deep(.el-form) {
  display: flex;
}
:deep(.el-form-item) {
  margin: 0 !important;
}
:deep(.el-input) {
  width: 200px;
}
</style>
