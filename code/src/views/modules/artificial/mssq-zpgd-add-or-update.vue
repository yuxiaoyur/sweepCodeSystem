<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-form-item label="时间" prop="sj">
        <el-input v-model="dataForm.sj" placeholder="格式（yyyy-MM-dd HH:mm:ss）"></el-input>
      </el-form-item>
      <el-form-item label="主题" prop="zt">
        <el-input v-model="dataForm.zt"></el-input>
      </el-form-item>
      <el-form-item label="直派部门" prop="zpbm">
        <el-input v-model="dataForm.zpbm"></el-input>
      </el-form-item>
			<el-form-item label="区域" prop="area">
			  <el-input v-model="dataForm.area"></el-input>
			</el-form-item>
      <el-form-item label="工单号" prop="gdh">
        <el-input v-model="dataForm.gdh"></el-input>
      </el-form-item>
			<el-form-item label="URL" prop="url">
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
          zt: '',
          zpbm: '',
          area: '',
          gdh: '',
          url: ''
        },
        dataRule: {
          sj: [
            { required: true, message: '时间不能为空', trigger: 'blur' },
						{ validator: validateDate, trigger: 'blur' }
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
	            url: this.$http.adornUrl(`/mssq/zpgd/detail?id=` + this.dataForm.id),
	            method: 'get'
	          }).then(({data}) => {     
						  if (data && data.successful) {
	              this.dataForm.sj = data.data.sj
	              this.dataForm.zt = data.data.zt
	              this.dataForm.zpbm = data.data.zpbm
	              this.dataForm.area = data.data.area
	              this.dataForm.gdh = data.data.gdh
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
              url: this.$http.adornUrl(`/mssq/zpgd/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              params: this.$http.adornParams({
                'id': this.dataForm.id || undefined,
                'sj': this.dataForm.sj,
                'zt': this.dataForm.zt,
                'zpbm': this.dataForm.zpbm,
                'area': this.dataForm.area,
                'gdh': this.dataForm.gdh,
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
