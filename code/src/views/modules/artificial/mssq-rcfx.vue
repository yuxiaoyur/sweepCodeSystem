<template>
  <div class="mod-mssq-rcfx">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.title" placeholder="热词" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.tjrq" placeholder="统计日期(yyyy-MM-dd)" clearable></el-input>
      </el-form-item>
      <el-form-item>
    		<el-select v-model="dataForm.fl" placeholder="不限分类" style="width:100%">
	      	 <el-option label="不限分类" value=""></el-option>
	      	 <el-option label="综合" value="0"></el-option>
	      	 <el-option label="企业诉求" value="1"></el-option>
    		</el-select>
  		</el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="hasPermission('delete')" @click="deleteHandle()">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <!--<el-table-column
        prop="id"
        header-align="center"
        align="center"
        width="150"
        label="ID">
      </el-table-column>-->
      <el-table-column
        prop="title"
        header-align="center"
        align="center"
        label="热词">
      </el-table-column>
       <el-table-column
        prop="sl"
        header-align="center"
        align="center"
        label="投诉量">
      </el-table-column>
      <el-table-column
        prop="tjrq"
        header-align="center"
        align="center"
        label="统计日期">
      </el-table-column>
      <el-table-column
        prop="flmc"
        header-align="center"
        align="center"
        label="分类">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="250"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="hasPermission('delete')" type="text" @click="deleteHandle(scope.row.id)">删除</el-button>
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
        dataForm: {
          title: '',
          tjrq: '',
          fl: ''
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
        }
      }
    },
    components: {
      
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
          url: this.$http.adornUrl('/mssq/rcfx'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'title': this.dataForm.title,
            'tjrq': this.dataForm.tjrq,
            'fl': this.dataForm.fl
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
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 删除
      deleteHandle (id) {
        var rcIds = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        if(rcIds == null || rcIds == ''){
          this.$message.error("请选择要删除的数据")
          return
        }
        this.$confirm(`确定进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/mssq/rcfx/remove'),
            method: 'post',
            params: this.$http.adornParams({id:rcIds.join(',')},false)
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
      }
      
    }
  }
</script>
