<template>
  <el-dialog
    :title="dataForm.type == 'add' ? '新增' : '修改'"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="50%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="validateSame()"
             label-width="15%">
      <el-form-item label="链接地址" prop="linkurl">
        <el-input v-model="dataForm.linkurl" placeholder="请输入链接地址..."></el-input>
      </el-form-item>
      <el-form-item label="标识码" prop="linkcode">
        <el-input :disabled="codereadonly" v-model="dataForm.linkcode" placeholder="链接标识码"></el-input>
      </el-form-item>
      <el-form-item label="一级页面" prop="yjpage">
        <el-input v-model="dataForm.yjpage" placeholder="一级页面名称"></el-input>
      </el-form-item>
      <el-form-item label="二级页面" prop="ejpage">
        <el-input v-model="dataForm.ejpage" placeholder="二级页面名称"></el-input>
      </el-form-item>
      <el-form-item label="三级页面" prop="sjpage">
        <el-input v-model="dataForm.sjpage" placeholder="三级页面名称"></el-input>
      </el-form-item>
      <el-form-item label="所属系统" prop="sysname">
        <el-input v-model="dataForm.sysname" placeholder="系统名称"></el-input>
      </el-form-item>
      <el-form-item label="所属部门" prop="managername">
        <el-input v-model="dataForm.managername" placeholder="部门名称"></el-input>
      </el-form-item>
      <el-form-item label="窗口宽" prop="width">
        <el-input v-model="dataForm.width" placeholder="px"></el-input>
      </el-form-item>
      <el-form-item label="窗口高" prop="height">
        <el-input v-model="dataForm.height" placeholder="px"></el-input>
      </el-form-item>
      <el-form-item label="参数动静态类型" size="mini" prop="status">
        <el-radio-group v-model="dataForm.paramtype">
          <el-radio :label="'0'">静态值</el-radio>
          <el-radio :label="'1'">动态值</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否验证" size="mini" prop="status">
        <el-radio-group v-model="dataForm.isvalidate"
                        @change="isvalidateChange(dataForm.isvalidate)">
          <el-radio :label="'0'">否</el-radio>
          <el-radio :label="'1'">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="拼接方式" size="mini" prop="status">
        <el-radio-group :disabled="waytypeRadio" v-model="dataForm.waytype">
          <el-radio :label="'0'">url拼接</el-radio>
          <el-radio :label="'1'">header隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="链接状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.linkstatus">
          <el-radio :label="'0'">正常</el-radio>
          <el-radio :label="'1'">异常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="validateSame()">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { isURL } from '../../../utils/validate.js'

  export default {
    data () {
      var validateUrl = (rule, value, callback) => {
        if (!isURL(value)) {
          callback(new Error('必须以http,https开头,且需符合URL规范,检查格式是否正确'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        dataForm: {
          id: '',
          linkurl: '',
          linkcode: '',
          yipage: '',
          eipage: '',
          sipage: '',
          sysname: '',
          managername: '',
          width: '',
          height: '',
          paramtype: '0',
          linkstatus: '0',
          isvalidate: '0',
          waytype: '',
          type: '',
          codereadonly: false,
          waytypeRadio: false
        },
        dataRule: {
          linkcode: [
            {required: true, message: '标识码不能为空', trigger: 'blur'}
          ],
          linkurl: [
            {required: true, message: '链接地址不能为空', trigger: 'blur'},
            {validator: validateUrl, trigger: 'blur'}
          ],
          yjpage: [
            {required: true, message: '页面名称不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    created () {
    },
    methods: {
      init (id, subType) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (id.length > 0) {
            this.$http({
              url: this.$http.adornUrl('/link/findidtolink'),
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
              this.codereadonly = true
              this.isvalidateChange(data.data.isvalidate)
            })
          }
          this.dataForm.type = subType
          this.codereadonly = false
          this.isvalidateChange(this.dataForm.isvalidate)
        })
      },
      isvalidateChange (value) {
        if (value == '0') {
          this.dataForm.waytype = ''
          this.waytypeRadio = true
        } else {
          this.dataForm.waytype = '0'
          this.waytypeRadio = false
        }
      },
      validateSame () {
        if (this.dataForm.type === 'add') {
          this.$http({
            url: this.$http.adornUrl('/link/isSamecCode'),
            method: 'get',
            params: this.$http.adornParams({
              'linkcode': this.dataForm.linkcode
            })
          }).then(({data}) => {
            if (data.successful) {
              this.messageHint(this.dataForm.linkcode)
            } else {
              this.dataFormSubmit()
            }
          })
        } else {
          this.dataFormSubmit()
        }
      },
      messageHint (value) {
        this.$message({
          dangerouslyUseHTMLString: true,
          message: '<strong style="color: #ff2222">标识码' + value + '已存在!</strong>'
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/link/${this.dataForm.type === 'add' ? 'addLink' : 'updateLink'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'linkurl': this.dataForm.linkurl,
                'linkcode': this.dataForm.linkcode,
                'yjpage': this.dataForm.yjpage,
                'ejpage': this.dataForm.ejpage,
                'sjpage': this.dataForm.sjpage,
                'sysname': this.dataForm.sysname,
                'managername': this.dataForm.managername,
                'width': this.dataForm.width,
                'height': this.dataForm.height,
                'paramtype': this.dataForm.paramtype,
                'linkstatus': this.dataForm.linkstatus,
                'isvalidate': this.dataForm.isvalidate,
                'waytype': this.dataForm.waytype
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
