<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="账号" prop="username">
        <el-input v-model="dataForm.username" placeholder="登录帐号,长度不超过20个字"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="comfirmPassword" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.comfirmPassword" type="password" placeholder="确认密码"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="realname">
        <el-input v-model="dataForm.realname" placeholder="用户名,长度不超过10个字"></el-input>
      </el-form-item>
      <el-form-item label="部门" prop="deptName">
        <el-popover
          ref="menuListPopover"
          placement="bottom-start"
          trigger="click">
          <el-tree
            :data="deptList"
            :props="deptListTreeProps"
            node-key="id"
            ref="deptListTree"
            @current-change="deptListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.deptName" v-popover:menuListPopover :readonly="true" placeholder="点击选择上级部门，默认根目录下添加" class="menu-list__input"></el-input>
      </el-form-item>

      <el-form-item label="用户类型" size="mini" prop="type">
        <el-radio-group v-model="dataForm.type">
          <el-radio :label="1">普通用户</el-radio>
          <el-radio :label="2">大屏用户</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="用户状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">启用</el-radio>
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
  import { treeDataTranslate } from '@/utils'
  import { isEmail, isMobile } from '@/utils/validate'
  import { isPassword } from '../../../utils/validate.js'
  import crypto from 'crypto'
  export default {
    data () {
      var validatePassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('密码不能为空'))
        } else if (!isPassword(value)) {
          callback(new Error('6-20位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符'))
        } else {
          callback()
        }
      }
      var validateComfirmPassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('确认密码不能为空'))
        } else if (this.dataForm.password !== value) {
          callback(new Error('确认密码与密码输入不一致'))
        } else {
          callback()
        }
      }
      var validateEmail = (rule, value, callback) => {
        if (!isEmail(value)) {
          callback(new Error('邮箱格式错误'))
        } else {
          callback()
        }
      }
      var validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        deptList: [],
         deptListTreeProps: {
          label: 'deptName',
          children: 'children'
        },
        dataForm: {
          id: 0,
          username: '',
          password: '',
          comfirmPassword: '',
          realname:'',
          salt: '',
          deptid: '',
	  type:1,
          status: 1,
          deptName:''
        },
        dataRule: {
          username: [
            { required: true, message: '账号不能为空', trigger: 'blur' },
            { max: 20, message: "长度不能超过20个字", trigger: "blur" }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' }
          ],
          comfirmPassword: [
            { validator: validateComfirmPassword, trigger: 'blur' }
          ],
          email: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
            { validator: validateEmail, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '手机号不能为空', trigger: 'blur' },
            { validator: validateMobile, trigger: 'blur' }
          ],
          deptName: [
          	 { required: true, message: '部门不能为空', trigger: 'blur' }
          ],
            realname: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
            { max: 10, message: "长度不能超过10个字", trigger: "blur" }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/dept/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
					this.deptList = treeDataTranslate(data.data, 'id','parentId')
        }).then(() => {
        	this.dataForm.deptid = ''

          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/user/getUserById/` + this.dataForm.id),
              method: 'get'
            }).then(({data}) => {
						if (data && data.successful) {
                this.dataForm.username = data.data.username
                this.dataForm.deptid = data.data.deptid
		this.dataForm.type = parseInt(data.data.type)
                this.dataForm.status = parseInt(data.data.status)
                this.dataForm.realname = data.data.realname
                 this.deptListTreeSetCurrentNode()
              }else{
		        		console.log('ERROR',data)
		            this.$message.error("操作失败")
		         }
            })
          }
        })
      },
         // 菜单树选中
      deptListTreeCurrentChangeHandle (data, node) {
        this.dataForm.deptid = data.id
        this.dataForm.deptName = data.deptName
      },
      // 菜单树设置当前选中节点
      deptListTreeSetCurrentNode () {
        this.$refs.deptListTree.setCurrentKey(this.dataForm.deptid)
        this.dataForm.deptName = (this.$refs.deptListTree.getCurrentNode() || {})['deptName']
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
		if(this.dataForm.password!=""){
			var md5 = crypto.createHash("md5");
			md5.update(this.dataForm.password);
			var password = md5.digest('hex');
		 }
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/user/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'username': this.dataForm.username,
                'password': password,
                'realname':this.dataForm.realname,
		'type': this.dataForm.type,
                'status': this.dataForm.status,
                'deptid': this.dataForm.deptid
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
