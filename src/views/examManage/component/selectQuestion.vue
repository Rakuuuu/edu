<template>
  <div class="container">
    <el-row
      class="options"
    >
      <el-col
        :lg="12"
        :sm="12"
        :xs="24"
        v-for="(item, index) in options"
        :key="index"
        class="col"
      >
        <div
          :class="['option-item', answers.includes(item.key) ? 'checked' : '']"
        >
          <el-checkbox
            @change="setAnswer($event, index)"
            :model-value="answers.includes(item.key)"
            size="large"
            :disabled="disabled"
          >
            答案
          </el-checkbox>
          <el-input
            v-model="item.value"
            ref="optionContent"
            size="large"
            :disabled="disabled"
          />
          <el-button
            class="delete-btn"
            type="danger"
            plain
            v-if="options.length > 3"
            @click="dropOption(index)"
            :disabled="disabled"
          >
            <el-icon><Delete/></el-icon>
          </el-button>
        </div>
      </el-col>
    </el-row>
    <div class="add">
      <el-button
        size="large"
        class="add-btn"
        type="primary"
        plain
        @click="addOption"
        v-if="options.length < 10 && !disabled"
      >
        <el-icon><Plus/></el-icon>添加选项
      </el-button>
    </div>
  </div>
</template>

<script>
import { Plus, Delete } from '@element-plus/icons-vue'

export default {
  name: "selectQuestion",
  components: { Plus, Delete },
  props: {
    // 题目类型： 单选1 多选6
    questionType: String,
    disabled: Boolean
  },
  data () {
    return {
      // 存放选项内容，至少3个选项
      options: [
        { key: '0', value: '' },
        { key: '1', value: '' },
        { key: '2', value: '' },
      ],
      // 存放答案，若是多选至少2个选项
      answers: [],
    }
  },
  methods: {
    // 添加选项
    addOption () {
      this.options.push({
        key: String(this.options.length),
        value: ''
      })
    },
    // 移除选项
    dropOption (index) {
      console.log('选项', this.options.map(v => `${v.key}${v.value}`))
      this.options.splice(index, 1)
      this.options.forEach((v, i) => {
        if (i >= index) {
          v.key = String(--v.key)
        }
      })
      console.log('选项', this.options.map(v => `${v.key}${v.value}`))
    },
    //设置答案
    setAnswer (ev, index) {
      //若是单选题
      if (this.questionType === '1') {
        if (ev) {
          this.answers = [this.options[index].key]
        }
      } else if (this.questionType === '6') {
        const matchIndex = this.answers.findIndex(v => v === this.options[index].key)
        if (ev && matchIndex === -1) {
          this.answers.push(this.options[index].key)
        } else if (!ev && matchIndex !== -1) {
          this.answers.splice(matchIndex, 1)
        }
      }
    },
    /**
     * 初始化数据
     * @param questionDetail
     */
    setData (questionDetail) {
      console.log(666)
      const { questionOption, questionAnswer } = questionDetail
      this.options = questionOption.split(';').map(v => {
        const [ key, value ] = v.split(',')
        return { key, value }
      })
      console.log(this.options, 3)
      this.answers = questionAnswer.split(',')
      console.log(this.answers, 4)
    },
    /**
     * 获取指定数据
     */
    getData () {
      // 校验
      if (this.options.length < 3) {
        this.$message({
          type: 'warning',
          message: '选项不足，请调整'
        })
        return
      }
      for (const i of this.options) {
        if (!i.value) {
          this.$message({
            type: 'warning',
            message: '请完善选项内容'
          })
          return
        }
      }
      if (this.questionType === '1' && !this.answers.length) {
        this.$message({
          type: 'warning',
          message: '请选择答案'
        })
        return
      } else if (this.questionType === '6' && this.answers.length < 2) {
        this.$message({
          type: 'warning',
          message: '请选择至少2个答案'
        })
        return
      }
      const optionStr = this.options.map(({ key, value }) => `${key},${value}`).join(';')
      const answerStr = this.answers.join(',')
      console.log({ optionStr, answerStr })
      return { optionStr, answerStr }
    }
  }
}
</script>


<style scoped lang="scss">
.container {
  width: calc(100% + 32px);
  margin-left: -16px;
  margin-right: -16px;
}
.options{
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  .col {
    padding: 8px 16px;
    box-sizing: border-box;
  }
  .option-item {
    width: 100%;
    padding: 16px;
    box-sizing: border-box;
    display: flex;
    margin-bottom: 12px;
    border: 1px solid rgba(0,0,0,0.15);
    border-radius: 8px;
    align-items: center;
    min-width: 300px;
    :deep(.el-checkbox) {
      margin-right: 16px;
    }
    .delete-btn {
      height: 100%;
      margin-left: 16px;
    }
  }
}

.checked {
  border: 1px solid var(--el-color-primary) !important;
  background: var(--el-color-primary-light-9);
}

.add {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .add-btn {
    width: 100% !important;
    margin: 12px 16px;
  }
}
</style>
