<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <!--<el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>-->
        <el-button v-if="hasPermission('add')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      style="width: 100%;">
      <el-table-column
        prop="menu_id"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <table-tree-column
        prop="menu_name"
        header-align="center"
        treeKey="menu_id"
        width="200"
        label="名称">
      </table-tree-column>
      <el-table-column
        prop="parent_name"
        header-align="center"
        align="center"
        width="120"
        label="上级菜单">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="50"
        label="图标">
        <template slot-scope="scope">
          <icon-svg :name="scope.row.icon || ''"></icon-svg>
        </template>
      </el-table-column>
      <el-table-column
        prop="menu_type"
        header-align="center"
        align="center"
        width="100"
        label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.menu_type == '0'" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.menu_type == '1'" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.menu_type == '2'" size="small" type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="menu_order"
        header-align="center"
        align="center"
        width="80"
        label="排序号">
      </el-table-column>
      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="菜单URL">
      </el-table-column>

      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <!--<el-button v-if="isAuth('sys:user:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.menuId)">修改</el-button>
          <el-button v-if="isAuth('sys:user:delete')" type="text" size="small" @click="deleteHandle(scope.row.menuId)">删除</el-button>-->
          <el-button v-if="hasPermission('update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.menu_id)">修改</el-button>
          <el-button v-if="hasPermission('delete')" type="text" size="small" @click="deleteHandle(scope.row.menu_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import TableTreeColumn from '@/components/table-tree-column'
  import AddOrUpdate from './menu-add-or-update'
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {},
        dataList: [],
        permission:[],
        permissionVisible:{
        	add:false,
        	update:false,
        	delete:false
        },
        dataListLoading: false,
        addOrUpdateVisible: false
      }
    },
    components: {
      TableTreeColumn,
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    mounted(){
    	this.getPermission()
    },
    methods: {
    	getPermission(){
    		this.$http({
          url: this.$http.adornUrl('/sys/menuPermission'),
          method: 'get',
          params: this.$http.adornParams({menuId:this.$route.meta.menuId})
        }).then(({data}) => {
        	this.permission = data
        	for (var i = 0; i < data.length; i++) {
        		switch (data[i].split(":")[1]){
        			case "add":
        				this.permissionVisible.add = true
        				break;
        			case "update":
        				this.permissionVisible.update = true
        				break;
        			case "delete":
        				this.permissionVisible.delete = true
        				break;
        			default:
        				break;
        		}
        	}

        })
    	},
    	hasPermission(param){
    		switch (param){
        			case "add":
        				return this.permissionVisible.add
        			case "update":
        				return this.permissionVisible.update
        			case "delete":
        				return this.permissionVisible.delete
        			default:
        				return false;
        		}
    	},
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/menu/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
        	if(data.successful){
        		this.dataList = treeDataTranslate(data.data, 'menu_id','parent_id')
          	this.dataListLoading = false
        	}else{
        		console.log('ERROR',data)
        	}

        })
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        this.$confirm(`确定进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/menu/remove`),
            method: 'post',
            params: this.$http.adornParams({id:id},false)
          }).then(({data}) => {
	           if (data.successful) {
	              this.$message({
	                message: '操作成功',
	                type: 'success',
	                duration: 1500,
	                onClose: () => {
	                  this.getDataList()
	                }
	              })
	              console.log('success',data)
	            }else{
	            	console.log('ERROR',data)
            		this.$message.error("操作失败")
            	}
          })
        }).catch(() => {})
      }
    }
  }
</script>
