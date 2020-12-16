<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      
      <el-form-item label="上级部门" prop="name">
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
        <el-input v-model="dataForm.name" v-popover:menuListPopover :readonly="true" placeholder="点击选择上级部门，默认根目录下添加" class="menu-list__input"></el-input>
      </el-form-item>
      <el-form-item label="部门名称" prop="deptName">
        <el-input v-model="dataForm.deptName" placeholder="部门名称，长度不超过10个字"></el-input>
      </el-form-item>
      
      <el-form-item label="省/直辖市" prop="province">
    		<el-select v-model="dataForm.province" placeholder="" @change="proChange" style="width:50%">
	      	 <el-option v-for="item in dataForm.proList" :label="item.dataName" :value="item.dataCode"></el-option>
    		</el-select>
  		</el-form-item>
  		
  		<el-form-item label="市/直辖市区" prop="city">
    		<el-select v-model="dataForm.city" placeholder="" @change="cityChange" style="width:50%">
	      	 <el-option v-for="item in dataForm.cityList" :label="item.dataName" :value="item.dataCode"></el-option>
    		</el-select>
  		</el-form-item>
  		
      <el-form-item label="区/县" prop="area">
    		<el-select v-model="dataForm.area" placeholder="" style="width:50%">
	      	 <el-option v-for="item in dataForm.areaList" :label="item.dataName" :value="item.dataCode"></el-option>
    		</el-select>
  		</el-form-item>
  		
      <el-form-item label="详细地址" prop="street">
        <el-input v-model="dataForm.street" placeholder="街道"></el-input>
      </el-form-item>
   
      <el-form-item label="排序号" prop="deptOrder">
        <el-input-number v-model="dataForm.deptOrder" controls-position="right" :min="0" label="排序号"></el-input-number>
      </el-form-item>
  
      <el-form-item label="类型" size="mini" prop="parentType">
        <el-radio-group v-model="dataForm.parentType">
          <el-radio :label="1">地区监管部门</el-radio>
          <el-radio :label="2">行业监管部门</el-radio>
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
  import Icon from '@/icons'
  export default {
    data () {
      var validateUrl = (rule, value, callback) => {
        if (this.dataForm.type === 1 && !/\S/.test(value)) {
          callback(new Error('菜单URL不能为空'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        dataForm: {
          id: 0,
          parentType: 1,
          deptName: '',
          parentId: -1,
          name: '',
          deptOrder: 0,
          province:'',
          city:'',
          area:'',
          street:'',
          region:[],
          proList:[],	//所有省份list
          cityList:[],
          areaList:[]
        },
        dataRule: {
          deptName: [
            { required: true, message: '部门名称不能为空', trigger: 'blur' },
            { max: 10, message: "长度不能超过10个字", trigger: "blur" }
          ],
          province: [
            { required: true, message: '省份不能为空', trigger: 'blur' },
            { max: 20, message: "长度有误", trigger: "blur" }
          ],
          city: [
//          { required: true, message: '市不能为空', trigger: 'blur' },
            { max: 20, message: "长度有误", trigger: "blur	" }
          ],
          area: [
//          { required: true, message: '区不能为空', trigger: 'blur' },
            { max: 20, message: "长度有误", trigger: "blur	" }
          ],
          street: [
//          { required: true, message: '街道不能为空', trigger: 'change' },
            { max: 25, message: "长度不能超过25个字", trigger: "blur	" }
          ],
          deptOrder: [
            { required: true, message: '排序号不能为空', trigger: 'change' }
          ],
          parentType: [
            { required: true, message: '类型不能为空', trigger: 'change' }
          ]
        },
        deptList: [],
        deptListTreeProps: {
          label: 'deptName',
          children: 'children'
        }
      }
    },
 		created () {
      this.getPro()
   },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.dataForm.cityList = []
        this.dataForm.areaList = []
        this.$http({
          url: this.$http.adornUrl('/dept/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
        	if(data.successful){
          this.deptList = treeDataTranslate(data.data, 'id','parentId')
         }else{
        		console.log('ERROR',data)
            this.$message.error("操作失败")
         }
        }).then(() => {
 
          this.dataForm.parentId = -1
          this.dataForm.deptOrder = 0

          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (this.dataForm.id) {
            // 修改
            this.$http({
              url: this.$http.adornUrl(`/dept/getDeptById`),
              method: 'get',
              params: this.$http.adornParams({id:this.dataForm.id},false)
            }).then(({data}) => {
          	
	          	if (data&&data.successful) {
	          		this.dataForm.id = data.data.id
	              this.dataForm.parentType = parseInt(data.data.parentType)
	              this.dataForm.deptName = data.data.deptName
	              this.dataForm.parentId = data.data.parentId
	              this.dataForm.deptOrder = data.data.deptOrder
	              this.dataForm.province = data.data.province
	              this.dataForm.city = data.data.city
	              this.dataForm.area = data.data.area
	              this.dataForm.street = data.data.street
	              
	         			this.proChange(this.dataForm.province )
	         			this.cityChange(this.dataForm.city )
	              this.deptListTreeSetCurrentNode()
	          	}
            })
          }
        })
      },
      // 菜单树选中
      deptListTreeCurrentChangeHandle (data, node) {
        this.dataForm.parentId = data.id
        this.dataForm.name = data.deptName
      },
      // 菜单树设置当前选中节点
      deptListTreeSetCurrentNode () {	
//				console.log("菜单树设置当前选中节点")
//				console.log(this.dataForm.parent_id+"\t "+this.dataForm.parent_name)
        this.$refs.deptListTree.setCurrentKey(this.dataForm.parentId)
//      console.log(this.dataForm.parent_id+"\t "+this.dataForm.parent_name)
        this.dataForm.name = (this.$refs.deptListTree.getCurrentNode() || {})['deptName']
//				console.log(this.dataForm.parent_id+"\t "+this.dataForm.parent_name)
//				console.log("菜单树设置当前选中节点 over")
      },
              
        //获取服务器列表
      getPro(){
      	this.$http({
              url: this.$http.adornUrl(`/meta/getMetaByTypeCode`),
              method: 'get',
              params: this.$http.adornParams({typeCode:'region'},false)
            }).then(({data}) => {
            	
							if(data.successful){
								var result = [];
								this.dataForm.region = data.data
								for (var i = 0; i < this.dataForm.region.length; i++) {
									if(this.dataForm.region[i].parentCode == '-1'){
										result.push(this.dataForm.region[i])
									}
								}
								this.dataForm.proList = result
							}else{
								console.log('ERROR',data)
							}
							
            })
      },

      proChange(selVal){

      	var result = []
      	var parentId = ''
      	//获取parentid
      	for (var i = 0; i < this.dataForm.region.length; i++) {
        	if(selVal == this.dataForm.region[i].dataCode){
        		parentId = this.dataForm.region[i].id
        		break
        	}
        }
      	
        for (var i = 0; i < this.dataForm.region.length; i++) {
        	if(parentId == this.dataForm.region[i].parentCode){
        		result.push(this.dataForm.region[i])
        	}
        }
        
        this.dataForm.cityList = result
      },
      
      cityChange(selVal){

      	var result = []
      	var parentId = ''
      	//获取parentid
      	for (var i = 0; i < this.dataForm.region.length; i++) {
        	if(selVal == this.dataForm.region[i].dataCode){
        		parentId = this.dataForm.region[i].id
        		break
        	}
        }
      	console.log(parentId)
        for (var i = 0; i < this.dataForm.region.length; i++) {
        	if(parentId == this.dataForm.region[i].parentCode){
        		result.push(this.dataForm.region[i])
        	}
        }
        
        this.dataForm.areaList = result
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/dept/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: {
                'id': this.dataForm.id || undefined,
                'parentType': this.dataForm.parentType,
                'deptName': this.dataForm.deptName,
                'parentId': this.dataForm.parentId,
                'province': this.dataForm.province,
                'city': this.dataForm.city,
                'area': this.dataForm.area,
								'street':this.dataForm.street,
                'deptOrder': this.dataForm.deptOrder,
              }
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
            	}else{
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
