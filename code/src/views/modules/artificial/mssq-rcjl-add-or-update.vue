<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="热词" prop="rc">
        <el-input v-model="dataForm.rc" readonly="readonly"></el-input>
      </el-form-item>
      <el-form-item label="人工事件" prop="rgsj">
        <el-input v-model="dataForm.rgsj"></el-input>
      </el-form-item>      
      <el-form-item label="事件等级" size="mini" prop="sjdj">
        <el-radio-group v-model="dataForm.sjdj">
          <el-radio :label="0">严重</el-radio>
          <el-radio :label="1">一般</el-radio>
        </el-radio-group>
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
          rc: '',
          rgsj: '',
          sjdj: 1
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
              url: this.$http.adornUrl(`/mssq/getRcjl?id=` + this.dataForm.id),
              method: 'get'
            }).then(({data}) => {     
						if (data && data.successful) {
                this.dataForm.rc = data.data.rc
                this.dataForm.rgsj = data.data.rgsj
                this.dataForm.sjdj = parseInt(data.data.sjdj)
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
              url: this.$http.adornUrl(`/mssq/rcjl/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              params: this.$http.adornParams({
                'id': this.dataForm.id || undefined,
                'rc': this.dataForm.rc,
                'rgsj': this.dataForm.rgsj,
                'sjdj':this.dataForm.sjdj
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
