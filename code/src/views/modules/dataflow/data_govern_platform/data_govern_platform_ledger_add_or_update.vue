<template>
  <el-dialog
    :title="whichType(dataForm.type)"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="60%">
    <el-form :model="dataForm" ref="dataForm" label-width="20%" :rules="rules">
      <el-form-item label="主题总条数" prop="topicCount">
        <el-input v-model="dataForm.topicCount"
                  :disabled="isView"></el-input>
      </el-form-item>
      <el-form-item label="部门总数" prop="departmentCount">
        <el-input v-model="dataForm.departmentCount"
                  :disabled="isView"></el-input>
      </el-form-item>
      <el-form-item label="磁盘占用空间" prop="diskUsageCount">
        <el-input v-model="dataForm.diskUsageCount"
                  :disabled="isView"></el-input>
      </el-form-item>
      <el-form-item label="记录总条数" prop="recordCount">
        <el-input v-model="dataForm.recordCount"
                  :disabled="isView"></el-input>
      </el-form-item>
      <el-form-item label="文件总数" prop="fileCount">
        <el-input v-model="dataForm.fileCount"
                  :disabled="isView"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit()"
                 :disabled="isView">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import ElFormItem from 'element-ui/packages/form/src/form-item.vue'
  import ElInput from 'element-ui/packages/input/src/input.vue'

  export default {

    components: {
      ElInput,
      ElFormItem
    },
    computed: {
      isView: function () {
        return this.whichType(this.dataForm.type) === "查看" ? true : false
      }
    },
    data() {
      return {
        visible: false,
        dataForm: {
          id: '',
          topicCount: '',
          departmentCount: '',
          diskUsageCount: '',
          recordCount: '',
          fileCount: '',
          type: ''
        },
        rules: {
          topicCount: [
            {required: true, message: '请输入主题总条数', trigger: 'blur'},
            {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
          ],
          departmentCount: [
            {required: true, message: '请输入部门总数', trigger: 'blur'},
            {min: 2, max: 66, message: '长度在 2 到 66 个字符', trigger: 'blur'}
          ],
          diskUsageCount: [
            {required: true, message: '请输入磁盘占用空间', trigger: 'blur'},
            {min: 2, max: 66, message: '长度在 2 到 66 个字符', trigger: 'blur'}
          ],
          recordCount: [
            {required: true, message: '请输入记录总条数', trigger: 'blur'},
            {min: 2, max: 66, message: '长度在 2 到 66 个字符', trigger: 'blur'}
          ],
          fileCount: [
            {required: true, message: '请输入文件总数', trigger: 'blur'},
            {min: 2, max: 66, message: '长度在 2 到 66 个字符', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      whichType(typeCode) {
        if (typeCode === 'add') {
          return "新增"
        } else if (typeCode === 'update') {
          return "修改"
        } else if (typeCode === 'view') {
          return "查看"
        }
      },
      initializing(id, subType) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (typeof (id) === 'number') {
            this.$http({
              url: this.$http.adornUrl('/data_govern_platform_ledger/record'),
              method: 'get',
              params: this.$http.adornParams({
                'id': id
              })
            }).then(({data}) => {
              if (data && data.successful) {
                this.dataForm = data.data
                this.dataForm.type = subType
                this.dataForm.id = id
              } else {
                console.log('ERROR', data)
                this.$message.error('操作失败')
              }
            })
          } else {
            for (var i in this.dataForm) {
              this.dataForm[i] = ''
            }
          }
          this.dataForm.type = subType
        })
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/data_govern_platform_ledger/record`),
              method: this.dataForm.type === 'add' ? 'post' : 'put',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'topicCount': this.dataForm.topicCount,
                'departmentCount': this.dataForm.departmentCount,
                'diskUsageCount': this.dataForm.diskUsageCount,
                'recordCount': this.dataForm.recordCount,
                'fileCount': this.dataForm.fileCount,
                'deleteFlag': '1'
              })
            }).then(({data}) => {
              if (data.successful) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                console.log('ERROR', data)
                this.$message.error('操作失败')
              }
            })
          } else {
            return false
          }
        })
      }
    }
  }
</script>
