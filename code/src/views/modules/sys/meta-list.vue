<template>
	<el-dialog
    :title="'元数据维护'"
    :close-on-click-modal="false"
    :visible.sync="visible">

	 <el-form :inline="true" :model="dataForm">
	      <el-form-item>
	        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
	      </el-form-item>
	    </el-form>

    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      height="460"
      style="width: 100%;">
      
      <table-tree-column
        prop="dataName"
        header-align="center"
        align="center"
        treeKey="id"
        parentKey="parentCode"
        label="元数据名称">
      </table-tree-column>
      
       <el-table-column
        prop="dataCode"
        header-align="center"
        align="center"
        label="元数据代码">
      </el-table-column>

        <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button  type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--<el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>-->
    
     <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
     </el-dialog>
</template>

<script>
	import TableTreeColumn from '@/components/table-tree-column'
	import AddOrUpdate from './meta-add-or-update'
	import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: ''//类型ID
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        addOrUpdateVisible: false
      }
    },
    components: {
      TableTreeColumn,
      AddOrUpdate
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
          url: this.$http.adornUrl('/meta/metaList'),
           method: 'get',
          params: this.$http.adornParams({typeId:this.dataForm.id},false)
        }).then(({data}) => {
        	if(data.successful){
        		this.dataList = treeDataTranslate(data.data, 'id','parentCode')
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

          // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id,this.dataForm.id)
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
            url: this.$http.adornUrl(`/meta/removeMate`),
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
