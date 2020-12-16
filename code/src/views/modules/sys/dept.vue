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
      <table-tree-column
        prop="deptName"
        header-align="center"
        treeKey="id"
        parentKey="parentId"
        width="150"
        label="名称">
      </table-tree-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        width="120"
        label="上级部门">
      </el-table-column>
      <el-table-column
        prop="parentType"
        header-align="center"
        align="center"
        label="类型">
        <template slot-scope="scope">
        	{{scope.row.parentType == '1'?'地区监管部门':'行业监管部门'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="deptOrder"
        header-align="center"
        align="center"
        label="排序号">
      </el-table-column>
  		<el-table-column
        prop="province"
        header-align="center"
        align="center"
        width="120"
        label="省">
      </el-table-column>
      <el-table-column
        prop="city"
        header-align="center"
        align="center"
        width="120"
        label="市">
      </el-table-column>
      <el-table-column
        prop="area"
        header-align="center"
        align="center"
        width="120"
        label="区">
      </el-table-column>
       <!--<el-table-column
        prop="area"
        header-align="center"
        align="center"
        width="120"
        label="街道">
      </el-table-column>-->
      
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        
        label="操作">
        <template slot-scope="scope">
          <!--<el-button v-if="isAuth('sys:user:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.menuId)">修改</el-button>
          <el-button v-if="isAuth('sys:user:delete')" type="text" size="small" @click="deleteHandle(scope.row.menuId)">删除</el-button>-->
          <el-button v-if="hasPermission('update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import TableTreeColumn from '@/components/table-tree-column'
  import AddOrUpdate from './dept-add-or-update'
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {},
        dataList: [],
        dataListLoading: false,
        addOrUpdateVisible: false,
        permission:[],
        permissionVisible:{
        	add:false,
        	update:false,
        	delete:false
        }
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
          url: this.$http.adornUrl('/dept/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
        	if(data.successful){
          this.dataList = treeDataTranslate(data.data,'id','parentId')
          this.dataListLoading = false
         }else{
        		console.log('ERROR',data)
            this.$message.error("操作失败")
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
            url: this.$http.adornUrl(`/dept/remove`),
            method: 'get',
            params: this.$http.adornParams({id:id},false)
          }).then(({data}) => {
	           if (data && data.successful) {
	              this.$message({
	                message: '操作成功',
	                type: 'success',
	                duration: 1500,
	                onClose: () => {
	                  this.getDataList()
	                }
	              })
	            }else{
            		this.$message.error(data.message)
            	}
          })
        }).catch(() => {})
      }
    }
  }
</script>
