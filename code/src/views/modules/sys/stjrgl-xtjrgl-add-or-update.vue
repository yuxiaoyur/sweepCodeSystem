<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">

      <el-form-item label="系统名称" prop="xtmc">
        <el-input v-model="dataForm.xtmc" placeholder="系统名称"></el-input>
      </el-form-item>
      <el-form-item label="来源" prop="ly">
        <el-input v-model="dataForm.ly" placeholder="部门名称，长度不超过10个字"></el-input>
      </el-form-item>
			<el-form-item label="系统代码" prop="code">
			  <el-input v-model="dataForm.code"></el-input>
			</el-form-item>
      <el-form-item label="百分比" prop="bfb">
        <el-input v-model="dataForm.bfb"></el-input>
      </el-form-item>
      <el-form-item label="主题" prop="panel">
        <el-input v-model="dataForm.panel"></el-input>
      </el-form-item>
      <el-form-item label="展示宽度" prop="width">
        <el-input v-model="dataForm.width" placeholder="展示宽度，输入为数字类型"></el-input>
      </el-form-item>
      <el-form-item label="展示高度" prop="height">
        <el-input v-model="dataForm.height" placeholder="展示高度，输入为数字类型"></el-input>
      </el-form-item>

      <el-form-item label="访问地址" prop="url">
        <el-input v-model="dataForm.url"></el-input>
      </el-form-item>

      <el-form-item label="状态" size="mini" prop="zt">
        <el-radio-group v-model="dataForm.zt">
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">异常</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="来源类型" size="mini" prop="lylx">
        <el-radio-group v-model="dataForm.lylx">
          <el-radio :label="0">部门系统</el-radio>
          <el-radio :label="1">区县系统</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="是否验证" size="mini" prop="isvalidate">
        <el-radio-group v-model="dataForm.isvalidate">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="子系统" size="mini" prop="issubsystem">
        <el-radio-group v-model="dataForm.issubsystem">
          <el-radio :label="0">是子系统</el-radio>
          <el-radio :label="1">否子系统</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="描述" prop="szwl">
        <el-input v-model="dataForm.szwl" placeholder="请描述系统所在网络情况"></el-input>
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
          xtmc: '',
          ly: '',
          code: '',
          bfb: '',
          panel: '',
          width: '',
          height: '',
          zt: 1,
          lylx: 1,
          isvalidate: 1,
          issubsystem:1,
          szwl: '',
          url: ''
        },
        dataRule: {
          xtmc: [
            { required: true, message: '系统名称不能为空', trigger: 'blur' },
          ],
          ly: [
            { required: true, message: '部门名称不能为空', trigger: 'blur' },
            { max: 10, message: "长度不超过10个字", trigger: "blur" }
          ],
          code: [
            { required: true, message: '系统代码不能为空', trigger: 'blur' },
          ],
          width: [
            { required: true, message: '展示宽度不能为空', trigger: 'blur' },
           // {max: 6,number:true, message: "展示宽度，输入为数字类型，且数字长度≤6", trigger: "blur" }
            { type: 'string',pattern:/^(([1-9]\d{0,3})|0)(\d{0,2})?$/, message: "展示高度，输入为数字类型，且数字长度≤6", trigger: "blur" }
          ],
          height: [
            { required: true, message: '展示高度不能为空', trigger: 'blur' },
            //{ number:true, message: "展示高度，输入为数字类型，且数字长度≤6", trigger: "blur" }
            { type: 'string',pattern:/^(([1-9]\d{0,3})|0)(\d{0,2})?$/, message: "展示高度，输入为数字类型，且数字长度≤6", trigger: "blur" }
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
	            url: this.$http.adornUrl(`/stjr/xtjrgljk/detail?id=` + this.dataForm.id),
	            method: 'get'
	          }).then(({data}) => {
						  if (data && data.successful) {
	              this.dataForm.sj = data.data.sj
	              this.dataForm.xtmc = data.data.xtmc
	              this.dataForm.ly = data.data.ly
	              this.dataForm.code = data.data.code
	              this.dataForm.bfb = data.data.bfb
                this.dataForm.panel = data.data.panel
                this.dataForm.width =String( data.data.width)
                this.dataForm.height =String(  data.data.height)
                this.dataForm.zt = data.data.zt
                this.dataForm.lylx = data.data.lylx
                this.dataForm.isvalidate = data.data.isvalidate
                this.dataForm.issubsystem = data.data.issubsystem
	              this.dataForm.szwl = data.data.szwl
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
              url: this.$http.adornUrl(`/stjr/xtjrgljk/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              params: this.$http.adornParams({
                'id': this.dataForm.id || undefined,
                'sj': this.dataForm.sj,
                'xtmc': this.dataForm.xtmc,
                'ly': this.dataForm.ly,
                'code': this.dataForm.code,
                'bfb': this.dataForm.bfb,
                'panel': this.dataForm.panel,
                'width': this.dataForm.width,
                'height': this.dataForm.height,
                'zt': this.dataForm.zt,
                'lylx': this.dataForm.lylx,
                'isvalidate': this.dataForm.isvalidate,
                'issubsystem': this.dataForm.issubsystem,
                'szwl': this.dataForm.szwl,
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
