<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="类型" prop="menu_type">
        <el-radio-group v-model="dataForm.menu_type">
          <el-radio v-for="(type, index) in dataForm.typeList" :label="index" :key="index">{{ type }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="dataForm.typeList[dataForm.menu_type] + '名称'" prop="menu_name">
        <el-input v-model="dataForm.menu_name" :placeholder="dataForm.typeList[dataForm.menu_type] + '名称，长度不超过10个字'"></el-input>
      </el-form-item>
      <el-form-item label="上级菜单" prop="parent_name">
        <el-popover
          ref="menuListPopover"
          placement="bottom-start"
          trigger="click">
          <el-tree
            :data="menuList"
            :props="menuListTreeProps"
            node-key="menu_id"
            ref="menuListTree"
            @current-change="menuListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parent_name" v-popover:menuListPopover :readonly="true" placeholder="点击选择上级菜单，默认根目录下添加" class="menu-list__input"></el-input>
      </el-form-item>

      <el-form-item v-if="dataForm.menu_type == '1'" label="打开方式" prop="style">
    		<el-select v-model="dataForm.styleDef" placeholder="选择打开菜单方式 " style="width:50%">
	      	 <el-option v-for="item in dataForm.style" :label="item.dataName" :value="item.dataCode"></el-option>
    		</el-select>
  		</el-form-item>
      <el-form-item v-if="dataForm.menu_type == '1'" label="服务器" prop="server">
    		<el-select v-model="dataForm.serverDef" placeholder="跳转外部链接请选择服务器" @change="currentSel" style="width:50%">
      	<el-option v-for="item in dataForm.server" :label="item.dataName" :value="item.dataCode"></el-option>
    		</el-select>
  		</el-form-item>
      <el-form-item v-if="dataForm.menu_type == '1'" label="菜单路由" prop="url">
        <el-input v-model="dataForm.url" placeholder="菜单路由，长度不超过100字"></el-input>
      </el-form-item>

      <el-form-item v-if="dataForm.menu_type == '1' && dataForm.urlPath != '' " label="完整路径" prop="urlPath">
        <el-input readonly v-model="dataForm.urlPath + dataForm.url" ></el-input>
      </el-form-item>
      <!--<el-form-item v-if="dataForm.menu_type != '0'" label="权限" prop="opt">
        <el-input v-model="dataForm.opt" placeholder="多个用逗号分隔, 如: baseView,add,delete,update,view"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.menu_type != '0'" label="权限描述" prop="optName">
        <el-input v-model="dataForm.optName" placeholder="多个用逗号分隔, 如: 基础查看,新增,删除,修改,查看"></el-input>
      </el-form-item>-->
      <el-form-item v-if="dataForm.menu_type != '2'" label="排序号" prop="menu_order">
        <el-input-number v-model="dataForm.menu_order" controls-position="right" :min="0" label="排序号"></el-input-number>
      </el-form-item>
      <el-form-item v-if="dataForm.menu_type != '2'" label="菜单图标" prop="icon">
        <el-row>
          <el-col :span="22">
            <el-popover
              ref="iconListPopover"
              placement="bottom-start"
              trigger="click"
              popper-class="mod-menu__icon-popover">
              <div class="mod-menu__icon-list">
                <el-button
                  v-for="(item, index) in iconList"
                  :key="index"
                  @click="iconActiveHandle(item)"
                  :class="{ 'is-active': item === dataForm.icon }">
                  <icon-svg :name="item"></icon-svg>
                </el-button>
              </div>
            </el-popover>
            <el-input v-model="dataForm.icon" v-popover:iconListPopover :readonly="true" placeholder="菜单图标名称" class="icon-list__input"></el-input>
          </el-col>
          <!--<el-col :span="2" class="icon-list__tips">
            <el-tooltip placement="top" effect="light">
              <div slot="content">全站推荐使用SVG Sprite, 详细请参考:<a href="//github.com/daxiongYang/renren-fast-vue/blob/master/src/icons/index.js" target="_blank">icons/index.js</a>描述</div>
              <i class="el-icon-warning"></i>
            </el-tooltip>
          </el-col>-->
        </el-row>
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
          menu_type: 1,
          typeList: ['目录', '菜单', '按钮'],
          menu_name: '',
          parent_id: -1,
          parent_name: '',
          url: '',
          opt: '',
          optName: '',
          menu_order: 0,
          icon: '',
          iconList: [],
	        style:[],//菜单打开方式
	        styleDef:'',
	        server:[],//服务器
	        serverDef:'',
	        urlPath:''	//完整url
        },
        dataRule: {
          menu_name: [
            { required: true, message: '名称不能为空', trigger: 'blur' },
            { max: 10, message: "长度不能超过10个字", trigger: "blur" }
          ],
          url: [
            { required: true, message: '菜单路由不能为空', trigger: 'change' },
            { max: 100, message: "长度不能超过100个字", trigger: "blur" }
          ],
          menu_order: [
            { required: true, message: '排序号不能为空', trigger: 'change' }
          ],
          icon: [
            { required: true, message: '菜单图标不能为空', trigger: 'change' }
          ],
          style: [
            { required: true, message: '打开方式不能为空', trigger: 'change' }
          ]
        },
        menuList: [],
        menuListTreeProps: {
          label: 'menu_name',
          children: 'children'
        }
      }
    },
    created () {
      this.iconList = Icon.getNameList()
      this.getStyle()
    	this.getServer()
    },
    methods: {
      init (id) {
        let strUrl = ''
        this.dataForm.id = id || 0
        if (!this.dataForm.id) {
          // 新增
           strUrl = '/menu/list'
        } else {
          // 修改
           strUrl = '/menu/supMenuList'
        }
        this.$http({
          url: this.$http.adornUrl(strUrl),
          method: 'get',
          params: this.$http.adornParams({id : id}, false)
        }).then(({data}) => {
        	if(data.successful){
        		this.menuList = treeDataTranslate(data.data, 'menu_id','parent_id')
        	}else{
        		console.log('ERROR',data)
        	}

        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (!this.dataForm.id) {
            // 新增
            this.dataForm.styleDef = ''
            this.dataForm.serverDef = ''
            this.dataForm.urlPath = ''
//          console.log(this.dataForm)
//          this.menuListTreeSetCurrentNode()
          } else {
            // 修改
            this.dataForm.styleDef = ''
            this.dataForm.serverDef = ''
            this.dataForm.urlPath = ''

            this.$http({
              url: this.$http.adornUrl(`/menu/getById`),
              method: 'get',
              params: this.$http.adornParams({id:this.dataForm.id},false)
            }).then(({data}) => {

							if(data.successful){
								this.dataForm.id = data.data.menu_id
	              this.dataForm.menu_type = parseInt(data.data.menu_type)
	              this.dataForm.menu_name = data.data.menu_name
	              this.dataForm.parent_id = parseInt(data.data.parent_id)
	              this.dataForm.url = data.data.url
	              this.dataForm.styleDef = data.data.style
	              this.dataForm.serverDef = data.data.server

	//            this.dataForm.opt = data.opt
	//            this.dataForm.optName = data.optName
	              this.dataForm.menu_order = data.data.menu_order
	              this.dataForm.icon = data.data.icon

	              for (var i = 0; i < this.dataForm.server.length; i++) {
				        	if(this.dataForm.serverDef == this.dataForm.server[i].dataCode){
				        		this.dataForm.urlPath = this.dataForm.server[i].dataName
				        		break
				        	}
				        }
	              this.menuListTreeSetCurrentNode()
							}else{
								console.log('ERROR',data)
							}

            })
          }
        })
      },
      //获取菜单打开方式
      getStyle(){
      	this.$http({
              url: this.$http.adornUrl(`/meta/getMetaByTypeCode`),
              method: 'get',
              params: this.$http.adornParams({typeCode:'style'},false)
            }).then(({data}) => {

							if(data.successful){
								this.dataForm.style = data.data
							}else{
								console.log('ERROR',data)
							}

            })
      },
    	//获取服务器列表
      getServer(){
      	this.$http({
              url: this.$http.adornUrl(`/meta/getMetaByTypeCode`),
              method: 'get',
              params: this.$http.adornParams({typeCode:'server'},false)
            }).then(({data}) => {

							if(data.successful){
								this.dataForm.server = data.data
							}else{
								console.log('ERROR',data)
							}

            })
      },
      // 菜单树选中
      menuListTreeCurrentChangeHandle (data, node) {
        this.dataForm.parent_id = data.menu_id
        this.dataForm.parent_name = data.menu_name
      },
      // 菜单树设置当前选中节点
      menuListTreeSetCurrentNode () {
//				console.log("菜单树设置当前选中节点")
//				console.log(this.dataForm.parent_id+"\t "+this.dataForm.parent_name)
        this.$refs.menuListTree.setCurrentKey(this.dataForm.parent_id)
//      console.log(this.dataForm.parent_id+"\t "+this.dataForm.parent_name)
        this.dataForm.parent_name = (this.$refs.menuListTree.getCurrentNode() || {})['menu_name']
//				console.log(this.dataForm.parent_id+"\t "+this.dataForm.parent_name)
//				console.log("菜单树设置当前选中节点 over")
      },
      // 图标选中
      iconActiveHandle (iconName) {
        this.dataForm.icon = iconName
      },
      currentSel(selVal){
      	console.log(JSON.stringify())
        for (var i = 0; i < this.dataForm.server.length; i++) {
        	if(selVal == this.dataForm.server[i].dataCode){
        		this.dataForm.urlPath = this.dataForm.server[i].dataName
        		break
        	}
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {

          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/menu/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: {
                'menu_id': this.dataForm.id || undefined,
                'menu_type': this.dataForm.menu_type,
                'menu_name': this.dataForm.menu_name,
                'parent_id': this.dataForm.parent_id,
                'style': this.dataForm.styleDef,
                'server': this.dataForm.serverDef,
                'url': this.dataForm.url,
//              'opt': this.dataForm.opt,
//              'optName': this.dataForm.optName,
                'menu_order': this.dataForm.menu_order,
                'icon': this.dataForm.icon
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
            		this.$message.error("操作失败")
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
