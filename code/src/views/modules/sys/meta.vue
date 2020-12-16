<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm">
    	<el-form-item>
        <el-input v-model="dataForm.typeName" placeholder="类型名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
      	<el-button @click="getDataList()">查询</el-button>
        <!--<el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>-->
        <el-button v-if="hasPermission('add')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      style="width: 100%;">
      <!--<el-table-column
        prop="id"
        header-align="center"
        align="center"
        width="auto"
        label="ID">
      </el-table-column>-->
     
    	<el-table-column
        prop="typeName"
        header-align="center"
        align="center"
        width="auto"
        label="数据类型名称">
      </el-table-column>
      
      <el-table-column
        prop="typeCode"
        header-align="center"
        align="center"
        width="auto"
        label="数据类型编码">
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
          
          <el-button type="text" size="small" @click="metaListHandle(scope.row.id)">元数据维护</el-button>
          <el-button v-if="hasPermission('update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <meta-list v-if="metaListVisible" ref="metaList" @refreshDataList="getDataList"></meta-list>
  </div>
</template>

<script>
  import TableTreeColumn from '@/components/table-tree-column'
	import AddOrUpdate from './type-add-or-update'
	import MetaList from './meta-list'
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {
        	typeName:''
        },
        dataList: [],
        dataListLoading: false,
        addOrUpdateVisible: false,
        metaListVisible:false,
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
      AddOrUpdate,
			MetaList
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
          url: this.$http.adornUrl('/meta/typeList'),
          method: 'get',
          params: this.$http.adornParams({typeName:this.dataForm.typeName},false)
        }).then(({data}) => {
        	if(data.successful){
        		this.dataList = data.data
          	this.dataListLoading = false
        	}else{
        		console.log('ERROR',data)
            this.$message.error("操作失败")
        	}
          
        })
      },
      // 维护
      metaListHandle (id) {
        this.metaListVisible = true
       
        this.$nextTick(() => {
	          this.$refs.metaList.init(id)
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
        	//确定对[id=${id}]进行[删除]操作?
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/meta/removeType`),
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
