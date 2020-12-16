<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="50%">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    	<el-form-item label="人工事件" prop="rgsj">
        <el-input v-model="dataForm.rgsj" readonly="readonly"></el-input>
      </el-form-item>
      <el-form-item label="工单号" prop="gdh">
        <el-input v-model="dataForm.gdh" readonly="readonly"></el-input>
      </el-form-item>      
      <el-form-item label="事件描述" prop="wtms">  
        <el-input type="textarea" :rows="8" v-model="dataForm.wtms" placeholder="事件相关描述，供事件地址参考，不可编辑" readonly="readonly"></el-input>     
      </el-form-item>
      <el-form-item label="备选地址" prop="address">
        <el-input v-model="dataForm.address" placeholder="电话填报地址，供事件地址参考，不可编辑" readonly="readonly"></el-input>
      </el-form-item>
      <el-form-item label="事件地址" prop="dz">
        <el-input v-model="dataForm.dz"></el-input>
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
          rgsj: '',
          gdh: '',
          wtms: '',
          address: '',
          dz: ''
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
              url: this.$http.adornUrl(`/mssq/rgsj/detail?id=` + this.dataForm.id),
              method: 'get'
            }).then(({data}) => {     
						if (data && data.successful) {
                this.dataForm.rgsj = data.data.rgsj
                this.dataForm.gdh = data.data.gdh
                this.dataForm.wtms = data.data.wtms
                this.dataForm.address = data.data.address
                this.dataForm.dz = data.data.dz
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
              url: this.$http.adornUrl(`/mssq/rgsj/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              params: this.$http.adornParams({
                'id': this.dataForm.id || undefined,
                'dz':this.dataForm.dz
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
