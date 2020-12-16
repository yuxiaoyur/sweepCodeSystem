<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">

      <el-form-item label="部门名称" prop="bmmc">
        <el-input v-model="dataForm.bmmc" placeholder="部门名称"></el-input>
      </el-form-item>
      <el-form-item label="接入系统数" prop="jrxts">
        <el-input v-model="dataForm.jrxts" placeholder="接入系统数，长度不超过11位"></el-input>
      </el-form-item>
			<el-form-item label="接入数据类数" prop="jrsjls">
			  <el-input v-model="dataForm.jrsjls" placeholder="接入系统数，长度不超过11位"></el-input>
			</el-form-item>
      <el-form-item label="接入数据量" prop="jrsjl">
        <el-input v-model="dataForm.jrsjl" placeholder="接入系统数，长度不超过11位"></el-input>
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
          bmmc: '',
          jrxts: '',
          jrsjls: '',
          jrsjl: '',
          url: ''
        },
        dataRule: {
          bmmc: [
            { required: true, message: '部门名称不能为空', trigger: 'blur' },
          ],
          jrxts: [
            { required: true, message: '接入系统数不能为空', trigger: 'blur' },
            { type: 'string',pattern:/^(0|[1-9]\d{0,8})$/, message: "展示高度，输入为数字类型，且数字长度≤9", trigger: "blur" }
          ],
          jrsjls: [
            { required: true, message: '接入数据类数不能为空', trigger: 'blur' },
            { type: 'string',pattern:/^(0|[1-9]\d{0,8})$/, message: "展示高度，输入为数字类型，且数字长度≤9", trigger: "blur" }
          ],
          jrsjl: [
            { required: true, message: '接入数据量不能为空', trigger: 'blur' },
            { type: 'string',pattern:/^(0|[1-9]\d{0,8})$/, message: "展示接入数据量，输入为数字类型，且数字长度≤9", trigger: "blur" }
          ]
        }
      }
    },
    methods: {
      init (id) {
      	console.log(id);
        this.visible = true
        this.$nextTick(() => {
	        this.$refs['dataForm'].resetFields()
	        this.dataForm.id = id
	        if (this.dataForm.id) {
	          this.$http({
	            url: this.$http.adornUrl(`/dockingDepartment/info?id=` + this.dataForm.id),
	            method: 'get'
	          }).then(({data}) => {
						  if (data && data.successful) {
	              this.dataForm.sj = data.data.sj
	              this.dataForm.bmmc = data.data.bmmc
	              this.dataForm.jrxts = data.data.jrxts
	              this.dataForm.jrsjls = data.data.jrsjls
	              this.dataForm.jrsjl = data.data.jrsjl
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
              url: this.$http.adornUrl(`/dockingDepartment/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              params: this.$http.adornParams({
                'id': this.dataForm.id || undefined,
                'sj': this.dataForm.sj,
                'bmmc': this.dataForm.bmmc,
                'jrxts': this.dataForm.jrxts,
                'jrsjls': this.dataForm.jrsjls,
                'jrsjl': this.dataForm.jrsjl,
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
              	console.log(this.dataForm);
                this.$message.error(data.message)
              }
            })
          }
        })
      }
    }
  }
</script>

