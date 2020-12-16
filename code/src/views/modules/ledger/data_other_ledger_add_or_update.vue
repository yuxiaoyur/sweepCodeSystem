<template>
  <el-dialog
    :title=" dataForm.type === 'add' ? '新增' : '修改'"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="60%">


    <el-form :model="dataForm" ref="dataForm" label-width="15%" :rules="rules">

      <el-form-item label="数据类" prop="dataType">
        <el-input v-model="dataForm.dataType"></el-input>
      </el-form-item>

      <el-form-item label="部门" prop="department">
        <el-input v-model="dataForm.department"></el-input>
      </el-form-item>

      <el-form-item label="接入方式" prop="accessMethod">
        <el-select v-model="dataForm.accessMethod" placeholder="请选择接入方式" clearable>
          <el-option
            v-for="item in accessMethodOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        visible: false,
        accessMethodOptions: [
          {
            value: '接口-单位直接提供',
            lable: '接口-单位直接提供'
          },
          {
            value: '人工录入',
            lable: '人工录入'
          },
          {
            value: '离线文件',
            lable: '离线文件'
          },
          {
            value: '涉密介质',
            lable: '涉密介质'
          }
        ],
        dataForm: {
          id: '',
          dataType: '',
          departmetn: '',
          accessMethod: ''
        },
        rules: {
          dataType: [
            {required: true, message: '请输入数据类名称', trigger: 'blur'},
            {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
          ],
          department: [
            {required: true, message: '请输入部门名称', trigger: 'blur'},
            {min: 2, max: 66, message: '长度在 2 到 66 个字符', trigger: 'blur'}
          ],
          accessMethod: [
            {required: true, message: '请选择接入方式', trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      initializing(id, subType) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (typeof (id) === 'number') {
            this.$http({
              url: this.$http.adornUrl('/data_other_ledger/detail'),
              method: 'get',
              params: this.$http.adornParams({
                'id': id
              })
            }).then(({data}) => {
              if (data && data.successful) {
                this.dataForm = data.data
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
              url: this.$http.adornUrl(`/data_other_ledger/${this.dataForm.type === 'add' ? 'insert' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'dataType': this.dataForm.dataType,
                'department': this.dataForm.department,
                'accessMethod': this.dataForm.accessMethod
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
