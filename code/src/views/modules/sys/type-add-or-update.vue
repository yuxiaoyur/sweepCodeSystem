<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">

      <el-form-item label="数据类型名称" prop="typeName" label-width="150px">
        <el-input v-model="dataForm.typeName" placeholder="数据类型名称，长度不超过10个字"></el-input>
      </el-form-item>
      
      <el-form-item label="数据类型编码" prop="typeCode" label-width="150px">
        <el-input v-model="dataForm.typeCode" placeholder="数据类型编码，长度不超过10个字"></el-input>
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
  import Icon from '@/icons'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          typeName:'',
          typeCode:''
        },
        dataRule: {
          typeName: [
            { required: true, message: '数据类型名称不能为空', trigger: 'blur' },
            { max: 10, message: "长度不能超过10个字", trigger: "blur	" }
          ],
          typeCode: [
            { required: true, message: '数据类型编码不能为空', trigger: 'blur' },
            { max: 10, message: "长度不能超过10个字", trigger: "blur	" }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        
        this.visible = true
        if (this.dataForm.id) {
	        // 修改
	        this.$http({
	          url: this.$http.adornUrl(`/meta/getTypeById`),
	          method: 'get',
	          params: this.$http.adornParams({id:this.dataForm.id},false)
	        }).then(({data}) => {
	        	if(data.successful){
	        		this.dataForm.typeName= data.data.typeName
	          	this.dataForm.typeCode = data.data.typeCode
	        	}else{
	        			console.log('ERROR',data)
            		this.$message.error(data.message)
	        	}
	          
	        })
	      }else{
	      	this.dataForm.typeName= ''
	        this.dataForm.typeCode = ''
	      }
          
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/meta/${!this.dataForm.id ? 'saveType' : 'updateType'}`),
              method: 'post',
              data: {
                'id': this.dataForm.id || undefined,
                'typeName': this.dataForm.typeName,
                'typeCode': this.dataForm.typeCode
              }
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
            	}else{
            		console.log('ERROR',data)
            		this.$message.error(data.message)
            	}
            	
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .mod-menu {
    .menu-list__input,
    .icon-list__input {
       > .el-input__inner {
        cursor: pointer;
      }
    }
    &__icon-popover {
      max-width: 370px;
    }
    &__icon-list {
      max-height: 180px;
      padding: 0;
      margin: -8px 0 0 -8px;
      > .el-button {
        padding: 8px;
        margin: 8px 0 0 8px;
        > span {
          display: inline-block;
          vertical-align: middle;
          width: 18px;
          height: 18px;
          font-size: 18px;
        }
      }
    }
    .icon-list__tips {
      font-size: 18px;
      text-align: center;
      color: #e6a23c;
      cursor: pointer;
    }
  }
</style>
