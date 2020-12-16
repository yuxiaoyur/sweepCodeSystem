<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.xtmc" placeholder="系统名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="xtmc"
        header-align="center"
        align="center"
        width="150"
        label="系统名称">
      </el-table-column>
      <el-table-column
        prop="zt"
        header-align="center"
        align="center"
        width="150"
        label="状态">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        width="150"
        label="状态码">
      </el-table-column>
      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        label="链接地址">
      </el-table-column>
       <el-table-column
        prop="ly"
        header-align="center"
        align="center"
        label="来源">
      </el-table-column>
      <el-table-column
        prop="sj"
        header-align="center"
        align="center"
        label="更新时间">
      </el-table-column>
      <el-table-column
        prop="ip"
        header-align="center"
        align="center"
        width="180"
        label="更新IP">
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
        dataForm: {
          userName: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        permission:[],
        permissionVisible:{
        	add:false,
        	update:false,
        	delete:false
        },
        addOrUpdateVisible: false,
        userMenuOptVisible: false
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/dockingSysyem/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'xtmc': this.dataForm.xtmc
          })
        }).then(({data}) => {
				if (data && data.successful) {
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
      }
    }
  }
</script>
