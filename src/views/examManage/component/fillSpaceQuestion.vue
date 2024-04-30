<template>
  <div class="container">
    <el-row class="row">
      <el-col
        :sm="24"
        :md="12"
        :lg="12"
        v-for="(item, index) in spaceList"
        :key="index"
        class="col"
      >
        <div class="input-main">
          <el-input
            size="large"
            class="input"
            v-model="spaceList[index]"
            :placeholder="`填空${index + 1}`"
            :disabled="disabled"
          />
          <el-button
            type="danger"
            plain
            size="large"
            class="delete-btn"
            @click="removeSpace(index)"
            v-if="spaceList.length > 1"
            :disabled="disabled"
          >
            <el-icon><Delete/></el-icon>
          </el-button>
        </div>
      </el-col>
      <div>
      </div>
    </el-row>
    <div class="bottom">
      <el-button
        class="add-btn"
        type="primary"
        plain
        @click="addSpace"
        v-if="spaceList.length < 10 && !disabled"
      >
        <el-icon><Plus/></el-icon>添加填空项
      </el-button>
    </div>
  </div>
</template>

<script>
import { Plus, Delete } from '@element-plus/icons-vue'

export default {
  name: "fillSpaceQuestion",
  components: { Plus, Delete },
  props: {
    disabled: Boolean
  },
  data () {
    return {
      spaceList: [''],
    }
  },
  methods: {
    // 添加填空项
    addSpace () {
      this.spaceList.push('')
    },
    // 删除填空项
    removeSpace (index) {
      this.spaceList.splice(index, 1)
    },
    /**
     * 返回数据
     */
    getData () {
      for (const i of this.spaceList) {
        const arr = i.split(',')
        if (arr.some(v => !v)) {
          this.$message({
            message: '请检查输入内容',
            type: 'warning'
          })
          return
        }
      }
      console.log({ optionStr: String(this.spaceList.length), answerStr: this.spaceList.join(';') })
      return { optionStr: String(this.spaceList.length), answerStr: this.spaceList.join(';') }
    },
    /**
     * 获取数据
     * @param questionDetail
     */
    setData (questionDetail) {
      const { questionAnswer } = questionDetail
      this.spaceList = questionAnswer.split(';')
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
.row {
}
.col {
  padding: 16px;
}
.input-main {
  display: flex;
  align-items: center;
  .input {

  }
  .delete-btn {
    margin-left: 12px;
  }
}

.bottom {
  width: 100%;
  padding: 0 16px;
  .add-btn {
    width: 100%;
    padding: 18px 0;
    margin-top: 8px;
  }
}
</style>
