<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" >
      <el-form-item>
        <el-input v-model="dataForm.roleName" placeholder="角色名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="hasPermission('add')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"  
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <!--<el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>-->
      <el-table-column
        prop="roleName"
        header-align="center"
        align="center"
        width="120"
        label="角色名称">
      </el-table-column>
      <el-table-column
        prop="roleType"
        header-align="center"
        align="center"
        label="角色类型">
      </el-table-column>
      <el-table-column
        prop="description"
        header-align="center"
        align="center"
        label="备注">
      </el-table-column>
      <el-table-column
        prop="createtime"
        header-align="center"
        align="center"
        width="180"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <!--<el-button v-if="isAuth('sys:role:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.roleId)">修改</el-button>
          <el-button v-if="isAuth('sys:role:delete')" type="text" size="small" @click="deleteHandle(scope.row.roleId)">删除</el-button>-->
          <el-button type="text" size="small" @click="bindUserHandle(scope.row.id)">用户授权</el-button>
          <el-button type="text" size="small" @click="bindMenuOptHandle(scope.row.id)">菜单配置</el-button>
          <el-button type="text" size="small" @click="handleOpenSjqx(scope.row)">数据权限</el-button>
          <el-button type="text" size="small" @click="handleOpenSxqx(scope.row)">属性权限</el-button>
          <el-button v-if="hasPermission('update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button> 
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
     <!-- 弹窗, 用户授权 refreshDataList回调函数-->
    <bind-user v-if="bindUserVisible" ref="bindUser" @refreshDataList="getDataList"></bind-user>
    <!-- 弹窗, 菜单配置-->
    <bind-menu-opt v-if="bindMenuOptVisible" ref="bindMenuOpt" @refreshDataList="getDataList"></bind-menu-opt>
    
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  
    <!-- 属性权限授权 -->
    <jsqxsq-sxqx :isShowSxqxDialog='isShowSxqxDialog' ref='usersxId'  @onClose='handleCloseSxqx("close-sxqx")' ></jsqxsq-sxqx>
    <!-- 数据权限授权 -->
    <jsqxsq-sjqx :isShowSjqxDialog='isShowSjqxDialog' ref='usersjId' @onClose='handleCloseSjqx("close-sjqx")'></jsqxsq-sjqx>  
  </div>
</template>

<script>
  import JsqxsqSxqx from './jsqxsq/sxqx'
  import JsqxsqSjqx from './jsqxsq/sjqx'
  import AddOrUpdate from './role-add-or-update'
  import BindUser from './bind-user'
  import BindMenuOpt from './bind-menuopt'
  export default {
    data () {
      return {
        dataForm: {
          roleName: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        bindUserVisible: false,
        bindMenuOptVisible: false,
        permission:[],
        permissionVisible:{
        	add:false,
        	update:false,
        	delete:false
        },

        isShowSjqxDialog:false,//数据权限授权弹窗
        isShowSxqxDialog:false//属性权限授权弹窗
      }
    },
    components: {
      AddOrUpdate,
      BindUser,
      BindMenuOpt,
      'jsqxsq-sxqx': JsqxsqSxqx,
      'jsqxsq-sjqx': JsqxsqSjqx,
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
          url: this.$http.adornUrl('/role/roleList'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'roleName': this.dataForm.roleName
          })
        }).then(({data}) => {
	       if(data.successful){
	          this.dataList = data.data.list
		        this.totalPage = data.data.total
	          this.dataListLoading = false
	         }else{
	        		console.log('ERROR',data)
	            this.$message.error("操作失败")
	         }
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
     // 页码变更
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
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
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.roleId
        })
        this.$confirm(`确定进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/role/removeRole'),
            method: 'post',
            params: this.$http.adornParams({id:ids.join(',')},false)
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
            } else {
              this.$message.error(data.message)
            }
          })
        }).catch(() => {})
      },
      
      //用户授权
      bindUserHandle (id) {
        this.bindUserVisible = true
        this.$nextTick(() => {
          this.$refs.bindUser.init(id)
        })
      },
      
      //菜单配置
      bindMenuOptHandle (id) {
        this.bindMenuOptVisible = true
        this.$nextTick(() => {
          this.$refs.bindMenuOpt.init(id)
        })
      },

      //数据权限弹窗
      handleOpenSjqx(row){
        console.log(row)
        this.isShowSjqxDialog=true
        this.$refs.usersjId.handleClickSjqx({id:row.id,name:row.roleName,type:"juese"})
      },
      // 关闭
      handleCloseSjqx (key) {
        switch (key) {
          case 'close-sjqx': {
            this.isShowSjqxDialog = false
            break
          }
        }
      },
      //属性权限弹窗
      handleOpenSxqx(row){
        this.isShowSxqxDialog=true
        this.$refs.usersxId.handleClickSxqx({id:row.id,type:"juese"})
      },
      // 关闭
      handleCloseSxqx (key) {
        switch (key) {
          case 'close-sxqx': {
            this.isShowSxqxDialog = false
            break
          }
        }
      },
      
      
      
      
      
      
    }
  }
</script>
