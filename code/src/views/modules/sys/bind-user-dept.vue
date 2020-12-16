<template>
	<div>
  <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.DEPTNAME" placeholder="部门名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      height="460"
      style="width: 100%;">
      <el-table-column
        prop="DEPTNAME"
        header-align="center"
        align="center"
        width="80"
        label="部门名称">
      </el-table-column>
      <el-table-column
        prop="STATE"
        header-align="center"
        align="center"
        label="当前状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.STATE == '0'" size="small">未绑定</el-tag>
          <el-tag v-else-if="scope.row.STATE == '1'" size="small" type="success">已绑定</el-tag>
        </template>
      </el-table-column>
      
      
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <!--<el-button v-if="isAuth('sys:role:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.roleId)">修改</el-button>
          <el-button v-if="isAuth('sys:role:delete')" type="text" size="small" @click="deleteHandle(scope.row.roleId)">删除</el-button>-->
          <el-button v-if="scope.row.STATE == '0'" type="text" size="small" @click="bindHandle(scope.row.ID)">绑定</el-button>
          <el-button v-if="scope.row.STATE == '1'" type="text" size="small" @click="unbindHandle(scope.row.ID)">解绑</el-button>
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
    </div>
</template>

<script>
	
  export default {
    data () {
      return {
        visible: false,
        activeName: 'user',	//选项卡默认值
        dataForm: {
          id: '',
          DEPTNAME:''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false
      }
    },
    methods: {
      init (id) {
      	this.dataForm.id = id || 0
        this.visible = true
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
       this.$http({
          url: this.$http.adornUrl('/role/getRoleBindList'),
          method: 'get',
           params: this.$http.adornParams({
          	'type': 'dept',
            'id':this.dataForm.id,
            'page': this.pageIndex,
            'limit': this.pageSize,
            'name': this.dataForm.DEPTNAME
          })
        }).then(({data}) => {
        	
        	if(data.successful){
        		this.dataList = data.data.list
		        this.totalPage = data.data.total
          		this.dataListLoading = false
        	}else{
        		console.log('ERROR',data)
        	}
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      
      // 绑定
      bindHandle (id) {
		var that = this;
        this.$confirm(`确定进行[绑定]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/role/bindRole'),
            method: 'post',
            data: this.$http.adornData({id:that.dataForm.id,bindingId:id,type:'dept'},false)
          }).then(({data}) => {
            if (data.successful) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
            	console.log('ERROR',data)
              this.$message.error("操作失败")
            }
          })
        }).catch(() => {})
      },
      
      // 解绑
      unbindHandle (id) {
		var that = this;
        this.$confirm(`确定进行[解绑]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/role/untieRole'),
            method: 'post',
            data: this.$http.adornData({id:that.dataForm.id,bindingId:id,type:'dept'},false)
          }).then(({data}) => {
            if (data.successful) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
            	console.log('ERROR',data)
              this.$message.error("操作失败")
            }
          })
        }).catch(() => {})
      }
      
      
      
    }
  }
</script>
