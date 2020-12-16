<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">

      <el-form-item label="一级系统功能" prop="yjxtgn">
        <el-input v-model="dataForm.yjxtgn" placeholder="一级系统功能，长度不超过10个字"></el-input>
      </el-form-item>
      <el-form-item label="二级系统功能" prop="erjxtgn">
        <el-input v-model="dataForm.erjxtgn" placeholder="二级系统名称，长度不超过10个字"></el-input>
      </el-form-item>
      <el-form-item label="三级系统功能" prop="sjxtgn">
        <el-input v-model="dataForm.sjxtgn" placeholder="三级系统名称，长度不超过10个字"></el-input>
      </el-form-item>

      <el-form-item label="表（接口）信息" prop="bjxx">
        <el-input v-model="dataForm.bjxx"></el-input>
      </el-form-item>

      <el-form-item label="类型" size="mini" prop="lx">
        <el-radio-group v-model="dataForm.lx">
          <el-radio :label="0">接口</el-radio>
          <el-radio :label="1">表</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="备注" prop="url">
        <el-input v-model="dataForm.url"></el-input>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { formatDate } from '@/utils/validate'
  export default {
    data () {
      var validateDate = (rule, value, callback) => {
        if (!formatDate(value)) {
          callback(new Error('时间格式错误'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        dataForm: {
          id: 0,
          sj: '',
          yjxtgn: '',
          erjxtgn: '',
          sjxtgn: '',
          bjxx: '',
          lx: 1,
          url: ''
        },
        dataRule: {
          yjxtgn: [
            { required: true, message: '一级系统功能不能为空', trigger: 'blur' },
            { max: 10, message: "长度不超过10个字", trigger: "blur" }
          ],
          erjxtgn: [
            { required: true, message: '二级系统功能不能为空', trigger: 'blur' },
            { max: 20, message: "长度不超过10个字", trigger: "blur" }
          ],
          sjxtgn: [
            { required: true, message: '三级系统功能不能为空', trigger: 'blur' },
            { max: 20, message: "长度不超过10个字", trigger: "blur" }
          ]

        }
      }
    },
    methods: {
      init (id) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.dataForm.id = id
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/kfkb/xtjrgljk/detail?id=` + this.dataForm.id),
              method: 'get'
            }).then(({data}) => {
              if (data && data.successful) {
                this.dataForm.sj = data.data.sj
                this.dataForm.yjxtgn = data.data.yjxtgn
                this.dataForm.erjxtgn = data.data.erjxtgn
                this.dataForm.sjxtgn = data.data.sjxtgn
                this.dataForm.bjxx = data.data.bjxx
                this.dataForm.lx = data.data.lx
                this.dataForm.url = data.data.url

              }else{
                console.log('ERROR',data)
                this.$message.error("操作失败")
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/kfkb/xtjrgljk/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              params: this.$http.adornParams({
                'id': this.dataForm.id || undefined,
                'sj': this.dataForm.sj,
                'yjxtgn': this.dataForm.yjxtgn,
                'erjxtgn': this.dataForm.erjxtgn,
                'sjxtgn': this.dataForm.sjxtgn,
                'bjxx': this.dataForm.bjxx,
                'lx': this.dataForm.lx,
                'url': this.dataForm.url
              })
            }).then(({data}) => {
              if (data && data.successful) {
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
                this.$message.error(data.message)
              }
            })
          }
        })
      }
    }
  }
</script>
