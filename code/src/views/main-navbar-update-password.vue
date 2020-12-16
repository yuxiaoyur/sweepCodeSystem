<template>
  <el-dialog
    title="修改密码"
    :visible.sync="visible"
    :append-to-body="true">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <!--<el-form-item label="账号">
        <span>{{ userName }}</span>
      </el-form-item>-->
      <el-form-item label="原密码" prop="password">
        <el-input type="password" v-model="dataForm.password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="dataForm.newPassword"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input type="password" v-model="dataForm.confirmPassword"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { isPassword } from '../utils/validate.js'
  import crypto from 'crypto'
  export default {
    data () {
      var validatePassword = (rule, value, callback) => {
        if (!/\S/.test(value)) {
          callback(new Error('新密码不能为空'))
        } else if (!isPassword(value)) {
          callback(new Error('6-20位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符'))
        } else {
          callback()
        }
      }
      var validateConfirmPassword = (rule, value, callback) => {
        if (this.dataForm.newPassword !== value) {
          callback(new Error('确认密码与新密码不一致'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        dataForm: {
          password: '',
          newPassword: '',
          confirmPassword: ''
        },
        dataRule: {
          password: [
            { required: true, message: '原密码不能为空', trigger: 'blur' }
          ],
          newPassword: [
            { required: true, message: '新密码不能为空', trigger: 'blur' },
            { validator: validatePassword, trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true, message: '确认密码不能为空', trigger: 'blur' },
            { validator: validateConfirmPassword, trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      userName: {
        get () { return this.$store.state.user.name }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      }
    },
    methods: {
      // 初始化
      init () {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if(this.dataForm.password!=""){
            var md5 = crypto.createHash("md5");
            md5.update(this.dataForm.password);
            var password = md5.digest('hex');
          }
          if(this.dataForm.newPassword!=""){
            var newmd5 = crypto.createHash("md5");
            newmd5.update(this.dataForm.newPassword);
            var newPassword = newmd5.digest('hex');
          }
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/sys/updatePassword'),
              method: 'post',
              data: this.$http.adornData({/*this.dataForm.newPassword*/
                'password': password,
                'newPassword': newPassword
              })
            }).then(({data}) => {
              if (data && data.successful) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$nextTick(() => {
                      this.mainTabs = []
                      this.$cookie.delete('token')
                      this.$router.replace({ name: 'login' })
                    })
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

