<template>
  <el-dialog
    :title="dataForm.type == 'add' ? '新增' : '修改'"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="50%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="15%">
      <el-form-item :label="'报送内容'" prop="bsnr">
        <textarea v-model="dataForm.bsnr" placeholder="请输入内容..."
                  style="margin-top: 0px; margin-bottom: 0px; min-height: 216px;width: 90%"></textarea>
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
    data () {
      return {
        visible: false,
        dataForm: {
          id: '',
          bsnr: '',
          sjdm: '',
          type: ''
        },
        dataRule: {
          bsnr: [
            {required: true, message: '内容不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    created () {
    },
    methods: {
      init (id, bsnr, subType) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.dataForm.id = id
          this.dataForm.type = subType
          this.dataForm.bsnr = bsnr
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/yjzh/${this.dataForm.type === 'add' ? 'addxxbs' : 'updatexxbs'}`),
              method: 'post',
              params: this.$http.adornParams({
                'id': this.dataForm.id || undefined,
                'bsnr': this.dataForm.bsnr
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
          }
        })
      }
    }
  }
</script>
