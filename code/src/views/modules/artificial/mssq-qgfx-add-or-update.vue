<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="50%">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    	<el-form-item label="统计日期" prop="tjrq">
        <el-input v-model="dataForm.tjrq" readonly="readonly"></el-input>
      </el-form-item>
      <el-form-item label="正面舆情" prop="zmyq">
        <el-input v-model="dataForm.zmyq"></el-input>
      </el-form-item>
      <el-form-item label="反面舆情" prop="fmyq">
        <el-input v-model="dataForm.fmyq"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          tjrq: '',
          zmyq: '',
          fmyq: ''
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        if (this.dataForm.id) {
        		this.visible = true
		        this.$nextTick(() => {
		          this.$refs['dataForm'].resetFields()
		        })        
            this.$http({
              url: this.$http.adornUrl(`/mssq/qgfx/detail?id=` + this.dataForm.id),
              method: 'get'
            }).then(({data}) => {     
						if (data && data.successful) {
                this.dataForm.tjrq = data.data.tjrq
                this.dataForm.zmyq = data.data.zmyq
                this.dataForm.fmyq = data.data.fmyq              
              }else{
		        		console.log('ERROR',data)
		            this.$message.error("操作失败")
		         }
            })
          }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/mssq/qgfx/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              params: this.$http.adornParams({
                'id': this.dataForm.id || undefined,
                'zmyq':this.dataForm.zmyq,
                'fmyq':this.dataForm.fmyq
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
