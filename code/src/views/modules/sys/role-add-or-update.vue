<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="dataForm.roleName" placeholder="角色名称,长度不超过10个字" v-bind:readonly="isReadOnly"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="description">
        <el-input v-model="dataForm.description" placeholder="备注,长度不超过50个字"></el-input>
      </el-form-item>
      <el-form-item label="角色类型" prop="roleType">
        <el-input v-model="dataForm.roleType" placeholder="类型"></el-input>
      </el-form-item>
      <!--<el-form-item size="mini" label="授权">
        <el-tree
          :data="menuList"
          :props="menuListTreeProps"
          node-key="menuId"
          ref="menuListTree"
          :default-expand-all="true"
          show-checkbox>
        </el-tree>
      </el-form-item>-->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
	    isReadOnly:false,
        visible: false,
        menuList: [],
        menuListTreeProps: {
          label: 'name',
          children: 'children'
        },
        dataForm: {
          id: 0,
          roleName: '',
          description: '',
          roleType:''
        },
        dataRule: {
          roleName: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' },
            { max: 10, message: "长度不能超过10个字", trigger: "blur" }
          ],
          description: [
            { required: true, message: '备注不能为空', trigger: 'blur' },
            { max: 50, message: "长度不能超过50个字", trigger: "blur" }
          ],
          roleType: [
            { required: true, message: '角色类型不能为空', trigger: 'blur' }
          ]
        },
        tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
      }
    },
    methods: {
      init (id) {
		this.dataForm.id = id || 0
		this.isReadOnly=id?true:false
      	this.visible = true
  	    this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        
        if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/role/getRole/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.successful) {
                this.dataForm.roleName = data.data.roleName              
                this.dataForm.description = data.data.description
                this.dataForm.roleType = data.data.roleType
             }else{
			        		console.log('ERROR',data)
			            this.$message.error("操作失败")
			         }
            })
          }
//      this.$http({
//        url: this.$http.adornUrl('/sys/menu/list'),
//        method: 'get',
//        params: this.$http.adornParams()
//      }).then(({data}) => {
//        this.menuList = treeDataTranslate(data, 'menuId')
//      }).then(() => {
//        this.visible = true
//        this.$nextTick(() => {
//          this.$refs['dataForm'].resetFields()
//          this.$refs.menuListTree.setCheckedKeys([])
//        })
//      }).then(() => {
//        if (this.dataForm.id) {
//          this.$http({
//            url: this.$http.adornUrl(`/sys/role/info/${this.dataForm.id}`),
//            method: 'get',
//            params: this.$http.adornParams()
//          }).then(({data}) => {
//            if (data && data.code === 0) {
//              this.dataForm.roleName = data.role.roleName
//              this.dataForm.remark = data.role.remark
//              var idx = data.role.menuIdList.indexOf(this.tempKey)
//              if (idx !== -1) {
//                data.role.menuIdList.splice(idx, data.role.menuIdList.length - idx)
//              }
//              this.$refs.menuListTree.setCheckedKeys(data.role.menuIdList)
//            }
//          })
//        }
//      })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/role/${!this.dataForm.id ? 'save' : 'updateRole'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'roleName': this.dataForm.roleName,
                'description': this.dataForm.description,
                'roleType': this.dataForm.roleType
//              'menuIdList': [].concat(this.$refs.menuListTree.getCheckedKeys(), [this.tempKey], this.$refs.menuListTree.getHalfCheckedKeys())
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
