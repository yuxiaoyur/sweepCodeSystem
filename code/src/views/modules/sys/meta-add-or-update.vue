<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible" 
    :modal="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      
        <el-form-item label="上级元数据" prop="parentName">
        <el-popover
          ref="menuListPopover"
          placement="bottom-start"
          trigger="click">
          <el-tree
            :data="metaList"
            :props="metaListTreeProps"
            node-key="id"
            ref="metaListTree"
            @current-change="metaListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:menuListPopover :readonly="true" placeholder="点击选择上元数据，默认根目录下添加" class="menu-list__input"></el-input>
      </el-form-item>
      <el-form-item label="元数据名称" prop="dataName">
        <el-input v-model="dataForm.dataName" placeholder="元数据名称，长度不超过50个字"></el-input>
      </el-form-item>
      <el-form-item label="元数据代码" prop="dataCode">
        <el-input v-model="dataForm.dataCode"placeholder="元数据代码"></el-input>
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
  export default {
    data () {
      return {
        visible: false,
        metaList: [],
         metaListTreeProps: {
          label: 'dataName',
          children: 'children'
        },
        dataForm: {
          id: '',
        	dataType:'',
        	dataName:'',
        	dataCode:'',
        	parentCode:'',
        	parentName:''
        },
        dataRule: {
          dataName: [
           { required: true, message: '元数据名称不能为空', trigger: 'blur' },
           { max: 50, message: "长度不能超过50个字", trigger: "blur	" }
          ],
          dataCode: [
           { required: true, message: '元数据代码不能为空', trigger: 'blur' },
           { max: 20, message: "长度不能超过20个字", trigger: "blur	" }
          ]
			   }
      }
    },
    methods: {
      init (id,dataType) {
        this.dataForm.id = id || 0
        this.dataForm.dataType = dataType || 0
        this.$http({
          url: this.$http.adornUrl('/meta/metaList'),
           method: 'get',
          params: this.$http.adornParams({typeId:this.dataForm.dataType},false)
        }).then(({data}) => {
					this.metaList = treeDataTranslate(data.data, 'id','parentCode')
        }).then(() => {
        	this.dataForm.parentName = ''
        	this.dataForm.parentCode = ''
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/meta/getMetaById`),
              method: 'get',
          		params: this.$http.adornParams({id:this.dataForm.id},false)
            }).then(({data}) => { 
						if (data && data.successful) {
                this.dataForm.dataName = data.data.dataName
                this.dataForm.dataCode = data.data.dataCode
                this.dataForm.parentCode = data.data.parentCode
                 this.metaListTreeSetCurrentNode()
              }else{
		        		console.log('ERROR',data)
		            this.$message.error("操作失败")
		         }
            })
          }
          
        })
      },
         // 菜单树选中
      metaListTreeCurrentChangeHandle (data, node) {
        this.dataForm.parentCode = data.id
        this.dataForm.parentName = data.dataName
      },
      // 菜单树设置当前选中节点
      metaListTreeSetCurrentNode () {	
//				console.log("菜单树设置当前选中节点")
//				console.log(this.dataForm.parent_id+"\t "+this.dataForm.parent_name)
        this.$refs.metaListTree.setCurrentKey(this.dataForm.parentCode)
//      console.log(this.dataForm.parent_id+"\t "+this.dataForm.parent_name)
        this.dataForm.parentName = (this.$refs.metaListTree.getCurrentNode() || {})['dataName']
//				console.log(this.dataForm.parent_id+"\t "+this.dataForm.parent_name)
//				console.log("菜单树设置当前选中节点 over")
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/meta/${!this.dataForm.id ? 'saveMeta' : 'updateMeta'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'dataType': this.dataForm.dataType,
                'dataName': this.dataForm.dataName,
                'dataCode':this.dataForm.dataCode,
                'parentCode': this.dataForm.parentCode
              },false)
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
